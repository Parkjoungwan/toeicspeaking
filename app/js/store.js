/* IndexedDB — 녹음 blob과 시도 기록을 로컬에 영구 보관 */

const DB_NAME = 'toeic-speaking';
const DB_VER = 2;              // v2: drills / coverage 스토어 추가
const STORE = 'attempts';
const STORE_DRILL = 'drills';
const STORE_COV = 'coverage';

let _db = null;

/* ------------------------------------------------------------
   file:// 로 열면 브라우저에 따라 IndexedDB 가 막힌다(opaque origin).
   그때 조용히 실패하지 않도록 메모리 백엔드로 자동 전환한다.
   이 세션 안에서는 녹음·재생·리포트가 정상 동작하고,
   새로고침하면 사라진다는 점만 사용자에게 알린다.
   ------------------------------------------------------------ */
const LS_KEY = 'ts-fallback';

const Mem = {
  attempts: [], drills: [], coverage: [], _id: 1,

  /* 오디오 Blob 은 직렬화할 수 없고 용량도 크다.
     학습 기록(점수·메모·지표·드릴·커버리지)만 localStorage 에 남긴다.
     → file:// 로 열어도 진도는 보존되고, 오디오만 그 세션 한정이 된다. */
  persist() {
    try {
      const strip = a => { const { audio, ...rest } = a; return { ...rest, audioLost: true }; };
      localStorage.setItem(LS_KEY, JSON.stringify({
        v: 1, _id: Mem._id,
        attempts: Mem.attempts.map(strip),
        drills: Mem.drills,
        coverage: Mem.coverage
      }));
      return true;
    } catch (e) { return false; }   // 용량 초과·차단 시 조용히 포기
  },

  load() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return false;
      const d = JSON.parse(raw);
      Mem.attempts = d.attempts || [];
      Mem.drills = d.drills || [];
      Mem.coverage = d.coverage || [];
      Mem._id = d._id || (Mem.attempts.length + 1);
      return true;
    } catch (e) { return false; }
  },

  add(store, rec) { rec.id = Mem._id++; Mem[store].push(rec); Mem.persist(); return rec.id; },
  put(store, rec) {
    const i = Mem[store].findIndex(x => x.id === rec.id);
    if (i >= 0) Mem[store][i] = rec; else Mem.add(store, rec);
    Mem.persist();
    return rec.id;
  },
  get(store, id) { return Mem[store].find(x => x.id === id) || undefined; },
  all(store) { return Mem[store].slice(); },
  del(store, id) { Mem[store] = Mem[store].filter(x => x.id !== id); Mem.persist(); },
  clear(store) { Mem[store] = []; Mem.persist(); }
};

function openDB() {
  if (Store.backend === 'memory') return Promise.reject(new Error('memory backend'));
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    let req;
    try { req = indexedDB.open(DB_NAME, DB_VER); }
    catch (e) { return reject(e); }
    // 일부 브라우저는 opaque origin 에서 아무 이벤트도 쏘지 않는다
    const guard = setTimeout(() => reject(new Error('IndexedDB timeout')), 4000);
    const done = fn => (...a) => { clearTimeout(guard); return fn(...a); };
    req.onblocked = done(() => reject(new Error('IndexedDB blocked')));
    const _res = resolve, _rej = reject;
    resolve = done(_res); reject = done(_rej);
    req.onupgradeneeded = () => {
      const db = req.result;
      // v1 녹음은 절대 건드리지 않는다
      if (!db.objectStoreNames.contains(STORE)) {
        const os = db.createObjectStore(STORE, { keyPath: 'id', autoIncrement: true });
        os.createIndex('byQuestion', 'questionId');
        os.createIndex('byDate', 'startedAt');
      }
      if (!db.objectStoreNames.contains(STORE_DRILL)) {
        const os = db.createObjectStore(STORE_DRILL, { keyPath: 'id', autoIncrement: true });
        os.createIndex('byType', 'typePath');
        os.createIndex('byDate', 'at');
      }
      if (!db.objectStoreNames.contains(STORE_COV)) {
        const os = db.createObjectStore(STORE_COV, { keyPath: 'id', autoIncrement: true });
        os.createIndex('byQuestion', 'questionId');
        os.createIndex('byDate', 'at');
      }
    };
    req.onsuccess = () => { _db = req.result; resolve(_db); };
    req.onerror = () => reject(req.error);
  });
}

function tx(mode, store = STORE) {
  return openDB().then(db => db.transaction(store, mode).objectStore(store));
}

