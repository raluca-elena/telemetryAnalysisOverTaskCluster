#!/bin/bash

(while read fname
do
   xz --decompress --stdout $fname
   #echo $fname;
done) | ./map.py
