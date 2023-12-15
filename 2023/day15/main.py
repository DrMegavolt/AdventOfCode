import os
import collections
import re
folder = os.path.dirname(__file__)
data = open(folder + "/input1.txt", "r").read().splitlines()

sequences = data[0].split(',')

def hash15(s):
    val = 0
    for c in s:
        code = ord(c)
        val+= code
        val *= 17
        val %= 256
    return val

# print("HASH:", hash15("HASH"))

sum = 0
for s in sequences:
    # print(s, hash15(s))
    sum += hash15(s)

print("part1:", sum)

print("HASH rn:", hash15("ot"))

boxes = dict()
for i in range(0, 256):
    boxes[i] = []

for s in sequences:
    print(s, hash15(s))


    if s[-1] == '-':
        code = s[:-1]
        box = hash15(code)
        for l in boxes[box]:
            if l[0] == code:
                boxes[box].remove(l)
                break
    else:
        [code, strength] = s.split('=')
        box = hash15(code)
        replaced = False
        for l in boxes[box]:
            if l[0] == code:
                l[1] = int(strength)
                replaced = True
                break
        if not replaced:
            boxes[box].append([code, int(strength)])



print("boxes:", boxes)

part2 = 0
for b in boxes:
    for id, l in enumerate(boxes[b]):
        part2 += (b+1)*(id+1)* l[1]

print("part2:", part2)