/* 시험 진행 상태기계
   DIRECTIONS → (MATERIAL) → [질문음성] → PREPARATION → RESPONSE → 다음
   실전 재현이 목적이므로 일시정지 없음, 되감기 없음, 답변 중 중단 시 그 문항은 무효. */

/* --- 실행 목록 만들기 --------------------------------------- */
const Runlist = {
  /* 단일 문항 (Part 1·2·5·레거시) 또는 세트 (Part 3·4) */
  one(part, q, opts = {}) {
    const P = PARTS[part];
    const p = Number(part);   // 호출부가 '3' 처럼 문자열 키를 넘길 수 있다
    const segs = [{ kind: 'directions', part, text: P.directions }];

    if (p === 3 || p === 4) {
      segs.push({ kind: 'intro', part, q, text: q.intro });
      if (p === 4) segs.push({ kind: 'material', part, q, sec: 45 });
      // 실전은 세트당 3문항. 데이터에 더 있어도 모의고사 총 11문항을 깨지 않는다.
      const items = opts.limit ? q.items.slice(0, opts.limit) : q.items;
      items.forEach((it, i) => segs.push({
        kind: 'question', part, q, item: it, idx: i,
        prepSec: 3, respSec: it.sec, ask: it.q, repeat: !!it.repeat,
        stimulus: p === 4 ? 'material' : 'none',
        qid: `${q.id}#${i + 1}`
      }));
    } else {
      segs.push({
        kind: 'question', part, q, item: null, idx: 0,
        prepSec: P.prep, respSec: P.resp, ask: null, repeat: false,
        stimulus: p === 1 ? 'text' : p === 2 ? 'picture' : 'prompt',
        qid: q.id
      });
    }
    return segs;
  },

  /* 파트 전체 순회 */
  part(part) {
    const list = BANK[part];
    const segs = [{ kind: 'directions', part, text: PARTS[part].directions }];
    list.forEach(q => Runlist.one(part, q).slice(1).forEach(s => segs.push(s)));
    return segs;
  },

  /* 풀 모의고사 — 현행 11문항 구성: P1×2, P2×2, P3세트1(3), P4세트1(3), P5×1 */
  mock() {
    const pick = (arr, n) => {
      const c = [...arr];
      const out = [];
      while (out.length < n && c.length) out.push(c.splice(Math.floor(Math.random() * c.length), 1)[0]);
      return out;
    };
    const segs = [];
    const p1 = pick(PART1, 2), p2 = pick(PART2, 2), p3 = pick(PART3, 1)[0], p4 = pick(PART4, 1)[0], p5 = pick(PART5, 1)[0];

    segs.push({ kind: 'directions', part: 1, text: PARTS[1].directions });
    p1.forEach(q => Runlist.one(1, q).slice(1).forEach(s => segs.push(s)));
    segs.push({ kind: 'directions', part: 2, text: PARTS[2].directions });
    p2.forEach(q => Runlist.one(2, q).slice(1).forEach(s => segs.push(s)));
    segs.push({ kind: 'directions', part: 3, text: PARTS[3].directions });
    Runlist.one(3, p3, { limit: 3 }).slice(1).forEach(s => segs.push(s));
    segs.push({ kind: 'directions', part: 4, text: PARTS[4].directions });
    Runlist.one(4, p4, { limit: 3 }).slice(1).forEach(s => segs.push(s));
    segs.push({ kind: 'directions', part: 5, text: PARTS[5].directions });
    Runlist.one(5, p5).slice(1).forEach(s => segs.push(s));

    // 문항 번호 부여 (Q1~Q11)
    let n = 0;
    segs.forEach(s => { if (s.kind === 'question') s.qNo = ++n; });
    return segs;
  }
};

