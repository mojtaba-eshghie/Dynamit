#!/usr/bin/python3


import json
import sys


depths = list()

with open('data/trace_' + sys.argv[1] + '.json') as jsonfile:
    data = json.load(jsonfile)
    for log in data['result']['structLogs']:
        depths.append(log['depth'])


print(sum(depths) / len(depths))