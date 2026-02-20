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

EXTRA_REQUEST="${*:-}"
GUIDE_FILE="docs/update-task.md"

if [[ -f "$GUIDE_FILE" ]]; then
  GUIDE_CONTENT="$(cat "$GUIDE_FILE")"
else
  GUIDE_CONTENT="(참고 문서 없음: ${GUIDE_FILE})"
fi

if [[ "$MODE" == "plan" ]]; then
  EXECUTION_INSTRUCTION="중요: 위 문서는 '참고'가 아니라 실행 명세서다. 문서 내용을 재해석하지 말고 해당 파일만 기준으로 실행해. 먼저 계획/요약만 제시하고, 내 동의 전에는 Notion 쓰기 작업을 하지 마."
else
  EXECUTION_INSTRUCTION="중요: 위 문서는 '참고'가 아니라 실행 명세서다. 문서 내용을 재해석하지 말고 해당 파일만 기준으로 실행해. 내 승인이 이미 있다고 가정하고 Notion 반영까지 즉시 진행해."
fi

PROMPT="$(
cat <<EOF
아래 문서를 실행 명세서로 사용해.
- 문서 경로: ${GUIDE_FILE}
- 문서 내용:
${GUIDE_CONTENT}

${EXECUTION_INSTRUCTION}

추가 요청:
${EXTRA_REQUEST:-없음}
EOF
)"

codex "$PROMPT"
