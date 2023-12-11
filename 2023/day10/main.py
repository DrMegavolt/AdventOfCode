import os
import collections
from time import sleep
folder = os.path.dirname(__file__)
m = open(folder +  "/input1.txt", "r").read().splitlines()
original_m = m.copy()
width = len(m[0])
height = len(m)
# find S 
start = [0,0]

def print_map(m):
    for y in range(len(m)):
        for x in range(len(m[y])):
            print(m[y][x], end='')
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
print("PART1:", max_distance)
print('----')

def walk_loop(x1, y1, path):
    pos_x = x1
    pos_y = y1
    while m[pos_y][pos_x] != 'S':
        prev = path[-1]
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
loop_path = walk_loop(x_1,y_1, [start])

# print_map(m)

# the previous loop is not enough, we need to test all the points inside the map
# since the path is a loop all the dots inside will have at least 1 border from each direction 
# F-7    f-7f7 
# |.| or |.||| 1+1 or 1+3
# L-J    l-jlj 
# same for top and bottom

for i in range(len(loop_path)):
    [x,y] = loop_path[i]
    m[y] = m[y][:x] + '&' + m[y][x+1:]
potential_hideouts = []
for y in range(height):
    for x in range(width):
        if m[y][x] != '&':
            potential_hideouts.append([x,y])

hideouts_counter = 0
for spot in potential_hideouts:
    # [x,y] = spot

    line = list(filter(lambda coord: coord[1]==spot[1], loop_path))
    # sort by x
    line.sort(key=lambda coord: coord[0])

    # count borders before and after coord(.) B.AAA |.||| 1+3
    before = list(filter(lambda coord: coord[0] < spot[0], line))
    bf_pipes = list(map(lambda bf: original_m[bf[1]][bf[0]], before))
    bf_pipes = ''.join(list(filter(lambda t: t != '-', bf_pipes)))
    after = list(filter(lambda coord: coord[0] > spot[0], line))
    af_pipes = list(map(lambda af: original_m[af[1]][af[0]], after))
    af_pipes = ''.join(list(filter(lambda t: t != '-', af_pipes)))

    # L7 and FJ are the same vertical pipes so we can replace them with |
    bf_pipes = bf_pipes.replace('L7', '|').replace('FJ', "|").replace('SJ', "|")
    af_pipes = af_pipes.replace('L7', '|').replace('FJ', "|").replace('SJ', "|")
    if len(bf_pipes) % 2 == 1 and len(af_pipes) % 2 == 1:
        hideouts_counter += 1

# print_map(original_m)
print("PART2:", hideouts_counter) # 595 correct