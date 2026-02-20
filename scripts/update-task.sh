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
  PROMPT="$(
cat <<EOF
아래 참고 문서를 먼저 읽고 지침을 반영해줘.
- 참고 문서 경로: ${GUIDE_FILE}
- 참고 문서 내용:
${GUIDE_CONTENT}

추가 요청:
${EXTRA_REQUEST:-없음}
EOF
)"
else
  PROMPT="$(
cat <<EOF
아래 참고 문서를 먼저 읽고 지침을 반영해줘.
- 참고 문서 경로: ${GUIDE_FILE}
- 참고 문서 내용:
${GUIDE_CONTENT}

추가 요청:
${EXTRA_REQUEST:-없음}
EOF
)"
fi

codex "$PROMPT"
