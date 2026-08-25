/* ============================================================
   문항 뱅크
   출처: TOEIC_Speaking_PART1_학습자료.md, 토익 전반 리서치.md
   ※ ETS 공식 문항 복제가 아니라 현행 시험 구조에 맞춰 만든 연습 문항.
   ============================================================ */

/* --- Part 2용 간이 장면 SVG --------------------------------- */
function person(x, y, s, color, pose) {
  const g = [];
  g.push(`<circle cx="${x}" cy="${y}" r="${9 * s}" fill="#e8c39e"/>`);
  g.push(`<path d="M${x - 11 * s} ${y + 42 * s} L${x - 11 * s} ${y + 13 * s} Q${x} ${y + 6 * s} ${x + 11 * s} ${y + 13 * s} L${x + 11 * s} ${y + 42 * s} Z" fill="${color}"/>`);
  if (pose === 'arm-up') {
    g.push(`<path d="M${x + 9 * s} ${y + 16 * s} L${x + 26 * s} ${y - 4 * s}" stroke="${color}" stroke-width="${5 * s}" stroke-linecap="round"/>`);
  } else if (pose === 'arms-fwd') {
    g.push(`<path d="M${x - 9 * s} ${y + 18 * s} L${x - 20 * s} ${y + 28 * s} M${x + 9 * s} ${y + 18 * s} L${x + 20 * s} ${y + 28 * s}" stroke="${color}" stroke-width="${5 * s}" stroke-linecap="round"/>`);
  }
  return g.join('');
}

const SCENE = {
  cafe: `<svg viewBox="0 0 640 360" role="img" aria-label="Outdoor cafe scene">
    <rect width="640" height="360" fill="#dfeaf2"/>
    <rect y="250" width="640" height="110" fill="#c9b79c"/>
    <path d="M60 150 L200 150 L130 96 Z" fill="#7fb3a4"/><rect x="127" y="150" width="6" height="60" fill="#8a7b6b"/>
    <path d="M430 140 L580 140 L505 84 Z" fill="#e0a05a"/><rect x="502" y="140" width="6" height="70" fill="#8a7b6b"/>
    <rect x="90" y="212" width="130" height="8" rx="3" fill="#8d6e52"/>
    ${person(130, 176, 1.05, '#3f6fa8', 'arms-fwd')}
    <rect x="150" y="196" width="34" height="20" rx="3" fill="#2f3b45"/>
    ${person(300, 172, 1.1, '#a8523f', null)}
    <circle cx="322" cy="196" r="8" fill="#f2f2f2"/>
    <rect x="440" y="216" width="150" height="8" rx="3" fill="#8d6e52"/>
    ${person(470, 186, .85, '#5a7f52', null)}${person(540, 186, .85, '#8a6ba8', null)}
    <text x="320" y="336" text-anchor="middle" font-family="system-ui" font-size="15" fill="#6b5b48">OUTDOOR CAFÉ</text>
  </svg>`,

  meeting: `<svg viewBox="0 0 640 360" role="img" aria-label="Meeting room scene">
    <rect width="640" height="360" fill="#eef0f3"/>
    <rect y="270" width="640" height="90" fill="#cfd6dd"/>
    <rect x="330" y="52" width="250" height="150" rx="6" fill="#31404f"/>
    <rect x="352" y="76" width="150" height="10" rx="4" fill="#7fa8c9"/>
    <rect x="352" y="98" width="200" height="10" rx="4" fill="#5b7f9c"/>
    <rect x="352" y="120" width="110" height="10" rx="4" fill="#5b7f9c"/>
    ${person(150, 150, 1.2, '#b0553f', 'arm-up')}
    <rect x="120" y="248" width="430" height="12" rx="4" fill="#a98b64"/>
    ${person(330, 196, 1, '#3f6fa8', null)}${person(430, 196, 1, '#4f7f5c', null)}
    <rect x="300" y="230" width="42" height="18" rx="3" fill="#2f3b45"/>
    <rect x="400" y="230" width="42" height="18" rx="3" fill="#2f3b45"/>
    <rect x="200" y="236" width="52" height="12" rx="2" fill="#f5f2ea"/>
    <text x="320" y="336" text-anchor="middle" font-family="system-ui" font-size="15" fill="#5c6773">MEETING ROOM</text>
  </svg>`,

  market: `<svg viewBox="0 0 640 360" role="img" aria-label="Supermarket scene">
    <rect width="640" height="360" fill="#f1efe6"/>
    <rect y="272" width="640" height="88" fill="#d9d4c6"/>
    <rect x="400" y="60" width="210" height="212" fill="#c8cdd2"/>
    <rect x="400" y="112" width="210" height="7" fill="#8f979e"/>
    <rect x="400" y="176" width="210" height="7" fill="#8f979e"/>
    <rect x="400" y="240" width="210" height="7" fill="#8f979e"/>
    ${[0, 1, 2, 3, 4].map(i => `<rect x="${412 + i * 40}" y="80" width="26" height="30" rx="3" fill="#d9704f"/>`).join('')}
    ${[0, 1, 2, 3, 4].map(i => `<rect x="${412 + i * 40}" y="144" width="26" height="30" rx="3" fill="#e0b357"/>`).join('')}
    ${[0, 1, 2, 3, 4].map(i => `<rect x="${412 + i * 40}" y="208" width="26" height="30" rx="3" fill="#6f9e78"/>`).join('')}
    ${person(370, 168, 1.05, '#2f6f8f', 'arm-up')}
    ${person(150, 176, 1.1, '#8a5aa8', 'arms-fwd')}
    <rect x="168" y="222" width="76" height="44" rx="4" fill="none" stroke="#6b7078" stroke-width="5"/>
    <circle cx="182" cy="274" r="7" fill="#5b6068"/><circle cx="232" cy="274" r="7" fill="#5b6068"/>
    <text x="320" y="336" text-anchor="middle" font-family="system-ui" font-size="15" fill="#7a7365">SUPERMARKET</text>
  </svg>`,

  park: `<svg viewBox="0 0 640 360" role="img" aria-label="Park scene">
    <rect width="640" height="360" fill="#cfe6f0"/>
    <rect y="228" width="640" height="132" fill="#8fbe72"/>
    <circle cx="90" cy="150" r="56" fill="#4e8b52"/><rect x="84" y="196" width="12" height="44" fill="#7a5b3f"/>
    <circle cx="560" cy="132" r="66" fill="#3f7a48"/><rect x="553" y="188" width="14" height="52" fill="#7a5b3f"/>
    <circle cx="470" cy="164" r="44" fill="#4e8b52"/><rect x="464" y="200" width="11" height="40" fill="#7a5b3f"/>
    ${person(200, 236, .95, '#d95f4f', 'arm-up')}${person(280, 240, .9, '#f0c14f', 'arms-fwd')}
    <circle cx="244" cy="300" r="14" fill="#f2f2f2" stroke="#33404a" stroke-width="3"/>
    <rect x="410" y="252" width="120" height="8" rx="3" fill="#8d6e52"/>
    <rect x="416" y="260" width="8" height="26" fill="#8d6e52"/><rect x="516" y="260" width="8" height="26" fill="#8d6e52"/>
    ${person(440, 216, .85, '#6b7a8f', null)}${person(500, 216, .85, '#a8859e', null)}
    <text x="320" y="340" text-anchor="middle" font-family="system-ui" font-size="15" fill="#4c6b45">CITY PARK</text>
  </svg>`,

  airport: `<svg viewBox="0 0 640 360" role="img" aria-label="Airport check-in scene">
    <rect width="640" height="360" fill="#e9edf1"/>
    <rect y="276" width="640" height="84" fill="#cdd3d9"/>
    <rect x="360" y="40" width="240" height="46" rx="5" fill="#2b3a47"/>
    <rect x="376" y="56" width="90" height="7" rx="3" fill="#7fd0a8"/>
    <rect x="376" y="70" width="140" height="7" rx="3" fill="#7fd0a8"/>
    <rect x="486" y="56" width="60" height="7" rx="3" fill="#e0c15a"/>
    <rect x="360" y="212" width="250" height="64" fill="#b9c2ca"/>
    ${person(500, 178, 1.05, '#3f6fa8', null)}
    ${person(300, 190, 1.05, '#a8523f', null)}
    <rect x="252" y="232" width="30" height="44" rx="4" fill="#4d5b68"/><rect x="264" y="216" width="6" height="18" fill="#4d5b68"/>
    ${person(190, 194, 1, '#4f7f5c', null)}
    <rect x="144" y="238" width="28" height="40" rx="4" fill="#6b5b8f"/><rect x="155" y="222" width="6" height="18" fill="#6b5b8f"/>
    ${person(88, 196, .95, '#8a6ba8', null)}
    <text x="320" y="340" text-anchor="middle" font-family="system-ui" font-size="15" fill="#6c757d">AIRPORT CHECK-IN</text>
  </svg>`,

  restaurant: `<svg viewBox="0 0 640 360" role="img" aria-label="Restaurant interior scene">
    <rect width="640" height="360" fill="#f3ece2"/>
    <rect y="268" width="640" height="92" fill="#8a6a4e"/>
    <rect x="40" y="40" width="120" height="86" rx="4" fill="#cfe0e8" stroke="#a8825e" stroke-width="5"/>
    <rect x="470" y="40" width="120" height="86" rx="4" fill="#cfe0e8" stroke="#a8825e" stroke-width="5"/>
    <circle cx="320" cy="52" r="13" fill="#e8c86a"/><rect x="317" y="0" width="6" height="40" fill="#7a6a55"/>
    <ellipse cx="250" cy="238" rx="92" ry="17" fill="#fdfaf4"/>
    <rect x="243" y="238" width="14" height="34" fill="#8d6e52"/>
    ${person(196, 176, 1.05, '#a8523f', 'arms-fwd')}
    ${person(304, 176, 1.05, '#3f6fa8', 'arms-fwd')}
    <circle cx="216" cy="234" r="13" fill="#fff" stroke="#d8cec0" stroke-width="2"/>
    <circle cx="284" cy="234" r="13" fill="#fff" stroke="#d8cec0" stroke-width="2"/>
    <rect x="238" y="226" width="24" height="14" rx="3" fill="#c9553f"/>
    ${person(470, 168, 1.15, '#37474f', 'arm-up')}
    <rect x="486" y="196" width="42" height="9" rx="3" fill="#e8e2d6"/>
    <circle cx="507" cy="196" r="9" fill="#fff" stroke="#d8cec0" stroke-width="2"/>
    <text x="320" y="332" text-anchor="middle" font-family="system-ui" font-size="15" fill="#f0e4d4">RESTAURANT</text>
  </svg>`,

  library: `<svg viewBox="0 0 640 360" role="img" aria-label="Library study scene, one person">
    <rect width="640" height="360" fill="#f0ece4"/>
    <rect y="276" width="640" height="84" fill="#c4b8a4"/>
    <rect x="20" y="46" width="180" height="230" fill="#8a6f52"/>
    ${[0,1,2,3].map(r=>[0,1,2,3,4,5,6].map(i=>`<rect x="${30+i*23}" y="${58+r*56}" width="17" height="46" rx="2" fill="${['#b5543f','#4f7f8f','#7a6a9e','#c9974f','#5a8f6a'][(i+r)%5]}"/>`).join('')).join('')}
    <rect x="440" y="46" width="180" height="230" fill="#8a6f52"/>
    ${[0,1,2,3].map(r=>[0,1,2,3,4,5,6].map(i=>`<rect x="${450+i*23}" y="${58+r*56}" width="17" height="46" rx="2" fill="${['#4f7f8f','#c9974f','#b5543f','#5a8f6a','#7a6a9e'][(i+r)%5]}"/>`).join('')).join('')}
    <rect x="228" y="244" width="184" height="10" rx="3" fill="#a8825e"/>
    <rect x="238" y="254" width="10" height="30" fill="#a8825e"/><rect x="392" y="254" width="10" height="30" fill="#a8825e"/>
    ${person(320, 178, 1.3, '#3f6fa8', 'arms-fwd')}
    <path d="M286 244 L320 232 L354 244 L320 250 Z" fill="#fdfaf4" stroke="#c9bfae" stroke-width="2"/>
    <rect x="356" y="228" width="30" height="16" rx="3" fill="#37474f"/>
    <text x="320" y="336" text-anchor="middle" font-family="system-ui" font-size="15" fill="#6b5b48">LIBRARY</text>
  </svg>`,

  street: `<svg viewBox="0 0 640 360" role="img" aria-label="City street scene">
    <rect width="640" height="360" fill="#d6e4ee"/>
    <rect x="0" y="60" width="150" height="200" fill="#9aa7b2"/>
    <rect x="160" y="30" width="130" height="230" fill="#8794a0"/>
    <rect x="300" y="76" width="140" height="184" fill="#a4b0bb"/>
    <rect x="450" y="46" width="190" height="214" fill="#8f9ca8"/>
    ${[0,1,2,3].map(r=>[0,1,2].map(i=>`<rect x="${18+i*46}" y="${76+r*46}" width="30" height="30" fill="#cfe0e8"/>`).join('')).join('')}
    ${[0,1,2,3,4].map(r=>[0,1,2].map(i=>`<rect x="${174+i*40}" y="${46+r*44}" width="26" height="28" fill="#cfe0e8"/>`).join('')).join('')}
    ${[0,1,2,3].map(r=>[0,1,2,3].map(i=>`<rect x="${464+i*44}" y="${62+r*46}" width="28" height="30" fill="#cfe0e8"/>`).join('')).join('')}
    <rect y="260" width="640" height="30" fill="#b9c2ca"/>
    <rect y="290" width="640" height="70" fill="#5c6771"/>
    <rect y="320" width="640" height="4" fill="#e8e2d0" stroke-dasharray="30 22"/>
    ${[0,1,2,3,4,5,6,7,8].map(i=>`<rect x="${20+i*72}" y="320" width="34" height="5" fill="#e8e2d0"/>`).join('')}
    ${person(120, 216, .95, '#b5543f', 'arms-fwd')}${person(210, 220, .9, '#4f7f8f', null)}
    ${person(500, 214, .95, '#7a6a9e', null)}
    <circle cx="356" cy="256" r="15" fill="none" stroke="#37474f" stroke-width="4"/>
    <circle cx="404" cy="256" r="15" fill="none" stroke="#37474f" stroke-width="4"/>
    <path d="M356 256 L380 232 L404 256 M380 232 L374 218" stroke="#37474f" stroke-width="4" fill="none"/>
    ${person(378, 196, .85, '#c9974f', null)}
    <text x="320" y="348" text-anchor="middle" font-family="system-ui" font-size="15" fill="#dfe6ec">CITY STREET</text>
  </svg>`,

  outdoormarket: `<svg viewBox="0 0 640 360" role="img" aria-label="Outdoor market scene">
    <rect width="640" height="360" fill="#dcecd8"/>
    <rect y="262" width="640" height="98" fill="#b8a88c"/>
    <path d="M40 130 L300 130 L300 108 L40 108 Z" fill="#c9553f"/>
    <path d="M40 130 L70 130 L70 108 L40 108 Z" fill="#e8e2d6"/>
    <path d="M100 130 L130 130 L130 108 L100 108 Z" fill="#e8e2d6"/>
    <path d="M160 130 L190 130 L190 108 L160 108 Z" fill="#e8e2d6"/>
    <path d="M220 130 L250 130 L250 108 L220 108 Z" fill="#e8e2d6"/>
    <rect x="46" y="130" width="7" height="80" fill="#8a7b6b"/><rect x="288" y="130" width="7" height="80" fill="#8a7b6b"/>
    <rect x="52" y="206" width="234" height="12" rx="3" fill="#8d6e52"/>
    ${[0,1,2,3].map(i=>`<rect x="${62+i*56}" y="180" width="44" height="26" rx="3" fill="#a8825e"/>`).join('')}
    ${[0,1,2,3].map(i=>[0,1,2].map(j=>`<circle cx="${74+i*56+j*16}" cy="176" r="7" fill="${['#d9704f','#e0b357','#6f9e78'][i%3]}"/>`).join('')).join('')}
    ${person(170, 150, 1.05, '#4f7f8f', 'arms-fwd')}
    ${person(360, 182, 1.1, '#8a5aa8', 'arm-up')}
    ${person(440, 186, 1, '#b5543f', null)}
    <path d="M520 120 L560 120 L582 200 L498 200 Z" fill="#c9974f" opacity=".55"/>
    ${person(540, 186, .95, '#5a8f6a', null)}
    <text x="320" y="338" text-anchor="middle" font-family="system-ui" font-size="15" fill="#6b5b48">OUTDOOR MARKET</text>
  </svg>`,

  lecture: `<svg viewBox="0 0 640 360" role="img" aria-label="Lecture hall scene">
    <rect width="640" height="360" fill="#e7e9ee"/>
    <rect y="286" width="640" height="74" fill="#c2c7d0"/>
    <rect x="180" y="34" width="330" height="176" rx="5" fill="#2b3a47"/>
    <rect x="204" y="60" width="200" height="12" rx="4" fill="#7fa8c9"/>
    <rect x="204" y="86" width="260" height="12" rx="4" fill="#5b7f9c"/>
    <rect x="204" y="112" width="150" height="12" rx="4" fill="#5b7f9c"/>
    <rect x="204" y="146" width="120" height="40" rx="4" fill="#4f7f8f"/>
    <rect x="340" y="146" width="124" height="40" rx="4" fill="#7a6a9e"/>
    ${person(98, 168, 1.25, '#37474f', 'arm-up')}
    <rect x="66" y="232" width="66" height="54" rx="4" fill="#8d6e52"/>
    ${[0,1,2,3,4].map(i=>`<g>${person(214+i*76, 250, .95, ['#b5543f','#4f7f8f','#c9974f','#5a8f6a','#7a6a9e'][i], null)}</g>`).join('')}
    ${[0,1,2,3,4].map(i=>`<rect x="${196+i*76}" y="292" width="46" height="8" rx="3" fill="#9aa3ae"/>`).join('')}
    <text x="320" y="344" text-anchor="middle" font-family="system-ui" font-size="15" fill="#5c6773">LECTURE HALL</text>
  </svg>`
};

