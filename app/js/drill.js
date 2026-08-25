/* ============================================================
   드릴 엔진 — 형식 검사기 + 세션 상태
   AI 없음. 검사는 형식(어휘·패턴·길이)까지만 한다.
   내용 적절성은 판정하지 않고 모범 예시 대조로 사용자가 판단한다.
   ============================================================ */

const Check = {
  /* 한 건 검사 → [{ok, msg, label}] */
  run(rules, input) {
    const text = (input || '').trim();
    const out = [];
    (rules || []).forEach(r => {
      let ok = true, label = '';
      if (r.type === 'contains') {
        label = `"${r.value}" 포함`;
        ok = text.toLowerCase().includes(String(r.value).toLowerCase());
      } else if (r.type === 'notContains') {
        label = `"${r.value}" 미사용`;
        ok = !text.toLowerCase().includes(String(r.value).toLowerCase());
      } else if (r.type === 'pattern') {
        label = '문장 구조';
        try { ok = new RegExp(r.re, 'i').test(text); } catch { ok = true; }
      } else if (r.type === 'minWords') {
        label = `${r.value}단어 이상`;
        ok = Check.words(text) >= r.value;
      }
      out.push({ ok, label, msg: r.msg || '' });
    });
    return out;
  },

  words(t) {
    return (t || '').trim().split(/\s+/).filter(Boolean).length;
  },

  /* 빈칸이 실제로 채워졌는가 — 템플릿의 {SLOT} 표기가 그대로 남아 있으면 실패 */
  slotsFilled(text) {
    return !/\{[A-Z0-9_]+\}/.test(text || '');
  },

  /* 템플릿의 고정부(슬롯 밖 단어)를 얼마나 유지했는가 0~1 */
  skeleton(tpl, input) {
    const fixed = String(tpl).replace(/\{[A-Z0-9_]+\}/g, ' ')
      .toLowerCase().match(/[a-z']+/g) || [];
    if (!fixed.length) return 1;
    const got = new Set((String(input).toLowerCase().match(/[a-z']+/g) || []));
    let hit = 0;
    fixed.forEach(w => { if (got.has(w)) hit++; });
    return hit / fixed.length;
  },

  /* 종합 판정 */
  grade(sentence, input) {
    const text = (input || '').trim();
    const checks = Check.run(sentence.check, text);
    const filled = Check.slotsFilled(text);
    const skel = Check.skeleton(sentence.tpl, text);
    if (!filled) checks.unshift({ ok: false, label: '빈칸 채움', msg: '{SLOT} 표기가 그대로 남아 있다. 실제 내용으로 바꿔라.' });
    if (skel < 0.5) checks.push({ ok: false, label: '골격 유지', msg: '템플릿의 고정 표현이 너무 많이 빠졌다.' });
    else checks.push({ ok: true, label: '골격 유지', msg: '' });
    const passed = text.length > 0 && checks.every(c => c.ok);
    return { passed, checks, words: Check.words(text), skeleton: skel };
  }
};

/* ============================================================
   드릴 세션
   모드 A 슬롯 채우기 / B 상황 연속 변환 / C 블록 조립 / D 말하기 전환
   ============================================================ */
const Drill = {
  /* speak:true 면 3-2-1 카운트다운 뒤 자동 녹음. 시험은 타이핑이 아니라 말하기다. */
  MODES: {
    A: { id: 'A', ko: '슬롯 채우기', sec: 12, speak: false,
         desc: '타이핑. 빈칸에 뭐가 들어가는지 익히고 형식 검사를 받는다.' },
    B: { id: 'B', ko: '연속 말하기', sec: 15, prep: 3, speak: true,
         desc: '3·2·1 뒤 녹음. 답변 골격 전체를 문장마다 상황 3개씩 순회한다. 핵심 드릴.' },
    C: { id: 'C', ko: '블록 조립', sec: 20, speak: false,
         desc: '타이핑. 블록을 이어 완성 답안을 만든다.' },
    D: { id: 'D', ko: '실전 타이밍', sec: 0, prep: 3, speak: true,
         desc: '유형의 실제 답변 시간으로 한 번에. 15·30·60초.' }
  },

  /* 문장 하나를 말하는 데 실제로 필요한 시간.
     모범 예시의 단어 수로 잡는다. 템플릿은 슬롯이 비어 있어 실제 길이와 다르다.
     학습자 발화를 초당 2단어로 보고 생각할 여유 3초를 더한다. */
  estimateSec(item) {
    const ref = (item && item.refs && item.refs[0]) || (item && item.sentence && item.sentence.tpl) || '';
    const words = String(ref).trim().split(/\s+/).filter(Boolean).length;
    return Math.max(6, Math.min(20, Math.ceil(words / 2) + 3));
  },

  /* 모드 D 는 유형의 실제 답변 시간, 모드 B 는 문장 길이에 맞춘다 */
  secFor(mode, type, item) {
    const M = Drill.MODES[mode];
    if (mode === 'D') return (type && type.sec) || 15;
    if (mode === 'B' && item) return Drill.estimateSec(item);
    return M.sec;
  },

  /* 유형에서 드릴 가능한 문장만 추림 */
  drillable(type) {
    return (type.sentences || []).filter(s => s.drills && s.drills.length);
  },

  /* 모드별 문항 목록 생성 */
  build(type, mode, sentenceId) {
    const ds = Drill.drillable(type);
    if (!ds.length) return [];

    if (mode === 'A') {
      // 각 문장에서 상황 1개씩
      return ds.map(s => ({
        sentence: s, situation: s.drills[0].situation, refs: s.drills[0].refs
      }));
    }
    if (mode === 'B') {
      // 문장을 지정했으면 그 문장만 깊게 (상황 5개 전부)
      if (sentenceId) {
        const s = ds.find(x => x.id === sentenceId);
        if (s) return s.drills.map(d => ({ sentence: s, situation: d.situation, refs: d.refs }));
      }
      // 지정이 없으면 답변 골격 전체를 순회한다.
      // 문장별로 묶어서 돌려야 "같은 골격에 다른 상황" 효과가 유지된다.
      // 한 문장당 3상황이면 골격이 손에 붙으면서 세션도 길어지지 않는다.
      const per = 3;
      const out = [];
      ds.forEach(s => s.drills.slice(0, per).forEach(d =>
        out.push({ sentence: s, situation: d.situation, refs: d.refs })));
      return out;
    }
    if (mode === 'C') {
      // 블록 순서대로 각 1개 — 이어 붙이면 완성 답안
      return ds.map(s => ({
        sentence: s, situation: s.drills[0].situation, refs: s.drills[0].refs, block: s.block
      }));
    }
    if (mode === 'D') {
      // 말하기: 문장별 상황 1개씩, 녹음
      return ds.map(s => ({
        sentence: s, situation: s.drills[0].situation, refs: s.drills[0].refs
      }));
    }
    return [];
  },

  /* 세션 상태 */
  state: null,

  start(typePath, mode, sentenceId) {
    const t = getType(typePath);
    if (!t || !t.type) return null;
    const items = Drill.build(t.type, mode, sentenceId);
    if (!items.length) return null;
    Drill.state = {
      typePath, mode, typeData: t, items, i: 0,
      results: [], startedAt: Date.now()
    };
    return Drill.state;
  },

  current() {
    const s = Drill.state;
    return s && s.i < s.items.length ? s.items[s.i] : null;
  },

  submit(input) {
    const s = Drill.state;
    if (!s) return null;
    const item = s.items[s.i];
    const g = Check.grade(item.sentence, input);
    const rec = { situation: item.situation, input: (input || '').trim(), refs: item.refs, ...g };
    s.results[s.i] = rec;
    return rec;
  },

  /* 녹음 결과 기록 (모드 D) */
  submitAudio(attemptId, durationSec) {
    const s = Drill.state;
    if (!s) return null;
    const item = s.items[s.i];
    const rec = { situation: item.situation, refs: item.refs, attemptId, durationSec, passed: true, checks: [], spoken: true };
    s.results[s.i] = rec;
    return rec;
  },

  next() {
    const s = Drill.state;
    if (!s) return false;
    s.i++;
    return s.i < s.items.length;
  },

  done() {
    const s = Drill.state;
    return !s || s.i >= s.items.length;
  },

  summary() {
    const s = Drill.state;
    if (!s) return null;
    const done = s.results.filter(Boolean);
    const passed = done.filter(r => r.passed).length;
    return {
      typePath: s.typePath, mode: s.mode,
      total: s.items.length, answered: done.length, passed,
      rate: done.length ? passed / done.length : 0,
      results: done, at: s.startedAt
    };
  },

  async save() {
    const sum = Drill.summary();
    if (!sum || !sum.answered) return null;
    const t = getType(sum.typePath);
    return Store.saveDrill({
      typePath: sum.typePath,
      typeKo: t && t.type ? `Part ${t.part} · ${t.type.ko}` : sum.typePath,
      mode: sum.mode, at: sum.at,
      total: sum.total, answered: sum.answered, passed: sum.passed,
      results: sum.results.map(r => ({
        situation: r.situation, input: r.input || '', passed: !!r.passed, spoken: !!r.spoken
      }))
    }).catch(() => null);
  },

  clear() { Drill.state = null; }
};

/* ============================================================
   Part 2 블록 커버리지 기록
   STT가 없으므로 체크는 사용자가 한다. 누락 블록을 누적해 보여주는 게 목적.
   ============================================================ */
const Coverage = {
  async record(questionId, blocks) {
    return Store.saveCoverage({ questionId, blocks, at: Date.now() }).catch(() => null);
  },

  /* 최근 N회에서 반복 누락된 블록 */
  async weakBlocks(questionId, n = 3) {
    const all = await Store.coverageOf(questionId).catch(() => []);
    const recent = all.slice(0, n);
    if (recent.length < 2) return [];
    const ids = (PATTERNS[2].blocks || []).map(b => b.id);
    const miss = {};
    ids.forEach(id => { miss[id] = recent.filter(r => !r.blocks.includes(id)).length; });
    return ids
      .filter(id => miss[id] >= Math.min(2, recent.length))
      .map(id => ({ id, times: miss[id], of: recent.length,
                    ko: (PATTERNS[2].blocks.find(b => b.id === id) || {}).ko || id }));
  }
};
