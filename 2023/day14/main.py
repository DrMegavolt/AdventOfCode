import os
import collections
import re
folder = os.path.dirname(__file__)
data = open(folder + "/input1.txt", "r").read().splitlines()

field = []
for row in data:
    line = list(row)
    field.append(line)
w = len(field[0])
h = len(field)

def print_map(m):
    for y in range(len(m)):
        for x in range(len(m[y])):
            print(m[y][x], end='')
        print()

print_map(field)

def tilt_north(field):
    for x in range(w):
        north = 0
        for y in range(0, h):
            if field[y][x] == '#':
                north = y+1
                continue
            if field[y][x] == 'O':
                field[y][x] = '.'
                field[north][x] = 'O'
                north += 1
                continue


def tilt_south(field):
    for x in range(w):
        south = h-1
        for y in range(h-1, -1, -1):
            if field[y][x] == '#':
                south = y-1
                continue
            if field[y][x] == 'O':
                field[y][x] = '.'
                field[south][x] = 'O'
                south -= 1
                continue

def tilt_east(field):
    for y in range(h):
        east = w-1
        for x in range(w-1, -1, -1):
            if field[y][x] == '#':
                east = x-1
                continue
            if field[y][x] == 'O':
                field[y][x] = '.'
                field[y][east] = 'O'
                east -= 1
                continue

def tilt_west(field):
    for y in range(h):
        west = 0
        for x in range(0, w):
            if field[y][x] == '#':
                west = x+1
                continue
            if field[y][x] == 'O':
                field[y][x] = '.'
                field[y][west] = 'O'
                west += 1
                continue

def find_weight(field):
    weight = 0
    for y in range(h):
        for x in range(w):
            if field[y][x] == 'O':
                weight += 1 * (h-y)
    return weight
cycles = 10**9

loop_candidates = dict()
loop_size = 0
i=0
while i < cycles:
    i+=1
    print("cycle:", i)
    tilt_north(field)
    if (i==1):
        print("part1:", find_weight(field))

    # print()
    # print_map(field)
    tilt_west(field)
    # print()
    # print_map(field)
    tilt_south(field)
    # print()
    # print_map(field)
    tilt_east(field)
    weight = find_weight(field)
    key = str(field)
    if key in loop_candidates:
        print("loop found:", i, loop_candidates[key])
        loop_size = i - loop_candidates[key]
        print("loop size:", loop_size, "skip:", (cycles - i) // loop_size)
        i += loop_size * ((cycles - i) // loop_size)
        print("new cycle:", i)
        # loops.append(i)
        # break
    else:
        loop_candidates[key] = i

print("loops size:", loop_size)
# count weight
part2 = find_weight(field)

print("part2:", part2)