/* ============================================================
   PART 1 — Read a Text Aloud  (준비 45초 / 답변 45초)
   ============================================================ */
const PART1 = [
  {
    id: 'p1-01', tone: '교통 안내',
    text: `Beginning next Monday, the Greenfield bus service will operate on a revised schedule. Buses to the downtown area will leave Central Station every twenty minutes from six in the morning until ten at night. Passengers should note that the stop on Pine Street will be temporarily closed because of road construction. Please use the nearby stop in front of City Hall instead. Updated maps and schedules are available on our website or at the customer service desk inside the station.`,
    model: `Beginning next MONDAY, / the GREENFIELD bus service / will operate on a revised SCHEDULE. ↘
BUSES to the DOWNTOWN area / will leave CENTRAL STATION / every TWENTY minutes / from SIX in the morning / until TEN at night. ↘
PASSENGERS should note / that the stop on PINE STREET / will be temporarily CLOSED / because of road construction. ↘
Please use the nearby stop / in front of CITY HALL instead. ↘
Updated MAPS and SCHEDULES / are available on our WEBSITE / or at the CUSTOMER SERVICE desk / inside the station. ↘`,
    focus: ['revised', 'passengers', 'temporarily', 'construction', 'updated'],
    tips: [
      '숫자가 네 번 나온다 — twenty, six, ten. 준비 시간에 이것부터 눈으로 찍어라.',
      '고유명사 3개(Greenfield, Pine Street, City Hall)는 가중치 최상. 여기서 뭉개면 정보 전달 실패다.',
      '`temporarily`는 4음절(tem-po-RAR-i-ly). 한국어 화자가 가장 많이 무너뜨리는 단어다.',
      '`Passengers`의 어말 -s, `revised`/`Updated`의 -ed를 살려라. 어미 탈락이 발음 점수를 깎는 1순위.',
      '문장이 다섯 개 전부 평서문이다. 다섯 번 모두 끝을 확실히 내려라(↘).'
    ],
    note: '안내·공지형. 침착하고 분명하게. 밝은 광고 톤이 아니다.'
  },
  {
    id: 'p1-02', tone: '매장 광고',
    text: `Thank you for visiting Harbor Home Market. This weekend, all kitchen appliances are fifteen percent off the regular price. Our newest coffee makers are compact, energy-efficient, and easy to clean. Would you prefer a silver model or a black one? Ask a sales associate for a free demonstration. Customers who spend more than one hundred dollars will also receive complimentary delivery within the city. This special offer ends Sunday, so stop by today and find the perfect appliance for your home.`,
    model: `Thank you for visiting HARBOR HOME MARKET. ↘
This WEEKEND, / all KITCHEN APPLIANCES / are FIFTEEN percent OFF / the regular PRICE. ↘
Our newest COFFEE MAKERS / are COMPACT ↗, ENERGY-EFFICIENT ↗, / and EASY to CLEAN. ↘
Would you prefer a SILVER model ↗ / or a BLACK one? ↘
Ask a SALES ASSOCIATE / for a FREE demonstration. ↘
Customers who spend / more than ONE HUNDRED DOLLARS / will also receive complimentary DELIVERY / within the city. ↘
This special offer ends SUNDAY, / so stop by TODAY / and find the perfect APPLIANCE / for your HOME. ↘`,
    focus: ['appliances', 'percent', 'efficient', 'associate', 'complimentary'],
    tips: [
      '광고문이다. 안내문보다 톤을 한 단계 밝게, 핵심어를 더 또렷하게.',
      '나열 구간 `compact ↗, energy-efficient ↗, and easy to clean ↘` — 앞은 올리고 마지막만 내린다. 세 개를 다 같은 높이로 읽으면 억양 점수가 깎인다.',
      '선택 의문문 `silver ↗ or black ↘` — 첫 선택지 올리고 마지막 내림. 둘 다 올리면 틀린 억양.',
      '`complimentary`(무료)를 `complementary`처럼 읽지 마라. com-pli-MEN-ta-ry.',
      '`appliances`가 두 번 나온다. 두 번 다 같은 품질로 읽어라.'
    ],
    note: '광고형. 밝게, 핵심어 강조. 나열과 선택 의문문이 동시에 나오는 억양 종합 문제.'
  },
  {
    id: 'p1-03', tone: '행사 안내',
    text: `Good afternoon, and welcome to the Lakeside Business Conference. Our first presentation will begin at nine thirty in the main auditorium. After the presentation, please join us in Room 204 for a networking session with local business owners. Lunch will be served in the garden café from noon until one thirty. Do you have a special dietary request? Please speak with a staff member at the registration desk. We hope you enjoy today's program and make many useful connections.`,
    model: `Good AFTERNOON, / and welcome to the LAKESIDE BUSINESS CONFERENCE. ↘
Our FIRST PRESENTATION / will begin at NINE THIRTY / in the main AUDITORIUM. ↘
After the presentation, / please JOIN us in ROOM TWO OH FOUR / for a NETWORKING session / with local BUSINESS OWNERS. ↘
LUNCH will be served / in the GARDEN CAFÉ / from NOON until ONE THIRTY. ↘
Do you have a special DIETARY request? ↗
Please speak with a STAFF MEMBER / at the REGISTRATION desk. ↘
We hope you enjoy today's PROGRAM / and make many useful CONNECTIONS. ↘`,
    focus: ['auditorium', 'networking', 'dietary', 'registration', 'connections'],
    tips: [
      '`Room 204`는 "two oh four"로 읽는다. "two hundred four"도 통하지만 안내 방송에서는 앞이 자연스럽다.',
      '시각이 세 번(nine thirty, noon, one thirty). 셋 다 정확히.',
      '`Do you have a special dietary request?` — 유일한 Yes/No 의문문. 여기만 올린다(↗). 나머지는 전부 내림.',
      '`dietary`는 DI-e-ta-ry. 첫 음절 강세.',
      '행사 진행 안내 톤 — 친절하고 자연스럽게. 뉴스처럼 딱딱하면 어색하다.'
    ],
    note: '방송·소개형. 시간·장소·순서 정보가 밀집. 문장 유형이 섞여 있어 억양 판별 연습에 좋다.'
  },
  {
    id: 'p1-04', tone: '역 안내방송',
    text: `Attention, passengers. The 8:30 train to Riverside will depart from Platform Six instead of Platform Four. Travelers who have already boarded should move to the new platform as soon as possible. We apologize for the last-minute change and appreciate your patience. Please note that the dining car will remain closed until the train reaches Fairview Station. Additional updates will be posted on the information screens throughout the terminal. If you have questions about your connection, a staff member at the ticket counter will be happy to assist you.`,
    model: `ATTENTION, PASSENGERS. ↘
The EIGHT THIRTY train to RIVERSIDE / will depart from PLATFORM SIX / instead of PLATFORM FOUR. ↘
TRAVELERS who have already BOARDED / should MOVE to the NEW PLATFORM / as soon as possible. ↘
We APOLOGIZE for the last-minute CHANGE / and appreciate your PATIENCE. ↘
Please note / that the DINING CAR will remain CLOSED / until the train reaches FAIRVIEW STATION. ↘
Additional UPDATES will be posted / on the INFORMATION SCREENS / throughout the terminal. ↘
If you have QUESTIONS about your CONNECTION, / a STAFF MEMBER at the TICKET COUNTER / will be happy to ASSIST you. ↘`,
    focus: ['passengers', 'boarded', 'apologize', 'patience', 'additional'],
    tips: [
      '`Platform Six instead of Platform Four` — 대조 구문. Six와 Four를 다른 단어보다 확실히 세게. 이 문장의 존재 이유가 그 대비다.',
      '`8:30`은 "eight thirty". 숫자를 건너뛰거나 얼버무리면 즉시 감점.',
      '`apologize`는 a-POL-o-gize. 두 번째 음절 강세.',
      '고유명사 3개(Riverside, Fairview Station, 그리고 Platform 번호)가 정보의 핵심이다.',
      '안내방송이므로 감정을 넣지 말고 처음부터 끝까지 같은 속도를 유지해라.'
    ],
    note: '전화·방송 안내형. 또렷하고 일정하게. 대조와 숫자가 살아야 한다.'
  },
  {
    id: 'p1-05', tone: '시설 홍보',
    text: `Welcome to the Greenwood Fitness Center. New members can enjoy a complimentary personal training session during their first week. To make an appointment, please speak with a staff member at the front desk or use our mobile application. Our facilities are open from five in the morning until eleven at night, seven days a week. The swimming pool, the indoor track, and the group exercise studio are included in every membership. Would you like to tour the building before you decide? A member of our team can show you around at any time during business hours.`,
    model: `Welcome to the GREENWOOD FITNESS CENTER. ↘
NEW MEMBERS can enjoy / a complimentary PERSONAL TRAINING session / during their FIRST WEEK. ↘
To make an APPOINTMENT, / please speak with a STAFF MEMBER / at the FRONT DESK / or use our MOBILE APPLICATION. ↘
Our FACILITIES are open / from FIVE in the morning / until ELEVEN at night, / SEVEN DAYS a week. ↘
The SWIMMING POOL ↗, / the INDOOR TRACK ↗, / and the GROUP EXERCISE STUDIO / are included in every MEMBERSHIP. ↘
Would you like to TOUR the building / before you DECIDE? ↗
A member of our TEAM can show you AROUND / at any time during BUSINESS HOURS. ↘`,
    focus: ['complimentary', 'appointment', 'facilities', 'application', 'membership'],
    tips: [
      '`a complimentary personal training session` — 6단어짜리 긴 명사구. 중간에서 끊으면 의미가 조각난다. 한 덩어리로 밀어라.',
      '`appointment`는 a-POINT-ment. 한국어 화자가 첫 음절에 강세를 주는 실수가 잦다.',
      '`facilities`는 fa-CIL-i-ties. 4음절 전부 살려라.',
      '3항목 나열 — pool ↗, track ↗, studio ↘. 마지막에서만 내린다.',
      '`Would you like to tour the building before you decide?` 는 Yes/No 의문문이다. 여기만 올려라(↗). 나머지는 전부 내림.',
      '홍보문이므로 첫 문장 `Welcome to...`를 밝게 시작해라. 여기서 톤이 결정된다.'
    ],
    note: '광고·홍보형. 긴 명사구, 나열 억양, Yes/No 의문문이 한 지문에 다 들어 있다.'
  },
  {
    id: 'p1-06', tone: '사내 공지',
    text: `Due to scheduled maintenance, the west parking garage will be closed this Saturday from seven A.M. until noon. Employees are encouraged to use the east entrance and allow extra time when arriving at the office. Vehicles left in the west garage overnight on Friday must be moved before six A.M. During the closure, the shuttle from the north lot will run every fifteen minutes. We appreciate your cooperation and will send a confirmation message once the garage reopens for regular use.`,
    model: `Due to scheduled MAINTENANCE, / the WEST PARKING GARAGE / will be CLOSED this SATURDAY / from SEVEN A.M. until NOON. ↘
EMPLOYEES are encouraged / to use the EAST ENTRANCE / and allow EXTRA TIME / when arriving at the office. ↘
VEHICLES left in the WEST GARAGE / overnight on FRIDAY / must be MOVED before SIX A.M. ↘
During the CLOSURE, / the SHUTTLE from the NORTH LOT / will run every FIFTEEN MINUTES. ↘
We appreciate your COOPERATION / and will send a CONFIRMATION message / once the garage REOPENS / for regular use. ↘`,
    focus: ['maintenance', 'garage', 'employees', 'cooperation', 'confirmation'],
    tips: [
      '방향어가 세 개다 — `west`, `east`, `north`. 셋 다 다른 단어보다 세게 읽어야 정보가 산다. 이 지문의 존재 이유가 그 대비다.',
      '`maintenance`는 MAIN-te-nance. 첫 음절 강세, 뒤는 약하게. "메인테넌스"처럼 균등하게 읽지 마라.',
      '`A.M.`은 두 글자를 또박또박. 얼버무리면 P.M.과 구분이 안 된다. 이 지문에 두 번 나온다.',
      '`cooperation`은 co-op-er-A-tion. 네 번째 음절 강세.',
      '사내 공지 톤 — 객관적이고 안정적으로. 사과문처럼 처지지 않게.'
    ],
    note: '공지형. 방향·시간 대비가 살아야 하는 지문.'
  },
  {
    id: 'p1-07', tone: '행사 광고',
    text: `Our annual food festival returns to Central Park next month, featuring dishes from more than twenty local restaurants. Visitors can also enjoy live music, cooking demonstrations, and activities for children. Admission is free, and the festival runs from Friday evening through Sunday afternoon. Because parking near the park is limited, we strongly recommend taking public transportation. Would you like to volunteer at one of the information booths? Applications are available on the city website until the thirtieth of this month.`,
    model: `Our ANNUAL FOOD FESTIVAL / returns to CENTRAL PARK next month, / featuring dishes / from more than TWENTY local RESTAURANTS. ↘
VISITORS can also enjoy / LIVE MUSIC ↗, / COOKING DEMONSTRATIONS ↗, / and ACTIVITIES for CHILDREN. ↘
ADMISSION is FREE, / and the festival runs / from FRIDAY EVENING / through SUNDAY AFTERNOON. ↘
Because PARKING near the park is LIMITED, / we strongly RECOMMEND / taking PUBLIC TRANSPORTATION. ↘
Would you like to VOLUNTEER / at one of the INFORMATION BOOTHS? ↗
APPLICATIONS are available on the CITY WEBSITE / until the THIRTIETH of this month. ↘`,
    focus: ['annual', 'featuring', 'demonstrations', 'admission', 'thirtieth'],
    tips: [
      '3항목 나열 — live music ↗, cooking demonstrations ↗, activities for children ↘. 마지막에서만 내려라.',
      '`demonstrations`는 dem-on-STRA-tions. 5음절이다. 준비 시간에 한 번 소리 내 봐라.',
      '`annual`은 AN-nu-al. `annual`을 `annually`로 바꿔 읽는 실수 주의 — 단어를 변형하면 감점이다.',
      '`through`와 `thirtieth`의 θ 발음. `true`, `tirtieth`가 되지 않게 혀끝을 치아 사이에. `thirtieth`는 θ가 두 번 들어간다.',
      '`Would you like to volunteer...?` 만 Yes/No 의문문이다. 여기만 ↗.',
      '축제 광고다. 밝게. 뉴스 톤으로 읽으면 부적절하다.'
    ],
    note: '광고형. 나열 억양이 채점 포인트로 직결되는 지문.'
  },
  {
    id: 'p1-08', tone: '고객 안내',
    text: `Customers who purchased a laptop between March first and March fifteenth may qualify for a free extended warranty. Please bring your receipt to any of our service locations before the end of this month. Our representatives will be happy to answer any questions about the program. Customers who bought their computers online should upload a copy of the invoice instead. The extended warranty covers repairs for an additional two years but does not include accidental damage. We appreciate your continued business and look forward to serving you again.`,
    model: `CUSTOMERS who purchased a LAPTOP / between MARCH FIRST and MARCH FIFTEENTH / may qualify for a FREE EXTENDED WARRANTY. ↘
Please bring your RECEIPT / to any of our SERVICE LOCATIONS / before the END of this MONTH. ↘
Our REPRESENTATIVES will be happy / to answer any QUESTIONS / about the program. ↘
CUSTOMERS who bought their computers ONLINE / should UPLOAD a copy of the INVOICE instead. ↘
The EXTENDED WARRANTY covers REPAIRS / for an additional TWO YEARS / but does NOT include ACCIDENTAL DAMAGE. ↘
We appreciate your continued BUSINESS / and look forward to SERVING you again. ↘`,
    focus: ['purchased', 'qualify', 'warranty', 'receipt', 'representatives'],
    tips: [
      '서수 두 개 — `March first`, `March fifteenth`. fifteenth의 -th 어말을 반드시 살려라. fifteen과 fifteenth는 다른 단어다.',
      '`receipt`의 p는 묵음. "리시트"다. "리셉트"로 읽으면 틀린다.',
      '`purchased`의 -ed는 /t/ 소리. "퍼처스드"가 아니라 "퍼처스트".',
      '`representatives`는 rep-re-SEN-ta-tives. 6음절 최장 단어. 준비 시간에 확보해라.',
      '`but does NOT include` — 부정어 not은 반드시 강세를 받는다. 여기서 뭉개면 의미가 정반대로 전달된다.',
      '첫 문장이 길다(주어절 + 조건 + 결과). 세 덩어리로 확실히 끊어야 청자가 따라온다.'
    ],
    note: '고객 안내형. 날짜·조건·행동 요청을 구분해서 전달하는 게 관건.'
  },
  {
    id: 'p1-09', tone: '지역 뉴스',
    text: `In local news, the Department of Public Transportation has finished making changes to the train service between Bridgeport and Milton. The project, which began in February, added twelve new stops and extended weekend hours. City officials say the improvements will reduce average travel times by about eighteen minutes. Residents who live near the northern route reported the largest benefit. A spokesperson announced that the department will review passenger feedback in December before planning the next phase of construction. The full report will be posted on the city website early next month.`,
    model: `In LOCAL NEWS, / the DEPARTMENT of PUBLIC TRANSPORTATION / has finished making CHANGES / to the TRAIN SERVICE / between BRIDGEPORT and MILTON. ↘
The PROJECT, / which began in FEBRUARY, / added TWELVE NEW STOPS / and extended WEEKEND HOURS. ↘
CITY OFFICIALS say / the IMPROVEMENTS will REDUCE / average TRAVEL TIMES / by about EIGHTEEN MINUTES. ↘
RESIDENTS who live near the NORTHERN ROUTE / reported the LARGEST BENEFIT. ↘
A SPOKESPERSON announced / that the department will REVIEW PASSENGER FEEDBACK in DECEMBER / before planning the NEXT PHASE of construction. ↘
The FULL REPORT will be POSTED / on the CITY WEBSITE / early next month. ↘`,
    focus: ['transportation', 'February', 'officials', 'residents', 'spokesperson'],
    tips: [
      '뉴스는 객관적이고 안정적인 톤이다. 광고처럼 밝게 읽으면 부적절하다.',
      '`the Department of Public Transportation` — 7음절짜리 긴 기관명. 중간에 끊지 말고 한 덩어리로 밀어라.',
      '숫자가 셋(twelve, eighteen, December). 준비 시간에 먼저 찍어라. 뉴스에서 숫자를 뭉개면 정보가 사라진다.',
      '`which began in February` 는 삽입절이다. 앞뒤를 끊고 살짝 낮게 읽어야 주절이 살아난다.',
      '`spokesperson`은 SPOKES-per-son. 첫 음절 강세.'
    ],
    note: '뉴스형. 기관명·숫자·날짜가 밀집. 삽입절 처리가 억양 점수를 가른다.'
  },
  {
    id: 'p1-10', tone: '일기예보',
    text: `And now for your weekend forecast. Saturday will begin with heavy fog along the coast, but conditions should improve by early afternoon. Temperatures will reach a high of seventy-three degrees with a light breeze from the southwest. Sunday looks considerably cooler, and there is a sixty percent chance of thunderstorms after four o'clock. If you are planning outdoor activities, Saturday afternoon is clearly the better choice. We will bring you updated conditions every hour throughout the weekend. Enjoy your Saturday, and please drive carefully on Sunday evening.`,
    model: `And now / for your WEEKEND FORECAST. ↘
SATURDAY will begin with HEAVY FOG / along the COAST, / but conditions should IMPROVE / by early AFTERNOON. ↘
TEMPERATURES will reach a HIGH / of SEVENTY-THREE DEGREES / with a LIGHT BREEZE / from the SOUTHWEST. ↘
SUNDAY looks considerably COOLER, / and there is a SIXTY PERCENT CHANCE / of THUNDERSTORMS / after FOUR O'CLOCK. ↘
If you are planning OUTDOOR ACTIVITIES, / SATURDAY AFTERNOON / is clearly the BETTER CHOICE. ↘
We will bring you UPDATED CONDITIONS / every HOUR / throughout the weekend. ↘
ENJOY your SATURDAY, / and please DRIVE CAREFULLY / on SUNDAY EVENING. ↘`,
    focus: ['forecast', 'temperatures', 'considerably', 'thunderstorms', 'southwest'],
    tips: [
      '숫자가 넷이다 — seventy-three, sixty, four, every hour. 일기예보의 정보는 사실상 전부 숫자다. 하나라도 뭉개면 실패.',
      '`Saturday` ↔ `Sunday` 대조가 지문의 뼈대다. 두 요일을 확실히 구분해서 세게 읽어라.',
      '`but conditions should improve` — but 앞에서 살짝 끊어라. 대조 신호를 청자에게 줘야 한다.',
      '`considerably`는 con-SID-er-a-bly. 5음절. 준비 시간에 소리 내 봐라.',
      '방송 톤 — 친절하지만 일정한 속도. 뉴스보다 약간 부드럽게.'
    ],
    note: '방송형. 숫자 밀도가 가장 높은 지문. 요일 대조와 수치 정확성이 채점 포인트.'
  },
  {
    id: 'p1-11', tone: '교통 방송',
    text: `Here is your afternoon traffic update. Drivers heading east on Highway Nine should expect significant delays near the Riverside exit, where crews are repairing a damaged bridge. Traffic is currently backed up for approximately three miles. We recommend using Route Twelve as an alternate path until the work is completed later this evening. Downtown streets are moving normally, although the parking area near the stadium is already full. Stay with us for another update in fifteen minutes. Until then, please drive safely and watch carefully for construction workers.`,
    model: `Here is your AFTERNOON TRAFFIC UPDATE. ↘
DRIVERS heading EAST on HIGHWAY NINE / should expect SIGNIFICANT DELAYS / near the RIVERSIDE EXIT, / where CREWS are REPAIRING a DAMAGED BRIDGE. ↘
TRAFFIC is currently BACKED UP / for approximately THREE MILES. ↘
We RECOMMEND using ROUTE TWELVE / as an ALTERNATE PATH / until the WORK is COMPLETED / later this evening. ↘
DOWNTOWN STREETS are moving NORMALLY, / although the PARKING AREA near the STADIUM / is already FULL. ↘
STAY with us / for another UPDATE / in FIFTEEN MINUTES. ↘
Until then, / please DRIVE SAFELY / and WATCH CAREFULLY for CONSTRUCTION WORKERS. ↘`,
    focus: ['significant', 'approximately', 'alternate', 'completed', 'normally'],
    tips: [
      '`approximately`는 a-PROX-i-mate-ly. 5음절, 두 번째 음절 강세. 교통방송 단골 단어다.',
      '도로 이름과 숫자가 붙어 다닌다 — Highway Nine, Route Twelve, three miles, fifteen minutes. 숫자를 놓치면 안내가 무의미해진다.',
      '`although the parking area ... is already full` — although 앞에서 끊어라. 앞 절과 반대되는 정보라는 신호다.',
      '`repairing`, `completed` 의 -ed/-ing 어미를 살려라. 시제가 정보의 일부다.',
      '교통방송은 또렷하고 일정하게. 다급하게 읽지 마라 — 오히려 안 들린다.'
    ],
    note: '방송형. 도로명+숫자 조합이 계속 나온다. 대조 접속사(although) 처리 연습.'
  },
  {
    id: 'p1-12', tone: '라디오 인터뷰 소개',
    text: `Good evening, and welcome back to Business Matters. I'm your host, Daniel Reyes. Our guest tonight is Doctor Amelia Fontaine, an economist who has spent the last decade studying small business growth in rural communities. Her recent book examines why some local companies expand successfully while others struggle to survive. Doctor Fontaine has advised three national organizations and teaches at Westbrook University. After the interview, we will take questions from listeners. Doctor Fontaine, thank you for joining us this evening.`,
    model: `GOOD EVENING, / and welcome back to BUSINESS MATTERS. ↘
I'm your HOST, / DANIEL REYES. ↘
Our GUEST TONIGHT / is DOCTOR AMELIA FONTAINE, / an ECONOMIST / who has spent the last DECADE / studying SMALL BUSINESS GROWTH / in RURAL COMMUNITIES. ↘
Her recent BOOK examines / why some LOCAL COMPANIES / expand SUCCESSFULLY / while others STRUGGLE to SURVIVE. ↘
DOCTOR FONTAINE has advised / THREE NATIONAL ORGANIZATIONS / and TEACHES at WESTBROOK UNIVERSITY. ↘
After the INTERVIEW, / we will take QUESTIONS from LISTENERS. ↘
DOCTOR FONTAINE, / thank you for JOINING us this evening. ↘`,
    focus: ['economist', 'decade', 'communities', 'successfully', 'organizations'],
    tips: [
      '고유명사가 다섯이다 — Business Matters, Daniel Reyes, Amelia Fontaine, Westbrook University. 인명은 특히 또박또박. 뭉개면 소개 자체가 실패다.',
      '세 번째 문장이 매우 길다(주어 + 동격 + 관계절). 최소 네 덩어리로 끊어야 청자가 따라온다. 여기가 이 지문의 승부처다.',
      '`while others struggle to survive` — while 앞에서 끊어라. 대조 구조가 살아야 한다.',
      '`economist`는 e-CON-o-mist. 두 번째 음절 강세. `economics`와 강세 위치가 다르다.',
      '방송 소개 톤 — 친절하고 자연스럽게. 게스트를 환영하는 느낌이 들려야 한다.'
    ],
    note: '방송·소개형. 인명·기관명 밀도 최상. 긴 동격·관계절 끊기 연습에 최적.'
  },
  {
    id: 'p1-13', tone: '전화 자동응답',
    text: `Thank you for calling Lakeview Medical Center. Your call is important to us. To schedule or change an appointment, press one. To speak with the billing department, press two. For prescription refills, press three. To hear our location and business hours, press four. If you know your party's extension, you may dial it at any time. For a medical emergency, please hang up and dial nine one one immediately. To repeat this menu, remain on the line. An operator will assist you shortly during regular business hours.`,
    model: `Thank you for calling / LAKEVIEW MEDICAL CENTER. ↘
Your CALL is IMPORTANT to us. ↘
To SCHEDULE or CHANGE an APPOINTMENT, / press ONE. ↘
To speak with the BILLING DEPARTMENT, / press TWO. ↘
For PRESCRIPTION REFILLS, / press THREE. ↘
To hear our LOCATION and BUSINESS HOURS, / press FOUR. ↘
If you know your party's EXTENSION, / you may DIAL it at any time. ↘
For a MEDICAL EMERGENCY, / please HANG UP / and dial NINE ONE ONE / IMMEDIATELY. ↘
To REPEAT this menu, / REMAIN on the line. ↘
An OPERATOR will ASSIST you SHORTLY / during REGULAR BUSINESS HOURS. ↘`,
    focus: ['appointment', 'prescription', 'extension', 'emergency', 'immediately'],
    tips: [
      '자동응답 메뉴는 **모든 문장이 같은 구조**다: `To 동사..., press 숫자.` 이 리듬을 일정하게 유지하는 게 핵심이다.',
      '숫자 one·two·three·four를 문장 끝에서 확실히 내려라(↘). 여기서 올리면 청자가 다음을 기다린다.',
      '각 항목 사이를 확실히 끊어라. 붙여 읽으면 메뉴가 하나로 뭉개진다.',
      '`nine one one`은 숫자 세 개를 따로. "나인 일레븐"이 아니다.',
      '`prescription`은 pre-SCRIP-tion. `immediately`는 im-ME-di-ate-ly, 5음절.',
      '기계 음성처럼 감정 없이, 일정한 속도로. 이 지문에서만은 단조로움이 정답이다.'
    ],
    note: '전화 안내형. 반복 구조의 리듬 유지와 숫자 종결 억양이 전부다.'
  },
  {
    id: 'p1-14', tone: '예약 확인 안내',
    text: `Hello, this message is for Ms. Cheryl Bennett. I'm calling from Northgate Dental to confirm your cleaning appointment on Tuesday, October seventh, at two fifteen in the afternoon. Please arrive about ten minutes early so that you can update your insurance information at the front desk. If you need to reschedule, kindly call us at least twenty-four hours in advance. Would you prefer a morning appointment instead? Just let us know when you return our call. Thank you, and have a wonderful day.`,
    model: `HELLO, / this message is for MS. CHERYL BENNETT. ↘
I'm calling from NORTHGATE DENTAL / to CONFIRM your CLEANING APPOINTMENT / on TUESDAY, OCTOBER SEVENTH, / at TWO FIFTEEN in the afternoon. ↘
Please ARRIVE about TEN MINUTES EARLY / so that you can UPDATE your INSURANCE INFORMATION / at the FRONT DESK. ↘
If you need to RESCHEDULE, / kindly CALL us / at least TWENTY-FOUR HOURS in advance. ↘
Would you prefer a MORNING APPOINTMENT instead? ↗
Just LET US KNOW / when you RETURN our call. ↘
THANK YOU, / and have a WONDERFUL DAY. ↘`,
    focus: ['appointment', 'insurance', 'reschedule', 'seventh', 'twenty-four'],
    tips: [
      '날짜·시각·기간이 전부 숫자다 — October seventh, two fifteen, ten minutes, twenty-four hours. 예약 안내에서 숫자는 곧 정보다.',
      '`seventh`의 -th 어미를 반드시 살려라. `seven`과 `seventh`는 다른 날이다.',
      '`Would you prefer a morning appointment instead?` — 유일한 Yes/No 의문문. 여기만 ↗.',
      '`insurance`는 in-SUR-ance. 두 번째 음절 강세. `reschedule`은 re-SCHED-ule.',
      '전화 메시지 톤 — 또렷하고 친절하게. 급하게 읽으면 정보 전달이 무너진다.'
    ],
    note: '전화 안내형. 날짜·시각 서수 정확성이 최우선. Yes/No 의문문 1개 포함.'
  },
  {
    id: 'p1-15', tone: '서비스 소개',
    text: `Are you tired of slow internet at home? Clearwave Communications is now offering fiber service in your neighborhood. Our basic plan includes speeds up to three hundred megabits per second for just forty-nine dollars a month. Installation is free for customers who sign a one-year agreement, and there are no hidden equipment fees. Our technicians are available seven days a week, including evenings. Visit our website or call our sales team today to check whether service is available at your address.`,
    model: `Are you TIRED of SLOW INTERNET at home? ↗
CLEARWAVE COMMUNICATIONS / is now offering FIBER SERVICE / in your NEIGHBORHOOD. ↘
Our BASIC PLAN includes SPEEDS / up to THREE HUNDRED MEGABITS per second / for just FORTY-NINE DOLLARS a month. ↘
INSTALLATION is FREE / for customers who sign a ONE-YEAR AGREEMENT, / and there are NO HIDDEN EQUIPMENT FEES. ↘
Our TECHNICIANS are AVAILABLE / SEVEN DAYS a week, / including EVENINGS. ↘
VISIT our WEBSITE / or CALL our SALES TEAM today / to check whether SERVICE is AVAILABLE / at your ADDRESS. ↘`,
    focus: ['communications', 'megabits', 'installation', 'equipment', 'technicians'],
    tips: [
      '첫 문장이 Yes/No 의문문이다. 반드시 올려라(↗). 광고의 후킹 장치이므로 여기서 톤이 결정된다.',
      '`no hidden equipment fees` — 부정어 no에 강세. 광고에서 "없다"는 것이 핵심 세일즈 포인트다.',
      '숫자 세 개(three hundred, forty-nine, one-year, seven days). 가격과 속도를 뭉개면 광고가 성립하지 않는다.',
      '`technicians`은 tech-NI-cians. `equipment`는 e-QUIP-ment — 첫 음절에 강세 주는 실수가 잦다.',
      '광고 톤 — 밝고 자신 있게. 핵심어(FREE, NO HIDDEN)를 특히 세게.'
    ],
    note: '광고형. Yes/No 의문문으로 시작하는 유형. 가격·속도 숫자와 부정어 강세가 핵심.'
  },
  {
    id: 'p1-16', tone: '시설 이용 안내',
    text: `Attention, library visitors. The third-floor reading room will be unavailable this week while new lighting is installed. Study carrels on the second floor remain open and can be reserved at the circulation desk. Please remember that food and beverages are not permitted in any reading area. Items borrowed before the fifteenth are due this Friday, and late fees will apply after that date. If you need assistance finding materials, our reference librarians are available until eight in the evening. Thank you for your patience while we improve the building.`,
    model: `ATTENTION, / LIBRARY VISITORS. ↘
The THIRD-FLOOR READING ROOM / will be UNAVAILABLE this week / while NEW LIGHTING is INSTALLED. ↘
STUDY CARRELS on the SECOND FLOOR / remain OPEN / and can be RESERVED / at the CIRCULATION DESK. ↘
Please REMEMBER / that FOOD and BEVERAGES / are NOT PERMITTED / in any READING AREA. ↘
ITEMS BORROWED before the FIFTEENTH / are DUE this FRIDAY, / and LATE FEES will APPLY / after that date. ↘
If you need ASSISTANCE finding MATERIALS, / our REFERENCE LIBRARIANS / are available until EIGHT in the evening. ↘
Thank you for your PATIENCE / while we IMPROVE the BUILDING. ↘`,
    focus: ['unavailable', 'circulation', 'beverages', 'permitted', 'librarians'],
    tips: [
      '층수 대조가 뼈대다 — `third-floor`는 닫힘, `second floor`는 열림. 두 숫자를 확실히 구분해라.',
      '`are NOT permitted` — 부정어 not에 강세. 금지 사항에서 not을 뭉개면 정반대로 들린다.',
      '`fifteenth`의 -th를 살려라. `fifteen`과 다른 단어다.',
      '`circulation`은 cir-cu-LA-tion. `librarians`는 li-BRAR-i-ans.',
      '시설 안내 톤 — 침착하고 분명하게. 규칙을 전달하는 것이므로 또렷함이 우선이다.'
    ],
    note: '공지·안내형. 층수 대조, 부정어 강세, 서수 어미가 한 지문에 모여 있다.'
  }
];

