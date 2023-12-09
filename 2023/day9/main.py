import os
folder = os.path.dirname(__file__)
lines = open(folder + "/input1.txt", "r").read().splitlines()

readings = []
for l in lines:
    readings.append(list(map(int, l.split(' '))))


def compute_next_line(line):
    next_line = []
    for i in range(1, len(line)):
        diff = line[i] - line[i-1]
        next_line.append(diff)
    return next_line


def predict(reading):
    lines = [reading]
    next_line = reading
    while sum(map(abs, next_line)) > 0:
        next_line = compute_next_line(next_line)
        lines.append(next_line)
    future = 0
    for i in range(len(lines)):
        future += lines[i][-1]

    past = 0
    for i in range(len(lines), 0, -1):
        past = lines[i-1][0] - past
        # print(past, lines[i-1], '-->', lines[i-1][0])
    # print("PAST:", past)
    return [future, past]


part1 = 0
part2 = 0
for reading in readings:
    [f, p] = predict(reading)
    part1 += f
    part2 += p

print("PART1:", part1)
print("PART2:", part2)
# PART1: 1955513104
# PART2: 1131
