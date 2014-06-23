#!/bin/bash

(while read fname
do
   xz --decompress --stdout $fname;
   if [ "$?" == "0" ]; then
        echo  $fname >> filesDecompressed;
   fi
done);