/* ============================================================
   PART 2 — Describe a Picture  (준비 45초 / 답변 30초)
   ============================================================ */
const PART2 = [
  {
    id: 'p2-01', scene: SCENE.cafe, label: '야외 카페',
    model: `This picture was taken at an outdoor café. In the center, a woman is working on a laptop at a table. Next to her, a man is holding a cup and looking at his phone. In the background, several people are sitting under large umbrellas. Overall, the café looks fairly busy.`,
    slots: ['장소', '중심인물 동작', '주변 인물', '배경 사물', '전체 분위기'],
    tips: [
      '첫 문장은 무조건 장소. `This picture was taken at ___.` 여기서 고민하면 30초가 날아간다.',
      '중심인물 2명의 동작을 현재진행형으로. `is working on`, `is holding` — 시제가 흔들리면 문법 점수가 깎인다.',
      '위치 표현을 최소 3개 쓴다: `in the center`, `next to her`, `in the background`.',
      '마지막 1문장은 전체 인상. `Overall, ... looks ___.` 로 마무리하면 30초가 깔끔하게 닫힌다.',
      '30초다. 옷 색깔 나열에 시간 쓰지 마라. 중심 동작을 놓치는 게 가장 큰 감점이다.'
    ],
    note: '장소 → 중심인물 → 주변 → 전체. 현재진행형과 위치 표현이 채점 대상.'
  },
  {
    id: 'p2-02', scene: SCENE.meeting, label: '회의실',
    model: `I can see three people in a meeting room. A woman on the left is pointing at a large screen, and the other two people are listening to her. There are some documents and laptops on the table. It looks like they are discussing a business project.`,
    slots: ['인원 수', '중심인물 동작', '나머지 인물', '테이블 위 사물', '추론'],
    tips: [
      '사람 수를 먼저 세라. `I can see three people in ___.` 숫자로 시작하면 구조가 잡힌다.',
      '확인 가능한 사실을 먼저, 추론은 마지막에 한 번만. `It looks like they are discussing ___.`',
      '`pointing at`, `listening to` — 전치사까지 정확히. 동사만 맞고 전치사가 틀리면 어색해진다.',
      '관계를 단정하지 마라. 상사·동료라고 확신할 근거가 없으면 `the other two people`이 안전하다.',
      '`There are ___ on the table.`은 한 번만 써라. 세 번 반복하면 어휘 점수가 깎인다.'
    ],
    note: '사실 우선, 추론은 마지막 1문장으로 제한.'
  },
  {
    id: 'p2-03', scene: SCENE.market, label: '슈퍼마켓',
    model: `This picture appears to have been taken in a supermarket. On the right, an employee is putting products on a shelf. A customer is pushing a shopping cart down the aisle. I can also see many items neatly arranged on the shelves. The store seems quiet at the moment.`,
    slots: ['장소', '직원 동작', '고객 동작', '진열 상태', '전체 분위기'],
    tips: [
      '`putting products on a shelf`, `pushing a shopping cart` — 이 두 표현이 이 사진의 정답 동사다.',
      '`aisle`은 "아일". s가 묵음이다.',
      '사람 두 명의 역할이 다르다(직원 vs 고객). 역할을 구분해서 말하면 묘사가 훨씬 구체적으로 들린다.',
      '`neatly arranged`처럼 부사 하나만 얹어도 어휘 범위 점수가 올라간다.',
      '`This picture appears to have been taken in ___.`은 고급 구문이다. 안정적으로 나오면 쓰고, 더듬으면 `This picture was taken in ___.`으로 낮춰라.'
    ],
    note: '역할이 다른 인물 2명 + 배경 사물. 동작 동사가 핵심.'
  },
  {
    id: 'p2-04', scene: SCENE.park, label: '공원',
    model: `This is a picture of a park. In the foreground, two children are playing with a ball on the grass. Behind them, an older couple is sitting on a bench. There are many trees in the background, and the weather seems pleasant. It looks like a relaxing weekend afternoon.`,
    slots: ['장소', '전경 인물', '후경 인물', '배경 사물', '날씨/분위기'],
    tips: [
      '전경 → 후경 구조가 가장 자연스럽다. `In the foreground` ... `Behind them` ... `in the background`.',
      '`playing with a ball` — `playing a ball`이 아니다. 전치사 with 필수.',
      '야외 사진에서는 날씨를 한마디 넣어라. `The weather seems pleasant.` 무료로 한 문장 확보된다.',
      '`an older couple`처럼 확신 없는 관계는 부드럽게. 확신하면 `a man and a woman`이 더 안전하다.',
      '30초를 다 쓰기 위한 안전 문장: `It looks like a relaxing weekend afternoon.` 시간이 남으면 붙여라.'
    ],
    note: '전경/후경 구조 연습용. 야외 사진의 날씨 문장이 시간 채우기에 유용.'
  },
  {
    id: 'p2-05', scene: SCENE.airport, label: '공항 체크인',
    model: `This picture was taken at an airport. Several travelers are standing in line with their luggage. A staff member behind the counter is talking to a passenger. Above the counter, I can see several information screens. The area looks crowded.`,
    slots: ['장소', '줄 선 사람들', '직원 동작', '위쪽 사물', '전체 분위기'],
    tips: [
      '`standing in line`, `behind the counter`, `above the counter` — 공간 어휘 세 개를 반드시 쓴다. 어휘 범위가 그대로 점수다.',
      '`luggage`는 불가산이다. `luggages`, `many luggage` 모두 틀린다. `their luggage`가 맞다.',
      '여러 명이 같은 동작을 하면 묶어서 처리해라. `Several travelers are standing in line.` 한 명씩 세면 30초가 부족하다.',
      '`crowded`로 분위기를 닫아라. 공항 사진의 기본 마무리다.',
      '화면·표지판 같은 배경 사물을 하나 언급하면 묘사가 입체적으로 들린다.'
    ],
    note: '공간 전치사 집중 연습. 불가산 명사 함정 주의.'
  },
  {
    id: 'p2-06', scene: SCENE.restaurant, label: '식당 내부',
    model: `This picture was taken inside a restaurant. In the center, two people are sitting across from each other at a round table. There are plates and glasses on the table between them. On the right, a waiter is holding a tray and walking toward another table. The lighting is warm, so the restaurant looks comfortable and relaxed.`,
    slots: ['장소', '중심 인물 2명', '테이블 위 사물', '직원 동작', '조명·분위기'],
    tips: [
      '`sitting across from each other` — 마주 앉은 상태를 한 번에 표현하는 구문이다. 통째로 외워 둬라.',
      '역할이 다른 인물이 둘이다(손님 vs 직원). 구분해서 말하면 묘사가 즉시 구체적으로 들린다.',
      '`a waiter is holding a tray` — 식당 사진의 정답 동사다. `serving`도 가능하다.',
      '식당·카페 사진은 조명이나 분위기를 한 문장 넣으면 30초가 자연스럽게 채워진다.',
      '메뉴에 무엇이 있는지 상상해서 말하지 마라. 사진에 없는 내용은 감점이다.'
    ],
    note: '실내 식당. 손님·직원 역할 구분과 위치 관계 표현이 핵심.'
  },
  {
    id: 'p2-07', scene: SCENE.library, label: '도서관 (1인 중심)',
    model: `This picture was taken in a library. In the center, a man is sitting at a wooden desk and reading a book. There is a laptop next to him on the desk. Behind him, I can see tall bookshelves filled with colorful books. The room looks quiet, and he seems to be concentrating on his work.`,
    slots: ['장소', '중심 인물 동작', '책상 위 사물', '배경 책장', '분위기·추론'],
    tips: [
      '**인물이 한 명뿐인 사진**이다. 사람이 적을수록 배경 사물과 분위기로 30초를 채워야 한다.',
      '한 명일 때 전략: 동작 → 주변 사물 → 배경 → 추론. 네 단계로 나눠라.',
      '`bookshelves filled with books` — 배경을 한 문장으로 처리하는 구문. `full of`도 가능하다.',
      '`he seems to be concentrating` — 추론은 seem/look을 써서 마지막에 한 번만.',
      '사람이 한 명이라고 15초 만에 끝내면 완결성 감점이다. 반드시 30초를 채워라.'
    ],
    note: '1인 중심 사진. 인물이 적을 때 배경·사물로 시간을 채우는 훈련.'
  },
  {
    id: 'p2-08', scene: SCENE.street, label: '도심 거리',
    model: `This picture shows a busy city street. On the left, two people are walking along the sidewalk. In the middle of the picture, a person is riding a bicycle on the road. Tall office buildings with many windows line both sides of the street. I can see a crosswalk painted on the road. It looks like a weekday in a large city.`,
    slots: ['장소', '보행자', '자전거 탄 사람', '건물', '도로 표시·추론'],
    tips: [
      '`walking along the sidewalk`, `riding a bicycle` — 거리 사진의 두 핵심 동사다.',
      '`tall office buildings line both sides of the street` — 건물을 한 문장에 묶어 처리해라. 하나씩 세면 시간이 없다.',
      '거리 사진은 위치 표현을 쓰기 가장 좋다: `on the left`, `in the middle`, `both sides`.',
      '`crosswalk`(횡단보도), `sidewalk`(인도) — 거리 사진 필수 어휘 두 개. 미리 준비해라.',
      '사람 수를 정확히 셀 수 없으면 `several people`로 처리해라. 틀린 숫자보다 낫다.'
    ],
    note: '야외 거리. 위치 표현 밀도가 가장 높은 유형. 건물 묶어 처리하는 연습.'
  },
  {
    id: 'p2-09', scene: SCENE.outdoormarket, label: '야외 시장',
    model: `This picture was taken at an outdoor market. On the left, a vendor is standing under a red and white striped awning. In front of him, there are wooden boxes filled with fresh fruit and vegetables. On the right, some customers are looking at the products. One of them is carrying a shopping bag. The weather seems sunny and the market looks lively.`,
    slots: ['장소', '상인 위치·동작', '진열된 상품', '고객 동작', '날씨·분위기'],
    tips: [
      '`vendor`(노점 상인)는 시장 사진의 핵심 단어다. 모르면 `seller`나 `a man selling fruit`로 대체해라.',
      '`awning`(차양)을 모르면 `a large red and white cover`처럼 풀어 말해라. 멈추는 것보다 낫다.',
      '`boxes filled with fresh fruit` — 상품 진열을 묶어 표현. 품목을 하나씩 나열하면 시간이 부족하다.',
      '야외 사진이므로 날씨를 반드시 한 문장. `The weather seems sunny.` 무료로 시간이 확보된다.',
      '`fruit`는 보통 불가산이다. `fruits`보다 `fresh fruit`가 안전하다.'
    ],
    note: '야외 시장. 어려운 명사(vendor, awning)를 못 떠올릴 때 풀어 말하는 훈련.'
  },
  {
    id: 'p2-10', scene: SCENE.lecture, label: '강연장',
    model: `This picture was taken in a lecture hall. On the left, a speaker is standing next to a podium and pointing at a large screen. The screen shows some text and two colored boxes. In front of the speaker, about five people are sitting in a row and facing the screen. It looks like a business presentation or a training session.`,
    slots: ['장소', '발표자 동작', '화면 내용', '청중', '상황 추론'],
    tips: [
      '`podium`(연단), `in a row`(한 줄로) — 강연 사진의 핵심 어휘.',
      '발표자와 청중은 **바라보는 방향이 반대**다. `facing the screen`으로 그 관계를 표현하면 묘사가 정확해진다.',
      '인원을 정확히 못 세면 `about five people`처럼 근사치로. `about`을 붙이면 안전하다.',
      '화면에 뭐라고 쓰여 있는지 읽으려 하지 마라. `shows some text`로 충분하다. 읽으려다 시간을 날린다.',
      '`It looks like a business presentation` — 상황 추론으로 마무리. 강연 사진의 표준 종결이다.'
    ],
    note: '실내 행사. 발표자↔청중 관계 표현과 근사치 인원 처리가 핵심.'
  }
];

