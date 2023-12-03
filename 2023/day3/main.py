import os
folder = os.path.dirname(__file__)
lines = open(folder +  "/input1.txt", "r").read().splitlines()

width = len(lines[0])
height = len(lines)
numbers = []
data = set()

gear_connections = dict()
def add_connection(x,y,number):
    if (x,y) not in gear_connections:
        gear_connections[(x,y)] = []
    gear_connections[(x,y)].append(number)

def is_part_of_number(x1,x2,y):
    number = int(lines[y][x1:x2])
    print(f"\nChecking {x1},{x2},{y}")
    box_start_x = max(x1-1,0)
    box_end_x = min(x2+1,width)
    box_start_y = max(y-1,0)
    box_end_y = min(y+1,height-1)
    top = lines[box_start_y][box_start_x:box_end_x]
    bottom = lines[box_end_y][box_start_x:box_end_x]
    prev = lines[y][box_start_x:x1]
    next = lines[y][x2:box_end_x]
    print(f"Top: {top}")
    print(f"Bottom: {bottom}")
    print(f"Prev: {prev}")
    print(f"Next: {next}")

    for pos, ch in enumerate(top):
        if ch == '*':
            add_connection(box_start_x+pos,box_start_y,number)
    for pos, ch in enumerate(bottom):
        if ch == '*':
            add_connection(box_start_x+pos,box_end_y,number)
    for pos, ch in enumerate(prev):
        if ch == '*':
            add_connection(box_start_x+pos,y,number)
    for pos, ch in enumerate(next):
        if ch == '*':
            add_connection(x2+pos,y,number)

    tmp = set(top)
    tmp.update(list(bottom))
    tmp.update(list(prev))
    tmp.update(list(next))
    for c in tmp:
        if c.isdigit() or c == '.':
            continue
        else:
            print(f"Found {c} in {tmp}")
            return True

    print("NUMBER IGNORED:", number, "LINE", y+1)
    return False
for i, l in enumerate(lines):
    start = -1
    end = -1
    for j, c in enumerate(l):
        if c.isdigit() and start == -1:
            start = j
            end = j+1
        if c.isdigit() and start >=0:
            end = j+1
        if not c.isdigit() and start != -1:
            print(f"Found number {l[start:end]} at {start},{end}, Validating...")
            if is_part_of_number(start,end,i):
                numbers.append(int(l[start:end]))
            start = -1
            end = -1
    if start != -1:
        print(f"Found number {l[start:end]} at {start},{end}, Validating...")
        if is_part_of_number(start,end,i):
            numbers.append(int(l[start:end]))
    
    # print(numbers)
# print(data)
print("PART1:", sum(numbers))
part2 = 0
for k,v in gear_connections.items():
    if (len(v) == 2):
        # print("Found connection", k, v)
        part2 += v[0]*v[1]

print("PART2:", part2)