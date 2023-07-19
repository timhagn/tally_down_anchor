#!/usr/bin/env bash
if [ -n "$1" ]; then
  PORT=$1
else
  PORT=8000
fi
echo "Finding and killing all node servers on port ${PORT}..."

pids=$(fuser ${PORT}/tcp 2>/dev/null)

for pid in $pids; do
    echo "Killing process: $pid"
    kill "$pid"
done