/* --- 엔진 --------------------------------------------------- */
const Engine = {
  segs: [], i: 0, mode: 'practice', aborted: false, hooks: {},
  running: false, token: null,
  _timer: null, _end: null, _resolveWait: null, _skip: false,

  async run(segs, hooks, mode = 'practice') {
    // 재진입 방지. 엔진은 싱글턴이라 이전 실행이 살아 있으면 타이머 상태가 섞인다.
    if (Engine.running) {
      Engine.abort();
      await new Promise(r => setTimeout(r, 50));
    }
    const token = Symbol('run');
    Engine.token = token;
    Engine.running = true;
    Engine.segs = segs; Engine.i = 0; Engine.hooks = hooks; Engine.mode = mode;
    Engine.aborted = false;
    Engine.results = [];
    const alive = () => Engine.token === token && !Engine.aborted;

    try {
      await Recorder.arm();
    } catch (e) {
      Engine.running = false;
      hooks.onError && hooks.onError('마이크 권한이 필요합니다. 브라우저 주소창의 권한 설정을 확인하세요.');
      return;
    }

    for (Engine.i = 0; Engine.i < segs.length; Engine.i++) {
      if (!alive()) break;
      const s = segs[Engine.i];
      if (s.kind === 'directions') await Engine.doDirections(s);
      else if (s.kind === 'intro') await Engine.doIntro(s);
      else if (s.kind === 'material') await Engine.doMaterial(s);
      else if (s.kind === 'question') await Engine.doQuestion(s);
    }

    // 더 새로운 실행이 시작됐다면 그 실행의 상태를 건드리지 않고 조용히 빠진다.
    if (Engine.token !== token) return;
    Engine.running = false;
    Recorder.disarm();
    Speech.stop();
    if (!Engine.aborted) hooks.onDone && hooks.onDone(Engine.results);
  },

  abort() {
    Engine.aborted = true;
    Engine.running = false;
    Engine._skip = true;
    if (Engine._resolveWait) Engine._resolveWait();
    clearInterval(Engine._timer);
    clearTimeout(Engine._end);
    Speech.stop();
    if (Recorder.rec && Recorder.rec.state !== 'inactive') { try { Recorder.rec.stop(); } catch {} }
    Recorder.disarm();
  },

  /* 카운트다운. 남은 초를 onTick으로 흘린다. skip 가능 여부는 호출부가 결정 */
  wait(sec, phase, meta = {}) {
    return new Promise(resolve => {
      const total = sec * 1000;
      const t0 = performance.now();
      // _skip 은 여기서 초기화하지 않는다. 지시문 음성 재생 중에 누른 건너뛰기가
      // 곧바로 이어지는 wait 에서 소비돼야 하기 때문. 소비 시점에만 내린다.
      Engine._resolveWait = () => {
        clearInterval(Engine._timer);
        clearTimeout(Engine._end);
        Engine._skip = false;
        Engine._resolveWait = null;
        resolve();
      };
      Engine.hooks.onPhase && Engine.hooks.onPhase(phase, { ...meta, total: sec });
      Engine.hooks.onTick && Engine.hooks.onTick(sec, sec, phase);
      // 종료는 setTimeout 이 확정한다. setInterval 은 화면 표시용일 뿐이라
      // 탭이 백그라운드로 가서 스로틀링돼도 구간 길이가 늘어나지 않는다.
      Engine._end = setTimeout(() => Engine._resolveWait && Engine._resolveWait(), total);
      Engine._timer = setInterval(() => {
        const left = Math.max(0, total - (performance.now() - t0));
        Engine.hooks.onTick && Engine.hooks.onTick(left / 1000, sec, phase);
        if (left <= 0 || Engine._skip) Engine._resolveWait && Engine._resolveWait();
      }, 50);
    });
  },

  /* 건너뛰기 — 지시문 음성 중이면 음성을 끊고, 대기 중이면 대기를 끝낸다 */
  skip() {
    Engine._skip = true;
    Speech.stop();
    if (Engine._resolveWait) Engine._resolveWait();
  },

  async doDirections(s) {
    Engine.hooks.onSegment && Engine.hooks.onSegment(s);
    Engine.hooks.onPhase && Engine.hooks.onPhase('DIRECTIONS', { part: s.part, skippable: true });
    await Speech.say(s.text, 0.92);
    if (Engine.aborted) return;
    await Engine.wait(2, 'DIRECTIONS', { part: s.part, skippable: true });
  },

  async doIntro(s) {
    if (!s.text) return;
    Engine.hooks.onSegment && Engine.hooks.onSegment(s);
    Engine.hooks.onPhase && Engine.hooks.onPhase('INTRO', { part: s.part, skippable: true });
    await Speech.say(s.text, 0.92);
    if (Engine.aborted) return;
    await Engine.wait(2, 'INTRO', { part: s.part, skippable: true });
  },

  async doMaterial(s) {
    Engine.hooks.onSegment && Engine.hooks.onSegment(s);
    Audio_.beep('prep');
    await Engine.wait(s.sec, 'MATERIAL', { part: s.part });
  },

  async doQuestion(s) {
    Engine.hooks.onSegment && Engine.hooks.onSegment(s);

    // Part 3·4 — 질문 음성 (Q10류는 2회 재생)
    if (s.ask) {
      Engine.hooks.onPhase && Engine.hooks.onPhase('QUESTION_AUDIO', { part: s.part, repeat: s.repeat });
      await Speech.say(s.ask, 0.94);
      if (s.repeat && !Engine.aborted) {
        await new Promise(r => setTimeout(r, 700));
        Engine.hooks.onPhase && Engine.hooks.onPhase('QUESTION_AUDIO', { part: s.part, repeat: true, second: true });
        await Speech.say(s.ask, 0.94);
      }
    }
    if (Engine.aborted) return;

    // 준비 시간
    Audio_.beep('prep');
    await Engine.wait(s.prepSec, 'PREPARATION', { part: s.part });
    if (Engine.aborted) return;

    // 답변 시간 — 녹음
    Audio_.beep('go');
    let rec = null;
    try {
      Recorder.start();
      await Engine.wait(s.respSec, 'RESPONSE', { part: s.part });
      rec = await Recorder.stop();
    } catch (e) {
      Engine.hooks.onError && Engine.hooks.onError('녹음에 실패했습니다: ' + e.message);
      Engine.aborted = true;   // 남은 문항을 빈 채로 흘려보내지 않는다
      return;
    }
    Audio_.beep('end');
    if (Engine.aborted) return;

    if (rec && rec.blob && rec.blob.size > 0) {
      const attempt = {
        questionId: s.qid,
        part: s.part,
        qNo: s.qNo || null,
        startedAt: Date.now(),
        limitSec: s.respSec,
        durationSec: Math.min(rec.durationSec, s.respSec),
        mime: rec.mime,
        audio: rec.blob,
        mode: Engine.mode,
        selfCheck: {},
        memo: ''
      };
      try { attempt.id = await Store.save(attempt); } catch {}
      Engine.results.push(attempt);
      Engine.hooks.onRecorded && Engine.hooks.onRecorded(attempt, s);
    }
  }
};
