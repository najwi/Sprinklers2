#!/bin/bash
# gzip required

# Directories to process
DIRS=("data" "data/assets")

# File types to compress
EXTENSIONS=("html" "js" "css" "json" "svg" "ico" "txt")

# Loop through each directory
for DIR in "${DIRS[@]}"; do
  echo "Compressing files in $DIR..."

  for EXT in "${EXTENSIONS[@]}"; do
    find "$DIR" -type f -name "*.$EXT" | while read -r FILE; do
      echo "Compressing: $FILE"
      gzip -f "$FILE"         # Compress and overwrite
    done
  done
done

echo "✅ Compression complete."
