#!/usr/bin/python
import sys
import simplejson as json
f = open('measures.txt','w')
for line in sys.stdin:
    print 'MUAHAHAAHAHAH -------------------\n'
    #print line
    #print "-----------------//////////////--------------"
    x = line[36:len(line)]
    #print x
    y = json.loads(x)
    #print line[index+1:len(line)]
    #print "<><><><><><><><><><><><><>"
    for key, value in y.iteritems():
        #print key
        if key == 'histograms':
            z = json.dumps(value)
            q = json.loads(z);
            #print 'ALOHA', q
            for key, value in q.iteritems():
                print key, 1
                r = key + ' 1'
                f.write(r + '\n')
f.close()
