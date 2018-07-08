#!/usr/bin/python
# -*- coding: utf-8 -*-

from datetime import datetime
import sys, codecs, pprint, csv

# UTC == ROME -2h
# 1409011201 equivalent to: 08/26/2014 @ 12:00am (UTC)
# 1530921601 equivalent to: 07/07/2018 @ 12:00am (UTC) 

filesIN = ["TS1.txt", "TS2.txt", "TS3.txt"]

def openStampFile(file1):
    fileInput = codecs.open(file1, "r", "utf-8")
    raw = fileInput.read()
    return raw

def initTimeMap():
    time_frequency = {}
    for i in range(24):
        time_frequency[i] = [0,0,0]
    return time_frequency

def frequencyMap(timestamps,fbgroup, time_frequency):
    for timestamp in timestamps.splitlines():
        if int(timestamp) >= 1409011201 and int(timestamp) <= 1530921601:
            date_obj = datetime.fromtimestamp(int(timestamp))
            hour = date_obj.hour
            time_frequency[hour][fbgroup] += 1
    return time_frequency

def buildFreqMap():
    i = 0
    timeMap = initTimeMap()
    for fileS in filesIN:
        timestamps = openStampFile(fileS)
        frequencyMap(timestamps, i, timeMap)
        i+=1
    print "[*] Here is the frequency map:"
    pprint.pprint(timeMap)
    return timeMap

def writeCSV(timeMap):
    with open("FB-sleep.csv","wb") as csv_output:
        fieldnames=["Hour","Group1", "Group2", "Group3"]
        writer = csv.DictWriter(csv_output, fieldnames)
        writer.writeheader()
        for record in timeMap:
            row = {}
            row['Hour']  = record
            row['Group1'] = timeMap[record][0]
            row['Group2'] = timeMap[record][1]
            row['Group3'] = timeMap[record][2]
            writer.writerow(row)
        print "[*] Done writing FB-sleep.csv!"

def main():
    timeMap = buildFreqMap()
    writeCSV(timeMap)
    
main()