/* ============================================================
   PART 3 — Respond to Questions  (준비 3초 / Q5·Q6 15초, Q7 30초)
   ============================================================ */
const PART3 = [
  {
    id: 'p3-01', topic: '온라인 음식 주문',
    intro: `Imagine that a marketing firm is doing research in your area. You have agreed to participate in a telephone interview about ordering food online.`,
    items: [
      {
        q: `How often do you order food online, and when do you usually do it?`, sec: 15,
        model: `I order food online about twice a week, usually on weekends. It's convenient because I don't have to spend time cooking.`,
        tips: ['빈도 + 시점 + 이유 = 15초의 완성형 구조.', '첫 3단어 안에 빈도를 말해라. `about twice a week` 먼저.', '사실일 필요 없다. 즉시 말할 수 있는 답을 골라라.']
      },
      {
        q: `What kind of food do you usually order?`, sec: 15,
        model: `I usually order Korean food, especially chicken or noodles. They are easy to share, and most restaurants near my home deliver very quickly.`,
        tips: ['종류를 즉답하고 예시 두 개를 붙여라.', '`especially`로 구체화하면 내용 완결성이 올라간다.', '15초에 문장 두 개면 충분하다. 세 개를 노리다 끊기지 마라.']
      },
      {
        q: `Would you recommend ordering food online to a friend who has never tried it? Why or why not?`, sec: 30,
        model: `Yes, I would definitely recommend it. The main reason is that it saves a lot of time, especially on busy weekdays. For example, when I work late, I can order dinner on my phone and it arrives in about thirty minutes. Also, most apps show reviews and photos, so it is easy to choose a good restaurant. For those reasons, I think it is worth trying.`,
        tips: ['30초 = 직답 → 이유 → 예시 → 마무리. 4블록을 다 채워라.', '예시가 없으면 이유가 추상적으로 들린다. `For example`을 반드시 넣어라.', '5초 안에 Yes/No를 확정해라. 망설이면 시간이 사라진다.']
      }
    ]
  },
  {
    id: 'p3-02', topic: '운동',
    intro: `Imagine that a fitness magazine is conducting a survey in your city. You have agreed to answer some questions about exercise.`,
    items: [
      {
        q: `What kind of exercise do you enjoy most?`, sec: 15,
        model: `I enjoy jogging the most. I usually jog near my apartment because it's free and I can exercise whenever I have time.`,
        tips: ['종류를 첫 문장에 즉시 제시.', '`because`로 이유를 붙이면 15초가 자연스럽게 채워진다.', '어려운 운동 이름을 고르지 마라. 쉬운 단어로 정확하게가 이긴다.']
      },
      {
        q: `When and where do you usually exercise?`, sec: 15,
        model: `I usually exercise in the early morning, around six thirty. I go to a park near my home because it's quiet at that time.`,
        tips: ['When과 Where 둘 다 물었다. 둘 다 답해야 완결성이 인정된다.', '한쪽만 답하고 끝내는 게 가장 흔한 감점이다.', '시각을 구체적으로 말하면 답이 훨씬 진짜처럼 들린다.']
      },
      {
        q: `What do you think are the biggest benefits of exercising regularly?`, sec: 30,
        model: `I think there are two main benefits. First, regular exercise improves physical health. It helps people control their weight and sleep better at night. Second, it reduces stress. For example, after I jog for thirty minutes, I feel much more relaxed and I can concentrate better at work. So I believe exercise is good for both the body and the mind.`,
        tips: ['`two main benefits` 로 예고하고 First/Second로 나눠라. 구조가 즉시 잡힌다.', '30초에 이유 2개 + 예시 1개가 표준 분량이다.', '마지막 문장으로 요약해 닫아라. 갑자기 끊기는 것보다 낫다.']
      }
    ]
  },
  {
    id: 'p3-03', topic: '교통수단',
    intro: `Imagine that a city research group is doing a study about transportation. You have agreed to participate in a telephone interview.`,
    items: [
      {
        q: `How do you usually get to work or school?`, sec: 15,
        model: `I usually take the subway to work. It takes about forty minutes, and it's much faster than driving during rush hour.`,
        tips: ['교통수단 → 소요시간 → 이유. 15초 표준 3요소.', '`take the subway`, `take the bus` — take를 쓴다. `ride`는 부자연스럽다.', '`rush hour` 같은 관용 표현 하나가 어휘 점수를 올린다.']
      },
      {
        q: `Has the traffic in your area gotten better or worse in the last few years?`, sec: 15,
        model: `I think it has gotten worse. More people have moved into my neighborhood, so the roads are much more crowded in the morning.`,
        tips: ['둘 중 하나를 즉시 고르고 이유를 붙여라. 중립은 답이 아니다.', '현재완료 `has gotten`을 질문에서 그대로 빌려 써라. 문법 사고를 줄여 준다.', '15초짜리는 문장 두 개로 끝내는 게 안전하다.']
      },
      {
        q: `Would you recommend using public transportation to visitors in your city? Why or why not?`, sec: 30,
        model: `Yes, definitely. I would recommend public transportation because it is inexpensive and convenient. For example, the subway connects most major tourist attractions, so visitors don't need to rent a car. Also, they can avoid traffic and parking problems, which can be really stressful in a big city. Overall, it's the easiest way to get around.`,
        tips: ['`Yes, definitely.` 로 2초 만에 입장 확정. 남은 28초를 내용에 써라.', '이유 2개(저렴 + 편리) → 예시 → 추가 이유. 30초가 딱 찬다.', '`which can be really stressful` 같은 관계절 하나가 문법 다양성 점수를 만든다.']
      }
    ]
  },
  {
    id: 'p3-04', topic: '앱 사용',
    intro: `Imagine that a technology company is conducting research about mobile applications. You have agreed to answer some questions.`,
    items: [
      {
        q: `How much time do you spend using apps on your phone each day?`, sec: 15,
        model: `I spend about two hours a day using apps on my phone. Most of that time is for messaging and checking the news.`,
        tips: ['시간을 숫자로 즉답. `about two hours a day`.', '무엇에 쓰는지 한 문장 덧붙이면 완결성이 생긴다.', '정확한 숫자일 필요 없다. 말하기 쉬운 숫자를 골라라.']
      },
      {
        q: `When you download a new app, what do you consider most important?`, sec: 15,
        model: `The most important thing for me is whether it is easy to use. I also check the reviews before downloading, because I don't want to waste storage space.`,
        tips: ['`The most important thing for me is ___.` 는 이 유형의 만능 첫 문장이다.', '이유를 `because`로 한 번 붙이면 15초가 채워진다.', '요소를 세 개 나열하지 마라. 15초에는 하나 + 이유가 맞다.']
      },
      {
        q: `Tell me about a useful app that you use regularly.`, sec: 30,
        model: `One useful app I use regularly is a calendar app. I use it to organize meetings, deadlines, and personal appointments. It sends me reminders, so I rarely forget important tasks. It is especially useful when I have a busy schedule, because I can see my whole week at a glance. I would say it's the app I depend on the most.`,
        tips: ['대상 → 용도 → 장점 → 상황 → 마무리. 30초 서술형의 표준 5단계.', '기능을 나열만 하지 말고 `so`, `because`로 연결해라. 응집성이 점수다.', '`at a glance` 같은 짧은 관용구 하나가 어휘 인상을 바꾼다.']
      }
    ]
  },
  {
    id: 'p3-05', topic: '공부 습관',
    intro: `Imagine that an education researcher is asking about study habits. You have agreed to participate in a telephone interview.`,
    items: [
      {
        q: `Where do you usually study when you have an important exam?`, sec: 15,
        model: `I usually study at a quiet library near my home. It helps me concentrate because there are fewer distractions there.`,
        tips: ['장소 + 이유. 두 문장이면 끝난다.', '`fewer distractions` — 가산명사에는 fewer. less는 틀린다.', '집이라고 답해도 전혀 문제없다. 이유가 명확하면 된다.']
      },
      {
        q: `Do you prefer studying alone or with other people?`, sec: 15,
        model: `I prefer studying alone. When I study by myself, I can control my own pace and focus on the parts I find difficult.`,
        tips: ['선택형은 즉시 한쪽. 양쪽을 다 말하면 완결성이 깎인다.', '`I prefer ___ because ___.` 골격을 자동화해 둬라.', '질문의 동명사 형태(studying)를 그대로 받아 써라.']
      },
      {
        q: `What advice would you give to someone who has trouble concentrating while studying?`, sec: 30,
        model: `I would give two pieces of advice. First, I would tell them to put their phone in another room. Notifications are the biggest distraction for most people. Second, I would suggest studying in short blocks, for example fifty minutes of study and a ten-minute break. When I started doing that, I could stay focused much longer. I think small changes like these make a real difference.`,
        tips: ['조언형은 `I would tell them to ___`, `I would suggest ___` 골격이 안전하다.', '조언 2개 + 각각의 근거. 하나만 말하면 30초가 남는다.', '`for example`로 숫자를 넣으면 조언이 구체적으로 들린다.']
      }
    ]
  },
  {
    id: 'p3-06', topic: '쇼핑',
    intro: `Imagine that a retail company is doing research in your area. You have agreed to participate in a telephone interview about shopping habits.`,
    items: [
      {
        q: `When was the last time you bought clothes, and where did you buy them?`, sec: 15,
        model: `The last time I bought clothes was about two weeks ago. I bought a jacket at a department store near my office.`,
        tips: ['과거 시제 질문이다. `bought`, `was`로 답해야 문법 점수가 지켜진다.', '시점 + 장소 둘 다 물었다. 둘 다 답해라.', '`about two weeks ago` — 정확할 필요 없다. 말하기 쉬운 시점을 골라라.']
      },
      {
        q: `Do you prefer shopping alone or with friends?`, sec: 15,
        model: `I prefer shopping alone. When I go by myself, I can take my time and decide without feeling rushed.`,
        tips: ['선택형은 즉시 한쪽. 양쪽을 다 말하면 완결성이 깎인다.', '`I prefer ___ because ___` 골격을 자동화해 둬라.', '질문의 동명사(shopping)를 그대로 받아 쓰면 문법 사고가 줄어든다.']
      },
      {
        q: `What do you think is the biggest disadvantage of shopping at large shopping malls?`, sec: 30,
        model: `I think the biggest disadvantage is that large malls are usually very crowded. On weekends, it can take twenty minutes just to find a parking space. Another problem is that the stores are spread out over several floors, so you have to walk a long way to compare prices. For example, last month I visited a mall to buy shoes and I ended up spending almost three hours there. That is why I usually shop online instead.`,
        tips: ['단점을 물었으면 단점만 말해라. 장점을 섞으면 관련성 점수가 깎인다.', '단점 2개 + 예시 1개가 30초 표준 분량이다.', '숫자가 들어간 예시(`twenty minutes`, `three hours`)가 가장 강력하다.']
      }
    ]
  },
  {
    id: 'p3-07', topic: '여행',
    intro: `Imagine that a travel magazine is conducting a survey. You have agreed to answer some questions about travel.`,
    items: [
      {
        q: `How often do you travel, and who do you usually travel with?`, sec: 15,
        model: `I travel about twice a year, usually during my summer and winter vacations. I normally travel with two or three close friends.`,
        tips: ['빈도 + 동행자. 두 질문이므로 둘 다 답해야 한다.', '`about twice a year` 로 시작하면 구조가 바로 잡힌다.', '15초에 문장 두 개면 충분하다.']
      },
      {
        q: `Would you rather stay at a hotel or rent an apartment when you travel?`, sec: 15,
        model: `I would rather stay at a hotel. I like having breakfast included and someone cleaning the room, so I can relax instead of doing housework.`,
        tips: ['`Would you rather A or B?` 는 선택 의문문이다. `I would rather ___` 로 그대로 받아라.', '이유 하나만 붙이면 15초가 채워진다. 두 개 노리다 끊기지 마라.', '`having breakfast included` 같은 구체적 이유가 추상적 이유보다 낫다.']
      },
      {
        q: `What advice would you give to someone visiting your country for the first time?`, sec: 30,
        model: `I would give two pieces of advice. First, I would tell them to use public transportation instead of renting a car. The subway system is fast, cheap, and easy to understand even if you don't speak the language. Second, I would recommend visiting during spring or autumn. The weather is much more comfortable than in summer, and there are many festivals during those seasons. I think those two things would make the trip much more enjoyable.`,
        tips: ['조언형은 `I would tell them to ___`, `I would recommend ___` 골격.', '조언 2개 + 각각의 근거. 30초를 채우는 표준 구조다.', '나라 이름을 말할 필요 없다. `my country`로 충분하다 — 시간을 아껴라.']
      }
    ]
  },
  {
    id: 'p3-08', topic: '여가 생활',
    intro: `Imagine that a research group is doing a study about free time. You have agreed to participate in a telephone interview.`,
    items: [
      {
        q: `What do you usually do in your free time on weekends?`, sec: 15,
        model: `On weekends I usually watch movies at home or meet friends for coffee. It helps me relax after a busy week at work.`,
        tips: ['활동 1~2개 + 이유. 15초 표준 구조.', '어려운 취미를 고르지 마라. 말하기 쉬운 것이 이긴다.', '`after a busy week` 같은 짧은 부사구가 답을 자연스럽게 만든다.']
      },
      {
        q: `Do you prefer watching movies at home or in a movie theater?`, sec: 15,
        model: `I prefer watching movies at home. It is much cheaper, and I can pause the movie whenever I want to take a break.`,
        tips: ['선택 즉시 확정. 이유 하나면 충분하다.', '`much cheaper`처럼 비교급을 쓰면 문법 다양성이 확보된다.', '질문의 표현(watching movies)을 그대로 재사용해라.']
      },
      {
        q: `Do you think people today have enough free time? Why or why not?`, sec: 30,
        model: `No, I don't think most people have enough free time. The main reason is that working hours are still very long in many companies. A lot of my friends work late and only get home around nine at night. Even on weekends, they often have to catch up on housework or family responsibilities. For example, one of my colleagues says he only has about four free hours a week. So I believe people need more time to rest and enjoy their lives.`,
        tips: ['Yes/No를 5초 안에 확정해라. 망설이면 30초가 사라진다.', '`No, I don\'t think ___` 로 시작하면 입장이 명확해진다.', '이유 → 근거 → 예시 → 결론. 30초 4블록을 다 채워라.']
      }
    ]
  },
  {
    id: 'p3-09', topic: '직장 생활',
    intro: `Imagine that a human resources consultant is conducting a survey about work. You have agreed to participate in a telephone interview.`,
    items: [
      {
        q: `How do you usually communicate with your colleagues at work?`, sec: 15,
        model: `I usually communicate with my colleagues through a messaging app. For quick questions it is much faster than sending an email.`,
        tips: ['수단 + 이유. 두 문장이면 끝난다.', '`through a messaging app`, `by email` — 전치사를 정확히.', '학생이라면 `at school`로 바꿔 답해도 전혀 문제없다.']
      },
      {
        q: `Would you prefer to work in a large company or a small company?`, sec: 15,
        model: `I would prefer to work in a small company. In a smaller team, I can take on more responsibility and see the results of my work directly.`,
        tips: ['선택형은 한쪽만. 중립은 답이 아니다.', '`take on responsibility`, `see the results` 같은 직장 어휘를 준비해 둬라.', '비교급 `smaller`로 대비를 만들면 이유가 선명해진다.']
      },
      {
        q: `What do you think is the most important quality for a good manager?`, sec: 30,
        model: `I think the most important quality is good communication. A manager needs to explain goals clearly so that everyone knows what to do. When instructions are unclear, team members waste a lot of time doing the wrong work. I also think a good manager should listen to feedback from the team. For example, my previous manager held a short meeting every Monday just to hear our concerns, and it made the whole team much more motivated.`,
        tips: ['`The most important quality is ___` 로 즉시 답을 확정해라.', '자질 하나를 깊게 파는 게 여러 개 나열하는 것보다 낫다.', '`For example, my previous manager...` — 개인 경험이 가장 빠르게 구체성을 만든다.']
      }
    ]
  },
  {
    id: 'p3-10', topic: '카페·외식',
    intro: `Imagine that a food service company is doing market research in your area. You have agreed to answer some questions about restaurants and cafés.`,
    items: [
      {
        q: `How often do you go to cafés, and what do you usually order?`, sec: 15,
        model: `I go to cafés about three times a week. I usually order an iced americano because it is simple and not too sweet.`,
        tips: ['빈도 + 주문 항목. 둘 다 답해라.', '음료 이름은 쉬운 것으로. 발음이 어려운 메뉴를 고르지 마라.', '이유를 한 조각 붙이면 15초가 자연스럽게 찬다.']
      },
      {
        q: `When you choose a restaurant, what is the most important factor?`, sec: 15,
        model: `The most important factor for me is the taste of the food. I also check online reviews before I go, because I don't want to waste money on a bad meal.`,
        tips: ['`The most important factor for me is ___` 는 이 유형의 만능 첫 문장이다.', '요소 하나 + 이유. 세 개 나열하면 15초에 못 끝낸다.', '`because`로 이유를 연결해라.']
      },
      {
        q: `Do you think eating out is becoming more popular in your country? Why or why not?`, sec: 30,
        model: `Yes, I definitely think eating out is becoming more popular. The main reason is that more people live alone now, and cooking for one person is not very efficient. Also, delivery apps have made it extremely easy to order restaurant food at any time. For example, in my neighborhood three new restaurants opened just last year, and they are always busy in the evening. So I think this trend will continue for a while.`,
        tips: ['`Yes, I definitely think ___` 로 2초 만에 입장 확정.', '이유 2개 + 예시. 사회 현상 질문의 표준 구조다.', '`this trend will continue` 같은 마무리 문장으로 닫으면 완결성이 올라간다.']
      }
    ]
  }
];

