#!/bin/bash

export CI=1

all=false
[ "$1" = "-a" ] && all=true

for t in \
  01 02 03 04 05 06 07 08 09 \
  10 11 12 13 14 15 16 17 \
  18 19 20 21 22 23 24 25 \
;do
    d="day/$t"
    if [ ! -f "$d/.slow" ] || $all ;then
        for tf in "$d/solution.ts" "$d/solution1.ts" "$d/solution2.ts";do
            [ -f "$tf" ] && echo -n "$t: " && bun run "$tf"
        done
    else   
        echo "$t: Skipping slow"
    fi
done

