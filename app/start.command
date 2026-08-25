#!/bin/bash
# 더블클릭하면 로컬 서버를 켜고 브라우저를 연다.
# 창을 닫으면 서버도 함께 종료된다.
cd "$(dirname "$0")" || exit 1

# 파이썬 찾기
PY=""
for c in python3 python; do
  if command -v "$c" >/dev/null 2>&1 && "$c" -c 'import sys; sys.exit(0 if sys.version_info[0]==3 else 1)' 2>/dev/null; then
    PY="$c"; break
  fi
done

if [ -z "$PY" ]; then
  echo
  echo "  Python 3 이 없습니다."
  echo
  echo "  서버 없이도 대부분 동작하므로 index.html 을 바로 엽니다."
  echo "  단, 브라우저를 완전히 종료하면 지난 녹음 오디오는 사라집니다."
  echo "  (점수·메모·드릴 기록은 남습니다.)"
  echo
  echo "  오디오까지 보관하려면 터미널에서 'xcode-select --install' 로"
  echo "  개발자 도구를 설치한 뒤 이 파일을 다시 실행하세요."
  echo
  open "index.html"
  read -n 1 -s -r -p "  아무 키나 누르면 닫힙니다."
  exit 0
fi

# 비어 있는 포트 찾기
PORT=8777
TRIES=0
while [ $TRIES -lt 20 ] && lsof -i :$PORT >/dev/null 2>&1; do
  PORT=$((PORT+1)); TRIES=$((TRIES+1))
done

echo
echo "  TOEIC Speaking 실전 트레이너"
echo "  http://localhost:$PORT"
echo
echo "  이 창을 닫으면 종료됩니다."
echo
( sleep 1; open "http://localhost:$PORT" ) &
"$PY" -m http.server "$PORT"