/* ============================================================
   PART 4 — Respond Using Information Provided
   (자료 45초 → 각 문항 준비 3초 / Q8·Q9 15초, Q10 30초·질문 2회)
   ============================================================ */
const PART4 = [
  {
    id: 'p4-01', title: 'Digital Marketing Workshop',
    intro: `Imagine that you are attending a workshop. You have asked the organizer for information about the schedule.`,
    material: {
      heading: 'Digital Marketing Workshop',
      sub: 'Saturday, June 14 · Riverside Convention Center',
      rows: [
        ['9:00 A.M.', 'Registration and Coffee', 'Lobby'],
        ['9:30 A.M.', 'Opening Remarks — Ms. Karen Doyle', 'Hall A'],
        ['10:00 A.M.', 'Social Media Trends', 'Hall A'],
        ['11:30 A.M.', 'Customer Service Online', 'Hall B'],
        ['12:30 P.M.', 'Lunch', 'Garden Café'],
        ['2:00 P.M.', 'Résumé Writing Session', 'Room 204'],
        ['3:00 P.M.', 'Interview Skills', 'Room 204'],
        ['4:00 P.M.', 'Networking Reception', 'Lobby']
      ],
      footer: 'Registration fee — General $80 / Students $50'
    },
    items: [
      {
        q: `When does the workshop begin, and how much is the registration fee for students?`, sec: 15,
        model: `The workshop begins at nine A.M. on Saturday, June fourteenth, and the registration fee for students is fifty dollars.`,
        tips: [
          '질문이 두 개다(When + How much). 둘 다 답해야 완결성이 인정된다. 한쪽만 답하는 게 최다 감점이다.',
          '서수 `fourteenth`를 정확히. `fourteen`으로 읽으면 오답이다.',
          '15초짜리에 서론을 붙이지 마라. 바로 정보로 들어가라.'
        ]
      },
      {
        q: `I heard the social media session starts at eleven thirty. Is that correct?`, sec: 15,
        model: `No, actually that's not correct. The social media session starts at ten A.M. in Hall A. The eleven thirty session is about customer service online, in Hall B.`,
        tips: ['**잘못된 전제 정정형.** `No, actually...` 로 즉시 부정하는 게 핵심이다.', '틀렸다고만 하면 부족하다. 올바른 정보 + 혼동의 원인까지 말해야 완결이다.', '질문에 끌려 `Yes`라고 답하는 게 이 유형 최대의 함정이다.']
      },
      {
        q: `Could you tell me all the activities that are scheduled after lunch?`, sec: 30, repeat: true,
        model: `Sure. There are three activities scheduled after lunch. First, a résumé-writing session begins at two P.M. in Room 204. Then, an interview-skills session starts at three P.M., also in Room 204. Finally, there's a networking reception at four P.M. in the lobby.`,
        tips: ['**개수를 먼저 말해라.** `There are three activities...` 청자가 구조를 즉시 잡는다.', 'First / Then / Finally 로 시간순 배열. 순서어가 응집성 점수다.', '항목 하나만 말하고 끝내는 게 Q10 최다 실수. 세 개를 다 말해라.', '질문은 두 번 재생된다. 처음엔 조건만 잡고, 두 번째에 세부를 확인해라.']
      }
    ]
  },
  {
    id: 'p4-02', title: 'Flight Schedule',
    intro: `Imagine that you work at a travel agency. A client has called for information about flights.`,
    material: {
      heading: 'Flights to Portland — Tuesday, October 8',
      sub: 'Northline Airways · All times local',
      rows: [
        ['Flight 721', '8:20 A.M.', 'Nonstop', '$210'],
        ['Flight 804', '10:45 A.M.', 'Nonstop', '$185'],
        ['Flight 915', '1:30 P.M.', '1 stop — Denver', '$140'],
        ['Flight 1102', '4:15 P.M.', 'Nonstop', '$230'],
        ['Flight 1240', '7:50 P.M.', '1 stop — Salt Lake City', '$155']
      ],
      footer: 'Checked bag $35 · Seat selection included on nonstop flights'
    },
    items: [
      {
        q: `What time does Flight 804 leave, and how much does it cost?`, sec: 15,
        model: `Flight 804 leaves at ten forty-five A.M., and it costs one hundred eighty-five dollars.`,
        tips: ['시각과 금액 둘 다. 하나만 답하면 완결성 감점.', '`10:45`는 "ten forty-five". 숫자 읽기를 미리 연습해 둬라.', 'A.M./P.M.을 절대 빼먹지 마라. 이 자료는 오전·오후가 섞여 있다.']
      },
      {
        q: `I'd like a cheap flight. Is the cheapest one nonstop?`, sec: 15,
        model: `No, it isn't. The cheapest flight is Flight 915 at one hundred forty dollars, but it has one stop in Denver. The cheapest nonstop flight is Flight 804 at one hundred eighty-five dollars.`,
        tips: ['정정형이다. `No, it isn\'t.` 로 시작해라.', '두 개의 값을 비교해야 답이 완성된다. 표를 세로로 훑는 습관을 들여라.', '15초는 짧다. 군더더기 없이 숫자 위주로.']
      },
      {
        q: `I need to arrive in Portland before noon. What are my options?`, sec: 30, repeat: true,
        model: `You have two options before noon. First, Flight 721 departs at eight twenty A.M. It's a nonstop flight and it costs two hundred ten dollars. Second, Flight 804 departs at ten forty-five A.M. It's also nonstop, and it's cheaper at one hundred eighty-five dollars. Both include seat selection, so I'd recommend Flight 804 if you want to save money.`,
        tips: ['**조건 필터링이 핵심.** 정오 이전 항목만 골라라. 전부 읽으면 오답이다.', '개수 예고 → 항목별 세부 → 추천. 30초에 딱 맞는 구조.', '조건에 맞지 않는 항목을 하나라도 넣으면 정확성 감점이다.']
      }
    ]
  },
  {
    id: 'p4-03', title: 'Community Center Classes',
    intro: `Imagine that you are a staff member at a community center. A resident has called to ask about the class schedule.`,
    material: {
      heading: 'Fall Class Schedule — Maple Community Center',
      sub: 'Session runs September 2 – November 25',
      rows: [
        ['Beginner Spanish', 'Mon / Wed', '6:00 – 7:30 P.M.', '$120'],
        ['Digital Photography', 'Tuesday', '7:00 – 9:00 P.M.', '$95'],
        ['Yoga for Beginners', 'Tue / Thu', '6:30 – 7:30 P.M.', '$80'],
        ['Cooking Basics', 'Thursday', '6:00 – 8:00 P.M.', '$140'],
        ['Watercolor Painting', 'Saturday', '10:00 A.M. – 12:00 P.M.', '$110']
      ],
      footer: 'Members receive a 20% discount · Materials not included'
    },
    items: [
      {
        q: `When does the fall session start and end?`, sec: 15,
        model: `The fall session runs from September second through November twenty-fifth.`,
        tips: ['서수 두 개 — second, twenty-fifth. 여기가 유일한 실패 지점이다.', '짧은 답이면 한 문장으로 끝내고 침묵해도 된다. 억지로 늘리지 마라.', '`from ___ through ___` 구문을 통째로 외워 둬라.']
      },
      {
        q: `How much is the cooking class, and when does it meet?`, sec: 15,
        model: `The cooking basics class is one hundred forty dollars, and it meets on Thursdays from six to eight P.M.`,
        tips: ['금액 + 요일 + 시간대. 세 정보를 한 문장에 담아라.', '요일은 복수형 `on Thursdays`가 정기 수업에 자연스럽다.', '`from six to eight` — 시간 범위 표현을 자동화해라.']
      },
      {
        q: `I can only come on Tuesdays. Which classes could I take?`, sec: 30, repeat: true,
        model: `On Tuesdays, you have two options. The first one is Digital Photography, which meets on Tuesday evenings from seven to nine P.M. and costs ninety-five dollars. The second is Yoga for Beginners, which meets on Tuesdays and Thursdays from six thirty to seven thirty P.M., and it costs eighty dollars. If you're a member, you'll also get a twenty percent discount on either class.`,
        tips: ['화요일이 포함된 행만 골라라. `Tue / Thu` 도 화요일 포함이다 — 놓치기 쉽다.', '`which meets on ___` 관계절로 항목을 설명하면 문법 다양성이 확보된다.', '남는 시간에 각주(할인)를 언급하면 완결성이 올라간다.']
      }
    ]
  },
  {
    id: 'p4-04', title: 'Regional Sales Conference',
    intro: `Imagine that you are an organizer of a conference. A participant has called you for information about the program.`,
    material: {
      heading: 'Regional Sales Conference — Day 1',
      sub: 'Thursday, May 21 · Hotel Brightwater, Ballroom B',
      rows: [
        ['8:30 A.M.', 'Welcome Breakfast', 'Ms. Diane Ortega'],
        ['9:15 A.M.', 'Keynote: Market Outlook', 'Mr. Victor Hale'],
        ['10:45 A.M.', 'Panel: Customer Retention', 'Four regional directors'],
        ['12:00 P.M.', 'Lunch Break', '—'],
        ['1:30 P.M.', 'Workshop: Negotiation Skills', 'Ms. Priya Raman'],
        ['3:00 P.M.', 'Workshop: Digital Tools', 'Mr. Victor Hale'],
        ['4:30 P.M.', 'Closing Remarks', 'Ms. Diane Ortega']
      ],
      footer: 'All sessions held in Ballroom B unless otherwise announced'
    },
    items: [
      {
        q: `What time does the conference start, and who is giving the welcome breakfast?`, sec: 15,
        model: `The conference starts at eight thirty A.M., and Ms. Diane Ortega is giving the welcome breakfast.`,
        tips: ['시각 + 인명. 둘 다 답해야 완결이다.', '인명은 또박또박. 뭉개면 정보가 사라진다.', '15초에 서론을 붙이지 마라. 바로 정보로.']
      },
      {
        q: `I understand Ms. Raman is leading both of the afternoon workshops. Is that right?`, sec: 15,
        model: `No, that's not correct. Ms. Raman is leading only the negotiation skills workshop at one thirty. The digital tools workshop at three o'clock is led by Mr. Victor Hale.`,
        tips: ['**잘못된 전제 정정형.** `No, that\'s not correct.` 로 즉시 부정해라.', '틀렸다고만 하면 부족하다. 올바른 정보 + 혼동의 원인까지.', '질문에 끌려 `Yes`라고 답하는 게 이 유형 최대의 함정이다.']
      },
      {
        q: `Could you tell me everything Mr. Victor Hale is involved in during the day?`, sec: 30, repeat: true,
        model: `Certainly. Mr. Victor Hale is involved in two sessions. First, he is giving the keynote presentation on the market outlook at nine fifteen in the morning. Then, in the afternoon, he is leading the workshop on digital tools, which starts at three o'clock. Both sessions will be held in Ballroom B.`,
        tips: ['**같은 이름이 들어간 행만** 골라라. 조건 필터링이 이 문항의 전부다.', '개수를 먼저 말해라 — `two sessions`. 청자가 구조를 즉시 잡는다.', '항목 하나만 말하고 끝내는 게 Q10 최다 실수다.', '질문은 두 번 재생된다. 처음엔 조건(누구), 두 번째에 세부를 확인해라.']
      }
    ]
  },
  {
    id: 'p4-05', title: 'City Tour Itinerary',
    intro: `Imagine that you work for a travel agency. A customer has called to ask about a tour schedule.`,
    material: {
      heading: 'Riverside City Day Tour',
      sub: 'Departs daily from Grand Plaza Hotel · $65 per person',
      rows: [
        ['9:00 A.M.', 'Depart from hotel lobby', 'Bus'],
        ['9:45 A.M.', 'Old Town Walking Tour', '90 minutes'],
        ['11:30 A.M.', 'Riverside Museum', '60 minutes'],
        ['12:45 P.M.', 'Lunch at Harbor Market', 'Not included'],
        ['2:15 P.M.', 'Botanical Garden', '75 minutes'],
        ['4:00 P.M.', 'Return to hotel', 'Bus']
      ],
      footer: 'Museum admission included · Lunch at your own expense'
    },
    items: [
      {
        q: `Where does the tour depart from, and how much does it cost?`, sec: 15,
        model: `The tour departs from the Grand Plaza Hotel lobby at nine A.M., and it costs sixty-five dollars per person.`,
        tips: ['장소 + 금액. 둘 다 물었으니 둘 다 답해라.', '`sixty-five dollars per person` — per person을 빼먹지 마라.', '출발 시각까지 넣으면 15초가 자연스럽게 찬다.']
      },
      {
        q: `I heard that lunch is included in the tour price. Is that correct?`, sec: 15,
        model: `No, actually that's not correct. Lunch at Harbor Market is at your own expense. However, the admission to the Riverside Museum is included in the price.`,
        tips: ['정정형이다. `No, actually...` 로 시작해라.', '각주(footer)에 정답이 있다. 45초 동안 표 아래까지 반드시 읽어라.', '틀린 정보를 바로잡은 뒤, 포함되는 것을 알려주면 완결성이 올라간다.']
      },
      {
        q: `I only have time until one o'clock. What parts of the tour can I join?`, sec: 30, repeat: true,
        model: `If you only have time until one o'clock, you can join three parts of the tour. First, the bus departs from the hotel lobby at nine A.M. Then, there is a ninety-minute walking tour of the Old Town starting at nine forty-five. After that, you can visit the Riverside Museum at eleven thirty for about an hour. You would need to leave before the lunch stop at twelve forty-five.`,
        tips: ['**시간 조건 필터링.** 1시 이전 항목만. 오후 일정을 넣으면 정확성 감점이다.', '개수 예고 → 시간순 배열 → 조건 확인. 30초 표준 구조.', '경계선 항목(12:45 점심)을 어떻게 처리할지 미리 정해라.']
      }
    ]
  },
  {
    id: 'p4-06', title: 'Interview Schedule',
    intro: `Imagine that you work in a human resources department. A manager has called you for information about today's interviews.`,
    material: {
      heading: "Interview Schedule — Marketing Assistant",
      sub: 'Wednesday, August 12 · Room 305',
      rows: [
        ['10:00 A.M.', 'Laura Kim', 'Phone interview'],
        ['11:00 A.M.', 'Daniel Boyd', 'In person'],
        ['1:00 P.M.', 'Sofia Marquez', 'In person'],
        ['2:00 P.M.', 'Ethan Wright', 'Video call'],
        ['3:30 P.M.', 'Hannah Lee', 'In person']
      ],
      footer: 'Each interview lasts 45 minutes · Panel: Mr. Choi and Ms. Delgado'
    },
    items: [
      {
        q: `Who is the first candidate, and how long does each interview last?`, sec: 15,
        model: `The first candidate is Laura Kim at ten A.M., and each interview lasts forty-five minutes.`,
        tips: ['인명 + 소요 시간. 소요 시간은 각주에 있다.', '`forty-five minutes` — 각주를 안 읽으면 답할 수 없는 문항이다.', '45초 자료 읽기 때 표 아래 각주까지 훑는 습관을 만들어라.']
      },
      {
        q: `I think all of the interviews are being held in person. Is that right?`, sec: 15,
        model: `No, that isn't right. Only three of them are in person. Laura Kim's interview is a phone interview, and Ethan Wright's is a video call.`,
        tips: ['정정형이다. 예외를 정확히 집어내야 한다.', '`Only three of them are in person` — 숫자로 먼저 정리하면 답이 깔끔해진다.', '예외가 두 개다. 하나만 말하면 완결성 감점.']
      },
      {
        q: `Could you tell me all the candidates scheduled in the afternoon?`, sec: 30, repeat: true,
        model: `Sure. There are three candidates scheduled in the afternoon. First, Sofia Marquez has an in-person interview at one P.M. Next, Ethan Wright has a video call at two P.M. Finally, Hannah Lee has an in-person interview at three thirty P.M. All of them will meet with Mr. Choi and Ms. Delgado in Room 305.`,
        tips: ['오후(P.M.) 항목만. 오전 두 명을 넣으면 정확성 감점이다.', '개수 먼저 → First / Next / Finally 로 시간순.', '남는 시간에 각주(면접관, 장소)를 덧붙이면 완결성이 올라간다.']
      }
    ]
  },
  {
    id: 'p4-07', title: 'Equipment Rental Rates',
    intro: `Imagine that you work at an equipment rental shop. A customer has called to ask about your rates.`,
    material: {
      heading: 'Lakeside Outdoor Rentals — Daily Rates',
      sub: 'Open 7 A.M. – 6 P.M. · Reservations recommended',
      rows: [
        ['Mountain bike', '$25 / day', 'Helmet included'],
        ['Kayak (single)', '$40 / day', 'Life jacket included'],
        ['Kayak (double)', '$60 / day', 'Life jackets included'],
        ['Camping tent (4-person)', '$35 / day', 'Setup not included'],
        ['Fishing gear set', '$20 / day', 'License required']
      ],
      footer: 'Weekly rental: 20% discount · Deposit of $50 required for all rentals'
    },
    items: [
      {
        q: `How much does it cost to rent a mountain bike for one day?`, sec: 15,
        model: `A mountain bike costs twenty-five dollars per day, and a helmet is included in that price.`,
        tips: ['단일 정보 찾기. 값 하나가 정답이다.', '15초가 남으면 비고란(helmet included)을 한 줄 덧붙여라.', '`per day`를 빼먹지 마라. 일일 요금이라는 게 정보의 일부다.']
      },
      {
        q: `I was told that a life jacket costs extra with the kayak. Is that correct?`, sec: 15,
        model: `No, that's not correct. Life jackets are included with both the single and the double kayak at no extra charge. However, a fifty-dollar deposit is required for all rentals.`,
        tips: ['정정형. `at no extra charge`로 확실히 부정해라.', '두 종류(single, double) 모두 포함이다. 하나만 말하면 불완전하다.', '실제로 추가로 드는 비용(보증금)을 알려주면 답이 완결된다.']
      },
      {
        q: `My budget is thirty dollars a day. What can I rent?`, sec: 30, repeat: true,
        model: `With a budget of thirty dollars a day, you have two options. The first one is a mountain bike, which costs twenty-five dollars per day and comes with a helmet. The second option is a fishing gear set for twenty dollars a day, but please note that you need a fishing license for that. Also, if you rent for a full week, you would receive a twenty percent discount.`,
        tips: ['**가격 조건 필터링.** 30달러 이하 항목만. 35달러 텐트를 넣으면 오답이다.', '개수 예고 → 항목별 가격·조건 → 각주. 30초가 딱 찬다.', '조건이 붙은 항목(license required)은 그 조건까지 말해야 완결이다.']
      }
    ]
  }
];

