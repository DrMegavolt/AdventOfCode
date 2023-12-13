import os
import collections
import re
folder = os.path.dirname(__file__)
data = open(folder + "/input1.txt", "r").read().splitlines()

fields = []
field = []
for row in data:
    if len(row) == 0:
        fields.append(field)
        field = []
        continue
    field.append(row)
fields.append(field)

def print_map(m):
    for y in range(len(m)):
        for x in range(len(m[y])):
            print(m[y][x], end='')
        print()
print("fields:", len(fields))

def find_horizontal_mirror(field):
    for y in range(0, len(field)-1):
        print("y:", y, field[y], field[y+1])
        is_mirror = True
        for t in range(0, min(y+1, len(field)-y-1)):
            print("  t:", t,  field[y-t], field[y+t+1])
            if field[y-t] != field[y+t+1]:
                is_mirror = False
                break;
        if is_mirror:
            return y + 1 
    return None

def find_vertical_mirror(field):
    for x in range(0, len(field[0])-1):
        print("x:", x)
        is_mirror = True
        for t in range(0, min(x+1, len(field[0])-x-1)):
            # print("  t:", t)
            for y in range(0, len(field)):
                # print("    y:", y, field[y][x-t], field[y][x+t+1])
                if field[y][x-t] != field[y][x+t+1]:
                    is_mirror = False
                    break;
            if not is_mirror:
                break;
        if is_mirror:
            return x + 1 
    return None

res = 0
for f in fields:
    print_map(f)
    print('---')
    mirror = find_horizontal_mirror(f)
    if mirror is None:
        mirror = find_vertical_mirror(f)
        res += mirror
        print("mirror V:", mirror)
    else:
        res += 100*mirror
        print("mirror H:", mirror)

print("part1:", res)


def count_differences(s1, s2):
    res = 0
    for i in range(len(s1)):
        if s1[i] != s2[i]:
            res += 1
    return res


def find_horizontal_mirror2(field):
    for y in range(0, len(field)-1):
        print("y:", y, field[y], field[y+1])
        diff_count = 0
        for t in range(0, min(y+1, len(field)-y-1)):
            # print("  t:", t,  field[y-t], field[y+t+1])
            diff_count += count_differences(field[y-t], field[y+t+1])
        if diff_count == 1:
            return y + 1 
    return None

def find_vertical_mirror2(field):
    for x in range(0, len(field[0])-1):
        diff_count = 0
        for t in range(0, min(x+1, len(field[0])-x-1)):
            print("  t:", t)
            for y in range(0, len(field)):
                # print("    y:", y, field[y][x-t], field[y][x+t+1])
                diff_count += count_differences(field[y][x-t] ,field[y][x+t+1])
        if diff_count == 1:
            return x + 1 
    return None


part2=0
for f in fields:
    print_map(f)
    print('---')
    mirror = find_horizontal_mirror2(f)
    if mirror is None:
        mirror = find_vertical_mirror2(f)
        print("mirror V2:", mirror)
        part2 += mirror
    else:
        print("mirror H2:", mirror)
        part2 += 100*mirror

print("part2:", part2)