# TOEIC Speaking 실전 트레이너

시험과 동일한 타이밍으로 녹음하고, 다시 듣고, 모범답안·만능 문장과 대조하는 **로컬 연습 도구**.
HTML / CSS / JavaScript만 사용한다. 빌드 없음, 의존성 없음, 서버 전송 없음.

## 실행

```bash
python3 -m http.server 8777 --directory app
```

브라우저에서 `http://localhost:8777` 을 연다.
`file://` 로 직접 열면 마이크와 IndexedDB가 막히므로 반드시 http로 띄운다.

## 기능

| | 내용 |
|---|---|
| **연습** | 2026년 현행 11문항 구조 그대로. 준비·답변 타이머, 자동 녹음, 재청취, 모범답안 대조, 자가 채점 |
| **문장 세트** | Part 2–5 유형별 만능 문장 70개 + 빈칸 채우기 드릴 4모드 (상황 310개) |
| **공식 자료** | ETS·한국TOEIC위원회 공식 자료로 이동하는 외부 링크 34개 |
| **기록** | 녹음 보관, 시간 활용률 추이, 반복 오류 메모 |

자동 발음 채점·STT·AI 분석은 **없다.** 채점은 자가 채점표로 직접 한다.

## 시험 구성 (2026년 현행)

11문항 · 약 20분 · 5개 과제 유형. 구 Part 5 *Propose a Solution* 은 2021-08-07 삭제됐다.

| 파트 | 문항 | 과제 | 준비 | 답변 | 배점 |
|---|---|---|---|---|---|
| 1 | Q1–2 | Read a text aloud | 45초 | 45초 | 0–3 |
| 2 | Q3–4 | Describe a picture | 45초 | 30초 | 0–3 |
| 3 | Q5–7 | Respond to questions | 3초 | 15·15·30초 | 0–3 |
| 4 | Q8–10 | Respond using information | 자료 45초 + 각 3초 | 15·15·30초 | 0–3 |
| 5 | Q11 | Express an opinion | 45초 | 60초 | 0–5 |

## 문항 구성

모든 문항·지문·사진·모범답안은 **자체 제작**이다. ETS·한국TOEIC위원회의 공식 문항·사진·음원은
저작권 보호 대상이므로 복제해 넣지 않았다. 공식 자료는 외부 링크로만 연결한다.

Part 1 16 · Part 2 10 · Part 3 10세트 · Part 4 7세트 · Part 5 10 · 레거시 2.

## 문서

- [app/README.md](app/README.md) — 상세 사용법, 문항 추가 방법, 저작권 정책
- [docs/SERVICE_PLAN.md](docs/SERVICE_PLAN.md) — 초기 서비스 기획
- [docs/V2_PATTERN_DRILL.md](docs/V2_PATTERN_DRILL.md) — 유형·만능 문장·드릴 설계

## 데이터

녹음은 이 브라우저의 IndexedDB에만 저장된다. 서버로 전송되지 않는다.
