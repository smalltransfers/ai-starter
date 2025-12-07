#!/bin/sh

set -e -u -o pipefail

# Get the directory of this script.
SOURCE=${BASH_SOURCE[0]}
while [ -L "$SOURCE" ]; do
  DIR=$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )
  SOURCE=$(readlink "$SOURCE")
  [[ $SOURCE != /* ]] && SOURCE=$DIR/$SOURCE
done
DIR=$( cd -P "$( dirname "$SOURCE" )" >/dev/null 2>&1 && pwd )

# Run linting.
pnpm lint

# Run type checking.
npx tsc --build

# Check for outdated dependencies, but don't fail the build if there are any.
pnpm outdated || true
