# read input1.txt
import os
folder = os.path.dirname(__file__)
content = open(folder +  "/input1.txt", "r").read().splitlines()
sum = 0
min_val = -100000
for s in content:
    p1 = min_val
    p2 = min_val
    for i in range(len(s)):
        try:
            p1 = int(s[i])
            break
        except:
            pass
    for i in range(len(s)):
        try:
            p2 = int(s[len(s)-1-i])
            break
        except:
            pass
    # print(p1,p2)
    sum += (p1*10 + p2)

print("PART1:",sum)

words = ["one","two","three","four","five","six","seven","eight","nine"]

sum = 0
for t in content:
    s=t
    # print(s)

    p1 = min_val
    p2 = min_val
    for i in range(len(s)):
        if s[i].isdigit():
            p1 = int(s[i])
        else:
            for j in range(len(words)):
                if s[i:].startswith(words[j]):
                    p1 = j+1
        if p1>=0:
            break
    for i in range(len(s)):
        if s[len(s)-1-i].isdigit():
            p2 = int(s[len(s)-1-i])
            break
        else:
            for j in range(len(words)):
                if s[:len(s)-i].endswith(words[j]):
                    p2 = j+1
        if p2>=0:
            break
    # print(p1,p2)
    sum += (p1*10 + p2)

print("PART2:",sum)