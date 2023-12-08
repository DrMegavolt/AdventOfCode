import os
import collections
folder = os.path.dirname(__file__)
lines = open(folder + "/input1.txt", "r").read().splitlines()

directions = collections.deque(lines[0])
nodes = dict()
for l in lines[2:]:
    [node, lr] = l.split(' = ')
    [left, right] = lr.split(', ')
    left = left[1:]
    right = right[:-1]
    nodes[node] = [left, right]

# print(nodes)

pos = 'AAA'
target = 'ZZZ'
counter = 0
while True:
    if pos == target:
        break
    counter += 1

    # print("pos:", pos)

    [left, right] = nodes[pos]
    d = directions[0]
    # print(directions)
    directions.rotate(-1)

    if d == 'L':
        # print("LEFT:", left)
        pos = left
    else:
        # print("right:", right)
        pos = right

print("PART1:", counter)