/* ============================================================
   PART 5 (Q11) — Express an Opinion  (준비 45초 / 답변 60초)
   ============================================================ */
const PART5 = [
  {
    id: 'p5-01',
    q: `Do you think employees should be allowed to work from home several days a week? Give reasons or examples to support your opinion.`,
    model: `Yes, I think employees should be allowed to work from home several days a week. The main reason is that it can save a significant amount of commuting time. For example, one of my friends spends almost two hours traveling to and from work every day. When he works from home, he can use that time to finish his tasks and rest. Also, many employees can concentrate better in a quiet environment, without constant interruptions from colleagues. Of course, some jobs require face-to-face collaboration, but a few days a week would not cause serious problems. Therefore, I think a flexible work-from-home policy can improve both productivity and job satisfaction.`,
    outline: ['입장 (5초)', '이유 1 (15초)', '구체적 예시 (15초)', '이유 2 (15초)', '결론 (10초)'],
    tips: [
      '첫 문장에서 입장을 확정해라. 60초 중 5초 안에.',
      '예시는 실화일 필요 없다. `one of my friends...` 가 가장 빠르게 구체성을 만드는 장치다.',
      '`Of course, ... but ...` 양보 구문 하나가 문법 다양성 점수를 만든다. 단 입장은 절대 흔들지 마라.',
      '50초 지점에서 `Therefore` 로 결론에 진입해라. 시간이 끊겨도 답이 완성된 것처럼 들린다.',
      '메모는 영어 키워드 4~5개면 충분하다: `YES / commute / friend 2hrs / focus / satisfaction`'
    ]
  },
  {
    id: 'p5-02',
    q: `Which is more important when choosing a job: a high salary or opportunities to learn new skills? Give reasons or examples to support your opinion.`,
    model: `I believe opportunities to learn new skills are more important. First, new skills can lead to better career opportunities in the future. For instance, learning data analysis or communication skills may help an employee qualify for a promotion or a higher-paying job later. Second, learning keeps work interesting. When people do the same tasks for years, they often lose motivation, but learning something new helps them stay engaged. A high salary is certainly attractive, and I understand why many people choose it. However, salaries can change, while skills stay with you for your whole career. For these reasons, I think long-term professional growth is more valuable than a high starting salary.`,
    outline: ['선택 확정 (5초)', '이유 1 + 예시 (20초)', '이유 2 (15초)', '반대편 인정 후 반박 (12초)', '결론 (8초)'],
    tips: [
      '**선택형 최대 함정: 양쪽을 오가다 입장이 사라지는 것.** 첫 문장에서 하나를 고르고 끝까지 유지해라.',
      '반대편을 인정하는 문장(`A high salary is certainly attractive`)은 넣되, 반드시 `However`로 되받아라.',
      '`skills stay with you for your whole career` 처럼 대비를 만드는 한 문장이 답변의 격을 올린다.',
      'First / Second 로 이유를 번호 매겨라. 60초에서 구조가 사라지는 걸 막아 준다.',
      '메모: `SKILLS / promotion / data analysis / motivation / salary changes`'
    ]
  },
  {
    id: 'p5-03',
    q: `Do you agree that universities should require students to participate in team projects? Give reasons or examples to support your opinion.`,
    model: `Yes, I agree that universities should require team projects. Team projects teach students how to communicate and cooperate with different types of people. This is important because most employees have to work with colleagues after graduation, and those skills are difficult to learn from textbooks. In addition, students can learn from one another's strengths. For example, one student may be good at research while another is good at presentations, and by combining their skills they can produce much better results. I know that some students dislike group work because of unequal participation, but professors can solve this by grading individual contributions. Overall, I think the benefits clearly outweigh the problems.`,
    outline: ['동의 확정 (5초)', '이유 1 + 근거 (18초)', '이유 2 + 예시 (18초)', '반론 처리 (12초)', '결론 (7초)'],
    tips: [
      '일반적인 이유를 반드시 직장·경험으로 구체화해라. 추상적인 이유만 두 개면 점수가 안 오른다.',
      '반론을 예상하고 처리하는 문장(`I know that some students dislike...`)이 5점권의 특징이다.',
      '`outweigh` 같은 단어 하나로 어휘 인상이 바뀐다. 하나만 준비해 가라.',
      '예시의 대비 구조: `one student may be good at A while another is good at B`. 이 틀은 어떤 주제에도 쓰인다.',
      '메모: `AGREE / communicate / after graduation / strengths / research vs presentation`'
    ]
  },
  {
    id: 'p5-04',
    q: `Some people prefer to shop online, while others prefer to shop in physical stores. Which do you prefer, and why? Give reasons or examples to support your opinion.`,
    model: `I prefer shopping online. The biggest reason is convenience. I can compare prices from many different stores in just a few minutes, without leaving my home. For example, when I bought a laptop last year, I checked five websites and found the same model almost two hundred dollars cheaper. That would have taken an entire day if I had visited the stores in person. Another reason is that online reviews help me make better decisions, because I can see what other customers experienced. I admit that you cannot touch the product before buying, and that can be a problem for clothes. Still, most websites now offer free returns, so I think online shopping is the better choice for me.`,
    outline: ['선호 확정 (5초)', '이유 1 (12초)', '구체적 예시 + 숫자 (18초)', '이유 2 (13초)', '양보 + 결론 (12초)'],
    tips: [
      '숫자가 들어간 예시가 가장 강력하다. `two hundred dollars cheaper`, `five websites`.',
      '`That would have taken an entire day if I had...` — 가정법을 안정적으로 쓸 수 있으면 여기서 쓰고, 아니면 쓰지 마라. 무너지면 오히려 손해다.',
      '`I admit that...` 로 약점을 인정한 뒤 `Still,`로 되받는 구조를 외워 둬라.',
      '개인 취향 문제이므로 진짜 자기 경험을 쓰는 게 가장 빠르다. 지어내면 60초를 못 버틴다.',
      '메모: `ONLINE / compare prices / laptop $200 / reviews / returns`'
    ]
  },
  {
    id: 'p5-05',
    q: `Do online courses provide the same educational value as traditional classroom courses? Give reasons or examples to support your opinion.`,
    model: `I don't think online courses always provide the same value as traditional classes. Although online courses are convenient and often cheaper, students usually have fewer opportunities to interact directly with teachers and classmates. In a classroom, students can ask follow-up questions immediately and join discussions naturally. For example, when I studied statistics, I understood difficult concepts much better after discussing them with other students right after class. In an online course, I would have had to send an email and wait for a reply. Another issue is self-discipline, because many people start online courses but never finish them. Therefore, I prefer traditional classes for subjects that require a lot of interaction, even though online courses work well for simple skills.`,
    outline: ['입장 확정 (6초)', '양보 + 주된 이유 (16초)', '예시 (18초)', '이유 2 (12초)', '조건부 결론 (8초)'],
    tips: [
      '`Although ___, ___` 로 시작하면 첫 문장부터 문법 다양성이 확보된다.',
      '완전 부정보다 조건부 결론(`for subjects that require a lot of interaction`)이 훨씬 세련되게 들린다.',
      '`fewer opportunities` — 가산명사에 fewer. less로 쓰면 문법 감점.',
      '예시에 과목명(statistics)처럼 구체적 명사를 넣어라. 신뢰도가 즉시 올라간다.',
      '메모: `NOT SAME / interaction / statistics discussion / self-discipline / depends on subject`'
    ]
  },
  {
    id: 'p5-06',
    q: `Some people prefer to live in a large city, while others prefer to live in a small town. Which do you prefer, and why? Give reasons or examples to support your opinion.`,
    model: `I prefer to live in a large city. The main reason is that cities offer far more job opportunities. In my field, almost all of the major companies have their offices in the capital, so living there makes it much easier to build a career. Another reason is convenience. In a large city, I can reach a hospital, a shopping center, or a train station within about fifteen minutes. For example, when I lived in a small town, I had to drive nearly an hour just to see a specialist. I understand that small towns are quieter and less expensive, but for my stage of life, the opportunities in a city matter more.`,
    outline: ['선호 확정 (5초)', '이유 1 직업 (15초)', '이유 2 편의성 + 예시 (20초)', '양보 (12초)', '결론 (8초)'],
    tips: [
      '선호형은 첫 문장에서 확정. 60초 중 5초 안에.',
      '`for my stage of life` 처럼 조건을 붙인 결론이 단정적 결론보다 세련되게 들린다.',
      '양보 문장(`I understand that small towns are quieter`)은 반드시 `but`으로 되받아라. 입장이 흔들리면 안 된다.',
      '숫자가 들어간 예시(`fifteen minutes`, `nearly an hour`)가 가장 강력하다.',
      '메모: `CITY / jobs / capital offices / convenience 15min / small town 1hr doctor`'
    ]
  },
  {
    id: 'p5-07',
    q: `Do you think companies should pay for their employees' job-related training? Give reasons or examples to support your opinion.`,
    model: `Yes, I strongly believe companies should pay for job-related training. First, the company itself benefits the most from the training. When employees learn new skills, they work more efficiently and make fewer mistakes, so the money comes back to the company. Second, paying for training helps companies keep good employees. People are much more likely to stay at a company that invests in their future. For example, a friend of mine turned down a higher salary elsewhere because her company paid for a professional certification. Some managers worry that trained employees will simply leave, but I think the risk of not training them is much greater. For these reasons, I believe training costs should be the company's responsibility.`,
    outline: ['입장 확정 (5초)', '이유 1 회사 이익 (15초)', '이유 2 인재 유지 + 예시 (20초)', '반론 처리 (12초)', '결론 (8초)'],
    tips: [
      '정책 찬반형이다. `Yes, I strongly believe ___` 로 즉시 확정해라.',
      '반론을 예상하고 처리하는 문장(`Some managers worry that...`)이 5점권의 특징이다.',
      '`the risk of not training them is much greater` — 반론을 뒤집는 한 문장을 준비해 두면 어떤 주제에도 쓸 수 있다.',
      'First / Second 로 이유를 번호 매겨라. 60초에서 구조가 사라지는 걸 막아 준다.',
      '메모: `YES / company benefits / retention / friend certification / risk of not training`'
    ]
  },
  {
    id: 'p5-08',
    q: `What do you think is the most effective way to learn a foreign language? Give reasons or examples to support your opinion.`,
    model: `I think the most effective way to learn a foreign language is to use it every day in real situations. The main reason is that grammar rules are easy to forget if you never apply them. When you actually speak with someone, you remember the expressions much longer because they are connected to a real experience. For example, I studied English grammar for years in school, but my speaking improved the most during three months when I talked with a language partner twice a week. Reading and listening are also important, of course, because they give you the vocabulary you need. But without regular speaking practice, that knowledge stays passive. That is why I believe daily use is the most effective method.`,
    outline: ['방법 확정 (7초)', '이유 (15초)', '개인 경험 예시 (20초)', '보완 요소 인정 (10초)', '결론 (8초)'],
    tips: [
      '"가장 효과적인 방법" 유형은 **하나만** 고르고 깊게 파라. 세 개 나열하면 60초에 다 못 채운다.',
      '`the most effective way to ___ is to ___` 골격을 통째로 자동화해 둬라.',
      '개인 경험 예시가 가장 빠르게 구체성을 만든다. 실화일 필요는 없다.',
      '`stays passive` 같은 짧은 대비 표현 하나가 답변의 격을 올린다.',
      '메모: `DAILY USE / forget grammar / language partner 3 months / reading passive`'
    ]
  },
  {
    id: 'p5-09',
    q: `Do you agree or disagree with the following statement? Social media has a positive effect on people's lives. Give reasons or examples to support your opinion.`,
    model: `I disagree with that statement, at least for most people. The main reason is that social media encourages constant comparison. People post only their best moments, so others feel that their own lives are boring or unsuccessful. This can seriously affect confidence, especially among younger users. Another problem is the amount of time it takes. For example, I once checked my phone settings and realized I was spending almost three hours a day scrolling, which is time I could have used for exercise or reading. I do admit that social media helps people stay in touch with friends who live far away. Still, when I consider the overall effect on attention and mental health, I think the negative side is stronger.`,
    outline: ['입장 확정 (6초)', '이유 1 비교 심리 (16초)', '이유 2 시간 + 예시 (18초)', '양보 (12초)', '결론 (8초)'],
    tips: [
      '`I disagree with that statement, at least for most people.` — 범위를 살짝 좁힌 입장이 더 방어하기 쉽다.',
      '찬반형은 **한쪽만** 유지해라. 양쪽을 오가면 입장 불명확으로 감점이다.',
      '`I do admit that ___. Still, ___` 양보 구조를 외워 둬라. 어떤 찬반 주제에도 쓰인다.',
      '`three hours a day` 처럼 자기 데이터를 넣으면 예시가 살아난다.',
      '메모: `DISAGREE / comparison / best moments only / 3hrs scrolling / but keeps in touch`'
    ]
  },
  {
    id: 'p5-10',
    q: `Some people think students should start working right after high school. Others think they should go to university first. Which do you think is better? Give reasons or examples to support your opinion.`,
    model: `I think going to university first is generally the better choice. The main reason is that a university degree still opens more doors in the job market. Many companies in my country will not even consider applicants without one, no matter how motivated they are. Second, university gives students time to figure out what they actually want to do. Most eighteen-year-olds do not know their real interests yet. For example, my cousin entered university planning to study law, but she discovered design in her second year and now works happily in that field. I know that university is expensive and that some people succeed without it, but for most students I think the long-term advantages are worth the cost.`,
    outline: ['선택 확정 (6초)', '이유 1 취업 (16초)', '이유 2 진로 탐색 + 예시 (20초)', '양보 (10초)', '결론 (8초)'],
    tips: [
      '선택형 최대 함정: 양쪽을 오가다 입장이 사라지는 것. 첫 문장에서 하나 고르고 끝까지 유지.',
      '`generally` 를 붙이면 예외를 인정하면서도 입장은 유지된다. 방어력이 올라가는 부사다.',
      '`no matter how motivated they are` 같은 양보절 하나가 문법 다양성 점수를 만든다.',
      '예시는 3인칭(`my cousin`)이 가장 빠르다. 실화일 필요 없다.',
      '메모: `UNIVERSITY / degree opens doors / find interests / cousin law to design / expensive but worth`'
    ]
  }
];

