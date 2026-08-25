#!/bin/bash
# 더블클릭하면 로컬 서버를 켜고 브라우저를 연다.
# 창을 닫으면 서버도 함께 종료된다.
cd "$(dirname "$0")" || exit 1
PORT=8777
while lsof -i :$PORT >/dev/null 2>&1; do PORT=$((PORT+1)); done
echo "TOEIC Speaking 실전 트레이너"
echo "http://localhost:$PORT  —  이 창을 닫으면 종료된다."
echo
( sleep 1; open "http://localhost:$PORT" ) &
python3 -m http.server "$PORT"
