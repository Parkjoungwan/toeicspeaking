/* ============================================================
   v2 — 유형 · 만능 문장 · 빈칸 드릴
   원칙: 통암기 금지. 골격은 고정, 내용은 매번 교체한다.
   ETS는 다른 응답·출판물과 실질적으로 유사한 답변에 점수 취소 권한을 명시한다.
   ============================================================ */

const TEMPLATE_WARNING =
  '만능 문장은 통째로 외우는 게 아니라 **골격을 자동화한 뒤 핵심 명사·동사만 바꿔 끼우는 용도**다. ' +
  'ETS는 다른 응답이나 출판물과 실질적으로 유사한 답변에 대해 점수 취소 권한을 명시하고 있다. ' +
  '빈칸에는 반드시 질문에 맞는 자기 내용을 넣어라.';

/* ---------- Part 5 공통 블록 (입장 문장만 유형별로 다르다) ---------- */
const P5_COMMON = [
  {
    id: 'r1', block: '이유 1', tpl: 'The main reason is that {CLAUSE}.',
    ko: '가장 큰 이유는 {CLAUSE}입니다.',
    use: '입장 직후 15초. 이유를 하나만 깊게 파라.',
    slots: { CLAUSE: { label: '주어+동사 절', hint: 'that 뒤이므로 완전한 문장', eg: ['it saves a lot of time', 'it reduces stress', 'companies benefit the most'] } },
    check: [{ type: 'contains', value: 'that', msg: 'that 절이 빠졌다' }, { type: 'minWords', value: 8 }],
    drills: [
      { situation: '통근 시간을 크게 아낄 수 있다', refs: ['The main reason is that it saves a significant amount of commuting time.'] },
      { situation: '새 기술이 나중에 더 좋은 기회로 이어진다', refs: ['The main reason is that new skills can lead to better career opportunities.'] },
      { situation: '조용한 환경에서 집중이 더 잘 된다', refs: ['The main reason is that people can concentrate better in a quiet environment.'] },
      { situation: '대도시에 일자리가 훨씬 많다', refs: ['The main reason is that large cities offer far more job opportunities.'] },
      { situation: '온라인은 가격 비교가 쉽다', refs: ['The main reason is that I can compare prices from many stores in a few minutes.'] }
    ]
  },
  {
    id: 'ex', block: '예시', tpl: 'For example, {PERSON} {PAST_EVENT}.',
    ko: '예를 들어, {PERSON}는 {PAST_EVENT}했습니다.',
    use: '18초. 예시가 없으면 이유가 추상적으로 들린다. 실화일 필요 없다.',
    slots: {
      PERSON: { label: '주어', hint: '3인칭이 가장 빠르다', eg: ['one of my friends', 'my cousin', 'a colleague of mine', 'I'] },
      PAST_EVENT: { label: '과거 사건', hint: '과거 시제', eg: ['spent almost two hours commuting every day', 'turned down a higher salary', 'saved two hundred dollars'] }
    },
    check: [{ type: 'contains', value: 'For example', msg: 'For example 로 시작해라' }, { type: 'minWords', value: 7 }],
    drills: [
      { situation: '친구가 매일 두 시간씩 통근한다', refs: ['For example, one of my friends spends almost two hours traveling to and from work every day.'] },
      { situation: '사촌이 법학을 하려다 디자인을 발견했다', refs: ['For example, my cousin entered university planning to study law, but she discovered design in her second year.'] },
      { situation: '작년에 노트북을 사면서 200달러를 아꼈다', refs: ['For example, when I bought a laptop last year, I found the same model two hundred dollars cheaper online.'] },
      { situation: '동료가 자격증 지원 때문에 이직을 포기했다', refs: ['For example, a colleague of mine turned down a higher salary because her company paid for a professional certification.'] },
      { situation: '통계 수업에서 토론 후에 이해가 훨씬 잘 됐다', refs: ['For example, when I studied statistics, I understood difficult concepts much better after discussing them with other students.'] }
    ]
  },
  {
    id: 'r2', block: '이유 2', tpl: 'In addition, {CLAUSE}.',
    ko: '게다가 {CLAUSE}입니다.',
    use: '12초. 이유 1과 다른 각도여야 한다. 동의어 반복은 감점이다.',
    slots: { CLAUSE: { label: '주어+동사 절', hint: '이유1과 겹치지 않게', eg: ['it helps companies keep good employees', 'learning keeps work interesting'] } },
    check: [{ type: 'contains', value: 'In addition', msg: 'In addition 으로 시작해라' }, { type: 'minWords', value: 6 }],
    drills: [
      { situation: '좋은 직원을 오래 붙잡아 둘 수 있다', refs: ['In addition, paying for training helps companies keep good employees.'] },
      { situation: '배우는 게 있으면 일이 지루하지 않다', refs: ['In addition, learning new things keeps work interesting and keeps people motivated.'] },
      { situation: '교통 체증과 주차 문제를 피할 수 있다', refs: ['In addition, people can avoid traffic and parking problems.'] },
      { situation: '온라인 후기가 더 나은 선택을 돕는다', refs: ['In addition, online reviews help me make better decisions.'] },
      { situation: '학생들이 서로의 강점에서 배운다', refs: ['In addition, students can learn from one another’s strengths.'] }
    ]
  },
  {
    id: 'cs', block: '양보', tpl: 'I understand that {COUNTER}, but {REBUTTAL}.',
    ko: '{COUNTER}는 이해하지만, {REBUTTAL}입니다.',
    use: '5~12초. 반대편을 인정하되 반드시 but으로 되받아라. 입장은 절대 흔들리면 안 된다.',
    slots: {
      COUNTER: { label: '반대편 주장', hint: '상대 입장의 장점', eg: ['a high salary is attractive', 'small towns are quieter', 'online courses are convenient'] },
      REBUTTAL: { label: '반박', hint: '내 입장이 이기는 이유', eg: ['skills stay with you for your whole career', 'the opportunities matter more to me'] }
    },
    check: [{ type: 'contains', value: 'but', msg: 'but 으로 되받아야 입장이 유지된다' }, { type: 'minWords', value: 9 }],
    drills: [
      { situation: '높은 연봉도 매력적이지만 기술은 평생 간다', refs: ['I understand that a high salary is attractive, but skills stay with you for your whole career.'] },
      { situation: '소도시가 조용하지만 나에겐 기회가 더 중요하다', refs: ['I understand that small towns are quieter and cheaper, but the opportunities in a city matter more to me.'] },
      { situation: '온라인 강의가 편리하지만 상호작용이 부족하다', refs: ['I understand that online courses are convenient, but students have fewer chances to interact directly.'] },
      { situation: '교육받은 직원이 떠날 수도 있지만 안 가르치는 게 더 위험하다', refs: ['I understand that trained employees might leave, but the risk of not training them is much greater.'] },
      { situation: 'SNS가 멀리 있는 친구와 연결해 주지만 비교 심리가 크다', refs: ['I understand that social media helps people stay in touch, but constant comparison affects confidence.'] }
    ]
  },
  {
    id: 'cc', block: '결론', tpl: 'For these reasons, I think {RESTATE}.',
    ko: '이러한 이유로 {RESTATE}라고 생각합니다.',
    use: '마지막 5초. 50초 지점에서 진입해라. 시간이 끊겨도 완성된 답처럼 들린다.',
    slots: { RESTATE: { label: '입장 재진술', hint: '첫 문장과 같은 입장, 다른 표현', eg: ['a flexible policy improves productivity', 'long-term growth is more valuable'] } },
    check: [{ type: 'pattern', re: '(For these reasons|Therefore|Overall|That is why)', msg: '결론 신호어로 시작해라' }],
    drills: [
      { situation: '유연 근무가 생산성과 만족도를 높인다', refs: ['For these reasons, I think a flexible work-from-home policy improves both productivity and job satisfaction.'] },
      { situation: '장기적 성장이 초봉보다 가치 있다', refs: ['For these reasons, I think long-term professional growth is more valuable than a high starting salary.'] },
      { situation: '장점이 문제점보다 확실히 크다', refs: ['For these reasons, I think the benefits clearly outweigh the problems.'] },
      { situation: '나에겐 온라인 쇼핑이 더 나은 선택이다', refs: ['For these reasons, I think online shopping is the better choice for me.'] },
      { situation: '대부분의 학생에게는 대학이 먼저다', refs: ['For these reasons, I think going to university first is better for most students.'] }
    ]
  }
];

/* ============================================================
   PATTERNS
   ============================================================ */