/* ============================================================
   출처 메타데이터
   이 앱의 모든 문항·지문·사진·음원은 자체 제작이다.
   ETS / 한국TOEIC위원회의 공식 문항·사진·음원은 복제해 넣지 않는다.
   공식 자료는 아래 OFFICIAL 의 외부 링크로만 제공한다.
   ============================================================ */
const SOURCE_META = {
  sourceType: 'original',
  sourceName: '자체 제작',
  license: 'owned',
  audioType: 'tts-browser',       // 질문·지시문은 브라우저 SpeechSynthesis 로 생성
  examFormatVerifiedAt: '2026-08-25'
};

/* 공식 자료 — 링크로만 연결한다. 앱 내부 문제 데이터로 변환하지 않는다. */
const OFFICIAL = {
  warning: 'ETS 문항은 저작권으로 보호되며 사전 허락 없는 복제·재사용이 금지된다. 아래는 공식 사이트로 이동하는 링크일 뿐, 이 앱은 공식 문항·사진·음원을 저장하거나 재생하지 않는다.',
  groups: [
    {
      title: '공식 기출문제 Test 01–11',
      desc: '한국TOEIC위원회가 제공하는 현행 형식 인터랙티브 테스트. 사진·정보표·질문 음원이 모두 포함된다. 실전 감각 점검에 가장 가깝다.',
      links: Array.from({ length: 11 }, (_, i) => {
        const n = String(i + 1).padStart(2, '0');
        return { label: `Test ${n}`, url: `https://www.toeicswt.co.kr/content/TOS/sample/Speaking${n}/testSpeDirection.php` };
      })
    },
    {
      title: '수준별 샘플 답변',
      desc: '같은 문항에 대한 고급·중급·초급 답변을 비교 청취할 수 있다. **내 녹음을 들은 직후에 여기서 고급 답변을 들어라.** 차이가 가장 선명하게 들리는 순간이다.',
      links: [
        { label: '공식 샘플 문제와 수준별 응답 음원', url: 'https://www.toeicswt.co.kr/content/TOS/sample.php' }
      ]
    },
    {
      title: '실제기출 공개영상 — 10차 (2025년 하반기)',
      desc: '가장 최신 공개분. 현행 PART 1–5 문제와 음원, 수험자 답변, 강사 해설을 함께 볼 수 있다.',
      links: [
        { label: 'PART 1 · Q1–2 지문 읽기', url: 'https://www.youtube.com/watch?v=Fmredj5j8_Q' },
        { label: 'PART 2 · Q3–4 사진 묘사', url: 'https://www.youtube.com/watch?v=G6UnQ2tDmi4' },
        { label: 'PART 3 · Q5–7 질문에 답하기', url: 'https://www.youtube.com/watch?v=vpouFT1sgus' },
        { label: 'PART 4 · Q8–10 제공된 정보로 답하기', url: 'https://www.youtube.com/watch?v=BRgBpDkJAnc' },
        { label: 'PART 5 · Q11 의견 제시', url: 'https://www.youtube.com/watch?v=kl0-ABvlKso' }
      ]
    },
    {
      title: '실제기출 공개영상 — 9차',
      desc: '현행 형식.',
      links: [
        { label: 'PART 1 · Q1–2', url: 'https://www.youtube.com/watch?v=AfG90U2fw1c' },
        { label: 'PART 2 · Q3–4', url: 'https://www.youtube.com/watch?v=xrfSUI_uAZo' },
        { label: 'PART 3 · Q5–7', url: 'https://www.youtube.com/watch?v=yVga70Vdfcs' },
        { label: 'PART 4 · Q8–10', url: 'https://www.youtube.com/watch?v=DySoyv83AMg' },
        { label: 'PART 5 · Q11', url: 'https://www.youtube.com/watch?v=hLrBIIgbDFI' }
      ]
    },
    {
      title: '실제기출 공개영상 — 8차',
      desc: '현행 형식.',
      links: [
        { label: 'PART 1 · Q1–2', url: 'https://www.youtube.com/watch?v=sL0hyWKYYfo' },
        { label: 'PART 2 · Q3–4', url: 'https://www.youtube.com/watch?v=SSjJFQTjzO4' },
        { label: 'PART 3 · Q5–7', url: 'https://www.youtube.com/watch?v=-bsuTgRwYe0' },
        { label: 'PART 4 · Q8–10', url: 'https://www.youtube.com/watch?v=cleMyKMXoOs' },
        { label: 'PART 5 · Q11', url: 'https://www.youtube.com/watch?v=0ZHFyVdqznA' }
      ]
    },
    {
      title: 'ETS 공식 PDF',
      desc: '문항 구조와 채점 근거 확인용. 독립된 문제 음원 파일은 제공되지 않는다.',
      links: [
        { label: 'Sample Tests — 현행 문항 구조와 공식 샘플 1세트', url: 'https://www.ets.org/content/dam/ets-org/pdfs/toeic/toeic-speaking-writing-sample-tests.pdf' },
        { label: 'Examinee Handbook — 문항별 진행 방식과 전체 채점표', url: 'https://www.ets.org/content/dam/ets-org/pdfs/toeic/toeic-speaking-writing-examinee-handbook.pdf' },
        { label: 'Score User Guide — 점수 해석과 평가 체계', url: 'https://www.ets.org/pdfs/toeic/toeic-speaking-writing-score-user-guide.pdf' }
      ]
    },
    {
      title: '시험 정보',
      desc: '형식·점수 체계 확인.',
      links: [
        { label: 'ETS — 시험 구성', url: 'https://www.ets.org/toeic/about/speaking-writing.html' },
        { label: '한국TOEIC위원회 — 기출문제 목록', url: 'https://www.toeicswt.co.kr/content/TOS/official.php' },
        { label: '한국TOEIC위원회 — 실제기출 공개영상 전체', url: 'https://www.toeicswt.co.kr/content/common/realQuestion.php?examCate=TOS' },
        { label: '한국TOEIC위원회 — 점수와 레벨', url: 'https://www.toeicswt.co.kr/common/template/viewContents.php?contentsCode=78' }
      ]
    }
  ]
};

