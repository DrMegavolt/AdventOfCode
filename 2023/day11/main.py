import os
import collections
folder = os.path.dirname(__file__)
space = open(folder +  "/input1.txt", "r").read().splitlines()
# find rows with only .
rows_to_expand = []
for y in range(len(space)):
    if space[y].count('.') == len(space[y]):
        rows_to_expand.append(y)
        # print("ROW:", y)

# find columns with only .
cols_to_expand = []
for x in range(len(space[0])):
    col = []
    for y in range(len(space)):
        col.append(space[y][x])
    if col.count('.') == len(col):
        cols_to_expand.append(x)
        # print("COL:", x)

# find galaxies
galaxies = []
for y in range(len(space)):
    for x in range(len(space[y])):
        if space[y][x] == '#':
            galaxies.append([x,y])

def find_path(g1, g2, scale_factor=2):
    # print("coords:", g1, g2)
    start_row = min(g1[1], g2[1])
    end_row = max(g1[1], g2[1])
    start_col = min(g1[0], g2[0])
    end_col = max(g1[0], g2[0])

    row_exp = list(filter(lambda r: r>start_row and r<end_row  , rows_to_expand))
    col_exp = list(filter(lambda c: c>start_col and c<end_col  , cols_to_expand))
    x = end_col - start_col + len(row_exp) * (scale_factor-1)
    y = end_row - start_row + len(col_exp) * (scale_factor-1)
    return x+y

# find paths for each pair of galaxies
paths = []
for i in range(len(galaxies)):
    for j in range(i+1, len(galaxies)):
        l = find_path(galaxies[i], galaxies[j])
        paths.append([l, i,j])


part1 = sum(map(lambda x: x[0], paths))
print("PART1:", part1) # 9647174

scale_factor = 1000000
paths = []
for i in range(len(galaxies)):
    for j in range(i+1, len(galaxies)):
        l = find_path(galaxies[i], galaxies[j], scale_factor)
        # print("PATH:",  i+1,'->', j+1 , '=', l)
        paths.append([l, i,j])

part2 = sum(map(lambda x: x[0], paths))
print("PART2:", part2) # 377318892554