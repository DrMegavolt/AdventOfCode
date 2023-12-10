import os
import collections
from time import sleep
folder = os.path.dirname(__file__)
m = open(folder +  "/input7.txt", "r").read().splitlines()

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
for y in range(height):
    distances.append([0] * width)
    for x in range(width):
        if m[y][x] == 'S':
            start = [x,y]
            break

print("START:", start)
# print_map(m)
next_steps = collections.deque()
def walk(x, y, distance):
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
def init_deque(start, q):
    if m[start[1]][start[0]-1] in ['-', 'L', 'F']:    
        q.append([start[0]-1, start[1], 1])
    if m[start[1]][start[0]+1] in ['-', 'J', '7']:
        q.append([start[0]+1, start[1], 1])
    if m[start[1]-1][start[0]] in ['|', 'F', '7']:
        q.append([start[0], start[1]-1, 1])
    if m[start[1]+1][start[0]] in ['|', 'L', 'J']:
        q.append([start[0], start[1]+1, 1])

init_deque(start, next_steps)
while len(next_steps) > 0:
    [x, y, distance] = next_steps.popleft()
    walk(x, y, distance)
# print_map(distances)
max_distance = 0
max_distance_pos = [0,0]
for y in range(height):
    for x in range(width):
        if distances[y][x] > max_distance:
            max_distance = distances[y][x]
            max_distance_pos = [x,y]
print("PART1: end pos = ", max_distance_pos)
print("PART1:", max_distance)

def walk_loop(x1, y1, path):
    pos_x = x1
    pos_y = y1
    while m[pos_y][pos_x] != 'S':
        # sleep(0.1)
        prev = path[-1]
        # print("walk_loop:", pos_x, pos_y, prev, m[pos_y][pos_x])
        path.append([pos_x, pos_y])
        if m[pos_y][pos_x] == '-':
            if prev[0] == pos_x-1: # came from left
                pos_x +=1 # go right
            else:
                pos_x -=1  # go left
        elif m[pos_y][pos_x] == '|':
            if prev[1] == pos_y-1: # came from up
                pos_y = pos_y+1 # go down
            else:
                pos_y = pos_y-1 # go up
        elif m[pos_y][pos_x] == 'L':
            if prev[0] == pos_x+1: # came from right
                pos_y = pos_y-1 # go up
            else:
                pos_x+=1 # go right
        elif m[pos_y][pos_x] == 'J':
            if prev[0] == pos_x-1: # came from left
                pos_y = pos_y-1 # go up
            else:
                pos_x=pos_x-1 # go left
        elif m[pos_y][pos_x] == '7':
            if prev[1] == pos_y+1: # came from down
                pos_x=pos_x-1 # go left
            else:
                pos_y = pos_y+1 # go down
        elif m[pos_y][pos_x] == 'F':
            if prev[1] == pos_y+1: # came from down
                pos_x+=1 # go right
            else:
                pos_y = pos_y+1 # go down
        # print('NEXT', pos_x, pos_y,  prev, m[pos_y][pos_x])
    return path

initial_directions = collections.deque()
init_deque(start, initial_directions)

[x_1,y_1, d] = initial_directions[0] # it is a loop so no matter which of 2 directions we start
print("initial_directions:", initial_directions)
p = walk_loop(x_1,y_1, [start])
for i in range(len(p)):
    [x,y] = p[i]
    m[y] = m[y][:x] + '&' + m[y][x+1:]


print_map(m)

for y in range(10):
    potential_hideouts = []
    visited = []
    for y in range(height):
        visited.append([0] * width)
        for x in range(width):
            if m[y][x] != '&':
                potential_hideouts.append([x,y])

    for ph in potential_hideouts:
        
        if visited[ph[1]][ph[0]] == 1:
            continue
        q = collections.deque()
        q.append(ph)

        while len(q) > 0:
            [x,y] = q.popleft()
            
            if visited[y][x] == 1:
                continue

            visited[y][x] = 1
            for i in range(-1,2):
                for j in range(-1,2):
                    if x+i < 0 or x+i >= width or y+j < 0 or y+j >= height:
                        m[y] = m[y][:x] + '0' + m[y][x+1:]
                        continue
                    if m[y+j][x+i] == '&':
                        visited[y+j][x+i] = 1
                    if m[y+j][x+i] == '0':
                        visited[y+j][x+i] = 1
                        m[y] = m[y][:x] + '0' + m[y][x+1:]
                    
                    q.append([x+i,y+j])




        print("potential_hideouts:", ph)

    inside = 0
    for y in range(height):
        for x in range(width):
            if m[y][x] == '0' or m[y][x] == '&':
                continue
            inside += 1

print_map(m)
print("PART2:", inside) # 855 too high
