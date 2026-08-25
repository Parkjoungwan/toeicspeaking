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
      return await idbFn(os);
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

  restored: false,       // localStorage 에서 이전 기록을 되살렸는가
  lsOK: false,           // localStorage 자체가 쓸 수 있는가

  /* 시작 시 1회 실행. 실제로 열어 보고 백엔드를 확정한다. */
  async probe() {
    try {
      const k = '__ts_probe__';
      localStorage.setItem(k, '1'); localStorage.removeItem(k);
      Store.lsOK = true;
    } catch (e) { Store.lsOK = false; }

    try { await openDB(); Store.backend = 'idb'; }
    catch (e) {
      Store.backend = 'memory';
      Store.reason = (e && e.message) || String(e);
      // IndexedDB 가 막혔으면 지난 학습 기록을 localStorage 에서 되살린다
      Store.restored = Mem.load();
    }
    return Store.backend;
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
    return withStore(STORE, 'readwrite',
      os => req2promise(os.clear()),
      M => M.clear('attempts'));
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
    return withStore(STORE_DRILL, 'readwrite',
      os => req2promise(os.clear()),
      M => M.clear('drills'));
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
    return withStore(STORE_COV, 'readwrite',
      os => req2promise(os.clear()),
      M => M.clear('coverage'));
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
