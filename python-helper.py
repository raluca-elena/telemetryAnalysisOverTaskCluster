#!/usr/bin/python
#import mapper
import sys
import simplejson as json
command = sys.argv[1]
mapper = __import__(command);
#import mapper

f = open('measures.txt','w')
for line in sys.stdin:
    uuid = line[0:35]
    jsonString = line[36:len(line)]
    y = json.loads(jsonString)
    f.write(mapper.mapper(uuid, y) + "\n")
f.close()
