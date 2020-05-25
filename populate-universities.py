import csv
import json
import requests
import sys

if len(sys.argv) < 4:
    print('ERROR: Need to pass path to file as first argument, the ratemyclasses API url as second argument, and the token as the third')
    exit()
url = sys.argv[2]
token = sys.argv[3]
with open(sys.argv[1]) as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    line_count = 0
    for row in csv_reader:
        data = {"name":row[1], "website":row[2]}
        print(json.dumps(data))
        result = requests.post(url, json=data, headers={'Authorization': 'Bearer ' + token})
        print(result)
        line_count += 1
    print(f'Processed {line_count} lines.')
