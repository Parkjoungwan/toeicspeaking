/* 화면 라우팅 + 렌더 */

const $ = (s, r = document) => r.querySelector(s);
const el = (tag, attrs = {}, html = '') => {
  const n = document.createElement(tag);
  Object.entries(attrs).forEach(([k, v]) => {
    if (k === 'class') n.className = v; else if (k === 'html') n.innerHTML = v; else n.setAttribute(k, v);
  });
  if (html) n.innerHTML = html;
  return n;
};
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const mmss = s => {
  s = Math.max(0, Math.ceil(s));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};
const fmtDate = ts => {
  const d = new Date(ts);
  const p = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const App = {
  view: 'home',
  main: null,
  attemptCounts: {},

  async init() {
    Speech.init();
    App.main = $('#main');
    $$tabs();
    window.addEventListener('hashchange', App.route);
    await Store.probe();
    App.showCapabilityBanner();
    await App.refreshCounts();
    App.route();
  },

  /* 실행 스크립트 이름은 OS 마다 다르다 */
  starterName() {
    return /Win/i.test(navigator.platform || navigator.userAgent) ? 'start.bat' : 'start.command';
  },

  /* 이 브라우저에서 실제로 뭐가 되는지 확인해 알린다.
     file:// 로 열었을 때 조용히 실패하는 걸 막는 게 목적. */
  showCapabilityBanner() {
    const STARTER = App.starterName();
    const isFile = location.protocol === 'file:';
    const noStore = Store.backend === 'memory';
    const noMic = !Recorder.supported();
    if (!isFile && !noStore && !noMic) return;

    const b = el('div', { class: 'capbar' });
    let msg = '';
    if (noMic) {
      msg = '<b>이 브라우저에서 녹음을 쓸 수 없다.</b> Chrome·Edge·Safari 최신 버전에서 열어라.';
    } else if (noStore) {
      msg = Store.lsOK
        ? '<b>학습 기록은 저장된다. 오디오만 이 창에서만 유지된다.</b> ' +
          '점수·메모·드릴 통계·커버리지는 새로고침해도 남는다. ' +
          `녹음 파일까지 보관하려면 <code>${STARTER}</code> 를 더블클릭해라.` +
          (Store.restored ? ' <b>이전 기록을 복원했다.</b>' : '')
        : '<b>이 창에서만 유지된다.</b> 브라우저가 저장소를 전부 막았다. ' +
          `<code>${STARTER}</code> 를 더블클릭해 열어라.`;
    } else if (isFile) {
      msg = Store.restored
        ? `<b>지난 기록 ${Store.restored}건을 복원했다.</b> 브라우저를 완전히 종료하면 ` +
          `<code>file://</code> 에서는 <b>녹음 오디오가 사라진다</b>(점수·메모·드릴 기록은 남는다). ` +
          `오디오까지 보관하려면 <code>${STARTER}</code> 를 더블클릭해라.`
        : '<code>file://</code> 로 열려 있다. 브라우저를 <b>완전히 종료하면 녹음 오디오가 사라진다.</b> ' +
          `점수·메모·드릴 기록은 남는다. 오디오까지 보관하려면 <code>${STARTER}</code> 를 더블클릭해라.`;
    }
    b.innerHTML = `<span>${msg}</span><button aria-label="닫기">✕</button>`;
    b.querySelector('button').onclick = () => b.remove();
    document.body.insertBefore(b, document.body.firstChild);
  },

  async refreshCounts() {
    const all = await Store.all().catch(() => []);
    App.attemptCounts = {};
    all.forEach(a => { App.attemptCounts[a.questionId] = (App.attemptCounts[a.questionId] || 0) + 1; });
    App.allAttempts = all;
  },

  go(hash) { location.hash = hash; },

  route() {
    const h = (location.hash || '#/home').slice(2);
    const [v, a, b] = h.split('/');
    document.querySelectorAll('nav.tabs button').forEach(t => t.classList.toggle('on', t.dataset.v === (v || 'home')));
    window.scrollTo(0, 0);
    if (v === 'part') return Views.part(a);
    if (v === 'review') return Views.review(Number(a));
    if (v === 'done') return Views.done();
    if (v === 'patterns') return a ? (b ? Views.typeDetail(a, b) : Views.partTypes(a)) : Views.patterns();
    if (v === 'drilldone') return DrillUI.result();
    if (v === 'drill') return DrillUI.open(a + '/' + b, (h.split('/')[3] || 'A'), h.split('/')[4]);
    if (v === 'official') return Views.official();
    if (v === 'history') return Views.history();
    if (v === 'settings') return Views.settings();
    return Views.home();
  },

  set(nodes) {
    App.main.innerHTML = '';
    (Array.isArray(nodes) ? nodes : [nodes]).forEach(n => App.main.appendChild(n));
  }
};

function $$tabs() {
  $('#tabs').addEventListener('click', e => {
    const b = e.target.closest('button[data-v]');
    // 탭을 직접 누른 건 "일부러 떠난다"는 뜻이므로 복귀 지점을 지운다
    if (b) { Nav.clear(); App.go('#/' + b.dataset.v); }
  });
}

/* ============================================================
   복귀 지점 — 리포트에서 문장 세트·드릴로 들어갔을 때 돌아올 곳을 기억한다.
   sessionStorage 라 새로고침해도 살아남고 탭마다 독립적이다.
   ============================================================ */
const Nav = {
  KEY: 'ts-returnto',
  set(hash, label) {
    try { sessionStorage.setItem(Nav.KEY, JSON.stringify({ hash, label })); } catch (e) {}
  },
  get() {
    try { return JSON.parse(sessionStorage.getItem(Nav.KEY) || 'null'); } catch (e) { return null; }
  },
  clear() { try { sessionStorage.removeItem(Nav.KEY); } catch (e) {} },

  /* 화면 맨 위에 붙이는 복귀 줄. 복귀 지점이 없으면 null */
  bar() {
    const r = Nav.get();
    if (!r) return null;
    const d = el('div', { class: 'returnbar' });
    d.innerHTML = `<span>풀던 문항 <b>${esc(r.label)}</b> 에서 넘어왔다</span>`;
    const b = el('button', {}, '← 리포트로 돌아가기');
    b.onclick = () => { const h = r.hash; Nav.clear(); App.go(h); };
    d.appendChild(b);
    return d;
  }
};

/* ============================================================
   화면
   ============================================================ */
const Views = {

  /* ---------- 홈 ---------- */
  home() {
    const w = el('div');
    w.appendChild(el('h1', {}, '실전 연습'));
    w.appendChild(el('p', { class: 'lede' }, '시험과 동일한 타이밍으로 녹음하고, 다시 듣고, 모범답안과 대조한다.'));

    const mock = el('div', { class: 'card' });
    mock.innerHTML = `
      <div class="row">
        <div style="flex:1;min-width:200px">
          <div style="font-weight:650;font-size:16px;letter-spacing:-.01em">풀 모의고사</div>
          <div style="font-size:13px;color:var(--text-3);margin-top:2px">11문항 · 약 20분 · 중단 없이 끝까지</div>
          <div id="mock-note" style="font-size:12.5px;color:var(--accent);margin-top:5px"></div>
        </div>
        <button class="btn primary big" id="go-mock">시작</button>
      </div>`;
    mock.querySelector('#go-mock').onclick = async () => {
      const b = mock.querySelector('#go-mock');
      b.disabled = true; b.textContent = '문항 고르는 중…';
      await Runlist.loadStats();          // 안 푼 문항·낮은 점수 우선
      b.disabled = false; b.textContent = '시작';
      Exam.start(Runlist.mock(), 'mock', '풀 모의고사');
    };
    // 출제 방식을 화면에 밝힌다
    Runlist.loadStats().then(() => {
      const st = Runlist.stats || {};
      const pool = [...PART1, ...PART2, ...PART3, ...PART4, ...PART5];
      const fresh = pool.filter(q => !st[q.id]).length;
      const note = mock.querySelector('#mock-note');
      if (note) note.textContent = fresh
        ? `아직 안 푼 문항 ${fresh}개를 먼저 출제한다`
        : '전부 한 번씩 풀었다 — 점수가 낮고 오래된 문항부터 출제한다';
    });
    w.appendChild(mock);

    w.appendChild(el('h2', {}, '파트별 연습'));
    const g = el('div', { class: 'grid c2' });
    ['1', '2', '3', '4', '5'].forEach(p => {
      const P = PARTS[p];
      const n = BANK[p].length;
      const c = el('button', { class: 'part-card' });
      c.innerHTML = `
        <div class="no">PART ${P.no} · ${P.qs}</div>
        <div class="ttl">${P.ko}</div>
        <div class="en">${P.name}</div>
        <div class="meta">
          <span class="pill">준비 ${P.prep}초</span>
          <span class="pill">답변 ${p === '3' || p === '4' ? '15/15/30초' : P.resp + '초'}</span>
          <span class="pill accent">0–${P.max}점</span>
          <span class="pill">${n}${p === '3' || p === '4' ? '세트' : '문항'}</span>
        </div>`;
      c.onclick = () => App.go('#/part/' + p);
      g.appendChild(c);
    });
    w.appendChild(g);

    const recent = (App.allAttempts || []).slice(0, 5);
    if (recent.length) {
      w.appendChild(el('h2', {}, '최근 녹음'));
      const card = el('div', { class: 'card' });
      recent.forEach(a => card.appendChild(Views._histRow(a)));
      w.appendChild(card);
    }

    const note = el('div', { class: 'note', style: 'margin-top:26px' });
    note.innerHTML = '이 도구는 <b>녹음·재청취·모범답안 대조</b>만 한다. 자동 발음 채점이나 AI 분석은 없다. 채점은 자가 채점표로 직접 한다 — 첫 청취는 발음만, 두 번째 청취는 멈춤·강세·억양만 본다.';
    w.appendChild(note);

    App.set(w);
  },

  /* ---------- 파트 문항 목록 ---------- */
  part(p) {
    const P = PARTS[p]; if (!P) return Views.home();
    const list = BANK[p];
    const w = el('div');

    w.appendChild(el('div', { class: 'row', style: 'margin-top:24px' },
      `<button class="btn ghost" id="back">← 홈</button>`));
    w.querySelector('#back').onclick = () => App.go('#/home');

    w.appendChild(el('h1', {}, `Part ${P.no} · ${P.ko}`));
    const sub = el('p', { class: 'lede' });
    sub.innerHTML = `${esc(P.name)} · ${P.qs} · 준비 ${P.prep}초 / 답변 ${p === '3' || p === '4' ? '15·15·30초' : P.resp + '초'} · 0–${P.max}점`;
    w.appendChild(sub);

    const crit = el('div', { class: 'row', style: 'margin-bottom:18px' });
    P.criteria.forEach(c => crit.appendChild(el('span', { class: 'pill accent' }, esc(c))));
    w.appendChild(crit);

    const all = el('div', { class: 'row', style: 'margin-bottom:14px' });
    const bAll = el('button', { class: 'btn primary' }, `Part ${P.no} 전체 순회`);
    bAll.onclick = () => Exam.start(Runlist.part(p), 'practice', `Part ${P.no} 전체`);
    all.appendChild(bAll);
    w.appendChild(all);

    const ul = el('div', { class: 'q-list' });
    list.forEach((q, i) => {
      const btn = el('button', { class: 'q-item' });
      const preview = p === '1' ? q.text : p === '2' ? `${q.label} — ${q.model.slice(0, 70)}…`
        : p === '3' || p === '4' ? (q.topic || q.title) + ' · ' + q.items.length + '문항'
        : q.q;
      const doneKey = (p === '3' || p === '4') ? q.items.map((_, k) => `${q.id}#${k + 1}`) : [q.id];
      const done = doneKey.reduce((s, k) => s + (App.attemptCounts[k] || 0), 0);
      btn.innerHTML = `
        <span class="idx">${String(i + 1).padStart(2, '0')}</span>
        <span class="body">
          <span class="t">${esc(q.tone || q.label || q.topic || q.title || 'Question')}</span>
          <span class="s">${esc(preview)}</span>
        </span>
        ${done ? `<span class="done">${done}회</span>` : ''}`;
      btn.onclick = () => Exam.start(Runlist.one(p, q), 'practice', `Part ${P.no} · ${q.tone || q.label || q.topic || q.title || ''}`);
      ul.appendChild(btn);
    });
    w.appendChild(ul);
    App.set(w);
  },

  /* ---------- 리포트 ---------- */
  async review(id) {
    const a = await Store.get(id);
    if (!a) return Views.home();
    const { q, item, partKey } = findQuestion(a.questionId);
    const P = PARTS[partKey] || PARTS[a.part];
    const w = el('div');

    w.appendChild(el('div', { class: 'row', style: 'margin-top:24px' },
      `<button class="btn ghost" id="back">← 돌아가기</button>`));
    w.querySelector('#back').onclick = () => history.length > 1 ? history.back() : App.go('#/home');

    const head = el('div', { class: 'report-head' });
    head.appendChild(el('h1', { style: 'margin-bottom:0' }, `Part ${P.no} · ${esc(q ? (q.tone || q.label || q.topic || q.title || '') : '')}`));
    head.appendChild(el('span', { class: 'pill' }, fmtDate(a.startedAt)));
    if (a.mode === 'mock') head.appendChild(el('span', { class: 'pill accent' }, `모의고사 Q${a.qNo || '?'}`));
    w.appendChild(head);
    w.appendChild(el('p', { class: 'lede' }, `${esc(P.name)} · 답변 제한 ${a.limitSec}초`));

    /* 1) 내 녹음 */
    w.appendChild(el('h3', {}, '내 녹음'));
    const playCard = el('div', { class: 'card' });
    const pct = Math.min(100, (a.durationSec / a.limitSec) * 100);
    const target = a.limitSec >= 45 ? 89 : 90;
    const good = pct >= target;
    playCard.innerHTML = `
      <div class="usage">
        <span class="num">${a.durationSec.toFixed(1)}<span style="font-size:13px;color:var(--text-3)">s</span></span>
        <span class="track"><i style="width:${pct}%;background:${good ? 'var(--ok)' : 'var(--warn)'}"></i><b style="left:${target}%"></b></span>
        <span class="cap">제한 ${a.limitSec}초의 <b>${pct.toFixed(0)}%</b> 사용 ${good ? '· 충분' : '· 더 채워라'}</span>
      </div>`;
    if (a.audio) {
      const au = el('audio', { controls: '' });
      au.src = URL.createObjectURL(a.audio);
      playCard.appendChild(au);
    } else {
      const lost = el('div', { class: 'note', style: 'margin-top:10px' });
      lost.innerHTML = '이 회차의 <b>오디오는 남아 있지 않다.</b> 지표·자가채점·메모는 그대로다. ' +
        '(브라우저가 <code>file://</code> 에서 오디오 저장을 막았을 때 이렇게 된다 — ' +
        '<code>' + App.starterName() + '</code> 로 열면 오디오도 보관된다.)';
      playCard.appendChild(lost);
    }
    const again = el('div', { class: 'row', style: 'margin-top:12px' });
    const bRetry = el('button', { class: 'btn' }, '이 문항 다시 풀기');
    bRetry.onclick = () => {
      if (!q) return;
      const rl = Runlist.one(partKey, q);
      if (item) {
        const idx = q.items.indexOf(item);
        const only = rl.filter(s => s.kind !== 'question' || s.idx === idx);
        Exam.start(only, 'practice', `Part ${P.no} 재시도`);
      } else Exam.start(rl, 'practice', `Part ${P.no} 재시도`);
    };
    again.appendChild(bRetry);
    const bDel = el('button', { class: 'btn danger' }, '녹음 삭제');
    bDel.onclick = async () => {
      if (!confirm('이 녹음을 삭제한다. 되돌릴 수 없다.')) return;
      await Store.remove(id); await App.refreshCounts(); App.go('#/history');
    };
    again.appendChild(bDel);
    playCard.appendChild(again);
    w.appendChild(playCard);

    if (!q) { App.set(w); return; }

    /* 2) 문제 다시 보기 */
    w.appendChild(el('h3', {}, '문제'));
    w.appendChild(Views._stimulus(partKey, q, item));

    /* 3) 모범 답안 */
    w.appendChild(el('h3', {}, partKey === '1' ? '모범 낭독 — 의미 단위와 강세' : '모범 답안'));
    const modelText = item ? item.model : q.model;
    const md = el('div', { class: 'model' + (partKey === '1' ? ' reading' : '') });
    md.innerHTML = partKey === '1' ? markReading(modelText) : esc(modelText);
    w.appendChild(md);

    const listen = el('div', { class: 'row', style: 'margin-top:10px' });
    const lb = el('button', { class: 'btn' }, partKey === '1' ? '▸ 모범 낭독 듣기' : '▸ 모범 답안 듣기');
    lb.onclick = () => {
      if (lb.dataset.on) { Speech.stop(); lb.removeAttribute('data-on');
        lb.textContent = partKey === '1' ? '▸ 모범 낭독 듣기' : '▸ 모범 답안 듣기'; return; }
      lb.dataset.on = '1'; lb.textContent = '■ 멈추기';
      Speech.passage(modelText).then(() => {
        lb.removeAttribute('data-on');
        lb.textContent = partKey === '1' ? '▸ 모범 낭독 듣기' : '▸ 모범 답안 듣기';
      });
    };
    const sl = el('button', { class: 'btn ghost' }, '느리게');
    sl.onclick = () => Speech.passage(modelText, 0.62);
    listen.append(lb, sl);
    w.appendChild(listen);

    if (partKey === '1') {
      const lg = el('div', { class: 'row', style: 'margin-top:8px;font-size:12.5px;color:var(--text-3)' });
      lg.innerHTML = `<span><b class="slash" style="color:var(--accent)">/</b> 의미 단위 끊기</span>
                      <span><b class="stress">대문자</b> 강세</span>
                      <span><b class="arrow">↘ ↗</b> 억양</span>
                      <span style="color:var(--text-3)">※ 표시는 연습용, 실제로 읽지 않는다</span>`;
      w.appendChild(lg);
    }

    if (q.outline) {
      w.appendChild(el('h3', {}, '시간 배분'));
      const ol = el('ul', { class: 'outline' });
      q.outline.forEach(o => ol.appendChild(el('li', {}, esc(o))));
      w.appendChild(ol);
    }
    if (q.slots) {
      w.appendChild(el('h3', {}, '반드시 언급할 요소'));
      const ol = el('ul', { class: 'outline' });
      q.slots.forEach(o => ol.appendChild(el('li', {}, esc(o))));
      w.appendChild(ol);
    }
    if (q.focus) {
      w.appendChild(el('h3', {}, '발음 점검 단어'));
      const fw = el('div', { class: 'focus-words' });
      q.focus.forEach(f => {
        const b = el('button', { class: 'fw', title: '눌러서 발음 듣기' });
        b.innerHTML = `<span class="w">${esc(f)}</span><span class="sp">▸</span>`;
        b.onclick = () => { speakBtn(b); Speech.word(f); };
        fw.appendChild(b);
      });
      w.appendChild(fw);
      w.appendChild(el('div', { style: 'font-size:12.5px;color:var(--text-3);margin-top:6px' },
        '단어를 누르면 천천히 읽어 준다. 내 녹음과 번갈아 들어라.'));
    }

    /* 4) 팁 */
    const tips = item ? item.tips : q.tips;
    if (tips && tips.length) {
      w.appendChild(el('h3', {}, '이 문항에서 잡아야 할 것'));
      const ul = el('ul', { class: 'tips' });
      tips.forEach(t => ul.appendChild(el('li', {}, mdInline(t))));
      w.appendChild(ul);
    }
    if (q.note) {
      const n = el('div', { class: 'note', style: 'margin-top:12px' });
      n.innerHTML = esc(q.note);
      w.appendChild(n);
    }

    /* 4.5) 유형 링크 — 리포트에서 드릴로 넘어가는 통로 */
    const typePath = TYPE_OF[a.questionId];
    if (typePath) {
      const t = getType(typePath);
      if (t) {
        const name = t.type ? t.type.ko : (t.variant ? t.variant.ko : '');
        w.appendChild(el('h3', {}, '이 문항의 유형'));
        const c = el('div', { class: 'card typelink' });
        c.innerHTML = `
          <div style="flex:1;min-width:180px">
            <div style="font-weight:650;font-size:15.5px">Part ${t.part} · ${esc(name)}</div>
            <div style="font-size:13px;color:var(--text-3);margin-top:2px">${esc(t.type ? t.type.cue : '골격 5블록')}</div>
          </div>`;
        const r = el('div', { class: 'row' });
        const label = `Part ${t.part} · ${q ? (q.tone || q.label || q.topic || q.title || '') : ''}`;
        const mk = (cls, text, hash) => {
          // 앵커라서 ⌘/Ctrl+클릭이면 새 창으로 열린다. 그때는 복귀 지점을 건드리지 않는다.
          const a = el('a', { class: 'btn ' + cls, href: hash });
          a.textContent = text;
          a.onclick = e => {
            if (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;  // 새 창은 그대로
            e.preventDefault();
            Nav.set('#/review/' + a.dataset.rid, label);
            App.go(hash);
          };
          a.dataset.rid = String(id);
          return a;
        };
        r.append(mk('', '만능 문장 보기', '#/patterns/' + typePath),
                 mk('primary', '빈칸 드릴', `#/drill/${typePath}/B`));
        c.appendChild(el('div', { style: 'flex-basis:100%;font-size:12.5px;color:var(--text-3);margin-top:2px' },
          '⌘(Ctrl)+클릭하면 새 창에서 열려 이 리포트를 그대로 둘 수 있다.'));
        c.appendChild(r);
        w.appendChild(c);
      }
    }

    /* 4.6) Part 2 — 블록 커버리지 체크 */
    if (partKey === '2') {
      w.appendChild(el('h3', {}, '블록 커버리지'));
      const c = el('div', { class: 'card' });
      c.appendChild(el('div', { class: 'note', style: 'margin-bottom:12px' },
        '녹음을 들으면서 <b>실제로 말한 블록</b>만 체크해라. 빠뜨린 블록이 누적되면 아래에 경고가 뜬다.'));
      const picked = new Set(a.coverage || []);
      const grid = el('div', { class: 'cov-grid' });
      PATTERNS[2].blocks.forEach(b => {
        const btn = el('button', { class: 'cov' + (picked.has(b.id) ? ' on' : '') });
        btn.innerHTML = `<span class="cid">${b.id}</span><span class="cko">${esc(b.ko)}</span>`;
        btn.onclick = async () => {
          if (picked.has(b.id)) picked.delete(b.id); else picked.add(b.id);
          btn.classList.toggle('on', picked.has(b.id));
          a.coverage = [...picked];
          await Store.update(a);
        };
        grid.appendChild(btn);
      });
      c.appendChild(grid);
      const saveRow = el('div', { class: 'row', style: 'margin-top:12px' });
      const sb = el('button', { class: 'btn' }, '이 회차 기록');
      const msg = el('span', { style: 'font-size:13px;color:var(--text-3)' });
      sb.onclick = async () => {
        await Coverage.record(a.questionId, [...picked]);
        const weak = await Coverage.weakBlocks(a.questionId);
        msg.textContent = weak.length
          ? `반복 누락: ${weak.map(x => x.id + ' ' + x.ko).join(', ')}`
          : '기록됨';
        msg.style.color = weak.length ? 'var(--warn)' : 'var(--text-3)';
      };
      saveRow.append(sb, msg);
      c.appendChild(saveRow);
      Coverage.weakBlocks(a.questionId).then(weak => {
        if (!weak.length) return;
        const n = el('div', { class: 'note warn', style: 'margin-top:12px' });
        n.innerHTML = `<b>최근 ${weak[0].of}회 반복 누락</b> — ${weak.map(x => `${x.id} ${x.ko}`).join(', ')}. 다음 녹음에서 이 블록부터 채워라.`;
        c.appendChild(n);
      });
      w.appendChild(c);
    }

    /* 5) 자가 채점 */
    w.appendChild(el('h3', {}, '자가 채점'));
    const scCard = el('div', { class: 'card' });
    scCard.appendChild(el('div', { class: 'note', style: 'margin-bottom:14px' },
      '0 = 안 됨 · 1 = 가끔 · 2 = 대체로 · 3 = 안정적<br>한 번에 다 고치지 마라. 첫 청취는 발음만, 두 번째 청취는 멈춤·강세·억양만.'));
    const tbl = el('table', { class: 'self' });
    const items = SELF_CHECK[partKey] || SELF_CHECK[1];
    items.forEach((label, i) => {
      const tr = el('tr');
      tr.appendChild(el('td', {}, esc(label)));
      const td = el('td', { class: 'sc' });
      const sc = el('div', { class: 'scale' });
      [0, 1, 2, 3].forEach(v => {
        const b = el('button', {}, String(v));
        if (a.selfCheck && a.selfCheck[i] === v) b.classList.add('on');
        b.onclick = async () => {
          sc.querySelectorAll('button').forEach(x => x.classList.remove('on'));
          b.classList.add('on');
          a.selfCheck = { ...(a.selfCheck || {}), [i]: v };
          await Store.update(a);
        };
        sc.appendChild(b);
      });
      td.appendChild(sc); tr.appendChild(td); tbl.appendChild(tr);
    });
    scCard.appendChild(tbl);
    w.appendChild(scCard);

    /* 6) 메모 */
    w.appendChild(el('h3', {}, '내일의 교정 목표'));
    const ta = el('textarea', { class: 'memo', placeholder: '가장 반복되는 오류 하나만 적어라. 예: passengers 어말 -s 탈락' });
    ta.value = a.memo || '';
    let t;
    ta.oninput = () => { clearTimeout(t); t = setTimeout(async () => { a.memo = ta.value; await Store.update(a); }, 400); };
    w.appendChild(ta);

    /* 이전 시도 */
    const prev = (App.allAttempts || []).filter(x => x.questionId === a.questionId && x.id !== a.id);
    if (prev.length) {
      w.appendChild(el('h3', {}, `이 문항의 이전 녹음 (${prev.length})`));
      const c = el('div', { class: 'card' });
      prev.forEach(x => c.appendChild(Views._histRow(x)));
      w.appendChild(c);
    }

    App.set(w);
  },

  _stimulus(partKey, q, item) {
    const c = el('div', { class: 'card' });
    if (partKey === '1') {
      c.innerHTML = `<div style="font-size:16.5px;line-height:1.85">${esc(q.text)}</div>`;
    } else if (partKey === '2') {
      const s = el('div', { style: 'background:#fff;border-radius:10px;overflow:hidden' });
      s.innerHTML = q.scene;
      c.appendChild(s);
    } else if (partKey === '3') {
      c.innerHTML = `<div style="font-size:13.5px;color:var(--text-3);margin-bottom:10px">${esc(q.intro)}</div>
        <div style="font-size:16.5px;line-height:1.7">${esc(item ? item.q : '')}</div>
        <div style="margin-top:8px"><span class="pill">${item ? item.sec : ''}초</span></div>`;
    } else if (partKey === '4') {
      c.appendChild(materialTable(q.material));
      c.appendChild(el('div', { style: 'font-size:16.5px;line-height:1.7;margin-top:16px' }, esc(item ? item.q : '')));
      const row = el('div', { class: 'row', style: 'margin-top:8px' });
      row.appendChild(el('span', { class: 'pill' }, `${item ? item.sec : ''}초`));
      if (item && item.repeat) row.appendChild(el('span', { class: 'pill accent' }, '질문 2회 재생'));
      c.appendChild(row);
    } else {
      c.innerHTML = `<div style="font-size:16.5px;line-height:1.7">${esc(q.q)}</div>`;
    }
    return c;
  },

  _histRow(a) {
    const { q, partKey } = findQuestion(a.questionId);
    const P = PARTS[partKey] || PARTS[a.part];
    const row = el('div', { class: 'hist-item' });
    const pct = Math.min(100, (a.durationSec / a.limitSec) * 100);
    row.innerHTML = `
      <span class="when">${fmtDate(a.startedAt)}</span>
      <span class="what">
        <b>Part ${P ? P.no : a.part} · ${esc(q ? (q.tone || q.label || q.topic || q.title || '') : a.questionId)}</b>
        <span>${a.durationSec.toFixed(1)}초 / ${a.limitSec}초 · ${pct.toFixed(0)}% 사용${a.mode === 'mock' ? ' · 모의고사' : ''}</span>
      </span>`;
    const b = el('button', { class: 'btn' }, '리포트');
    b.onclick = () => App.go('#/review/' + a.id);
    row.appendChild(b);
    return row;
  },

  /* ---------- 문장 세트: 파트 선택 ---------- */
  patterns() {
    const w = el('div');
    w.appendChild(el('h1', {}, '문장 세트'));
    w.appendChild(el('p', { class: 'lede' },
      '유형별 답변 골격과 만능 문장. 빈칸에 상황을 바꿔 넣는 드릴로 골격을 손에 붙인다.'));

    const warn = el('div', { class: 'note warn', style: 'margin-bottom:20px' });
    warn.innerHTML = mdInline(TEMPLATE_WARNING);
    w.appendChild(warn);

    const skip = el('div', { class: 'note', style: 'margin-bottom:20px' });
    skip.innerHTML = '<b>Part 1은 없다.</b> 지문을 그대로 읽는 과제라 채워 넣을 빈칸이 없기 때문이다. Part 1 훈련은 <b>연습</b> 탭의 모범 낭독 대조로 한다.';
    w.appendChild(skip);

    const g = el('div', { class: 'grid c2' });
    ['2', '3', '4', '5'].forEach(p => {
      const P = PATTERNS[p];
      const n = P.mode === 'coverage' ? P.variants.length : P.types.length;
      const c = el('button', { class: 'part-card' });
      c.innerHTML = `
        <div class="no">PART ${P.part}</div>
        <div class="ttl">${esc(P.ko)}</div>
        <div class="en">${esc(P.en)}</div>
        <div class="meta">
          <span class="pill accent">${P.mode === 'coverage' ? '골격 1개 + 장면 ' + n + '변형' : n + '유형'}</span>
          <span class="pill">답변 ${P.sec}초</span>
        </div>`;
      c.onclick = () => App.go('#/patterns/' + p);
      g.appendChild(c);
    });
    w.appendChild(g);
    App.set(w);
  },

  /* ---------- 문장 세트: 파트별 유형 목록 ---------- */
  async partTypes(p) {
    const P = PATTERNS[p];
    if (!P) return Views.patterns();
    const w = el('div');
    const rb0 = Nav.bar(); if (rb0) w.appendChild(rb0);
    w.appendChild(el('div', { class: 'row', style: 'margin-top:24px' },
      `<button class="btn ghost" id="back">← 문장 세트</button>`));
    w.querySelector('#back').onclick = () => App.go('#/patterns');

    w.appendChild(el('h1', {}, `Part ${P.part} · ${P.ko}`));
    const lede = el('p', { class: 'lede' });
    lede.innerHTML = mdInline(P.intro);
    w.appendChild(lede);

    if (P.mode === 'coverage') {
      /* Part 2 — 골격 + 변형 */
      w.appendChild(el('h3', {}, `공통 골격 · ${P.sec}초`));
      const bc = el('div', { class: 'card' });
      P.blocks.forEach(b => {
        const row = el('div', { class: 'blk' });
        row.innerHTML = `
          <span class="blk-id">${b.id}</span>
          <span class="blk-body">
            <span class="blk-ko">${esc(b.ko)} <span class="pill">${b.sec}초</span>${b.must ? ' <span class="pill accent">필수</span>' : ''}</span>
            ${b.tpl.map(t => `<code class="tplline">${esc(t)}</code>`).join('')}
            <span class="blk-note">${esc(b.note)}</span>
          </span>`;
        bc.appendChild(row);
      });
      w.appendChild(bc);

      w.appendChild(el('h3', {}, '장면 변형 — 어느 블록을 늘릴지가 달라진다'));
      const vg = el('div', { class: 'grid c2' });
      P.variants.forEach(v => {
        const c = el('button', { class: 'part-card' });
        c.innerHTML = `<div class="ttl">${esc(v.ko)}</div>
          <div class="meta"><span class="pill accent">${v.expand.join(' · ')} 확장</span></div>
          <div style="font-size:13px;color:var(--text-2);margin-top:8px;line-height:1.6">${mdInline(v.why)}</div>`;
        c.onclick = () => App.go(`#/patterns/2/${v.id}`);
        vg.appendChild(c);
      });
      w.appendChild(vg);

      w.appendChild(el('h3', {}, '자주 하는 실수'));
      const ml = el('ul', { class: 'tips' });
      P.mistakes.forEach(m => ml.appendChild(el('li', {}, mdInline(m))));
      w.appendChild(ml);

      const act = el('div', { class: 'row', style: 'margin-top:18px' });
      const b = el('button', { class: 'btn primary' }, '말하기 드릴 시작 (3·2·1 → 녹음)');
      b.onclick = () => App.go('#/drill/2/multi/B');
      act.appendChild(b);
      w.appendChild(act);
      App.set(w);
      return;
    }

    if (P.sharedNote) {
      const n = el('div', { class: 'note', style: 'margin-bottom:16px' });
      n.innerHTML = esc(P.sharedNote);
      w.appendChild(n);
    }

    const drills = await Store.drills().catch(() => []);
    const ul = el('div', { class: 'q-list' });
    P.types.forEach((t, i) => {
      const path = `${p}/${t.id}`;
      const done = drills.filter(d => d.typePath === path).length;
      const btn = el('button', { class: 'q-item' });
      btn.innerHTML = `
        <span class="idx">${t.id.toUpperCase()}</span>
        <span class="body">
          <span class="t">${esc(t.ko)} <span class="pill">${t.appears}</span> <span class="pill">${t.sec}초</span></span>
          <span class="s">${esc(t.cue)}</span>
        </span>
        ${done ? `<span class="done">${done}회</span>` : ''}`;
      btn.onclick = () => App.go(`#/patterns/${p}/${t.id}`);
      ul.appendChild(btn);
    });
    w.appendChild(ul);
    App.set(w);
  },

  /* ---------- 문장 세트: 유형 상세 ---------- */
  async typeDetail(p, tid) {
    const t = getType(`${p}/${tid}`);
    if (!t) return Views.patterns();
    const P = t.partData;
    const w = el('div');

    const rb1 = Nav.bar(); if (rb1) w.appendChild(rb1);
    w.appendChild(el('div', { class: 'row', style: 'margin-top:24px' },
      `<button class="btn ghost" id="back">← Part ${P.part}</button>`));
    w.querySelector('#back').onclick = () => App.go('#/patterns/' + p);

    /* Part 2 변형 상세 */
    if (t.variant) {
      const v = t.variant;
      w.appendChild(el('h1', {}, `Part 2 · ${v.ko}`));
      const l = el('p', { class: 'lede' }); l.innerHTML = mdInline(v.why); w.appendChild(l);

      w.appendChild(el('h3', {}, '이 변형에서 늘릴 블록'));
      const bc = el('div', { class: 'card' });
      P.blocks.forEach(b => {
        const hot = v.expand.includes(b.id);
        const row = el('div', { class: 'blk' + (hot ? ' hot' : '') });
        row.innerHTML = `
          <span class="blk-id">${b.id}</span>
          <span class="blk-body">
            <span class="blk-ko">${esc(b.ko)} <span class="pill">${b.sec}초</span>${hot ? ' <span class="pill accent">여기를 늘려라</span>' : ''}</span>
            ${b.tpl.map(x => `<code class="tplline">${esc(x)}</code>`).join('')}
          </span>`;
        bc.appendChild(row);
      });
      w.appendChild(bc);

      const act = el('div', { class: 'row', style: 'margin-top:18px' });
      const b1 = el('button', { class: 'btn primary' }, '말하기 드릴 시작 (3·2·1 → 녹음)');
      b1.onclick = () => App.go(`#/drill/2/${v.id}/B`);
      act.appendChild(b1);
      w.appendChild(act);
      App.set(w);
      return;
    }

    const type = t.type;
    w.appendChild(el('h1', {}, `Part ${P.part} · ${type.ko}`));
    const meta = el('div', { class: 'row', style: 'margin:0 0 14px' });
    meta.innerHTML = `<span class="pill accent">${type.appears}</span><span class="pill">답변 ${type.sec}초</span>`;
    w.appendChild(meta);

    const cue = el('div', { class: 'card', style: 'margin-bottom:6px' });
    cue.innerHTML = `<div style="font-size:12px;color:var(--text-3);letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px">신호 표현</div>
      <div style="font-size:17px;font-weight:600">${esc(type.cue)}</div>
      <div style="margin-top:12px;font-size:12px;color:var(--text-3);letter-spacing:.06em;text-transform:uppercase;margin-bottom:6px">답변 골격</div>
      <div class="row">${type.blocks.map((b, i) =>
        `<span class="pill${i === 0 ? ' accent' : ''}">${esc(b)}</span>${i < type.blocks.length - 1 ? '<span style="color:var(--text-3)">→</span>' : ''}`).join('')}</div>`;
    w.appendChild(cue);

    /* 만능 문장 */
    w.appendChild(el('h3', {}, '만능 문장'));
    type.sentences.forEach(s => {
      const c = el('div', { class: 'card sent' });
      const slotKeys = Object.keys(s.slots || {});
      c.innerHTML = `
        <div class="sent-block">${esc(s.block)}</div>
        <div class="sent-tpl">${tplHTML(s.tpl)}</div>
        <div class="sent-ko">${tplHTML(s.ko)}</div>
        <div class="sent-use">${esc(s.use || '')}</div>
        ${slotKeys.length ? `<div class="slot-list">${slotKeys.map(k => {
          const sl = s.slots[k];
          return `<div class="slot-row"><span class="slot-key">{${k}}</span>
            <span class="slot-meta"><b>${esc(sl.label)}</b>${sl.hint ? ' · ' + esc(sl.hint) : ''}<br>
            <span class="slot-eg">${(sl.eg || []).map(e => esc(e)).join(' / ')}</span></span></div>`;
        }).join('')}</div>` : ''}
        ${s.drills && s.drills.length ? `<div class="sent-act"><button class="btn" data-sid="${s.id}">이 문장만 5연속 드릴</button><button class="btn ghost" data-say="1">▸ 예시 듣기</button></div>` : ''}`;
      const b = c.querySelector('button[data-sid]');
      if (b) b.onclick = () => App.go(`#/drill/${p}/${tid}/B/${s.id}`);
      const sb = c.querySelector('button[data-say]');
      if (sb) sb.onclick = () => Speech.passage(s.drills[0].refs[0], 0.8);
      w.appendChild(c);
    });

    /* 실수 */
    if (type.mistakes && type.mistakes.length) {
      w.appendChild(el('h3', {}, '자주 하는 실수'));
      const ml = el('ul', { class: 'tips warn' });
      type.mistakes.forEach(m => ml.appendChild(el('li', {}, mdInline(m))));
      w.appendChild(ml);
    }

    /* 드릴 시작 */
    w.appendChild(el('h3', {}, '드릴'));
    const modes = el('div', { class: 'grid c2' });
    ['B', 'D', 'A', 'C'].forEach(m => {
      const M = Drill.MODES[m];
      const c = el('button', { class: 'part-card' });
      c.innerHTML = `<div class="no">모드 ${M.id}${m === 'B' ? ' · 기본' : ''}</div>
        <div class="ttl">${esc(M.ko)}</div>
        <div style="font-size:13px;color:var(--text-2);margin-top:6px;line-height:1.6">${esc(M.desc)}</div>
        <div class="meta">
          <span class="pill">${m === 'D' ? (type.sec + '초') : (M.sec + '초')}/문항</span>
          ${M.speak ? `<span class="pill rec">3·2·1 → 녹음</span>` : '<span class="pill">타이핑</span>'}
        </div>`;
      c.onclick = () => App.go(`#/drill/${p}/${tid}/${m}`);
      modes.appendChild(c);
    });
    w.appendChild(modes);

    /* 최근 드릴 기록 */
    const hist = await Store.drillsOf(`${p}/${tid}`).catch(() => []);
    if (hist.length) {
      w.appendChild(el('h3', {}, `최근 드릴 (${hist.length})`));
      const c = el('div', { class: 'card' });
      hist.slice(0, 5).forEach(d => {
        const row = el('div', { class: 'hist-item' });
        row.innerHTML = `<span class="when">${fmtDate(d.at)}</span>
          <span class="what"><b>모드 ${d.mode} · ${Drill.MODES[d.mode] ? Drill.MODES[d.mode].ko : ''}</b>
          <span>${d.passed} / ${d.answered} 통과</span></span>`;
        c.appendChild(row);
      });
      w.appendChild(c);
    }

    App.set(w);
  },

  /* ---------- 공식 자료실 (외부 링크 전용) ---------- */
  official() {
    const w = el('div');
    w.appendChild(el('h1', {}, '공식 자료실'));
    w.appendChild(el('p', { class: 'lede' },
      '공식 문항으로 실전 감각을 점검하고, 고급 답변과 내 녹음을 비교한다. 전부 공식 사이트로 이동하는 링크다.'));

    const warn = el('div', { class: 'note warn', style: 'margin-bottom:22px' });
    warn.innerHTML = esc(OFFICIAL.warning);
    w.appendChild(warn);

    OFFICIAL.groups.forEach(g => {
      w.appendChild(el('h3', {}, esc(g.title)));
      const c = el('div', { class: 'card' });
      const d = el('div', { style: 'font-size:13.5px;color:var(--text-2);margin-bottom:12px;line-height:1.6' });
      d.innerHTML = mdInline(g.desc);
      c.appendChild(d);
      const list = el('div', { class: 'link-grid' });
      g.links.forEach(l => {
        const a = el('a', { class: 'ext', href: l.url, target: '_blank', rel: 'noopener noreferrer' });
        a.innerHTML = `<span>${esc(l.label)}</span><span class="arr">↗</span>`;
        list.appendChild(a);
      });
      c.appendChild(list);
      w.appendChild(c);
    });

    const how = el('div', { class: 'note', style: 'margin-top:26px' });
    how.innerHTML = '<b>권장 사용 순서</b><br>① 이 앱에서 자체 문항으로 녹음한다 → ② 모범답안·팁과 대조한다 → ③ 공식 수준별 샘플에서 <b>고급 답변</b>을 듣는다 → ④ 같은 문항을 다시 녹음한다.<br>공식 기출 Test는 2주에 한 번 정도, 실전 점검용으로만 쓰는 게 좋다. 매일 풀면 문항이 금방 소진된다.';
    w.appendChild(how);

    App.set(w);
  },

  /* ---------- 시험 직후 결과 목록 ---------- */
  async done() {
    const ids = App.lastResults || [];
    if (!ids.length) return Views.home();
    await App.refreshCounts();
    const results = ids.map(id => (App.allAttempts || []).find(a => a.id === id)).filter(Boolean);
    if (!results.length) return Views.home();

    const w = el('div');
    w.appendChild(el('h1', {}, '녹음 완료'));
    w.appendChild(el('p', { class: 'lede' },
      `${results.length}개 문항을 녹음했다. 하나씩 다시 듣고 모범답안과 대조해라.`));

    const avg = results.reduce((s, a) => s + Math.min(100, a.durationSec / a.limitSec * 100), 0) / results.length;
    const sumCard = el('div', { class: 'card', style: 'margin-bottom:14px' });
    sumCard.innerHTML = `<div class="usage">
      <span class="num">${avg.toFixed(0)}<span style="font-size:13px;color:var(--text-3)">%</span></span>
      <span class="track"><i style="width:${avg}%;background:${avg >= 88 ? 'var(--ok)' : 'var(--warn)'}"></i><b style="left:88%"></b></span>
      <span class="cap">평균 시간 활용률 ${avg >= 88 ? '· 제한 시간을 잘 채웠다' : '· 제한 시간을 더 채워라'}</span></div>`;
    w.appendChild(sumCard);

    const c = el('div', { class: 'card' });
    results.forEach(a => c.appendChild(Views._histRow(a)));
    w.appendChild(c);

    const r = el('div', { class: 'row', style: 'margin-top:18px' });
    const b1 = el('button', { class: 'btn primary' }, '첫 문항 리포트 보기');
    b1.onclick = () => App.go('#/review/' + results[0].id);
    const b2 = el('button', { class: 'btn' }, '홈으로');
    b2.onclick = () => App.go('#/home');
    r.append(b1, b2);
    w.appendChild(r);
    App.set(w);
  },

  /* ---------- 기록 ---------- */
  async history() {
    await App.refreshCounts();
    const all = App.allAttempts || [];
    const w = el('div');
    w.appendChild(el('h1', {}, '기록'));

    if (!all.length) {
      w.appendChild(el('div', { class: 'empty' }, '아직 녹음이 없다. 홈에서 연습을 시작해라.'));
      App.set(w); return;
    }

    // 요약
    const byPart = {};
    all.forEach(a => { (byPart[a.part] = byPart[a.part] || []).push(a); });
    const sum = el('div', { class: 'grid c3', style: 'margin-bottom:8px' });
    Object.keys(byPart).sort().forEach(p => {
      const list = byPart[p];
      const avg = list.reduce((s, a) => s + Math.min(100, a.durationSec / a.limitSec * 100), 0) / list.length;
      const P = PARTS[p] || { no: p, ko: '' };
      const c = el('div', { class: 'card' });
      c.innerHTML = `<div style="font-size:12px;color:var(--accent);font-weight:700;letter-spacing:.06em">PART ${P.no}</div>
        <div style="font-size:22px;font-weight:650;margin:4px 0 0;font-variant-numeric:tabular-nums">${list.length}<span style="font-size:13px;color:var(--text-3);font-weight:400">회</span></div>
        <div style="font-size:12.5px;color:var(--text-2)">시간 활용 평균 ${avg.toFixed(0)}%</div>`;
      sum.appendChild(c);
    });
    w.appendChild(sum);

    // 메모 모음
    const memos = all.filter(a => a.memo && a.memo.trim());
    if (memos.length) {
      w.appendChild(el('h3', {}, '적어 둔 교정 목표'));
      const c = el('div', { class: 'card' });
      const ul = el('ul', { class: 'tips' });
      memos.slice(0, 8).forEach(m => ul.appendChild(el('li', {}, `${esc(m.memo)} <span style="color:var(--text-3);font-size:12px;margin-left:6px">${fmtDate(m.startedAt)}</span>`)));
      c.appendChild(ul); w.appendChild(c);
    }

    w.appendChild(el('h3', {}, `전체 녹음 ${all.length}건`));
    const c = el('div', { class: 'card' });
    all.forEach(a => c.appendChild(Views._histRow(a)));
    w.appendChild(c);

    const danger = el('div', { class: 'row end', style: 'margin-top:18px' });
    const bc = el('button', { class: 'btn danger' }, '모든 기록 삭제');
    bc.onclick = async () => {
      if (!confirm('모든 녹음과 기록을 영구 삭제한다. 되돌릴 수 없다. 진행할까?')) return;
      await Store.clear(); await App.refreshCounts(); Views.history();
    };
    danger.appendChild(bc);
    w.appendChild(danger);
    App.set(w);
  },

  /* ---------- 설정 ---------- */
  settings() {
    const s = Settings.get();
    const w = el('div');
    w.appendChild(el('h1', {}, '설정'));
    const c = el('div', { class: 'card' });

    const sw = (key, title, desc) => {
      const d = el('div', { class: 'setting' });
      d.innerHTML = `<span class="lbl"><b>${esc(title)}</b><span>${desc}</span></span>
        <label class="sw"><input type="checkbox" ${s[key] ? 'checked' : ''}><i></i></label>`;
      d.querySelector('input').onchange = e => Settings.set({ [key]: e.target.checked });
      return d;
    };
    c.appendChild(sw('tts', '지시문·질문 음성 재생', '실제 시험처럼 안내와 질문을 음성으로 듣는다. Part 3·4는 원래 음성만 나온다.'));
    c.appendChild(sw('showQuestionText', 'Part 3·4 질문 텍스트 표시', '끄면 실전과 동일하게 음성만 나온다. 켜면 화면에도 뜬다.'));
    c.appendChild(sw('beep', '비프음', '준비 시작·녹음 시작·종료 신호음.'));
    c.appendChild(sw('skipDirections', '연습 모드에서 지시문 건너뛰기 허용', '모의고사 모드에서는 건너뛸 수 없다.'));

    // 음성 선택
    const vd = el('div', { class: 'setting' });
    vd.innerHTML = `<span class="lbl"><b>영어 음성</b><span>브라우저에 설치된 음성 중 선택. macOS는 Samantha 권장.</span></span>`;
    const sel = el('select');
    const fill = () => {
      sel.innerHTML = '<option value="">자동 선택</option>';
      Speech.voices.forEach(v => {
        const o = el('option', { value: v.voiceURI }, `${v.name} (${v.lang})`);
        if (s.voiceURI === v.voiceURI) o.selected = true;
        sel.appendChild(o);
      });
    };
    fill();
    if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => { Speech.init(); fill(); };
    sel.onchange = () => Settings.set({ voiceURI: sel.value });
    vd.appendChild(sel);
    c.appendChild(vd);

    const td = el('div', { class: 'setting' });
    td.innerHTML = `<span class="lbl"><b>테마</b><span>시험 화면은 항상 어둡게 고정된다.</span></span>`;
    const tsel = el('select');
    ['시스템 설정', '라이트', '다크'].forEach((n, i) => tsel.appendChild(el('option', { value: ['', 'light', 'dark'][i] }, n)));
    tsel.value = localStorage.getItem('ts-theme') || '';
    tsel.onchange = () => {
      localStorage.setItem('ts-theme', tsel.value);
      if (tsel.value) document.documentElement.setAttribute('data-theme', tsel.value);
      else document.documentElement.removeAttribute('data-theme');
    };
    td.appendChild(tsel);
    c.appendChild(td);
    w.appendChild(c);

    const test = el('div', { class: 'row', style: 'margin-top:16px' });
    const bt = el('button', { class: 'btn' }, '음성 테스트');
    bt.onclick = () => Speech.say('This is a test of the English voice for the TOEIC Speaking practice.');
    const bb = el('button', { class: 'btn' }, '비프음 테스트');
    bb.onclick = () => { Audio_.beep('prep'); setTimeout(() => Audio_.beep('go'), 600); setTimeout(() => Audio_.beep('end'), 1300); };
    const bm = el('button', { class: 'btn' }, '마이크 테스트');
    bm.onclick = async () => {
      try { await Recorder.arm(); alert('마이크 정상. 입력 스트림이 열렸다.'); Recorder.disarm(); }
      catch (e) { alert('마이크를 열 수 없다: ' + e.message); }
    };
    test.append(bt, bb, bm);
    w.appendChild(test);

    const info = el('div', { class: 'note', style: 'margin-top:24px' });
    info.innerHTML = `<b>저장 위치</b> — 녹음은 이 브라우저의 IndexedDB에만 저장된다. 서버로 전송되지 않는다. 브라우저 데이터를 지우면 함께 사라진다.<br>
      <b>브라우저</b> — Chrome / Edge / Safari 모두 동작. 음성 품질은 Safari(macOS)가 가장 낫다.`;
    w.appendChild(info);

    App.set(w);
  }
};

/* ============================================================
   시험 화면 (오버레이)
   ============================================================ */
const Exam = {
  node: null, mode: 'practice', recorded: [],

  start(segs, mode, title) {
    if (!Recorder.supported()) {
      alert('이 브라우저는 녹음을 지원하지 않는다. Chrome, Edge 또는 Safari를 써라.');
      return;
    }
    Exam.mode = mode; Exam.recorded = [];
    document.body.classList.add('exam-mode');

    const n = el('div', { class: 'exam' });
    n.innerHTML = `
      <div class="exam-bar">
        <span class="t" id="ex-title">${esc(title)}</span>
        <span id="ex-count"></span>
        <span class="sp"></span>
        <button id="ex-skip" style="display:none">건너뛰기</button>
        <button id="ex-quit">시험 종료</button>
      </div>
      <div class="exam-body"><div class="exam-stage" id="ex-stage"></div></div>
      <div class="exam-foot" id="ex-foot">
        <div class="phase"><span class="dot"></span><span id="ex-phase">준비 중</span><span id="ex-hint" style="letter-spacing:0;text-transform:none;color:#6f7a86"></span></div>
        <div class="clock" id="ex-clock">--:--</div>
        <div class="bar"><i id="ex-bar" style="width:0%"></i></div>
        <div class="level" id="ex-level" style="display:none">${'<i></i>'.repeat(28)}</div>
      </div>`;
    document.body.appendChild(n);
    Exam.node = n;

    $('#ex-quit', n).onclick = () => {
      if (confirm('시험을 종료한다. 진행 중인 문항은 저장되지 않는다.')) Exam.close(true);
    };
    $('#ex-skip', n).onclick = () => Engine.skip();

    const totalQ = segs.filter(s => s.kind === 'question').length;
    let doneQ = 0;

    Engine.run(segs, {
      onSegment(s) {
        if (s.kind === 'question') {
          doneQ++;
          $('#ex-count', n).textContent = `문항 ${doneQ} / ${totalQ}`;
        }
        Exam.renderStage(s);
      },
      onPhase(phase, meta) {
        const foot = $('#ex-foot', n);
        foot.classList.toggle('is-prep', phase === 'PREPARATION' || phase === 'MATERIAL');
        foot.classList.toggle('is-resp', phase === 'RESPONSE');
        const labels = {
          DIRECTIONS: 'DIRECTIONS', INTRO: 'DIRECTIONS', MATERIAL: 'READING TIME',
          QUESTION_AUDIO: 'LISTEN', PREPARATION: 'PREPARATION TIME', RESPONSE: 'RESPONSE TIME'
        };
        $('#ex-phase', n).textContent = labels[phase] || phase;
        const hints = {
          MATERIAL: '자료를 읽어라 — 제목·시간·가격·장소',
          QUESTION_AUDIO: meta && meta.second ? '두 번째 재생' : (meta && meta.repeat ? '이 질문은 두 번 나온다' : ''),
          PREPARATION: '', RESPONSE: '지금 말해라'
        };
        $('#ex-hint', n).textContent = hints[phase] || '';

        const skippable = (phase === 'DIRECTIONS' || phase === 'INTRO') && Exam.mode !== 'mock' && Settings.get().skipDirections;
        $('#ex-skip', n).style.display = skippable ? '' : 'none';

        const lv = $('#ex-level', n);
        if (phase === 'RESPONSE') {
          lv.style.display = '';
          const bars = [...lv.children];
          Recorder.onLevel(v => {
            const lit = Math.round(v * bars.length);
            bars.forEach((b, i) => {
              b.classList.toggle('on', i < lit);
              b.classList.toggle('hot', i < lit && i > bars.length * .82);
              b.style.height = (28 + (i < lit ? 72 : 0) * (i / bars.length)) + '%';
            });
          });
        } else { lv.style.display = 'none'; Recorder.stopLevel(); }

        if (phase === 'DIRECTIONS' || phase === 'INTRO' || phase === 'QUESTION_AUDIO') {
          $('#ex-clock', n).textContent = '— —';
          $('#ex-bar', n).style.width = '0%';
        }
      },
      onTick(left, total, phase) {
        if (phase === 'DIRECTIONS' || phase === 'INTRO') return;
        $('#ex-clock', n).textContent = mmss(left);
        $('#ex-bar', n).style.width = ((total - left) / total * 100) + '%';
      },
      onRecorded(att) { Exam.recorded.push(att); },
      onError(msg) { alert(msg); Exam.close(true); },
      onDone(results) { Exam.finish(results); }
    }, mode);
  },

  renderStage(s) {
    const st = $('#ex-stage', Exam.node);
    st.innerHTML = '';
    const cfg = Settings.get();

    if (s.kind === 'directions') {
      st.appendChild(el('div', { class: 'directions' }, esc(s.text)));
      return;
    }
    if (s.kind === 'intro') {
      st.appendChild(el('div', { class: 'directions' }, esc(s.text)));
      return;
    }
    if (s.kind === 'material') {
      st.appendChild(materialTable(s.q.material, true));
      return;
    }
    // question
    const p = String(s.part);
    if (p === '1') {
      st.appendChild(el('div', { class: 'passage' }, esc(s.q.text)));
    } else if (p === '2') {
      const box = el('div', { class: 'scene' });
      box.innerHTML = s.q.scene;
      st.appendChild(box);
    } else if (p === '3') {
      if (cfg.showQuestionText) st.appendChild(el('div', { class: 'prompt' }, esc(s.ask)));
      else st.appendChild(el('div', { class: 'directions' }, '질문을 듣고 답하세요.'));
    } else if (p === '4') {
      st.appendChild(materialTable(s.q.material, true));
      if (cfg.showQuestionText) {
        st.appendChild(el('div', { class: 'prompt', style: 'margin-top:20px' }, esc(s.ask)));
      }
    } else {
      st.appendChild(el('div', { class: 'prompt' }, esc(s.q.q)));
    }
  },

  async finish(results) {
    Recorder.stopLevel();
    document.body.classList.remove('exam-mode');
    if (Exam.node) { Exam.node.remove(); Exam.node = null; }
    await App.refreshCounts();

    if (!results || !results.length) { App.go('#/home'); App.route(); return; }
    if (results.length === 1) { App.go('#/review/' + results[0].id); return; }

    // 여러 문항 — 결과 목록은 #/done 라우트가 그린다.
    // (여기서 직접 그리면 해시 변경으로 발생하는 route() 가 덮어쓴다)
    App.lastResults = results.map(a => a.id);
    App.go('#/done');
    if ((location.hash || '') === '#/done') Views.done();
  },

  close(abort) {
    if (abort) Engine.abort();
    Recorder.stopLevel();
    document.body.classList.remove('exam-mode');
    if (Exam.node) { Exam.node.remove(); Exam.node = null; }
    App.refreshCounts().then(() => App.route());
  }
};

/* ============================================================
   드릴 실행 화면
   ============================================================ */
const DrillUI = {
  node: null, timer: null, _step: null, endAt: 0, mode: 'A', typePath: '',

  open(typePath, mode, sentenceId) {
    const t = getType(typePath);
    if (!t) { App.go('#/patterns'); return; }

    // Part 2 변형은 파트 공통 문장으로 드릴한다
    if (t.variant) {
      const fake = { id: t.variant.id, ko: t.variant.ko, sentences: PATTERNS[2].sentences,
                     blocks: PATTERNS[2].blocks.map(b => b.ko), appears: 'Q3–4', sec: 30, cue: '', mistakes: PATTERNS[2].mistakes };
      Drill.state = {
        typePath, mode, typeData: { part: '2', partData: PATTERNS[2], type: fake },
        items: Drill.build(fake, mode, sentenceId), i: 0, results: [], startedAt: Date.now()
      };
      if (!Drill.state.items.length) { App.go('#/patterns/2'); return; }
    } else {
      if (!Drill.start(typePath, mode, sentenceId)) { App.go('#/patterns'); return; }
    }

    DrillUI.mode = mode; DrillUI.typePath = typePath;
    DrillUI.mount();

    const M = Drill.MODES[mode];
    if (M && M.speak) {
      // 연속 드릴이라 문항마다 권한을 묻지 않도록 한 번에 확보한다
      $('#dr-stage', DrillUI.node).innerHTML =
        '<div class="dr-arm">마이크를 준비하는 중…</div>';
      Recorder.arm().then(() => DrillUI.render()).catch(e => {
        $('#dr-stage', DrillUI.node).innerHTML =
          `<div class="dr-arm err">마이크를 열 수 없다.<br><span>${esc(e.message || e)}</span></div>`;
      });
      return;
    }
    DrillUI.render();
  },

  mount() {
    DrillUI.unmount();
    const n = el('div', { class: 'drill' });
    n.innerHTML = `
      <div class="drill-bar">
        <span class="t" id="dr-title"></span>
        <span id="dr-count"></span>
        <span class="sp"></span>
        <span id="dr-clock" class="dr-clock"></span>
        <button id="dr-quit"></button>
      </div>
      <div class="drill-body"><div class="drill-stage" id="dr-stage"></div></div>`;
    document.body.appendChild(n);
    document.body.classList.add('drill-mode');
    DrillUI.node = n;
    const q = $('#dr-quit', n);
    q.textContent = Nav.get() ? '← 리포트로' : '나가기';
    q.onclick = () => DrillUI.finish(true);
  },

  unmount() {
    clearInterval(DrillUI.timer); DrillUI.timer = null;
    clearInterval(DrillUI._step); DrillUI._step = null;
    Recorder.stopLevel();
    if (DrillUI.node) { DrillUI.node.remove(); DrillUI.node = null; }
    document.body.classList.remove('drill-mode');
  },

  startClock(sec, onEnd) {
    clearInterval(DrillUI.timer);
    DrillUI.endAt = performance.now() + sec * 1000;
    const c = $('#dr-clock', DrillUI.node);
    const tick = () => {
      const left = Math.max(0, DrillUI.endAt - performance.now()) / 1000;
      if (c) {
        c.textContent = left.toFixed(1) + 's';
        c.classList.toggle('low', left <= 3);
      }
      if (left <= 0) { clearInterval(DrillUI.timer); DrillUI.timer = null; onEnd && onEnd(); }
    };
    tick();
    DrillUI.timer = setInterval(tick, 100);
  },

  render() {
    const s = Drill.state;
    const item = Drill.current();
    if (!item) return DrillUI.finish();

    const M = Drill.MODES[DrillUI.mode];
    const T = s.typeData;
    $('#dr-title', DrillUI.node).textContent =
      `Part ${T.part} · ${T.type.ko} — 모드 ${M.id} ${M.ko}`;
    $('#dr-count', DrillUI.node).textContent = `${s.i + 1} / ${s.items.length}`;

    const st = $('#dr-stage', DrillUI.node);
    st.innerHTML = '';

    // 템플릿 (모드 B에서는 고정 표시가 핵심)
    const tpl = el('div', { class: 'dr-tpl' });
    tpl.innerHTML = tplHTML(item.sentence.tpl);
    st.appendChild(tpl);
    st.appendChild(el('div', { class: 'dr-tplko' }, tplHTML(item.sentence.ko)));

    // 상황 카드
    const sit = el('div', { class: 'dr-sit' });
    sit.innerHTML = `<span class="lab">상황</span><span class="val">${esc(item.situation)}</span>`;
    st.appendChild(sit);

    if (Drill.MODES[DrillUI.mode].speak) return DrillUI.renderSpeak(st, item);

    // 입력
    const ta = el('textarea', { class: 'dr-input', placeholder: '영어로 문장을 완성해라', rows: '2' });
    st.appendChild(ta);
    const act = el('div', { class: 'row', style: 'margin-top:12px' });
    const sub = el('button', { class: 'btn primary' }, '제출');
    const skip = el('button', { class: 'btn ghost' }, '건너뛰기');
    act.append(sub, skip);
    st.appendChild(act);
    setTimeout(() => ta.focus(), 30);

    let submitted = false;
    const submit = () => {
      if (submitted) return; submitted = true;
      clearInterval(DrillUI.timer); DrillUI.timer = null;
      const rec = Drill.submit(ta.value);
      DrillUI.showResult(st, item, rec);
    };
    sub.onclick = submit;
    skip.onclick = () => { if (!submitted) { submitted = true; clearInterval(DrillUI.timer); Drill.submit(''); DrillUI.advance(); } };
    ta.onkeydown = e => {
      if ((e.key === 'Enter' && (e.metaKey || e.ctrlKey)) || (e.key === 'Enter' && !e.shiftKey)) {
        e.preventDefault(); submit();
      }
    };

    DrillUI.startClock(M.sec, submit);
  },

  renderSpeak(st, item) {
    const mode = DrillUI.mode;
    const T = Drill.state.typeData;
    const sec = Drill.secFor(mode, T.type);
    const prep = Drill.MODES[mode].prep || 3;

    const stage = el('div', { class: 'dr-speak' });
    stage.innerHTML = `
      <div class="dr-phase" id="dr-ph">준비</div>
      <div class="dr-big" id="dr-big">${prep}</div>
      <div class="dr-sub" id="dr-sub">골격을 떠올려라</div>
      <div class="level" id="dr-lvl" style="visibility:hidden">${'<i></i>'.repeat(28)}</div>`;
    st.appendChild(stage);

    const act = el('div', { class: 'row', style: 'margin-top:16px' });
    const skip = el('button', { class: 'btn ghost' }, '건너뛰기');
    skip.onclick = () => { DrillUI.abortStep(); DrillUI.advance(); };
    act.appendChild(skip);
    st.appendChild(act);

    const big = stage.querySelector('#dr-big');
    const ph = stage.querySelector('#dr-ph');
    const sub = stage.querySelector('#dr-sub');
    const lvl = stage.querySelector('#dr-lvl');

    /* --- 3·2·1 카운트다운 --- */
    let n = prep;
    Audio_.beep('prep');
    big.textContent = n;
    DrillUI._step = setInterval(() => {
      n--;
      if (n > 0) { big.textContent = n; Audio_.beep('prep'); return; }
      clearInterval(DrillUI._step); DrillUI._step = null;
      startRec();
    }, 1000);

    /* --- 녹음 --- */
    function startRec() {
      ph.textContent = '말하기';
      ph.classList.add('rec');
      sub.textContent = '지금 말해라';
      lvl.style.visibility = 'visible';
      Audio_.beep('go');
      try { Recorder.start(); } catch (e) {
        sub.textContent = '녹음 실패: ' + (e.message || e);
        return;
      }
      const bars = [...lvl.children];
      Recorder.onLevel(v => {
        const lit = Math.round(v * bars.length);
        bars.forEach((b, i) => {
          b.classList.toggle('on', i < lit);
          b.style.height = (28 + (i < lit ? 72 : 0) * (i / bars.length)) + '%';
        });
      });
      const t0 = performance.now();
      big.textContent = sec.toFixed ? sec : sec;
      DrillUI._step = setInterval(async () => {
        const left = Math.max(0, sec - (performance.now() - t0) / 1000);
        big.textContent = Math.ceil(left);
        big.classList.toggle('low', left <= 3);
        if (left <= 0) {
          clearInterval(DrillUI._step); DrillUI._step = null;
          Recorder.stopLevel();
          Audio_.beep('end');
          const out = await Recorder.stop();
          let attemptId = null;
          if (out && out.blob && out.blob.size) {
            attemptId = await Store.save({
              questionId: 'drill:' + DrillUI.typePath, part: T.part,
              startedAt: Date.now(), limitSec: sec,
              durationSec: Math.min(out.durationSec, sec),
              mime: out.mime, audio: out.blob, mode: 'drill', selfCheck: {}, memo: ''
            }).catch(() => null);
          }
          Drill.submitAudio(attemptId, sec);
          DrillUI.showSpokenResult(st, item, attemptId);
        }
      }, 100);
    }
  },

  /* 카운트다운·녹음을 즉시 중단 */
  abortStep() {
    clearInterval(DrillUI._step); DrillUI._step = null;
    Recorder.stopLevel();
    if (Recorder.rec && Recorder.rec.state !== 'inactive') { try { Recorder.rec.stop(); } catch (e) {} }
  },

  showSpokenResult(st, item, attemptId) {
    st.innerHTML = '';
    st.appendChild(el('div', { class: 'dr-verdict ok' }, '녹음 완료'));
    st.appendChild(el('div', { class: 'dr-tpl' }, tplHTML(item.sentence.tpl)));
    st.appendChild(el('div', { class: 'dr-sit' },
      `<span class="lab">상황</span><span class="val">${esc(item.situation)}</span>`));

    if (attemptId) {
      Store.get(attemptId).then(a => {
        if (!a || !a.audio) return;
        const au = el('audio', { controls: '' });
        au.src = URL.createObjectURL(a.audio);
        st.insertBefore(au, st.children[3] || null);
      });
    }
    DrillUI.appendRefs(st, item);
    DrillUI.appendNext(st);
  },

  showResult(st, item, rec) {
    st.innerHTML = '';
    const v = el('div', { class: 'dr-verdict ' + (rec.passed ? 'ok' : 'no') },
      rec.passed ? '형식 통과' : '형식 미달');
    st.appendChild(v);

    st.appendChild(el('div', { class: 'dr-sit' },
      `<span class="lab">상황</span><span class="val">${esc(item.situation)}</span>`));

    const mine = el('div', { class: 'dr-mine' });
    mine.innerHTML = `<span class="lab">내 답</span><span class="val">${rec.input ? esc(rec.input) : '<i style="color:var(--text-3)">비어 있음</i>'}</span>`;
    st.appendChild(mine);

    const cl = el('div', { class: 'dr-checks' });
    rec.checks.forEach(c => {
      const row = el('div', { class: 'dr-check ' + (c.ok ? 'ok' : 'no') });
      row.innerHTML = `<span class="mark">${c.ok ? '✓' : '✗'}</span><span class="lab">${esc(c.label)}</span>` +
        (!c.ok && c.msg ? `<span class="msg">${esc(c.msg)}</span>` : '');
      cl.appendChild(row);
    });
    st.appendChild(cl);

    DrillUI.appendRefs(st, item);
    DrillUI.appendNext(st);
  },

  appendRefs(st, item) {
    const box = el('div', { class: 'dr-refs' });
    box.innerHTML = `<div class="lab">이 상황의 모범 예시</div>` +
      (item.refs || []).map(r => `<div class="ref say" role="button" tabindex="0">${esc(r)}</div>`).join('');
    box.querySelectorAll('.ref.say').forEach(d => {
      d.onclick = () => Speech.passage(d.textContent, 0.8);
    });
    st.appendChild(box);

    /* 같은 골격에 다른 내용이 들어간 예시 — 정답이 하나가 아님을 보여준다 */
    const sibs = (item.sentence.drills || [])
      .filter(d => d.situation !== item.situation)
      .slice(0, 2);
    if (sibs.length) {
      const sb = el('div', { class: 'dr-refs alt' });
      sb.innerHTML = `<div class="lab">같은 골격 · 다른 내용</div>` +
        sibs.map(d => `<div class="ref"><span class="sit">${esc(d.situation)}</span>${esc(d.refs[0])}</div>`).join('');
      st.appendChild(sb);
    }

    const n = el('div', { class: 'note', style: 'margin-top:12px' });
    n.innerHTML = '<b>문법 골격만 검사한다.</b> 내용이 질문에 맞는지는 위 예시와 직접 대조해라. 골격은 같아도 답은 여러 개다.';
    st.appendChild(n);
  },

  appendNext(st) {
    const s = Drill.state;
    const act = el('div', { class: 'row', style: 'margin-top:16px' });
    const last = s.i >= s.items.length - 1;
    const b = el('button', { class: 'btn primary' }, last ? '결과 보기' : '다음 상황 →');
    b.onclick = () => DrillUI.advance();
    act.appendChild(b);
    st.appendChild(act);
    setTimeout(() => b.focus(), 30);
  },

  advance() {
    if (Drill.next()) DrillUI.render();
    else DrillUI.finish();
  },

  async finish(aborted) {
    clearInterval(DrillUI.timer); DrillUI.timer = null;
    DrillUI.abortStep();
    Recorder.stopLevel(); Recorder.disarm();
    const sum = Drill.summary();
    if (sum && sum.answered) await Drill.save();

    const typePath = DrillUI.typePath;
    const mode = DrillUI.mode;
    DrillUI.unmount();
    Drill.clear();

    if (aborted || !sum || !sum.answered) {
      const ret = Nav.get();
      if (ret) { const h = ret.hash; Nav.clear(); App.go(h); }
      else App.go('#/patterns/' + typePath.split('/')[0]);
      return;
    }

    /* 결과는 #/drilldone 라우트가 그린다.
       여기서 직접 그리면 해시 변경으로 발생하는 route() 가 덮어쓴다. */
    App.lastDrill = { sum, typePath, mode };
    App.go('#/drilldone');
    if ((location.hash || '') === '#/drilldone') DrillUI.result();
  },

  result() {
    const d = App.lastDrill;
    if (!d) { App.go('#/patterns'); return; }
    const { sum, typePath, mode } = d;

    const w = el('div');
    const t = getType(typePath);
    const name = t && t.type ? t.type.ko : (t && t.variant ? t.variant.ko : typePath);
    w.appendChild(el('h1', {}, '드릴 완료'));
    w.appendChild(el('p', { class: 'lede' },
      `Part ${typePath.split('/')[0]} · ${name} — 모드 ${mode} ${Drill.MODES[mode].ko}`));

    const spoken = Drill.MODES[mode] && Drill.MODES[mode].speak;
    const pct = Math.round(sum.rate * 100);
    const card = el('div', { class: 'card', style: 'margin-bottom:16px' });
    card.innerHTML = spoken
      ? `<div class="usage">
          <span class="num">${sum.answered}<span style="font-size:13px;color:var(--text-3)">/${sum.total}</span></span>
          <span class="track"><i style="width:${Math.round(sum.answered / sum.total * 100)}%;background:var(--ok)"></i></span>
          <span class="cap">말하기 완료 · 아래에서 다시 듣고 모범 예시와 대조해라</span></div>`
      : `<div class="usage">
          <span class="num">${sum.passed}<span style="font-size:13px;color:var(--text-3)">/${sum.answered}</span></span>
          <span class="track"><i style="width:${pct}%;background:${pct >= 80 ? 'var(--ok)' : 'var(--warn)'}"></i></span>
          <span class="cap">형식 통과율 ${pct}%</span></div>`;
    w.appendChild(card);

    sum.results.forEach((r, i) => {
      const c = el('div', { class: 'card', style: 'margin-bottom:8px' });
      c.innerHTML = `
        <div class="row" style="margin-bottom:8px">
          <span class="pill ${r.passed ? 'ok' : 'warn'}">${i + 1}. ${r.passed ? '통과' : (r.spoken ? '녹음' : '미달')}</span>
          <span style="font-size:13px;color:var(--text-2)">${esc(r.situation)}</span>
        </div>
        ${r.spoken ? '' : `<div class="dr-mine"><span class="lab">내 답</span><span class="val">${r.input ? esc(r.input) : '<i style="color:var(--text-3)">비어 있음</i>'}</span></div>`}
        <div class="dr-refs" style="margin-top:8px"><div class="lab">모범 예시</div>${(r.refs || []).map(x => `<div class="ref">${esc(x)}</div>`).join('')}</div>`;
      w.appendChild(c);
    });

    const act = el('div', { class: 'row', style: 'margin-top:18px' });
    const ret = Nav.get();
    if (ret) {
      const rb = el('button', { class: 'btn primary' }, '← 리포트로 돌아가기');
      rb.onclick = () => { const h = ret.hash; Nav.clear(); App.go(h); };
      act.appendChild(rb);
    }
    const again = el('button', { class: ret ? 'btn' : 'btn primary' }, '다시 하기');
    again.onclick = () => App.go(`#/drill/${typePath}/${mode}`);
    const back = el('button', { class: 'btn' }, '유형으로');
    back.onclick = () => App.go('#/patterns/' + typePath);
    act.append(again, back);
    w.appendChild(act);

    App.set(w);
  }
};

/* ============================================================
   헬퍼
   ============================================================ */
function findQuestion(questionId) {
  const [base, sub] = String(questionId).split('#');
  for (const k of ['1', '2', '3', '4', '5']) {
    const q = BANK[k].find(x => x.id === base);
    if (q) {
      const item = sub && q.items ? q.items[Number(sub) - 1] : null;
      return { q, item, partKey: k };
    }
  }
  return { q: null, item: null, partKey: null };
}

/* Part 1 모범 낭독 표시: / 강조, 대문자 강세, 화살표 */
function markReading(text) {
  return esc(text)
    .replace(/\//g, '<span class="slash">/</span>')
    .replace(/([↘↗])/g, '<span class="arrow">$1</span>')
    .replace(/\b([A-Z][A-Z'’\-]{1,}(?:\s+[A-Z][A-Z'’\-]+)*)\b/g, m => `<span class="stress">${m}</span>`);
}

/* 듣기 버튼 누른 순간 잠깐 강조 */
function speakBtn(b) {
  b.classList.add('playing');
  setTimeout(() => b.classList.remove('playing'), 700);
}

/* 템플릿 문자열의 {SLOT} 을 빈칸 칩으로 렌더 */
function tplHTML(tpl) {
  return esc(tpl).replace(/\{([A-Z0-9_]+)\}/g, (_, k) => `<span class="slot">${k}</span>`);
}

/* 팁 안의 `code` 와 **bold** 만 인라인 처리 */
function mdInline(t) {
  return esc(t)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>');
}

function materialTable(m, exam) {
  const t = el('table', { class: 'exam-table' });
  const cap = el('caption');
  cap.innerHTML = `${esc(m.heading)}<span class="sub">${esc(m.sub)}</span>`;
  t.appendChild(cap);
  const tb = el('tbody');
  m.rows.forEach(r => {
    const tr = el('tr');
    r.forEach(cell => tr.appendChild(el('td', {}, esc(cell))));
    tb.appendChild(tr);
  });
  t.appendChild(tb);
  if (m.footer) {
    const tf = el('tfoot');
    const tr = el('tr');
    tr.appendChild(el('td', { colspan: String(m.rows[0].length) }, esc(m.footer)));
    tf.appendChild(tr); t.appendChild(tf);
  }
  if (!exam) t.style.cssText = 'background:var(--surface);color:var(--text)';
  return t;
}

/* 부트 */
(function boot() {
  const th = localStorage.getItem('ts-theme');
  if (th) document.documentElement.setAttribute('data-theme', th);
  document.addEventListener('DOMContentLoaded', App.init);
})();