function req2promise(r) {
  return new Promise((res, rej) => { r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); });
}

/* IndexedDB 로 시도하고, 안 되면 메모리로 같은 일을 한다 */
async function withStore(store, mode, idbFn, memFn) {
  if (Store.backend !== 'memory') {
    try {
      const os = await tx(mode, store);
      const out = await idbFn(os);
      // file:// 이면 쓰기마다 localStorage 사본을 갱신한다.
      // IndexedDB 가 브라우저 종료 후 초기화돼도 학습 기록은 살아남는다.
      if (mode === 'readwrite' && Store.mirror) Store._syncMirror();
      return out;
    } catch (e) {
      Store.backend = 'memory';
      Store.reason = (e && e.message) || String(e);
    }
  }
  return memFn(Mem);
}

const Store = {
  backend: 'idb',        // 'idb' | 'memory'
  reason: '',

  restored: 0,           // localStorage 에서 되살린 기록 수
  lsOK: false,           // localStorage 자체가 쓸 수 있는가
  mirror: false,         // 매 쓰기마다 localStorage 에 메타데이터를 복사하는가
  mirrorOverride: null,  // null = 자동 판단 (file:// 이면 켜짐). 테스트용 강제 스위치.
  _clearing: false,      // 사용자가 명시적으로 지우는 중인가

  /* 시작 시 1회 실행.
     file:// 에서는 IndexedDB 가 "에러 없이 열리지만" 브라우저를 완전히 종료하면
     origin 이 새로 잡혀 빈 DB 가 된다. 열기 성공 여부만으로는 이걸 못 잡는다.
     그래서 file:// 이면 항상 localStorage 에 메타데이터를 복사해 두고,
     시작할 때 DB 가 비어 있으면 거기서 되살린다. */
  async probe() {
    try {
      const k = '__ts_probe__';
      localStorage.setItem(k, '1'); localStorage.removeItem(k);
      Store.lsOK = true;
    } catch (e) { Store.lsOK = false; }

    Store.mirror = (Store.mirrorOverride != null)
      ? (Store.mirrorOverride && Store.lsOK)
      : ((location.protocol === 'file:') && Store.lsOK);

    try { await openDB(); Store.backend = 'idb'; }
    catch (e) {
      Store.backend = 'memory';
      Store.reason = (e && e.message) || String(e);
      Store.restored = Mem.load() ? Mem.attempts.length : 0;
      return Store.backend;
    }

    // IndexedDB 는 열렸다. 그런데 지난 기록이 통째로 날아갔는지 확인한다.
    if (Store.mirror) {
      const saved = { a: Mem.attempts, d: Mem.drills, c: Mem.coverage };
      if (Mem.load()) {
        const mirrored = { a: Mem.attempts, d: Mem.drills, c: Mem.coverage };
        Mem.attempts = saved.a; Mem.drills = saved.d; Mem.coverage = saved.c;
        try { Store.restored = await Store._rehydrate(mirrored); } catch (e) { Store.restored = 0; }
      }
      await Store._syncMirror();
    }
    return Store.backend;
  },

  /* localStorage 사본에만 있고 IndexedDB 에는 없는 레코드를 되살린다.
     오디오는 복원할 수 없으므로 audioLost 표시가 붙은 채로 들어간다. */
  async _rehydrate(m) {
    let n = 0;
    const pairs = [[STORE, m.a], [STORE_DRILL, m.d], [STORE_COV, m.c]];
    for (const [store, list] of pairs) {
      if (!list || !list.length) continue;
      const os0 = await tx('readonly', store);
      const have = new Set((await req2promise(os0.getAll()) || []).map(x => x.id));
      const missing = list.filter(x => !have.has(x.id));
      for (const rec of missing) {
        const os = await tx('readwrite', store);
        await req2promise(os.put(rec));
        n++;
      }
    }
    return n;
  },

  /* IndexedDB 의 현재 상태를 localStorage 에 메타데이터만 복사한다. */
  async _syncMirror() {
    if (!Store.mirror || Store.backend !== 'idb') return;
    try {
      const grab = async store => {
        const os = await tx('readonly', store);
        return (await req2promise(os.getAll())) || [];
      };
      Mem.attempts = (await grab(STORE));
      Mem.drills = (await grab(STORE_DRILL));
      Mem.coverage = (await grab(STORE_COV));
      Mem._id = Math.max(1, ...Mem.attempts.map(a => a.id || 0)) + 1;

      // 안전장치: 복원에 실패해 IndexedDB 가 비어 있는 상태로 사본을 덮어쓰면
      // 백업이 영구 소실된다. 사용자가 직접 지운 경우에만 빈 사본을 허용한다.
      const total = Mem.attempts.length + Mem.drills.length + Mem.coverage.length;
      if (total === 0 && !Store._clearing) {
        let prev = null;
        try { prev = JSON.parse(localStorage.getItem(LS_KEY) || 'null'); } catch (e) {}
        const had = prev && ((prev.attempts || []).length + (prev.drills || []).length + (prev.coverage || []).length);
        if (had) return;   // 기존 백업을 지키고 물러난다
      }
      Mem.persist();
    } catch (e) { /* 사본 실패는 본 저장을 막지 않는다 */ }
  },

  async save(attempt) {
    return withStore(STORE, 'readwrite',
      os => req2promise(os.add(attempt)),
      M => M.add('attempts', attempt));
  },

  async update(attempt) {
    return withStore(STORE, 'readwrite',
      os => req2promise(os.put(attempt)),
      M => M.put('attempts', attempt));
  },

  async get(id) {
    return withStore(STORE, 'readonly',
      os => req2promise(os.get(id)),
      M => M.get('attempts', id));
  },

  async all() {
    const list = await withStore(STORE, 'readonly',
      os => req2promise(os.getAll()),
      M => M.all('attempts'));
    return (list || []).sort((a, b) => b.startedAt - a.startedAt);
  },

  async byQuestion(questionId) {
    return (await Store.all()).filter(a => a.questionId === questionId);
  },

  async remove(id) {
    return withStore(STORE, 'readwrite',
      os => req2promise(os.delete(id)),
      M => M.del('attempts', id));
  },

  async clear() {
    Store._clearing = true;
    try { return await withStore(STORE, 'readwrite',
      os => req2promise(os.clear()),
      M => M.clear('attempts')); }
    finally { Store._clearing = false; }
  },

  async usage() {
    if (!navigator.storage || !navigator.storage.estimate) return null;
    const e = await navigator.storage.estimate();
    return { used: e.usage || 0, quota: e.quota || 0 };
  },

  /* ---------- v2: 드릴 ---------- */
  async saveDrill(rec) {
    return withStore(STORE_DRILL, 'readwrite',
      os => req2promise(os.add(rec)),
      M => M.add('drills', rec));
  },
  async drills() {
    const list = await withStore(STORE_DRILL, 'readonly',
      os => req2promise(os.getAll()),
      M => M.all('drills'));
    return (list || []).sort((a, b) => b.at - a.at);
  },
  async drillsOf(typePath) {
    return (await Store.drills()).filter(d => d.typePath === typePath);
  },
  async clearDrills() {
    Store._clearing = true;
    try { return await withStore(STORE_DRILL, 'readwrite',
      os => req2promise(os.clear()),
      M => M.clear('drills')); }
    finally { Store._clearing = false; }
  },

  /* ---------- v2: Part 2 블록 커버리지 ---------- */
  async saveCoverage(rec) {
    return withStore(STORE_COV, 'readwrite',
      os => req2promise(os.add(rec)),
      M => M.add('coverage', rec));
  },
  async coverageOf(questionId) {
    const list = await withStore(STORE_COV, 'readonly',
      os => req2promise(os.getAll()),
      M => M.all('coverage'));
    return (list || []).filter(c => c.questionId === questionId).sort((a, b) => b.at - a.at);
  },
  async clearCoverage() {
    Store._clearing = true;
    try { return await withStore(STORE_COV, 'readwrite',
      os => req2promise(os.clear()),
      M => M.clear('coverage')); }
    finally { Store._clearing = false; }
  }
};

/* 설정 — localStorage */
const Settings = {
  defaults: {
    tts: true,          // 지시문·질문 음성 재생
    showQuestionText: false, // Part 3/4 질문 텍스트 노출 (실전은 음성만)
    beep: true,
    skipDirections: true,   // 연습 모드에서 지시문 건너뛰기 허용
    voiceURI: ''
  },
  get() {
    try { return { ...Settings.defaults, ...JSON.parse(localStorage.getItem('ts-settings') || '{}') }; }
    catch { return { ...Settings.defaults }; }
  },
  set(patch) {
    const next = { ...Settings.get(), ...patch };
    localStorage.setItem('ts-settings', JSON.stringify(next));
    return next;
  }
};
