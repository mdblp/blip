#!/bin/sh

LINKED_PKGS="@tidepool/viz tideline sundial tidepool-platform-client hakken"
for i in ${LINKED_PKGS}; do
  if [ -d "/app/packageMounts/${i}" ]; then
    echo "Linking /app/packageMounts/${i}..."
    echo npm link "packageMounts/${i}"
    npm link "packageMounts/${i}"
  else
    echo "/app/packageMounts/${i} not a directory, ignore"
  fi
done
