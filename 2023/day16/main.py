import os
import collections
import re
folder = os.path.dirname(__file__)
data = open(folder + "/input1.txt", "r").read().splitlines()

h = len(data)
w = len(data[0])
def operate_beam(data, start_ray):
    field = []
    energized = []
    for row in data:
        line = list(row)
        field.append(line)
        energized.append([0]*len(line))

    rays = collections.deque()
    rays.append(start_ray)

    processed_rays = set()
    def reflect(direction, surface):
        if surface == '/':
            if direction == 'R':
                return 'U'
            if direction == 'U':
                return 'R'
            if direction == 'L':
                return 'D'
            if direction == 'D':
                return 'L'
        if surface == '\\':
            if direction == 'R':
                return 'D'
            if direction == 'D':
                return 'R'
            if direction == 'L':
                return 'U'
            if direction == 'U':
                return 'L'
        return None

    def trace_beam(ray):
        [x, y, direction] = ray
        while True:
            if x < 0 or x >= len(field[0]) or y < 0 or y >= len(field):
                return None
            energized[y][x] += 1
        
            if field[y][x] == '/' or field[y][x] == '\\':
                direction = reflect(direction, field[y][x])
            elif field[y][x] == '|':
                if direction == 'L' or direction == 'R':
                    if str([x, y-1, 'U']) not in processed_rays:
                        rays.append([x, y-1, 'U'])
                    if str([x, y+1, 'D']) not in processed_rays:
                        rays.append([x, y+1, 'D'])
                    return None
            elif field[y][x] == '-':
                if direction == 'U' or direction == 'D':
                    if str([x-1, y, 'L']) not in processed_rays:
                        rays.append([x-1, y, 'L'])
                    if str([x+1, y, 'R']) not in processed_rays:
                        rays.append([x+1, y, 'R'])
                    return None
        
            if direction == 'R':
                x += 1
            elif direction == 'L':
                x -= 1
            elif direction == 'U':
                y -= 1
            elif direction == 'D':
                y += 1
        
    while len(rays) > 0:
        ray = rays.popleft()
        trace_beam(ray)
        processed_rays.add(str(ray))

    counter = 0
    for y in range(len(energized)):
        for x in range(len(energized[y])):
            if energized[y][x] > 0:
                counter += 1

    print("counter:", counter)
    return counter

solutions = []
for k in range(h):
    c = operate_beam(data, [0, k, "R"])
    solutions.append(c)
    c = operate_beam(data, [w-1, k, "L"])

for k in range(w):
    c = operate_beam(data, [k, 0, "D"])
    solutions.append(c)
    c = operate_beam(data, [k, h-1, "U"])
    solutions.append(c)

print("part1:", solutions[0])
print("part2:", max(solutions))
