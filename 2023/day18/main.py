import os
import collections
import re
folder = os.path.dirname(__file__)
data = open(folder + "/input1.txt", "r").read().splitlines()

instructions = []
for row in data:
    [dir, num, color] = row.split(' ')
    num = int(num)
    color = color.strip('(').strip(')')
    instructions.append([dir, num, color])

x = 0
y = 0

dugouts = dict()
dugouts[(x,y)] = "none"
for [dir, num, color] in instructions:
    # print(dir, num, color)
    if dir == 'R':
        for i in range(num):
            paint = color if i == num-1 else "none"
            dugouts[(x+i+1,y)] = paint
        x += num
    if dir == 'L':
        for i in range(num):
            paint = color if i == num-1 else "none"
            dugouts[(x-i-1,y)] = paint
        x -= num
    if dir == 'U':
        for i in range(num):
            paint = color if i == num-1 else "none"
            dugouts[(x,y-i-1)] = paint
        y -= num
    if dir == 'D':
        for i in range(num):
            paint = color if i == num-1 else "none"
            dugouts[(x,y+i+1)] = paint
        y += num
    # print(dugouts, x, y)

# print(len(dugouts))
max_height = max([t[1] for t in dugouts.keys()])
max_width = max([t[0] for t in dugouts.keys()])
min_height = min([t[1] for t in dugouts.keys()])
min_width = min([t[0] for t in dugouts.keys()])
# print(dugouts)
# print(max_height)
# print(max_width)

for y in range(min_height, max_height+1):
    print(y)

    for x in range(min_width, max_width+1):
        if (x,y) in dugouts:
            print('#', end='')
        else:
            print('.', end='')

part1 = 0


x = min_width -1
y = min_height -1
# print("min_width:", min_width, "min_height:", min_height)
search = collections.deque()
search.append((x,y))

while len(search) > 0:
    [x,y] = search.popleft()
    if (x,y) in dugouts:
        continue
    if x < min_width-2 or x > max_width+2 or y < min_height-2 or y > max_height+2:
        continue
    dugouts[(x,y)] = "outside"
    search.append((x+1,y))
    search.append((x-1,y))
    search.append((x,y+1))
    search.append((x,y-1))


part1 = 0
border_counter = 0
inside_counter = 0
for y in range(min_height, max_height+1):
    print(y)

    for x in range(min_width, max_width+1):
        if (x,y) in dugouts:
            if dugouts[(x,y)] == "outside":
                print(' ', end='')
            else:
                part1 += 1
                border_counter += 1
                print('#', end='')
        else:
            part1 += 1
            inside_counter += 1
            print('.', end='')


# part1 = len(list(filter(lambda x: x[1] != "outside", dugouts.items())))
print("part1: in:", part1, "border:", border_counter, "inside:", inside_counter)
# print(list(dugouts.items())[0][1])