const PATTERNS = {

  /* ---------- PART 2 — 골격 1개 + 장면 변형 4개 ---------- */
  2: {
    part: 2, ko: '사진 묘사', en: 'Describe a Picture', sec: 30, mode: 'coverage',
    intro: 'Part 2는 유형이 나뉘지 않는다. **순서가 항상 같다.** 사진이 바뀌어도 골격은 그대로고, 어느 블록을 늘릴지만 달라진다.',
    blocks: [
      { id: 'B1', ko: '장소 도입', sec: 4, must: true,
        tpl: ['This picture was taken at {PLACE}.', 'This is a picture of {PLACE}.', 'I can see {N} people in {PLACE}.'],
        note: '첫 문장에서 고민하면 30초가 날아간다. 무조건 장소부터.' },
      { id: 'B2', ko: '중심 인물·동작', sec: 9, must: true,
        tpl: ['In the center, {SUBJ} is {VING}.', 'On the left, {SUBJ} is {VING}.', '{SUBJ} is {VING} while {SUBJ2} is {VING2}.'],
        note: '현재진행형 2개. 시제가 흔들리면 문법 점수가 깎인다.' },
      { id: 'B3', ko: '주변 인물·동작', sec: 7, must: false,
        tpl: ['Next to {REF}, {SUBJ} is {VING}.', 'Behind {REF}, {SUBJ} is {VING}.', 'In the background, {SUBJ} are {VING}.'],
        note: '위치 표현을 최소 3개 쓰는 게 목표다.' },
      { id: 'B4', ko: '배경·사물', sec: 6, must: false,
        tpl: ['There are {OBJ} on {PLACE2}.', 'I can also see {OBJ}.', '{OBJ} are neatly arranged on {PLACE2}.'],
        note: 'There is/are 는 한 번만. 세 번 반복하면 어휘 점수가 깎인다.' },
      { id: 'B5', ko: '전체 인상', sec: 4, must: true,
        tpl: ['Overall, {PLACE} looks {ADJ}.', 'It looks like {GUESS}.', 'The weather seems {ADJ}.'],
        note: '추론은 마지막에 한 번만. seem/look 으로 안전하게.' }
    ],
    variants: [
      { id: 'multi', ko: '다인 동작', expand: ['B2', 'B3'],
        why: '인물이 많으면 동작만으로 30초가 찬다. 사물 묘사에 시간 쓰지 마라.' },
      { id: 'solo', ko: '1인 중심', expand: ['B4', 'B5'],
        why: '**시간이 남아 감점되는 사례가 가장 많은 유형.** 인물이 하나뿐이므로 사물·배경·분위기로 채워야 한다.' },
      { id: 'indoor', ko: '실내', expand: ['B3'],
        why: '위치 전치사를 쓸 자리가 많다. in the center / behind / on the left 를 의도적으로 배치해라.' },
      { id: 'outdoor', ko: '야외', expand: ['B5'],
        why: '날씨 문장이 공짜로 한 문장 확보된다. The weather seems pleasant. 로 마무리.' }
    ],
    mistakes: [
      '장소를 안 말하고 인물부터 묘사한다',
      '`There is` 를 세 번 이상 반복한다',
      '사진에 없는 내용을 지어낸다',
      '1인 사진에서 15초 만에 할 말이 떨어진다'
    ],
    /* 슬롯 드릴용 문장 */
    sentences: [
      {
        id: 'b1', block: 'B1 장소', tpl: 'This picture was taken at {PLACE}.',
        ko: '이 사진은 {PLACE}에서 찍혔습니다.',
        use: '무조건 첫 문장. 3초 안에 뱉어라.',
        slots: { PLACE: { label: '장소', hint: '관사 포함', eg: ['an outdoor café', 'a supermarket', 'an airport', 'a lecture hall'] } },
        check: [{ type: 'pattern', re: '^(This picture|This is|I can see)', msg: '정해진 도입부로 시작해라' }],
        drills: [
          { situation: '야외 카페', refs: ['This picture was taken at an outdoor café.'] },
          { situation: '회의실', refs: ['This picture was taken in a meeting room.'] },
          { situation: '공항 체크인 구역', refs: ['This picture was taken at an airport.'] },
          { situation: '도서관', refs: ['This picture was taken in a library.'] },
          { situation: '야외 시장', refs: ['This picture was taken at an outdoor market.'] }
        ]
      },
      {
        id: 'b2', block: 'B2 중심 동작', tpl: 'In the center, {SUBJ} is {VING}.',
        ko: '가운데에서 {SUBJ}가 {VING}하고 있습니다.',
        use: '현재진행형. Part 2에서 시제가 무너지는 지점이 바로 여기다.',
        slots: {
          SUBJ: { label: '인물', hint: '관사 필수', eg: ['a woman', 'a man', 'an employee', 'a staff member'] },
          VING: { label: '동작 -ing', hint: '전치사까지', eg: ['working on a laptop', 'pointing at a screen', 'pushing a shopping cart'] }
        },
        check: [{ type: 'pattern', re: '\\b(is|are)\\s+\\w+ing\\b', msg: '현재진행형(is/are + V-ing)이 필요하다' }],
        drills: [
          { situation: '여성이 노트북으로 일하고 있다', refs: ['In the center, a woman is working on a laptop.'] },
          { situation: '남성이 큰 화면을 가리키고 있다', refs: ['In the center, a man is pointing at a large screen.'] },
          { situation: '직원이 선반에 물건을 올리고 있다', refs: ['In the center, an employee is putting products on a shelf.'] },
          { situation: '고객이 쇼핑 카트를 밀고 있다', refs: ['In the center, a customer is pushing a shopping cart.'] },
          { situation: '아이 두 명이 공을 가지고 놀고 있다', refs: ['In the center, two children are playing with a ball.'] }
        ]
      },
      {
        id: 'b5', block: 'B5 전체 인상', tpl: 'Overall, {PLACE} looks {ADJ}.',
        ko: '전체적으로 {PLACE}는 {ADJ}해 보입니다.',
        use: '마지막 4초를 닫는 문장. 시간이 남을 때 반드시 붙여라.',
        slots: {
          PLACE: { label: '장소/대상', hint: 'the + 명사', eg: ['the café', 'the store', 'the area', 'the room'] },
          ADJ: { label: '형용사', hint: '분위기', eg: ['fairly busy', 'quiet', 'crowded', 'comfortable and relaxed'] }
        },
        check: [{ type: 'pattern', re: '(Overall|It looks like|seems)', msg: '인상 표현으로 시작해라' }],
        drills: [
          { situation: '카페가 꽤 붐빈다', refs: ['Overall, the café looks fairly busy.'] },
          { situation: '가게가 지금은 한산하다', refs: ['Overall, the store seems quiet at the moment.'] },
          { situation: '공항이 혼잡하다', refs: ['Overall, the area looks crowded.'] },
          { situation: '편안한 주말 오후 같다', refs: ['It looks like a relaxing weekend afternoon.'] },
          { situation: '업무 발표 자리 같다', refs: ['It looks like a business presentation.'] }
        ]
      }
    ]
  },

  /* ---------- PART 3 — 8유형 ---------- */
  3: {
    part: 3, ko: '질문에 답하기', en: 'Respond to Questions', sec: 15, mode: 'slot',
    intro: '준비 시간이 **3초뿐**이다. 골격이 손에 붙어 있지 않으면 생각하다 시간이 끝난다. 골격 자동화 효과가 가장 큰 파트.',
    types: [
      {
        id: 't1', ko: '빈도', cue: 'How often ...?', appears: 'Q5', sec: 15,
        blocks: ['빈도', '시점', '이유'],
        mistakes: ['빈도를 안 말하고 이유부터 시작한다', '15초에 세 문장 노리다 중간에 끊긴다'],
        sentences: [
          {
            id: 's1', block: '빈도', tpl: 'I {VP} about {FREQ}.',
            ko: '저는 {FREQ} 정도 {VP}합니다.',
            use: '첫 문장. 3단어 안에 빈도를 던져라.',
            slots: {
              VP: { label: '동사구', hint: '원형으로 시작', eg: ['order food online', 'go to the gym', 'travel abroad', 'go to cafés'] },
              FREQ: { label: '빈도', hint: '횟수 + 기간', eg: ['twice a week', 'once a month', 'three times a year'] }
            },
            check: [{ type: 'contains', value: 'about', msg: 'about 을 넣으면 근사치가 되어 자연스럽다' },
                    { type: 'pattern', re: '^I\\s+\\w+', msg: 'I + 동사로 시작해라' }],
            drills: [
              { situation: '일주일에 두 번 온라인으로 음식을 주문한다', refs: ['I order food online about twice a week.'] },
              { situation: '한 달에 한 번 정도 부모님을 뵈러 간다', refs: ['I visit my parents about once a month.'] },
              { situation: '일 년에 두 번 여행을 간다', refs: ['I travel about twice a year.'] },
              { situation: '일주일에 세 번 카페에 간다', refs: ['I go to cafés about three times a week.'] },
              { situation: '하루에 두 시간 정도 앱을 쓴다', refs: ['I use apps on my phone about two hours a day.'] }
            ]
          },
          {
            id: 's2', block: '시점', tpl: 'I usually do that {WHEN}.',
            ko: '보통 {WHEN}에 그렇게 합니다.',
            use: '빈도 뒤에 붙이는 확장. 질문이 when을 같이 물었으면 필수.',
            slots: { WHEN: { label: '시점', hint: '전치사 포함', eg: ['on weekends', 'in the early morning', 'after work', 'during my vacation'] } },
            check: [{ type: 'minWords', value: 5 }],
            drills: [
              { situation: '주말에 주로 한다', refs: ['I usually do that on weekends.'] },
              { situation: '퇴근 후에 한다', refs: ['I usually do that after work.'] },
              { situation: '이른 아침에 한다', refs: ['I usually do that in the early morning.'] },
              { situation: '휴가 기간에 한다', refs: ['I usually do that during my vacation.'] },
              { situation: '점심시간에 한다', refs: ['I usually do that during my lunch break.'] }
            ]
          },
          {
            id: 's3', block: '이유', tpl: "It's convenient because {CLAUSE}.",
            ko: '{CLAUSE}라서 편리합니다.',
            use: '15초를 채우는 마지막 조각. 이유가 없으면 완결성 감점.',
            slots: { CLAUSE: { label: '주어+동사 절', hint: '완전한 문장', eg: ["I don't have to spend time cooking", 'it saves me a lot of time'] } },
            check: [{ type: 'contains', value: 'because', msg: 'because 가 빠졌다' }, { type: 'minWords', value: 6 }],
            drills: [
              { situation: '요리할 시간을 안 써도 된다', refs: ["It's convenient because I don't have to spend time cooking."] },
              { situation: '시간을 많이 아낄 수 있다', refs: ["It's convenient because it saves me a lot of time."] },
              { situation: '집 근처에 하나 있다', refs: ["It's convenient because there is one near my home."] },
              { situation: '언제든 예약할 수 있다', refs: ["It's convenient because I can book it at any time."] },
              { situation: '무료이고 시간이 날 때 할 수 있다', refs: ["It's convenient because it's free and I can do it whenever I have time."] }
            ]
          },
          {
            id: 's4', block: '대체 이유', tpl: 'The main reason is that {CLAUSE}.',
            ko: '가장 큰 이유는 {CLAUSE}입니다.',
            use: 'because 를 이미 썼을 때 쓰는 다른 골격.',
            slots: { CLAUSE: { label: '주어+동사 절', hint: '', eg: ['it saves me a lot of time'] } },
            check: [{ type: 'contains', value: 'that' }],
            drills: [
              { situation: '정기권을 쓰면 매달 교통비를 줄일 수 있다', refs: ['The main reason is that a monthly pass keeps my transportation costs low.'] },
              { situation: '앱 하나에서 필요한 최신 정보를 확인할 수 있다', refs: ['The main reason is that the app puts all the updates I need in one place.'] },
              { situation: '퇴근 후 산책을 하면 머리를 식힐 수 있다', refs: ['The main reason is that an evening walk helps me clear my mind after work.'] },
              { situation: '영상 통화로 멀리 사는 가족과 계속 가까이 지낼 수 있다', refs: ['The main reason is that video calls help me stay close to family members who live far away.'] },
              { situation: '집에서 공부하면 이동 시간을 쓰지 않아도 된다', refs: ['The main reason is that studying at home removes the need to commute.'] },
              { situation: '검증된 후기를 비교하면 더 안전하게 선택할 수 있다', refs: ['The main reason is that verified reviews help me compare options before I decide.'] },
              { situation: '이미 매일 하는 습관이라 꾸준히 이어 가기 쉽다', refs: ['The main reason is that it already fits naturally into my daily routine.'] },
              { situation: '새 장비를 사용하면 작업 중 고장이 줄어든다', refs: ['The main reason is that modern equipment reduces delays caused by breakdowns.'] },
              { situation: '혼자 일정을 정하면 방해 없이 집중할 수 있다', refs: ['The main reason is that setting my own schedule lets me focus without interruptions.'] },
              { situation: '동호회 활동은 관심사가 비슷한 사람을 만날 기회를 준다', refs: ['The main reason is that club activities introduce me to people with similar interests.'] }
            ]
          }
        ]
      },
      {
        id: 't2', ko: '시점·장소', cue: 'When ...? / Where ...?', appears: 'Q5', sec: 15,
        blocks: ['답', '이유'],
        mistakes: ['When과 Where를 같이 물었는데 한쪽만 답한다', '장소만 말하고 이유를 안 붙인다'],
        sentences: [
          {
            id: 's1', block: '답', tpl: 'I usually {VP} at {PLACE}.',
            ko: '저는 보통 {PLACE}에서 {VP}합니다.',
            use: '장소 질문의 즉답. 첫 문장에서 장소를 확정해라.',
            slots: {
              VP: { label: '동사구', hint: '원형', eg: ['study', 'exercise', 'work', 'meet my friends'] },
              PLACE: { label: '장소', hint: '관사 포함', eg: ['a quiet library near my home', 'a park near my apartment', 'a café downtown'] }
            },
            check: [{ type: 'pattern', re: '^I\\s+', msg: 'I 로 시작해라' }, { type: 'minWords', value: 5 }],
            drills: [
              { situation: '집 근처 조용한 도서관에서 공부한다', refs: ['I usually study at a quiet library near my home.'] },
              { situation: '아파트 근처 공원에서 운동한다', refs: ['I usually exercise at a park near my apartment.'] },
              { situation: '지하철로 출근한다', refs: ['I usually take the subway to work.'] },
              { situation: '메신저 앱으로 동료와 소통한다', refs: ['I usually communicate with my colleagues through a messaging app.'] },
              { situation: '사무실 근처 백화점에서 옷을 산다', refs: ['I usually buy clothes at a department store near my office.'] }
            ]
          },
          {
            id: 's2', block: '이유', tpl: 'It helps me {BENEFIT} because {CLAUSE}.',
            ko: '{CLAUSE}라서 {BENEFIT}하는 데 도움이 됩니다.',
            use: '15초를 채우는 두 번째 문장.',
            slots: {
              BENEFIT: { label: '효과', hint: '동사원형', eg: ['concentrate', 'relax', 'save time'] },
              CLAUSE: { label: '이유 절', hint: '', eg: ['there are fewer distractions there', "it's quiet at that time"] }
            },
            check: [{ type: 'contains', value: 'because' }, { type: 'minWords', value: 7 }],
            drills: [
              { situation: '방해 요소가 적어서 집중이 된다', refs: ['It helps me concentrate because there are fewer distractions there.'] },
              { situation: '그 시간엔 조용해서 좋다', refs: ["It helps me focus because it's quiet at that time."] },
              { situation: '출퇴근 시간보다 훨씬 빠르다', refs: ['It helps me save time because it is much faster than driving during rush hour.'] },
              { situation: '빠른 질문에는 이메일보다 빠르다', refs: ['It helps me work faster because it is quicker than sending an email.'] },
              { situation: '바쁜 한 주 뒤에 쉴 수 있다', refs: ['It helps me relax because I can rest after a busy week.'] }
            ]
          },
          {
            id: 's3', block: '보조', tpl: 'There is one near my {PLACE2}, so I can get there easily.',
            ko: '{PLACE2} 근처에 하나 있어서 쉽게 갈 수 있습니다.',
            use: '시간이 남을 때 붙이는 안전 문장.',
            slots: { PLACE2: { label: '기준 장소', hint: '', eg: ['home', 'office', 'apartment'] } },
            check: [{ type: 'minWords', value: 8 }]
          }
        ]
      },
      {
        id: 't3', ko: '선호·양자택일', cue: 'Which do you prefer ...? / Would you rather A or B?', appears: 'Q6', sec: 15,
        blocks: ['선택', '이유'],
        mistakes: ['양쪽 다 좋다고 말해 입장이 사라진다', '선택만 하고 이유를 안 붙인다'],
        sentences: [
          {
            id: 's1', block: '선택', tpl: 'I prefer {A}.',
            ko: '저는 {A}를 선호합니다.',
            use: '**즉시 한쪽.** 중립은 답이 아니다. 질문의 표현을 그대로 빌려 써라.',
            slots: { A: { label: '선택지', hint: '질문의 형태 그대로(동명사면 동명사)', eg: ['studying alone', 'shopping online', 'working in a small company'] } },
            check: [{ type: 'pattern', re: '^(I prefer|I would rather|I would prefer)', msg: 'I prefer / I would rather 로 시작해라' },
                    { type: 'notContains', value: 'both', msg: '양쪽을 다 고르면 입장이 사라진다' }],
            drills: [
              { situation: '혼자 공부하는 쪽', refs: ['I prefer studying alone.'] },
              { situation: '호텔에 묵는 쪽', refs: ['I would rather stay at a hotel.'] },
              { situation: '작은 회사에서 일하는 쪽', refs: ['I would prefer to work in a small company.'] },
              { situation: '집에서 영화 보는 쪽', refs: ['I prefer watching movies at home.'] },
              { situation: '혼자 쇼핑하는 쪽', refs: ['I prefer shopping alone.'] }
            ]
          },
          {
            id: 's2', block: '이유', tpl: 'When I {SITUATION}, I can {BENEFIT}.',
            ko: '{SITUATION}할 때 {BENEFIT}할 수 있습니다.',
            use: '선택의 이유를 상황으로 풀어라. 추상적 이유보다 강하다.',
            slots: {
              SITUATION: { label: '상황', hint: '주어+동사', eg: ['study by myself', 'go alone', 'work in a smaller team'] },
              BENEFIT: { label: '이점', hint: '동사원형', eg: ['control my own pace', 'take my time', 'take on more responsibility'] }
            },
            check: [{ type: 'pattern', re: '^When\\s+I', msg: 'When I ... 로 시작해라' }, { type: 'minWords', value: 8 }],
            drills: [
              { situation: '혼자 공부하면 속도를 조절할 수 있다', refs: ['When I study by myself, I can control my own pace.'] },
              { situation: '혼자 가면 서두르지 않고 고를 수 있다', refs: ['When I go by myself, I can take my time and decide without feeling rushed.'] },
              { situation: '작은 팀에서는 책임을 더 맡을 수 있다', refs: ['When I work in a smaller team, I can take on more responsibility.'] },
              { situation: '집에서 보면 원할 때 멈출 수 있다', refs: ['When I watch movies at home, I can pause whenever I want.'] },
              { situation: '호텔에 묵으면 집안일 대신 쉴 수 있다', refs: ['When I stay at a hotel, I can relax instead of doing housework.'] }
            ]
          },
          {
            id: 's3', block: '비교', tpl: '{A} is much more {ADJ} than {B}.',
            ko: '{A}가 {B}보다 훨씬 {ADJ}합니다.',
            use: '비교급으로 대비를 만들면 문법 다양성이 확보된다.',
            slots: {
              A: { label: '내 선택', hint: '', eg: ['The subway', 'Shopping online'] },
              ADJ: { label: '형용사', hint: '', eg: ['convenient', 'comfortable', 'efficient'] },
              B: { label: '반대편', hint: '', eg: ['driving', 'going to a store'] }
            },
            check: [{ type: 'contains', value: 'than', msg: '비교급에는 than 이 필요하다' }],
            drills: [
              { situation: '정기권이 매번 표를 사는 것보다 경제적이다', refs: ['A monthly pass is much more economical than buying a separate ticket each time.'] },
              { situation: '대면 대화가 긴 문자보다 뜻을 분명하게 전달한다', refs: ['A face-to-face conversation is much more effective than a long text message.'] },
              { situation: '혼자 공부하는 것이 시끄러운 모임보다 집중하기 쉽다', refs: ['Studying alone is much more manageable than working in a noisy group.'] },
              { situation: '온라인 신청이 사무실 방문보다 효율적이다', refs: ['Applying online is much more efficient than visiting an office in person.'] },
              { situation: '최신 장비가 오래된 장비보다 안정적이다', refs: ['Modern equipment is much more dependable than older equipment.'] },
              { situation: '집에서 운동하는 것이 붐비는 체육관보다 편하다', refs: ['Working out at home is much more comfortable than exercising in a crowded gym.'] },
              { situation: '전문가 자료가 익명 게시물보다 신뢰할 만하다', refs: ['Information from experts is much more trustworthy than anonymous online posts.'] },
              { situation: '그룹 수업이 혼자 연습하는 것보다 동기부여가 된다', refs: ['A group class is much more motivating than practicing by myself.'] }
            ]
          }
        ]
      },
      {
        id: 't4', ko: 'Yes/No + 이유', cue: 'Do you ...? / Do you think ...?', appears: 'Q6·Q7', sec: 15,
        blocks: ['직답', '이유'],
        mistakes: ['Yes/No 한 단어로 끝낸다', '5초 넘게 망설이다 시간을 잃는다'],
        sentences: [
          {
            id: 's1', block: '직답', tpl: 'Yes, {SHORT}, mainly because {CLAUSE}.',
            ko: '네, {SHORT}입니다. 주된 이유는 {CLAUSE}입니다.',
            use: '직답과 이유를 한 문장에 붙여라. 15초에서 가장 효율적인 구조.',
            slots: {
              SHORT: { label: '짧은 확인', hint: '주어+동사', eg: ['I do', 'I think so', 'it has'] },
              CLAUSE: { label: '이유 절', hint: '', eg: ['it saves a lot of time', 'more people have moved into my neighborhood'] }
            },
            check: [{ type: 'pattern', re: '^(Yes|No)', msg: 'Yes 또는 No 로 시작해라' },
                    { type: 'contains', value: 'because' }],
            drills: [
              { situation: '그렇다 — 시간을 많이 아껴 준다', refs: ['Yes, I do, mainly because it saves a lot of time.'] },
              { situation: '그렇다 — 동네에 사람이 늘었다', refs: ['Yes, it has, mainly because more people have moved into my neighborhood.'] },
              { situation: '그렇다 — 혼자 사는 사람이 늘었다', refs: ['Yes, I think so, mainly because more people live alone now.'] },
              { situation: '아니다 — 근무 시간이 여전히 길다', refs: ["No, I don't think so, mainly because working hours are still very long."] },
              { situation: '아니다 — 필요에 따라 다른 곳을 고른다', refs: ['No, I usually choose different places depending on my needs.'] }
            ]
          },
          {
            id: 's2', block: '부정 확장', tpl: 'Not really. I usually {ALTERNATIVE} instead.',
            ko: '그렇지는 않습니다. 대신 보통 {ALTERNATIVE}합니다.',
            use: 'No 라고 답할 때 대안을 제시하면 완결성이 생긴다.',
            slots: { ALTERNATIVE: { label: '대안 행동', hint: '동사구', eg: ['cook at home', 'take the bus', 'study at home'] } },
            check: [{ type: 'contains', value: 'instead', msg: 'instead 로 대안을 명시해라' }],
            drills: [
              { situation: '대신 집에서 요리한다', refs: ['Not really. I usually cook at home instead.'] },
              { situation: '대신 버스를 탄다', refs: ['Not really. I usually take the bus instead.'] },
              { situation: '대신 집에서 공부한다', refs: ['Not really. I usually study at home instead.'] },
              { situation: '대신 온라인으로 주문한다', refs: ['Not really. I usually order online instead.'] },
              { situation: '대신 친구를 만난다', refs: ['Not really. I usually meet my friends instead.'] }
            ]
          }
        ]
      },
      {
        id: 't5', ko: '추천', cue: 'Would you recommend ...?', appears: 'Q7', sec: 30,
        blocks: ['직답', '이유 2개', '예시', '마무리'],
        mistakes: ['이유만 말하고 예시를 빠뜨린다', 'Yes/No 확정에 5초 이상 쓴다'],
        sentences: [
          {
            id: 's1', block: '직답', tpl: 'Yes, I would definitely recommend {OBJ}.',
            ko: '네, {OBJ}를 꼭 추천하겠습니다.',
            use: '2초 만에 입장 확정. 남은 28초를 내용에 써라.',
            slots: { OBJ: { label: '대상', hint: '명사/동명사', eg: ['it', 'public transportation', 'ordering food online'] } },
            check: [{ type: 'pattern', re: '^(Yes|No)', msg: 'Yes/No 로 시작해라' },
                    { type: 'contains', value: 'recommend' }],
            drills: [
              { situation: '온라인 음식 주문을 추천한다', refs: ['Yes, I would definitely recommend ordering food online.'] },
              { situation: '대중교통을 추천한다', refs: ['Yes, I would definitely recommend public transportation.'] },
              { situation: '그 앱을 추천한다', refs: ['Yes, I would definitely recommend it to other people.'] },
              { situation: '추천하지 않는다', refs: ["No, I wouldn't really recommend it."] },
              { situation: '조건부로 추천한다', refs: ['Yes, I would recommend it, especially for beginners.'] }
            ]
          },
          {
            id: 's2', block: '이유 2개', tpl: 'The main reason is that it is {ADJ1} and {ADJ2}.',
            ko: '가장 큰 이유는 {ADJ1}하고 {ADJ2}하다는 점입니다.',
            use: '형용사 두 개로 이유를 압축. 30초 문항에서 효율이 가장 높다.',
            slots: {
              ADJ1: { label: '형용사 1', hint: '', eg: ['inexpensive', 'convenient', 'fast'] },
              ADJ2: { label: '형용사 2', hint: '다른 각도', eg: ['convenient', 'easy to use', 'reliable'] }
            },
            check: [{ type: 'contains', value: 'and' }, { type: 'minWords', value: 8 }],
            drills: [
              { situation: '저렴하고 편리하다', refs: ['The main reason is that it is inexpensive and convenient.'] },
              { situation: '빠르고 쓰기 쉽다', refs: ['The main reason is that it is fast and easy to use.'] },
              { situation: '저렴하고 시간이 절약된다', refs: ['The main reason is that it is cheap and it saves a lot of time.'] },
              { situation: '안전하고 믿을 만하다', refs: ['The main reason is that it is safe and reliable.'] },
              { situation: '무료이고 어디서든 된다', refs: ['The main reason is that it is free and available everywhere.'] }
            ]
          },
          {
            id: 's3', block: '예시', tpl: 'For example, {EXAMPLE}.',
            ko: '예를 들어 {EXAMPLE}입니다.',
            use: '**예시가 없으면 이유가 추상적으로 들린다.** 30초 문항에 반드시 넣어라.',
            slots: { EXAMPLE: { label: '구체 사례', hint: '주어+동사', eg: ['the subway connects most major tourist attractions'] } },
            check: [{ type: 'contains', value: 'For example' }, { type: 'minWords', value: 6 }],
            drills: [
              { situation: '지하철이 주요 관광지를 다 연결한다', refs: ['For example, the subway connects most major tourist attractions.'] },
              { situation: '늦게 일할 때 30분이면 배달이 온다', refs: ['For example, when I work late, dinner arrives in about thirty minutes.'] },
              { situation: '앱이 후기와 사진을 보여준다', refs: ['For example, most apps show reviews and photos.'] },
              { situation: '주차 걱정을 안 해도 된다', refs: ["For example, visitors don't need to worry about parking."] },
              { situation: '바쁜 날에도 일정을 놓치지 않는다', refs: ['For example, I never miss an appointment even on busy days.'] }
            ]
          },
          {
            id: 's4', block: '마무리', tpl: 'Also, {EXTRA}.',
            ko: '또한 {EXTRA}입니다.',
            use: '30초가 남을 때 붙이는 추가 이유.',
            slots: { EXTRA: { label: '추가 이유', hint: '주어+동사', eg: ['they can avoid traffic and parking problems'] } },
            check: [{ type: 'minWords', value: 4 }],
            drills: [
              { situation: '주말에도 서비스를 이용할 수 있다', refs: ['Also, the service is available on weekends.'] },
              { situation: '여러 출처를 한 화면에서 비교할 수 있다', refs: ['Also, users can compare several sources on one screen.'] },
              { situation: '비슷한 관심사를 가진 사람을 새로 만날 수 있다', refs: ['Also, participants can meet new people who share their interests.'] },
              { situation: '집에서는 방해가 적어 자기 속도로 할 수 있다', refs: ['Also, people can work at their own pace with fewer distractions at home.'] },
              { situation: '최신 장비 덕분에 작업이 더 안전해진다', refs: ['Also, updated equipment makes the work safer.'] },
              { situation: '자주 사용하면 자연스럽게 일상의 일부가 된다', refs: ['Also, regular use can turn it into a helpful daily habit.'] },
              { situation: '직접 설명을 들으면 오해를 줄일 수 있다', refs: ['Also, a direct explanation can prevent unnecessary misunderstandings.'] },
              { situation: '학생 할인 덕분에 빠듯한 예산에도 부담이 적다', refs: ['Also, the student discount makes it easier to stay within a tight budget.'] },
              { situation: '새로운 활동은 오래 기억할 긍정적인 경험을 준다', refs: ['Also, trying the activity can create a positive and memorable experience.'] },
              { situation: '휴대전화만 있으면 이동 중에도 이용할 수 있다', refs: ['Also, people can use it while traveling with only a smartphone.'] }
            ]
          }
        ]
      },
      {
        id: 't6', ko: '서술', cue: 'Tell me about ... / What kind of ...?', appears: 'Q5·Q7', sec: 30,
        blocks: ['대상', '용도', '장점', '상황'],
        mistakes: ['기능을 나열만 하고 연결어를 안 쓴다', '대상을 정하는 데 시간을 쓴다'],
        sentences: [
          {
            id: 's1', block: '대상', tpl: 'One {CATEGORY} I {VERB} regularly is {OBJ}.',
            ko: '제가 자주 {VERB}하는 {CATEGORY} 하나는 {OBJ}입니다.',
            use: '대상을 첫 문장에 확정. 고민하지 말고 말하기 쉬운 걸 골라라.',
            slots: {
              CATEGORY: { label: '범주', hint: '', eg: ['useful app', 'kind of exercise', 'place'] },
              VERB: { label: '동사', hint: '원형', eg: ['use', 'do', 'visit'] },
              OBJ: { label: '대상', hint: '관사 포함', eg: ['a calendar app', 'jogging', 'a nearby park'] }
            },
            check: [{ type: 'minWords', value: 6 }],
            drills: [
              { situation: '자주 쓰는 앱은 캘린더 앱이다', refs: ['One useful app I use regularly is a calendar app.'] },
              { situation: '즐기는 운동은 조깅이다', refs: ['One kind of exercise I do regularly is jogging.'] },
              { situation: '자주 주문하는 음식은 치킨이다', refs: ['One kind of food I order regularly is fried chicken.'] },
              { situation: '주말에 자주 하는 건 영화 보기다', refs: ['One thing I do regularly on weekends is watch movies at home.'] },
              { situation: '자주 가는 곳은 집 근처 도서관이다', refs: ['One place I visit regularly is a library near my home.'] }
            ]
          },
          {
            id: 's2', block: '용도', tpl: 'I use it to {P1}, {P2}, and {P3}.',
            ko: '{P1}, {P2}, {P3}하는 데 씁니다.',
            use: '3항목 나열로 30초를 효율적으로 채운다.',
            slots: {
              P1: { label: '용도 1', hint: '동사원형', eg: ['organize meetings'] },
              P2: { label: '용도 2', hint: '', eg: ['track deadlines'] },
              P3: { label: '용도 3', hint: '', eg: ['plan personal appointments'] }
            },
            check: [{ type: 'contains', value: 'and' }, { type: 'minWords', value: 8 }],
            drills: [
              { situation: '회의·마감·개인 약속 관리', refs: ['I use it to organize meetings, track deadlines, and plan personal appointments.'] },
              { situation: '체력 유지·스트레스 해소·친구 만나기', refs: ['I use it to stay healthy, reduce stress, and meet my friends.'] },
              { situation: '뉴스 읽기·메시지 확인·사진 저장', refs: ['I use it to read the news, check messages, and save photos.'] },
              { situation: '공부·자료 찾기·조용히 쉬기', refs: ['I use it to study, find materials, and rest quietly.'] },
              { situation: '길 찾기·예약·결제', refs: ['I use it to find directions, make reservations, and pay for things.'] }
            ]
          },
          {
            id: 's3', block: '상황', tpl: 'It is especially useful when {SITUATION}.',
            ko: '{SITUATION}할 때 특히 유용합니다.',
            use: '마무리 문장. 구체적 상황을 넣으면 신뢰도가 올라간다.',
            slots: { SITUATION: { label: '상황', hint: '주어+동사', eg: ['I have a busy schedule', 'I travel to a new city'] } },
            check: [{ type: 'contains', value: 'when' }],
            drills: [
              { situation: '일정이 바쁠 때', refs: ['It is especially useful when I have a busy schedule.'] },
              { situation: '새로운 도시를 여행할 때', refs: ['It is especially useful when I travel to a new city.'] },
              { situation: '시험이 가까울 때', refs: ['It is especially useful when I have an important exam.'] },
              { situation: '요리할 시간이 없을 때', refs: ["It is especially useful when I don't have time to cook."] },
              { situation: '스트레스를 많이 받을 때', refs: ['It is especially useful when I feel stressed.'] }
            ]
          }
        ]
      },
      {
        id: 't7', ko: '조언', cue: 'What advice would you give ...?', appears: 'Q7', sec: 30,
        blocks: ['예고', '조언 1', '근거', '조언 2'],
        mistakes: ['조언 하나만 말하고 30초가 남는다', '조언에 근거를 안 붙인다'],
        sentences: [
          {
            id: 's1', block: '예고', tpl: 'I would give {N} pieces of advice.',
            ko: '{N}가지 조언을 드리겠습니다.',
            use: '개수를 예고하면 청자가 구조를 즉시 잡는다. 30초는 보통 two.',
            slots: { N: { label: '개수', hint: '보통 two', eg: ['two', 'three'] } },
            check: [{ type: 'contains', value: 'advice' }],
            drills: [
              { situation: '두 가지 조언', refs: ['I would give two pieces of advice.'] },
              { situation: '세 가지 조언', refs: ['I would give three pieces of advice.'] },
              { situation: '조언 두 개를 하겠다(다른 표현)', refs: ['I have two main suggestions.'] },
              { situation: '가장 중요한 조언 두 가지', refs: ['I would give two important pieces of advice.'] },
              { situation: '두 가지를 추천하겠다', refs: ['I would recommend two things.'] }
            ]
          },
          {
            id: 's2', block: '조언 1', tpl: 'First, I would tell them to {ADVICE}.',
            ko: '먼저, {ADVICE}하라고 말하겠습니다.',
            use: 'tell them to + 동사원형. 조언형의 표준 골격.',
            slots: { ADVICE: { label: '조언', hint: '동사원형', eg: ['put their phone in another room', 'use public transportation'] } },
            check: [{ type: 'pattern', re: '(tell them to|suggest|recommend)', msg: '조언 골격을 써라' },
                    { type: 'minWords', value: 7 }],
            drills: [
              { situation: '휴대폰을 다른 방에 두라고', refs: ['First, I would tell them to put their phone in another room.'] },
              { situation: '차를 빌리지 말고 대중교통을 쓰라고', refs: ['First, I would tell them to use public transportation instead of renting a car.'] },
              { situation: '짧게 나눠서 공부하라고', refs: ['First, I would tell them to study in short blocks.'] },
              { situation: '봄이나 가을에 오라고', refs: ['First, I would recommend visiting during spring or autumn.'] },
              { situation: '미리 예약하라고', refs: ['First, I would tell them to make a reservation in advance.'] }
            ]
          },
          {
            id: 's3', block: '근거', tpl: '{SUBJ} {VERB} the biggest {NOUN} for most people.',
            ko: '{SUBJ}가 대부분의 사람에게 가장 큰 {NOUN}입니다.',
            use: '조언 뒤에 근거 한 줄. 근거 없는 조언은 설득력이 없다.',
            slots: {
              SUBJ: { label: '주어', hint: '', eg: ['Notifications', 'Traffic', 'Cost'] },
              VERB: { label: '동사', hint: 'is/are', eg: ['are', 'is'] },
              NOUN: { label: '명사', hint: '', eg: ['distraction', 'problem', 'concern'] }
            },
            check: [{ type: 'minWords', value: 6 }]
          },
          {
            id: 's4', block: '조언 2', tpl: 'Second, I would suggest {ADVICE2}.',
            ko: '둘째로, {ADVICE2}를 제안하겠습니다.',
            use: '두 번째 조언. 첫 조언과 다른 각도여야 한다.',
            slots: { ADVICE2: { label: '조언 2', hint: '동명사', eg: ['studying in short blocks', 'visiting during spring'] } },
            check: [{ type: 'pattern', re: '(Second|Also|In addition)', msg: '두 번째임을 알리는 신호어를 써라' }],
            drills: [
              { situation: '50분 공부 10분 휴식으로 나누기', refs: ['Second, I would suggest studying in short blocks, for example fifty minutes and a ten-minute break.'] },
              { situation: '봄이나 가을에 방문하기', refs: ['Second, I would suggest visiting during spring or autumn.'] },
              { situation: '알림을 꺼 두기', refs: ['Second, I would suggest turning off all notifications.'] },
              { situation: '현지 음식을 꼭 먹어 보기', refs: ['Second, I would suggest trying the local food.'] },
              { situation: '매일 조금씩 연습하기', refs: ['Second, I would suggest practicing a little every day.'] }
            ]
          }
        ]
      },
      {
        id: 't8', ko: '의견·평가', cue: 'What do you think is the most/biggest ...?', appears: 'Q7', sec: 30,
        blocks: ['답 확정', '근거', '예시'],
        mistakes: ['여러 개를 나열하다 하나도 깊게 못 판다', '단점을 물었는데 장점을 섞는다'],
        sentences: [
          {
            id: 's1', block: '답 확정', tpl: 'I think the most important {NOUN} is {ANSWER}.',
            ko: '가장 중요한 {NOUN}은 {ANSWER}라고 생각합니다.',
            use: '**하나만** 골라 깊게 파라. 세 개 나열하면 30초에 다 못 채운다.',
            slots: {
              NOUN: { label: '명사', hint: '질문에서 그대로', eg: ['quality', 'factor', 'thing'] },
              ANSWER: { label: '답', hint: '명사구', eg: ['good communication', 'the taste of the food', 'whether it is easy to use'] }
            },
            check: [{ type: 'pattern', re: '(most important|biggest|main)', msg: '질문의 최상급 표현을 받아 써라' },
                    { type: 'minWords', value: 7 }],
            drills: [
              { situation: '관리자에게 가장 중요한 건 소통이다', refs: ['I think the most important quality is good communication.'] },
              { situation: '식당 고를 때 가장 중요한 건 맛이다', refs: ['I think the most important factor is the taste of the food.'] },
              { situation: '앱 다운로드에서 중요한 건 사용 편의성이다', refs: ['I think the most important thing is whether it is easy to use.'] },
              { situation: '대형몰의 가장 큰 단점은 혼잡이다', refs: ['I think the biggest disadvantage is that large malls are usually very crowded.'] },
              { situation: '운동의 가장 큰 이점은 스트레스 감소다', refs: ['I think the biggest benefit is that it reduces stress.'] }
            ]
          },
          {
            id: 's2', block: '근거', tpl: '{SUBJ} needs to {ACTION} so that {PURPOSE}.',
            ko: '{SUBJ}는 {PURPOSE}하도록 {ACTION}해야 합니다.',
            use: 'so that 으로 목적을 연결하면 응집성 점수가 올라간다.',
            slots: {
              SUBJ: { label: '주어', hint: '', eg: ['A manager', 'A good teacher', 'A company'] },
              ACTION: { label: '행동', hint: '동사원형', eg: ['explain goals clearly', 'listen to feedback'] },
              PURPOSE: { label: '목적 절', hint: '주어+동사', eg: ['everyone knows what to do'] }
            },
            check: [{ type: 'contains', value: 'so that', msg: 'so that 으로 목적을 연결해라' }],
            drills: [
              { situation: '관리자는 목표를 명확히 설명해 모두가 할 일을 알게 해야 한다', refs: ['A manager needs to explain goals clearly so that everyone knows what to do.'] },
              { situation: '회사는 피드백을 들어 직원이 동기를 잃지 않게 해야 한다', refs: ['A company needs to listen to feedback so that employees stay motivated.'] },
              { situation: '식당은 재료를 신선하게 유지해 손님이 다시 오게 해야 한다', refs: ['A restaurant needs to keep ingredients fresh so that customers come back.'] },
              { situation: '앱은 단순해야 사용자가 금방 익힐 수 있다', refs: ['An app needs to stay simple so that users can learn it quickly.'] },
              { situation: '학교는 팀 과제를 줘서 학생이 협업을 배우게 해야 한다', refs: ['A school needs to assign team projects so that students learn to cooperate.'] }
            ]
          },
          {
            id: 's3', block: '역조건', tpl: 'When {BAD_CONDITION}, {BAD_RESULT}.',
            ko: '{BAD_CONDITION}하면 {BAD_RESULT}합니다.',
            use: '반대 상황을 들어 근거를 강화. 30초를 채우는 좋은 조각.',
            slots: {
              BAD_CONDITION: { label: '나쁜 조건', hint: '', eg: ['instructions are unclear', 'the service is slow'] },
              BAD_RESULT: { label: '나쁜 결과', hint: '', eg: ['team members waste a lot of time'] }
            },
            check: [{ type: 'pattern', re: '^When\\s+' }],
            drills: [
              { situation: '정보가 오래되면 잘못된 결정을 내릴 수 있다', refs: ['When information is outdated, people can make poor decisions.'] },
              { situation: '설명이 불분명하면 팀이 시간을 낭비한다', refs: ['When instructions are unclear, team members waste valuable time.'] },
              { situation: '서비스가 너무 느리면 고객이 흥미를 잃는다', refs: ['When service is too slow, customers quickly lose interest.'] },
              { situation: '가격이 지나치게 높으면 예산이 적은 사람은 이용하지 못한다', refs: ['When the price is too high, people with limited budgets cannot use the service.'] },
              { situation: '다른 사람을 기다려야 하면 전체 일정이 늦어진다', refs: ['When people have to wait for others, the entire schedule gets delayed.'] },
              { situation: '시설이 너무 오래되면 고장이 자주 생긴다', refs: ['When facilities are poorly maintained, equipment breaks down more often.'] },
              { situation: '문자로만 소통하면 말투를 오해하기 쉽다', refs: ['When people communicate only by text, they can easily misunderstand the tone.'] },
              { situation: '주변에 방해 요소가 많으면 집중력이 떨어진다', refs: ['When there are too many distractions, it becomes difficult to concentrate.'] }
            ]
          }
        ]
      }
    ]
  },

  /* ---------- PART 4 — 5유형 ---------- */
  4: {
    part: 4, ko: '제공 정보 활용', en: 'Respond Using Information Provided', sec: 15, mode: 'slot',
    intro: '자료에서 **정확한 정보를 찾아 말로 변환**하는 과제다. 유창하게 지어내는 게 아니다. 숫자 하나만 틀려도 정확성 감점.',
    types: [
      {
        id: 't1', ko: '단일 정보 조회', cue: 'What time ...? / How much ...?', appears: 'Q8', sec: 15,
        blocks: ['정답', '보충'],
        mistakes: ['서론을 붙이다 15초를 넘긴다', '단위(per day, A.M.)를 빼먹는다'],
        sentences: [
          {
            id: 's1', block: '정답', tpl: 'The {ITEM} {VERB} at {TIME}.',
            ko: '{ITEM}는 {TIME}에 {VERB}합니다.',
            use: '서론 없이 바로 정보로. 15초에 인사말 붙이지 마라.',
            slots: {
              ITEM: { label: '대상', hint: '자료의 항목명', eg: ['workshop', 'session', 'first presentation'] },
              VERB: { label: '동사', hint: 'begins/starts/leaves', eg: ['begins', 'starts', 'departs'] },
              TIME: { label: '시각', hint: 'A.M./P.M. 필수', eg: ['nine A.M.', 'ten forty-five A.M.', 'two fifteen P.M.'] }
            },
            check: [{ type: 'pattern', re: '(A\\.M\\.|P\\.M\\.|a\\.m\\.|p\\.m\\.|clock)', msg: 'A.M./P.M. 을 빼먹지 마라' }],
            drills: [
              { situation: '워크숍은 오전 9시에 시작한다', refs: ['The workshop begins at nine A.M.'] },
              { situation: '804편은 오전 10시 45분에 출발한다', refs: ['Flight 804 leaves at ten forty-five A.M.'] },
              { situation: '첫 발표는 오전 9시 30분이다', refs: ['The first presentation begins at nine thirty A.M.'] },
              { situation: '투어는 오전 9시에 호텔에서 출발한다', refs: ['The tour departs from the hotel at nine A.M.'] },
              { situation: '네트워킹 리셉션은 오후 4시다', refs: ['The networking reception starts at four P.M.'] }
            ]
          },
          {
            id: 's2', block: '금액', tpl: 'The {ITEM} costs {PRICE} per {UNIT}.',
            ko: '{ITEM}는 {UNIT}당 {PRICE}입니다.',
            use: '금액 질문의 표준. per 단위를 빼면 정보가 불완전하다.',
            slots: {
              ITEM: { label: '항목', hint: '', eg: ['registration fee for students', 'mountain bike'] },
              PRICE: { label: '금액', hint: '단어로 읽기', eg: ['fifty dollars', 'twenty-five dollars'] },
              UNIT: { label: '단위', hint: '', eg: ['day', 'person', 'month'] }
            },
            check: [{ type: 'contains', value: 'dollar', msg: 'dollars 를 빼먹지 마라' }],
            drills: [
              { situation: '학생 등록비는 50달러', refs: ['The registration fee for students is fifty dollars.'] },
              { situation: '산악자전거는 하루 25달러', refs: ['A mountain bike costs twenty-five dollars per day.'] },
              { situation: '투어는 1인당 65달러', refs: ['The tour costs sixty-five dollars per person.'] },
              { situation: '요리 강좌는 140달러', refs: ['The cooking class costs one hundred forty dollars.'] },
              { situation: '낚시 장비 세트는 하루 20달러', refs: ['The fishing gear set costs twenty dollars per day.'] }
            ]
          }
        ]
      },
      {
        id: 't2', ko: '복수 정보 조회', cue: '"A, and B?" — 질문이 둘', appears: 'Q8·Q9', sec: 15,
        blocks: ['정답 1', '정답 2'],
        mistakes: ['**한쪽만 답하고 끝낸다 — 이 유형 최다 감점**', '접속사 없이 두 정보를 나열한다'],
        sentences: [
          {
            id: 's1', block: '두 정보', tpl: '{ANSWER1}, and {ANSWER2}.',
            ko: '{ANSWER1}이고, {ANSWER2}입니다.',
            use: '**질문이 둘이면 답도 둘이다.** and 로 연결해 한 문장에 담아라.',
            slots: {
              ANSWER1: { label: '첫 답', hint: '완전한 절', eg: ['The workshop begins at nine A.M.'] },
              ANSWER2: { label: '둘째 답', hint: '완전한 절', eg: ['it is being held at the Riverside Convention Center'] }
            },
            check: [{ type: 'contains', value: 'and', msg: '두 정보를 and 로 연결해라' }, { type: 'minWords', value: 10 }],
            drills: [
              { situation: '워크숍은 6월 14일 오전 9시 시작 / 학생 등록비 50달러',
                refs: ['The workshop begins at nine A.M. on June fourteenth, and the registration fee for students is fifty dollars.'] },
              { situation: '804편은 오전 10시 45분 출발 / 요금 185달러',
                refs: ['Flight 804 leaves at ten forty-five A.M., and it costs one hundred eighty-five dollars.'] },
              { situation: '가을 학기는 9월 2일 시작 / 11월 25일 종료',
                refs: ['The fall session runs from September second through November twenty-fifth.'] },
              { situation: '컨퍼런스는 오전 8시 30분 시작 / 환영 조식은 Diane Ortega 담당',
                refs: ['The conference starts at eight thirty A.M., and Ms. Diane Ortega is giving the welcome breakfast.'] },
              { situation: '첫 지원자는 Laura Kim / 면접은 각 45분',
                refs: ['The first candidate is Laura Kim at ten A.M., and each interview lasts forty-five minutes.'] }
            ]
          }
        ]
      },
      {
        id: 't3', ko: '잘못된 전제 정정', cue: 'I heard ... / Is that correct?', appears: 'Q9', sec: 15,
        blocks: ['부정', '정정', '혼동 원인'],
        mistakes: ['**질문에 끌려 Yes 라고 답한다 — 이 유형 최대 함정**', '틀렸다고만 하고 올바른 정보를 안 준다'],
        sentences: [
          {
            id: 's1', block: '부정', tpl: "No, that's not correct.",
            ko: '아니요, 그건 맞지 않습니다.',
            use: '**즉시 부정.** 망설이면 15초가 사라진다. 통째로 자동화해 둘 것.',
            slots: {},
            check: [{ type: 'pattern', re: '^No', msg: 'No 로 시작해라' }],
            drills: [
              { situation: '틀렸다고 즉시 부정', refs: ["No, that's not correct.", "No, actually that's not right."] },
              { situation: '부드럽게 부정', refs: ["No, actually, that isn't quite right."] },
              { situation: '짧게 부정', refs: ["No, it isn't."] },
              { situation: '유감을 담아 부정', refs: ["No, I'm afraid that's not correct."] },
              { situation: '정보가 바뀌었다는 뉘앙스', refs: ["No, that information has changed."] }
            ]
          },
          {
            id: 's2', block: '정정', tpl: 'Actually, the {ITEM} {VERB} at {CORRECT}.',
            ko: '실제로는 {ITEM}가 {CORRECT}에 {VERB}합니다.',
            use: '올바른 정보를 즉시. 부정만 하고 끝내면 완결성 감점.',
            slots: {
              ITEM: { label: '항목', hint: '', eg: ['social media session', 'marketing session'] },
              VERB: { label: '동사', hint: '', eg: ['starts', 'begins'] },
              CORRECT: { label: '올바른 값', hint: '', eg: ['ten A.M. in Hall A'] }
            },
            check: [{ type: 'minWords', value: 6 }],
            drills: [
              { situation: '소셜미디어 세션은 실제로 오전 10시 Hall A', refs: ['Actually, the social media session starts at ten A.M. in Hall A.'] },
              { situation: 'Raman은 협상 워크숍만 진행한다', refs: ['Actually, Ms. Raman is leading only the negotiation skills workshop at one thirty.'] },
              { situation: '가장 싼 항공편은 경유가 있다', refs: ['Actually, the cheapest flight has one stop in Denver.'] },
              { situation: '점심은 본인 부담이다', refs: ['Actually, lunch at Harbor Market is at your own expense.'] },
              { situation: '구명조끼는 추가 요금 없이 포함된다', refs: ['Actually, life jackets are included at no extra charge.'] }
            ]
          },
          {
            id: 's3', block: '혼동 원인', tpl: 'The {TIME} session is about {OTHER}, not {WRONG}.',
            ko: '{TIME} 세션은 {WRONG}이 아니라 {OTHER}입니다.',
            use: '왜 헷갈렸는지 짚어 주면 완결성이 올라간다.',
            slots: {
              TIME: { label: '시각', hint: '', eg: ['eleven thirty', 'three o’clock'] },
              OTHER: { label: '실제 내용', hint: '', eg: ['customer service online'] },
              WRONG: { label: '오해한 내용', hint: '', eg: ['social media'] }
            },
            check: [{ type: 'contains', value: 'not' }]
          }
        ]
      },
      {
        id: 't4', ko: '조건 필터링 나열', cue: 'before noon / on Tuesdays / under $30', appears: 'Q10', sec: 30,
        blocks: ['개수 예고', '항목 나열', '각주'],
        mistakes: ['**조건 밖 항목을 넣는다 — 정확성 즉시 감점**', '항목 하나만 말하고 끝낸다'],
        sentences: [
          {
            id: 's1', block: '개수 예고', tpl: 'You have {N} options {CONDITION}.',
            ko: '{CONDITION} 조건으로는 {N}개의 선택지가 있습니다.',
            use: '**개수를 먼저.** 청자가 구조를 즉시 잡는다. Q10의 표준 오프닝.',
            slots: {
              N: { label: '개수', hint: '단어로', eg: ['two', 'three'] },
              CONDITION: { label: '조건', hint: '전치사구', eg: ['before noon', 'on Tuesdays', 'within your budget'] }
            },
            check: [{ type: 'pattern', re: '(There are|You have|there are)', msg: '개수 예고 골격을 써라' }],
            drills: [
              { situation: '정오 이전 두 편', refs: ['You have two options before noon.'] },
              { situation: '점심 이후 세 개 활동', refs: ['There are three activities scheduled after lunch.'] },
              { situation: '화요일 두 개 강좌', refs: ['On Tuesdays, you have two options.'] },
              { situation: '오후 지원자 세 명', refs: ['There are three candidates scheduled in the afternoon.'] },
              { situation: '30달러 예산으로 두 가지', refs: ['With a budget of thirty dollars a day, you have two options.'] }
            ]
          },
          {
            id: 's2', block: '항목 나열', tpl: 'First, {ITEM1}. Then, {ITEM2}. Finally, {ITEM3}.',
            ko: '먼저 {ITEM1}, 그다음 {ITEM2}, 마지막으로 {ITEM3}입니다.',
            use: '순서어가 곧 응집성 점수다. 시간순으로 배열해라.',
            slots: {
              ITEM1: { label: '항목 1', hint: '시각+내용', eg: ['a résumé-writing session begins at two P.M.'] },
              ITEM2: { label: '항목 2', hint: '', eg: ['an interview-skills session starts at three'] },
              ITEM3: { label: '항목 3', hint: '', eg: ['a networking reception is scheduled for four P.M.'] }
            },
            check: [{ type: 'pattern', re: '(First|Then|Finally|Second|Next)', msg: '순서어를 써라' },
                    { type: 'minWords', value: 12 }],
            drills: [
              { situation: '2시 이력서 / 3시 면접기술 / 4시 네트워킹',
                refs: ['First, a résumé-writing session begins at two P.M. Then, an interview-skills session starts at three. Finally, a networking reception is scheduled for four P.M.'] },
              { situation: '9시 버스 출발 / 9시45분 도보 투어 / 11시30분 박물관',
                refs: ['First, the bus departs at nine A.M. Then, there is a walking tour at nine forty-five. Finally, you can visit the museum at eleven thirty.'] },
              { situation: '1시 Sofia 대면 / 2시 Ethan 화상 / 3시30분 Hannah 대면',
                refs: ['First, Sofia Marquez has an in-person interview at one P.M. Then, Ethan Wright has a video call at two P.M. Finally, Hannah Lee has an in-person interview at three thirty.'] },
              { situation: '721편 8시20분 / 804편 10시45분',
                refs: ['First, Flight 721 departs at eight twenty A.M. Then, Flight 804 departs at ten forty-five A.M.'] },
              { situation: '사진 강좌 화요일 7시 / 요가 화목 6시30분',
                refs: ['First, Digital Photography meets on Tuesday from seven to nine P.M. Then, Yoga for Beginners meets on Tuesdays and Thursdays from six thirty.'] }
            ]
          },
          {
            id: 's3', block: '각주', tpl: 'Also, please note that {NOTE}.',
            ko: '또한 {NOTE}라는 점을 참고해 주세요.',
            use: '시간이 남을 때 표 하단 각주를 언급하면 완결성이 올라간다.',
            slots: { NOTE: { label: '각주 정보', hint: '', eg: ['members receive a twenty percent discount'] } },
            check: [{ type: 'minWords', value: 5 }]
          }
        ]
      },
      {
        id: 't5', ko: '특정 대상 전체', cue: 'everything ... is involved in', appears: 'Q10', sec: 30,
        blocks: ['개수', '세부 나열'],
        mistakes: ['같은 이름이 들어간 행을 하나 빠뜨린다', '개수를 예고하지 않아 구조가 안 잡힌다'],
        sentences: [
          {
            id: 's1', block: '개수', tpl: '{PERSON} is involved in {N} {NOUN}.',
            ko: '{PERSON}는 {N}개의 {NOUN}에 참여합니다.',
            use: '대상이 들어간 행만 골라 개수부터.',
            slots: {
              PERSON: { label: '대상', hint: '인명/항목명', eg: ['Mr. Victor Hale', 'Ms. Ortega'] },
              N: { label: '개수', hint: '', eg: ['two', 'three'] },
              NOUN: { label: '단위', hint: '', eg: ['sessions', 'activities'] }
            },
            check: [{ type: 'minWords', value: 5 }],
            drills: [
              { situation: 'Victor Hale은 두 세션에 참여', refs: ['Mr. Victor Hale is involved in two sessions.'] },
              { situation: 'Diane Ortega는 두 순서를 맡음', refs: ['Ms. Diane Ortega is in charge of two parts of the program.'] },
              { situation: 'Room 204에서 두 개 세션', refs: ['There are two sessions held in Room 204.'] },
              { situation: '대면 면접은 세 건', refs: ['Three of the interviews are held in person.'] },
              { situation: 'Hall A에서 두 개 세션', refs: ['Two sessions are scheduled in Hall A.'] }
            ]
          },
          {
            id: 's2', block: '세부 나열', tpl: 'First, he is {V1} at {T1}. Then, he is {V2} at {T2}.',
            ko: '먼저 {T1}에 {V1}하고, 그다음 {T2}에 {V2}합니다.',
            use: '각 항목의 시각과 내용을 짝지어라.',
            slots: {
              V1: { label: '활동 1', hint: '-ing', eg: ['giving the keynote presentation'] },
              T1: { label: '시각 1', hint: '', eg: ['nine fifteen'] },
              V2: { label: '활동 2', hint: '', eg: ['leading the workshop on digital tools'] },
              T2: { label: '시각 2', hint: '', eg: ['three o’clock'] }
            },
            check: [{ type: 'pattern', re: '(First|Then|Next|Finally)' }, { type: 'minWords', value: 10 }],
            drills: [
              { situation: '9시15분 기조연설 / 3시 디지털도구 워크숍',
                refs: ['First, he is giving the keynote presentation at nine fifteen. Then, he is leading the digital tools workshop at three.'] },
              { situation: '8시30분 환영조식 / 4시30분 폐회사',
                refs: ['First, she is hosting the welcome breakfast at eight thirty. Then, she is giving the closing remarks at four thirty.'] },
              { situation: '2시 이력서 세션 / 3시 면접기술 세션',
                refs: ['First, there is a résumé-writing session at two. Then, there is an interview-skills session at three.'] },
              { situation: '10시 소셜미디어 / 11시30분 고객서비스',
                refs: ['First, the social media session is at ten. Then, the customer service session is at eleven thirty.'] },
              { situation: '1시 Sofia / 3시30분 Hannah 대면 면접',
                refs: ['First, Sofia Marquez is interviewed at one P.M. Then, Hannah Lee is interviewed at three thirty P.M.'] }
            ]
          }
        ]
      }
    ]
  },

  /* ---------- PART 5 — 5유형 (입장 문장만 다르고 나머지는 공통) ---------- */
  5: {
    part: 5, ko: '의견 제시', en: 'Express an Opinion', sec: 60, mode: 'slot',
    intro: '**입장 문장만 유형별로 다르고, 이유·예시·양보·결론 5블록은 전 유형 공통이다.** 외울 게 10문장이 아니라 6문장이라는 뜻이다.',
    sharedNote: '아래 이유1·예시·이유2·양보·결론은 5개 유형 전부에서 똑같이 쓴다.',
    types: [
      {
        id: 't1', ko: '찬반', cue: 'Do you agree or disagree ...?', appears: 'Q11', sec: 60,
        blocks: ['입장', '이유1', '예시', '이유2', '양보', '결론'],
        mistakes: ['양쪽을 오가다 입장이 사라진다', '이유를 동의어로 반복한다'],
        sentences: [
          {
            id: 's0', block: '입장', tpl: 'I {STANCE} that {STATEMENT}.',
            ko: '저는 {STATEMENT}에 {STANCE}합니다.',
            use: '**5초 안에 확정.** 첫 문장에서 입장이 안 잡히면 60초가 흔들린다.',
            slots: {
              STANCE: { label: '입장', hint: 'agree / disagree', eg: ['agree', 'disagree', 'strongly agree'] },
              STATEMENT: { label: '주장', hint: '질문을 받아 재진술', eg: ['employees should be allowed to work from home', 'companies should pay for training'] }
            },
            check: [{ type: 'pattern', re: '(agree|disagree|believe|think)', msg: '입장 동사를 써라' },
                    { type: 'minWords', value: 6 }],
            drills: [
              { situation: '재택근무 허용에 찬성', refs: ['I agree that employees should be allowed to work from home several days a week.'] },
              { situation: '사내 교육비 회사 부담에 찬성', refs: ['I strongly agree that companies should pay for job-related training.'] },
              { situation: '대학 팀 과제 의무화에 찬성', refs: ['I agree that universities should require students to participate in team projects.'] },
              { situation: 'SNS가 긍정적이라는 주장에 반대', refs: ['I disagree that social media has a positive effect on most people.'] },
              { situation: '온라인 강의가 동등하다는 주장에 반대', refs: ["I don't think online courses always provide the same value as traditional classes."] }
            ]
          },
          ...P5_COMMON
        ]
      },
      {
        id: 't2', ko: '양자택일 비교', cue: 'Which is more important: A or B?', appears: 'Q11', sec: 60,
        blocks: ['선택', '이유1', '예시', '이유2', '양보', '결론'],
        mistakes: ['**양쪽 다 말하려다 입장이 흐려진다 — 이 유형 최대 함정**', '반대편 인정 후 되받지 않는다'],
        sentences: [
          {
            id: 's0', block: '선택', tpl: 'I believe {A} is more important than {B}.',
            ko: '저는 {A}가 {B}보다 더 중요하다고 생각합니다.',
            use: '**하나를 고르고 끝까지 유지.** 반대편은 양보 블록에서만 언급해라.',
            slots: {
              A: { label: '내 선택', hint: '질문의 표현 그대로', eg: ['opportunities to learn new skills', 'going to university first'] },
              B: { label: '반대편', hint: '', eg: ['a high salary', 'starting work right away'] }
            },
            check: [{ type: 'contains', value: 'than', msg: '비교급에는 than 이 필요하다' },
                    { type: 'notContains', value: 'both are', msg: '양쪽을 다 고르면 감점이다' }],
            drills: [
              { situation: '연봉보다 배움의 기회', refs: ['I believe opportunities to learn new skills are more important than a high salary.'] },
              { situation: '바로 취업보다 대학 진학', refs: ['I believe going to university first is better than starting work right after high school.'] },
              { situation: '속도보다 정확성', refs: ['I believe accuracy is more important than speed.'] },
              { situation: '가격보다 품질', refs: ['I believe quality is more important than price.'] },
              { situation: '개인 작업보다 팀워크', refs: ['I believe teamwork is more important than working individually.'] }
            ]
          },
          ...P5_COMMON
        ]
      },
      {
        id: 't3', ko: '선호', cue: 'Which do you prefer ...?', appears: 'Q11', sec: 60,
        blocks: ['선호', '이유1', '예시', '이유2', '양보', '결론'],
        mistakes: ['일반론으로 답해 개인 선호가 안 드러난다'],
        sentences: [
          {
            id: 's0', block: '선호', tpl: 'I prefer {A}, especially {CONDITION}.',
            ko: '저는 특히 {CONDITION}일 때 {A}를 선호합니다.',
            use: '조건을 붙이면 방어하기 쉬워진다. 단정보다 세련되게 들린다.',
            slots: {
              A: { label: '선호 대상', hint: '', eg: ['shopping online', 'living in a large city'] },
              CONDITION: { label: '조건', hint: '', eg: ['at this stage of my life', 'when I am busy'] }
            },
            check: [{ type: 'pattern', re: '^I prefer', msg: 'I prefer 로 시작해라' }, { type: 'minWords', value: 5 }],
            drills: [
              { situation: '온라인 쇼핑 선호', refs: ['I prefer shopping online, especially when I am busy.'] },
              { situation: '대도시 거주 선호', refs: ['I prefer living in a large city, especially at this stage of my life.'] },
              { situation: '집에서 영화 보기 선호', refs: ['I prefer watching movies at home, especially on weekdays.'] },
              { situation: '혼자 여행 선호', refs: ['I prefer traveling alone, especially when I want to relax.'] },
              { situation: '대면 수업 선호', refs: ['I prefer traditional classes, especially for subjects that require discussion.'] }
            ]
          },
          ...P5_COMMON
        ]
      },
      {
        id: 't4', ko: '최선의 방법', cue: 'What is the most effective way ...?', appears: 'Q11', sec: 60,
        blocks: ['방법', '이유1', '예시', '이유2', '양보', '결론'],
        mistakes: ['방법을 세 개 나열하다 하나도 깊게 못 판다'],
        sentences: [
          {
            id: 's0', block: '방법', tpl: 'I think the most effective way to {GOAL} is to {METHOD}.',
            ko: '{GOAL}하는 가장 효과적인 방법은 {METHOD}하는 것이라고 생각합니다.',
            use: '**하나만** 골라 깊게 파라. 나열하면 60초에 다 못 채운다.',
            slots: {
              GOAL: { label: '목표', hint: '동사원형', eg: ['learn a foreign language', 'stay healthy'] },
              METHOD: { label: '방법', hint: '동사원형', eg: ['use it every day in real situations', 'exercise regularly'] }
            },
            check: [{ type: 'contains', value: 'way to', msg: 'the most effective way to ... 골격을 써라' },
                    { type: 'minWords', value: 9 }],
            drills: [
              { situation: '외국어는 매일 실제로 써 보는 것', refs: ['I think the most effective way to learn a foreign language is to use it every day in real situations.'] },
              { situation: '건강 유지는 규칙적 운동', refs: ['I think the most effective way to stay healthy is to exercise regularly.'] },
              { situation: '집중력은 휴대폰을 치우는 것', refs: ['I think the most effective way to improve concentration is to put your phone in another room.'] },
              { situation: '돈 모으기는 자동 이체 설정', refs: ['I think the most effective way to save money is to set up an automatic transfer.'] },
              { situation: '스트레스 해소는 규칙적인 취미', refs: ['I think the most effective way to reduce stress is to have a regular hobby.'] }
            ]
          },
          ...P5_COMMON
        ]
      },
      {
        id: 't5', ko: '장단점', cue: 'What are the advantages/disadvantages of ...?', appears: 'Q11', sec: 60,
        blocks: ['핵심 장단점', '이유1', '예시', '이유2', '양보', '결론'],
        mistakes: ['장점을 물었는데 단점을 섞는다', '항목만 나열하고 근거가 없다'],
        sentences: [
          {
            id: 's0', block: '핵심', tpl: 'I think the biggest {ASPECT} of {TOPIC} is {POINT}.',
            ko: '{TOPIC}의 가장 큰 {ASPECT}은 {POINT}이라고 생각합니다.',
            use: '물어본 쪽만 답해라. 장점을 물었으면 장점만.',
            slots: {
              ASPECT: { label: '측면', hint: 'advantage / disadvantage', eg: ['advantage', 'disadvantage', 'benefit'] },
              TOPIC: { label: '주제', hint: '', eg: ['working from home', 'online shopping'] },
              POINT: { label: '핵심', hint: '명사구/절', eg: ['that it saves commuting time'] }
            },
            check: [{ type: 'pattern', re: '(advantage|disadvantage|benefit|drawback)', msg: '질문의 측면 단어를 받아 써라' }],
            drills: [
              { situation: '재택근무의 최대 장점은 통근 시간 절약', refs: ['I think the biggest advantage of working from home is that it saves commuting time.'] },
              { situation: '온라인 쇼핑의 최대 장점은 가격 비교', refs: ['I think the biggest advantage of online shopping is that you can easily compare prices.'] },
              { situation: '대형몰의 최대 단점은 혼잡', refs: ['I think the biggest disadvantage of large malls is that they are very crowded.'] },
              { situation: '온라인 강의의 최대 단점은 상호작용 부족', refs: ['I think the biggest disadvantage of online courses is the lack of direct interaction.'] },
              { situation: '대도시의 최대 단점은 높은 생활비', refs: ['I think the biggest disadvantage of large cities is the high cost of living.'] }
            ]
          },
          ...P5_COMMON
        ]
      }
    ]
  }
};

