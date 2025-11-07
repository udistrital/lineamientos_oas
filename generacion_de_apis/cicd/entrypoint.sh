#!/bin/sh

set -e
set -u
set -o pipefail
exec ./main "$@"
