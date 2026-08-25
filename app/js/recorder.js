/* 녹음 + 입력 레벨 미터 + 비프음 + TTS */

const Audio_ = {
  ctx: null,
  ac() {
    if (!Audio_.ctx) Audio_.ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (Audio_.ctx.state === 'suspended') Audio_.ctx.resume();
    return Audio_.ctx;
  },

  /* 시험장 비프음. type: 'prep' 준비시작 / 'go' 녹음시작 / 'end' 종료 */
  beep(type = 'go') {
    if (!Settings.get().beep) return;
    const ac = Audio_.ac();
    const spec = {
      prep: [[660, 0, .12]],
      go: [[880, 0, .16]],
      end: [[520, 0, .12], [380, .14, .18]]
    }[type];
    spec.forEach(([freq, at, dur]) => {
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = 'sine'; o.frequency.value = freq;
      const t = ac.currentTime + at;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(.22, t + .015);
      g.gain.exponentialRampToValueAtTime(.0001, t + dur);
      o.connect(g).connect(ac.destination);
      o.start(t); o.stop(t + dur + .02);
    });
  }
};

/* --- TTS: 지시문·질문 음성 ---------------------------------- */
const Speech = {
  voices: [],
  ready: false,

  init() {
    if (!('speechSynthesis' in window)) return;
    const load = () => {
      Speech.voices = speechSynthesis.getVoices().filter(v => /^en(-|_)/i.test(v.lang));
      Speech.ready = Speech.voices.length > 0;
    };
    load();
    speechSynthesis.onvoiceschanged = load;
  },

  pick() {
    const want = Settings.get().voiceURI;
    if (want) {
      const v = Speech.voices.find(v => v.voiceURI === want);
      if (v) return v;
    }
    return Speech.voices.find(v => /en-US/i.test(v.lang) && /Samantha|Google US|Aria|Jenny/i.test(v.name))
        || Speech.voices.find(v => /en-US/i.test(v.lang))
        || Speech.voices[0] || null;
  },

  /* 말하기. 끝나면 resolve. TTS 꺼져 있거나 미지원이면 즉시 resolve */
  say(text, rate = 0.95) {
    return new Promise(resolve => {
      if (!Settings.get().tts || !('speechSynthesis' in window)) return resolve();
      try {
        speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        const v = Speech.pick();
        if (v) { u.voice = v; u.lang = v.lang; } else { u.lang = 'en-US'; }
        u.rate = rate; u.pitch = 1;
        let done = false;
        const fin = () => { if (!done) { done = true; resolve(); } };
        u.onend = fin;
        u.onerror = fin;
        // 안전장치: 일부 브라우저가 onend를 안 쏘는 경우 대비
        const est = Math.min(60000, 900 + text.length * 70);
        setTimeout(fin, est);
        speechSynthesis.speak(u);
      } catch { resolve(); }
    });
  },

  stop() { try { speechSynthesis.cancel(); } catch {} }
};

/* --- 녹음기 ------------------------------------------------- */
const Recorder = {
  stream: null,
  rec: null,
  chunks: [],
  analyser: null,
  source: null,
  _levelRAF: null,

  supported() {
    return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia && window.MediaRecorder);
  },

  mime() {
    const cands = ['audio/webm;codecs=opus', 'audio/webm', 'audio/mp4', 'audio/ogg;codecs=opus'];
    for (const c of cands) {
      if (window.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(c)) return c;
    }
    return '';
  },

  /* 마이크 권한 확보 + 스트림 유지. 시험 시작 시 1회 호출 */
  async arm() {
    if (Recorder.stream && Recorder.stream.active) return Recorder.stream;
    Recorder.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: false, channelCount: 1 }
    });
    const ac = Audio_.ac();
    Recorder.source = ac.createMediaStreamSource(Recorder.stream);
    Recorder.analyser = ac.createAnalyser();
    Recorder.analyser.fftSize = 1024;
    Recorder.source.connect(Recorder.analyser);
    return Recorder.stream;
  },

  disarm() {
    Recorder.stopLevel();
    if (Recorder.stream) Recorder.stream.getTracks().forEach(t => t.stop());
    Recorder.stream = null; Recorder.source = null; Recorder.analyser = null;
  },

  start() {
    if (!Recorder.stream) throw new Error('마이크가 준비되지 않았습니다.');
    Recorder.chunks = [];
    const type = Recorder.mime();
    Recorder.rec = new MediaRecorder(Recorder.stream, type ? { mimeType: type } : undefined);
    Recorder.rec.ondataavailable = e => { if (e.data && e.data.size) Recorder.chunks.push(e.data); };
    Recorder.rec.start();
    Recorder._t0 = performance.now();
  },

  /* 정지 → { blob, mime, durationSec } */
  stop() {
    return new Promise(resolve => {
      const r = Recorder.rec;
      if (!r || r.state === 'inactive') return resolve(null);
      r.onstop = () => {
        const mime = r.mimeType || Recorder.mime() || 'audio/webm';
        const blob = new Blob(Recorder.chunks, { type: mime });
        const durationSec = (performance.now() - Recorder._t0) / 1000;
        Recorder.rec = null;
        resolve({ blob, mime, durationSec });
      };
      r.stop();
    });
  },

  /* 실시간 입력 레벨 (0~1) 콜백 */
  onLevel(cb) {
    Recorder.stopLevel();
    if (!Recorder.analyser) return;
    const buf = new Uint8Array(Recorder.analyser.fftSize);
    const tick = () => {
      Recorder.analyser.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
      const rms = Math.sqrt(sum / buf.length);
      cb(Math.min(1, rms * 4.5));
      Recorder._levelRAF = requestAnimationFrame(tick);
    };
    tick();
  },

  stopLevel() {
    if (Recorder._levelRAF) cancelAnimationFrame(Recorder._levelRAF);
    Recorder._levelRAF = null;
  }
};
