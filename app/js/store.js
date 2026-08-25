/* IndexedDB — 녹음 blob과 시도 기록을 로컬에 영구 보관 */

const DB_NAME = 'toeic-speaking';
const DB_VER = 2;              // v2: drills / coverage 스토어 추가
const STORE = 'attempts';
const STORE_DRILL = 'drills';
const STORE_COV = 'coverage';

let _db = null;

function openDB() {
  if (_db) return Promise.resolve(_db);
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
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

const Store = {
  async save(attempt) {
    const os = await tx('readwrite');
    return new Promise((res, rej) => {
      const r = os.add(attempt);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  },

  async update(attempt) {
    const os = await tx('readwrite');
    return new Promise((res, rej) => {
      const r = os.put(attempt);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  },

  async get(id) {
    const os = await tx('readonly');
    return new Promise((res, rej) => {
      const r = os.get(id);
      r.onsuccess = () => res(r.result);
      r.onerror = () => rej(r.error);
    });
  },

  async all() {
    const os = await tx('readonly');
    return new Promise((res, rej) => {
      const r = os.getAll();
      r.onsuccess = () => res((r.result || []).sort((a, b) => b.startedAt - a.startedAt));
      r.onerror = () => rej(r.error);
    });
  },

  async byQuestion(questionId) {
    const list = await Store.all();
    return list.filter(a => a.questionId === questionId);
  },

  async remove(id) {
    const os = await tx('readwrite');
    return new Promise((res, rej) => {
      const r = os.delete(id);
      r.onsuccess = () => res();
      r.onerror = () => rej(r.error);
    });
  },

  async clear() {
    const os = await tx('readwrite');
    return new Promise((res, rej) => {
      const r = os.clear();
      r.onsuccess = () => res();
      r.onerror = () => rej(r.error);
    });
  },

  async usage() {
    if (!navigator.storage || !navigator.storage.estimate) return null;
    const e = await navigator.storage.estimate();
    return { used: e.usage || 0, quota: e.quota || 0 };
  },

  /* ---------- v2: 드릴 ---------- */
  async saveDrill(rec) {
    const os = await tx('readwrite', STORE_DRILL);
    return req2promise(os.add(rec));
  },
  async drills() {
    const os = await tx('readonly', STORE_DRILL);
    const list = await req2promise(os.getAll());
    return (list || []).sort((a, b) => b.at - a.at);
  },
  async drillsOf(typePath) {
    return (await Store.drills()).filter(d => d.typePath === typePath);
  },
  async clearDrills() {
    const os = await tx('readwrite', STORE_DRILL);
    return req2promise(os.clear());
  },

  /* ---------- v2: Part 2 블록 커버리지 ---------- */
  async saveCoverage(rec) {
    const os = await tx('readwrite', STORE_COV);
    return req2promise(os.add(rec));
  },
  async coverageOf(questionId) {
    const os = await tx('readonly', STORE_COV);
    const list = await req2promise(os.getAll());
    return (list || []).filter(c => c.questionId === questionId).sort((a, b) => b.at - a.at);
  },
  async clearCoverage() {
    const os = await tx('readwrite', STORE_COV);
    return req2promise(os.clear());
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
