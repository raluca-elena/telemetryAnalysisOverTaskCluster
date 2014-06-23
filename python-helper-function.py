#!/usr/bin/python
import sys
import fileinput
import simplejson as json
import subprocess
from subprocess import Popen, PIPE


import time


print "args: ", sys.argv
command = sys.argv[1]
decompress = sys.argv[2]
mapper = __import__(command)

for line in sys.stdin:
    #print line
    if decompress == None:
        continue

    print "start"
    #print line
    xz_cmd = ["xz", "-d", "--stdout", line.strip()]
    xz = Popen(xz_cmd, stdout=PIPE)
    xz.wait()

    print "xz exit code ---- ", xz.returncode
    #if xz.returncode != 0:

    f = open('measures.txt', 'w')
    for line in xz.stdout.readlines():
        uuid = line[0:35]
        print uuid
        jsonString = line[36:len(line)]
        print jsonString
        y = json.loads(jsonString)
        f.write(mapper.mapper(uuid, y) + "\n")
    f.close()
#print x

