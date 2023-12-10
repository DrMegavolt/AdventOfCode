import os
import collections
folder = os.path.dirname(__file__)
m = open(folder +  "/input1.txt", "r").read().splitlines()

width = len(m[0])
height = len(m)
# find S 
start = [0,0]

def print_map(m):
    for y in range(len(m)):
        for x in range(len(m[y])):
            print(m[y][x], end='')
        print()

def print_map_zoom(m, pos_x, pos_y, zoom, just=5):
    y_min = max(0, pos_y - zoom)
    y_max = min(height, pos_y + zoom)
    x_min = max(0, pos_x - zoom)
    x_max = min(width, pos_x + zoom)
    for y in range(y_min, y_max):
        for x in range(x_min, x_max):
            s = str(m[y][x])
            if x == pos_x and y == pos_y:
                s = '[' + s + ']'
            print(s.ljust(just), end='')
            # if m[y][x] > 0:
            #     print('*', end='')
            # else:
            #     print('.', end='')
        print()

distances = []
visited = []
for y in range(height):
    distances.append([0] * width)
    visited.append([0] * width)
    for x in range(width):
        if m[y][x] == 'S':
            start = [x,y]
            break

print("START:", start)
# print_map(m)
next_steps = collections.deque()
def walk(x, y, distance):
    # print()
    # print("WALK:", m[y][x], x,y, distance, distances[y][x])
    # print_map_zoom(distances,x,y, 3)
    # print_map_zoom(m,x,y, 3, 3)

    if x < 0 or x >= width or y < 0 or y >= height:
        return None
    if m[y][x] == '.':
        return None
    if m[y][x] == 'S':
        return None
    if distance < distances[y][x] or distances[y][x] == 0:
        distances[y][x] = distance
    else:
        return None

    distance += 1 # walk one step

    if m[y][x] == '-':
        next_steps.append([x-1, y, distance])
        next_steps.append([x+1, y, distance])
    if m[y][x] == '|':
        next_steps.append([x, y-1, distance])
        next_steps.append([x, y+1, distance])
    if m[y][x] == 'L':
        next_steps.append([x+1, y, distance])
        next_steps.append([x, y-1, distance])
    if m[y][x] == 'J':
        next_steps.append([x-1, y, distance])
        next_steps.append([x, y-1, distance])
    if m[y][x] == '7':
        next_steps.append([x-1, y, distance])
        next_steps.append([x, y+1, distance])
    if m[y][x] == 'F':
        next_steps.append([x+1, y, distance])
        next_steps.append([x, y+1, distance])

# only 2 directions have connections

if m[start[1]][start[0]-1] in ['-', 'L', 'F']:    
    next_steps.append([start[0]-1, start[1], 1])
if m[start[1]][start[0]+1] in ['-', 'J', '7']:
    next_steps.append([start[0]+1, start[1], 1])
if m[start[1]-1][start[0]] in ['|', 'F', '7']:
    next_steps.append([start[0], start[1]-1, 1])
if m[start[1]+1][start[0]] in ['|', 'L', 'J']:
    next_steps.append([start[0], start[1]+1, 1])
while len(next_steps) > 0:
    [x, y, distance] = next_steps.popleft()
    walk(x, y, distance)
# print_map(distances)
print("PART1:", max(map(max, distances)))

# print_map(m)
dots = []
for y in range(height):
    for x in range(width):
        if m[y][x] == '.':
            dots.append([x,y])

#         if distances[y][x] > 0:
#             continue
# print(dots)

q = collections.deque(dots)

def walk_cavity(x, y, other_spaces):
    # check borders

    if x < 0 or x >= width or y < 0 or y >= height:
        return []
    if  visited[y][x] == 1:
        return []
    if m[y][x] == '.':
        visited[y][x] = 1
        result = [[x,y]]
        for j in range(-1,2):
            for i in range(-1,2):
                a = walk_cavity(x+i, y+j, [])
                result.extend(a)
        return result
    return []

cavities = []
while len(q) > 0:
    [x, y] = q.popleft()
    cvt = walk_cavity(x, y, [])
    if len(cvt) > 0:
        cavities.append(cvt)

escapable = dict()

def mark_cavity(id, symbol='0'):
    for [x,y] in cavities[id]:
        m[y] = m[y][:x] + symbol + m[y][x+1:]
# check if cavities are escapable directly to the border
for id, c in enumerate(cavities):
    for [x,y] in c:
        if y == 0 or y == height-1 or x == 0 or x == width-1:
            escapable[id] = True
            mark_cavity(id, '0')
            break

# check if cavities are escapable by squeezing in between pipes
# it can escape if it can reach a cavity that is escapable (marked with '0')
# if it can reach the border, it is escapable
for id, c in enumerate(cavities):
    if id in escapable:
        continue
    for [x,y] in c:
        can_sqeeze = check_squeeze(x, y)


print_map(m)
print(escapable)
print(cavities)