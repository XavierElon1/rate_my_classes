import csv
import json
import requests
import sys

if len(sys.argv) < 3:
    print('ERROR: Need to pass path to file as first argument and ratemyclasses API url as second argument')
    exit()
url = sys.argv[2]
with open(sys.argv[1]) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        data = {"name":row[1], "website":row[2]}
        print(json.dumps(data))
        result = requests.post(url, json=data)
        print(result)
        line_count += 1
    print(f'Processed {line_count} lines.')
