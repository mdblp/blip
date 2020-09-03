#!/bin/bash

echo "npm logs:"
echo
LOG_FILES=$(/bin/ls -1 ~/.npm/_logs/*)
for FILE in $LOG_FILES; do
  echo "${FILE}:"
  cat $FILE
  echo
done