/* ============================================================
   기존 문항 → 유형 매핑
   리포트 화면에서 "이 문항의 유형" 링크를 걸기 위해 필요하다.
   ============================================================ */
const TYPE_OF = {
  /* Part 2 — 전부 커버리지 모드. 값은 장면 변형 */
  'p2-01': '2/outdoor', 'p2-02': '2/indoor', 'p2-03': '2/indoor', 'p2-04': '2/outdoor',
  'p2-05': '2/indoor', 'p2-06': '2/indoor', 'p2-07': '2/solo', 'p2-08': '2/outdoor',
  'p2-09': '2/outdoor', 'p2-10': '2/indoor',

  /* Part 3 */
  'p3-01#1': '3/t1', 'p3-01#2': '3/t6', 'p3-01#3': '3/t5',
  'p3-02#1': '3/t6', 'p3-02#2': '3/t2', 'p3-02#3': '3/t8',
  'p3-03#1': '3/t2', 'p3-03#2': '3/t3', 'p3-03#3': '3/t5',
  'p3-04#1': '3/t1', 'p3-04#2': '3/t8', 'p3-04#3': '3/t6',
  'p3-05#1': '3/t2', 'p3-05#2': '3/t3', 'p3-05#3': '3/t7',
  'p3-06#1': '3/t2', 'p3-06#2': '3/t3', 'p3-06#3': '3/t8',
  'p3-07#1': '3/t1', 'p3-07#2': '3/t3', 'p3-07#3': '3/t7',
  'p3-08#1': '3/t6', 'p3-08#2': '3/t3', 'p3-08#3': '3/t4',
  'p3-09#1': '3/t2', 'p3-09#2': '3/t3', 'p3-09#3': '3/t8',
  'p3-10#1': '3/t1', 'p3-10#2': '3/t8', 'p3-10#3': '3/t4',

  /* Part 4 */
  'p4-01#1': '4/t2', 'p4-01#2': '4/t3', 'p4-01#3': '4/t4',
  'p4-02#1': '4/t2', 'p4-02#2': '4/t3', 'p4-02#3': '4/t4',
  'p4-03#1': '4/t2', 'p4-03#2': '4/t2', 'p4-03#3': '4/t4',
  'p4-04#1': '4/t2', 'p4-04#2': '4/t3', 'p4-04#3': '4/t5',
  'p4-05#1': '4/t2', 'p4-05#2': '4/t3', 'p4-05#3': '4/t4',
  'p4-06#1': '4/t2', 'p4-06#2': '4/t3', 'p4-06#3': '4/t4',
  'p4-07#1': '4/t1', 'p4-07#2': '4/t3', 'p4-07#3': '4/t4',

  /* Part 5 */
  'p5-01': '5/t1', 'p5-02': '5/t2', 'p5-03': '5/t1', 'p5-04': '5/t3', 'p5-05': '5/t1',
  'p5-06': '5/t3', 'p5-07': '5/t1', 'p5-08': '5/t4', 'p5-09': '5/t1', 'p5-10': '5/t2'
};

/* 유형 조회 헬퍼 */
function getType(path) {
  if (!path) return null;
  const [p, t] = String(path).split('/');
  const P = PATTERNS[p];
  if (!P) return null;
  if (P.mode === 'coverage') {
    const v = (P.variants || []).find(x => x.id === t);
    return { part: p, partData: P, variant: v || null, type: null };
  }
  const type = (P.types || []).find(x => x.id === t);
  return type ? { part: p, partData: P, type, variant: null } : null;
}
