import os
import collections
import re
folder = os.path.dirname(__file__)
data = open(folder + "/input1.txt", "r").read().splitlines()
part2_mode = True
instructions = []
for row in data:
    [dir, num, color] = row.split(' ')
    num = int(num)
    color = color.strip('(').strip(')')
    if part2_mode:
        color = color[1:]
        num = int(color[:-1], 16)

        dir_code = color[-1]
        if dir_code == '0':
            dir = 'R'
        if dir_code == '1':
            dir = 'D'
        if dir_code == '2':
            dir = 'L'
        if dir_code == '3':
            dir = 'U'
    instructions.append([dir, num])

x = 0
y = 0

vertical_borders = []
horizontal_borders = []
edges = []

for [dir, num] in instructions:
    # print(dir, num)
    edges.append((x, y))
    if dir == 'R':
        horizontal_borders.append((x, y, x+num, y))
        x += num
    if dir == 'L':
        horizontal_borders.append((x, y, x-num, y))
        x -= num
    if dir == 'U':
        vertical_borders.append((x, y, x, y-num))
        y -= num
    if dir == 'D':
        vertical_borders.append((x, y, x, y+num))
        y += num

border_l = sum([abs(t[2]-t[0]) for t in horizontal_borders]) + sum([abs(t[3]-t[1]) for t in vertical_borders])


print(border_l)
# thanks to reddit https://www.reddit.com/r/adventofcode/comments/18lv3l1/2023_day_18_the_pride_before_the_fall_is_too_real/
# Pick's theorem https://en.wikipedia.org/wiki/Pick%27s_theorem
# A = i + b/2 - 1
# i = A - b/2 + 1
# we have b = border_l

# area can be calculated as shoelace formula
# https://en.wikipedia.org/wiki/Shoelace_formula

def shoelace_formula(points):
    n = len(points)
    area = 0.0
    for i in range(n):
        j = (i + 1) % n
        area += points[i][0] * points[j][1]
        area -= points[j][0] * points[i][1]
    area = abs(area) / 2.0
    return area

i = int(shoelace_formula(edges) - border_l/2 + 1)

print("part2", i, border_l, i + border_l )