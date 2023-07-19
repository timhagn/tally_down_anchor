#!/bin/bash

# Find the process IDs of all processes containing the string "processChild.js" in the command path
pids=$(pgrep -f "processChild.js")

# Iterate over each process ID and kill the corresponding process
for pid in $pids; do
    echo "Killing process: $pid"
    kill "$pid"
done
