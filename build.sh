#!/bin/bash
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Building Angular app..."
cd "$SCRIPT_DIR/sprinklers-app"
npm run build

BUILD_OUTPUT="$SCRIPT_DIR/sprinklers-app/dist/sprinklers-app/browser"
DATA_DIR="$SCRIPT_DIR/esp/data"

echo "Clearing esp/data..."
rm -rf "${DATA_DIR:?}"/*

echo "Copying build output..."
cp -r "$BUILD_OUTPUT/." "$DATA_DIR/"

echo "Gzipping files..."
cd "$SCRIPT_DIR/esp"
bash gzip_data.sh