/* ============================================================
   메타
   ============================================================ */
const PARTS = {
  1: { no: 1, name: 'Read a Text Aloud', ko: '문장 읽기', qs: 'Q1–2', prep: 45, resp: 45,
       criteria: ['발음', '억양·강세'], max: 3,
       directions: `In this part of the test, you will read aloud the text on the screen. You will have 45 seconds to prepare. Then you will have 45 seconds to read the text aloud.` },
  2: { no: 2, name: 'Describe a Picture', ko: '사진 묘사', qs: 'Q3–4', prep: 45, resp: 30,
       criteria: ['발음', '억양·강세', '문법', '어휘', '일관성'], max: 3,
       directions: `In this part of the test, you will describe the picture on your screen in as much detail as you can. You will have 45 seconds to prepare your response. Then you will have 30 seconds to speak about the picture.` },
  3: { no: 3, name: 'Respond to Questions', ko: '질문에 답하기', qs: 'Q5–7', prep: 3, resp: 15,
       criteria: ['발음', '억양·강세', '문법', '어휘', '일관성', '내용 관련성', '내용 완결성'], max: 3,
       directions: `In this part of the test, you will answer three questions. You will have three seconds to prepare after you hear each question. You will have 15 seconds to respond to Questions 5 and 6, and 30 seconds to respond to Question 7.` },
  4: { no: 4, name: 'Respond Using Information Provided', ko: '제공 정보 활용', qs: 'Q8–10', prep: 3, resp: 15,
       criteria: ['발음', '억양·강세', '문법', '어휘', '일관성', '내용 관련성', '내용 완결성'], max: 3,
       directions: `In this part of the test, you will answer three questions based on the information provided. You will have 45 seconds to read the information before the questions begin. You will have three seconds to prepare after you hear each question. You will have 15 seconds to respond to Questions 8 and 9, and 30 seconds to respond to Question 10.` },
  5: { no: 5, name: 'Express an Opinion', ko: '의견 제시', qs: 'Q11', prep: 45, resp: 60,
       criteria: ['발음', '억양·강세', '문법', '어휘', '일관성', '내용 관련성', '내용 완결성'], max: 5,
       directions: `In this part of the test, you will give your opinion about a specific topic. Be sure to say as much as you can in the time allowed. You will have 45 seconds to prepare. Then you will have 60 seconds to speak.` },
};

/* 자가 채점표 — 학습자료 11장 기반, 파트별로 다르게 */
const SELF_CHECK = {
  1: ['단어를 빠뜨리거나 바꾸지 않았다', '핵심 단어와 어미가 알아듣기 쉬웠다', '의미 단위로 자연스럽게 멈췄다',
      '내용어에 적절한 강세를 주었다', '문장 끝의 상승·하강 억양이 적절했다', '제한 시간 안에 안정적인 속도로 완독했다'],
  2: ['장소를 첫 문장에 말했다', '중심인물의 동작을 현재진행형으로 말했다', '위치 표현을 3개 이상 썼다',
      '사진에 없는 내용을 지어내지 않았다', '마지막에 전체 인상을 말했다', '30초를 거의 다 채웠다'],
  3: ['첫 5초 안에 질문에 직접 답했다', '이유나 세부 정보를 붙였다', '3초 이상 멈추지 않았다',
      '질문을 그대로 반복하지 않았다', '(30초 문항) 예시를 넣었다', '제한 시간을 거의 다 채웠다'],
  4: ['자료의 정보를 정확히 말했다', 'A.M./P.M.과 숫자를 틀리지 않았다', '(정정 문항) No로 시작해 바로잡았다',
      '(Q10) 해당 항목을 빠짐없이 말했다', '순서어로 항목을 연결했다', '제한 시간을 거의 다 채웠다'],
  5: ['첫 문장에서 입장을 확정했다', '이유를 2개 제시했다', '구체적인 예시를 넣었다',
      '입장이 끝까지 흔들리지 않았다', '결론 문장으로 마무리했다', '60초를 거의 다 채웠다']
};

const BANK = { 1: PART1, 2: PART2, 3: PART3, 4: PART4, 5: PART5 };
