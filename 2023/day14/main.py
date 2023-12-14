import os
import collections
import re
folder = os.path.dirname(__file__)
data = open(folder + "/input2.txt", "r").read().splitlines()

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

cycles = 10**0


def move_all_north(field):
    for x in range(w):
        bottom = 0
        for y in range(0, h):
            # print("x:", x, "y:", y, "bottom:", bottom)
            # print_map(field)
            if field[y][x] == '#':
                bottom = y+1
                continue;
            if field[y][x] == 'O':
                field[y][x] = '.'
                field[bottom][x] = 'O'
                bottom +=1
                continue;


for i in range(cycles):
    move_all_north(field)
print()
print_map(field)

# count weight
part1 = 0
for y in range(len(field)):
    for x in range(len(field[y])):
        if field[y][x] == 'O':
            part1 += 1 * (h-y)

print("part1:", part1)
