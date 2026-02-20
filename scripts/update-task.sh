#!/usr/bin/env bash
set -euo pipefail

if ! command -v codex >/dev/null 2>&1; then
  echo "codex command not found"
  exit 1
fi

MODE="plan"
if [[ "${1:-}" == "--apply" ]]; then
  MODE="apply"
  shift
fi

DAILY_DB_URL="${NOTION_DAILY_DB_URL:-https://www.notion.so/choiyoungjune/30d21bc2456c80f0b16ee9cd4e142a88}"
EXTRA_REQUEST="${*:-}"

if [[ "$MODE" == "plan" ]]; then
  PROMPT="$(
cat <<EOF
현재 작업 브랜치를 분석해서 아래를 수행해.
- Git 업데이트 이력 확인
- 최근 업데이트 이력과 현재 브랜치 변경 이력을 커밋/파일 변경 기준으로 비교
- 결과를 대분류, 소분류, 중분류로 정리

중요:
1) 먼저 실행 계획과 예상 Notion 반영 내용을 보여줘.
2) 내 동의 전에는 Notion에 쓰기 작업을 하지 마.
3) Notion 대상은 아래 URL 범위만 사용해.
- ${DAILY_DB_URL}

추가 요청:
${EXTRA_REQUEST:-없음}
EOF
)"
else
  PROMPT="$(
cat <<EOF
현재 작업 브랜치를 분석해서,
1. Git Repository 업데이트 이력을 확인하고
2. 최근 업데이트 이력으로부터 현재 브랜치의 변경 이력을 Commit 과 파일 변경 내역과 비교하고
3. 변경 내역을 대분류, 소분류, 중분류로 구분하여 정리한 다음
4. 일별 작업내역(${DAILY_DB_URL})의 데이터베이스에 접근해서 하나의 페이지를 만들고
5. 작업 내역에는 '변경 내용 요약'을 적어주고
6. 날짜에는 작업 시작 일자 ~ 작업 종료 일자(오늘)로 설정하고
7. 페이지의 하단에 정리된 내용을 작성해줘

중요:
- 사용자가 Notion 업데이트에 동의한 상태로 보고 바로 진행해.
- Notion 대상은 아래 URL 범위만 사용해.
- ${DAILY_DB_URL}
- 결과에 생성 페이지 URL/ID, 날짜 범위, 변경 내용 요약을 포함해.

추가 요청:
${EXTRA_REQUEST:-없음}
EOF
)"
fi

codex "$PROMPT"
