import os
import collections
import re
folder = os.path.dirname(__file__)
data = open(folder + "/input1.txt", "r").read().splitlines()

field = []
fold = 5
part2 = 0

for row in data:
    print("row:", row, '----')
    [state, numbers] = row.split(' ')
    damaged_sequences = list(map(int, numbers.split(',')))
    full_sequence = []
    states = []
    for i in range(fold):
        full_sequence.extend(damaged_sequences)
        states.append(state)
    new_state = "?".join(states)
    new_state = new_state.strip('.')
    new_state = re.sub(r'\.{2,}', '.', new_state)
    field.append([new_state, full_sequence])

for id, row in enumerate(field):
    # print("row:", row)
    [state, numbers] = row
    if len(state) == sum(numbers) + len(numbers) - 1:  # all numbers are next to each other
        print("solvable:", state, "numbers:", numbers)
        part2 += 1
        field[id] = None

def is_valid_substr(sub, pattern ):
    if len(sub) > len(pattern):
        if len(sub) == len(pattern) + 1:
            sub = sub[:-1]
        else:
            return False
    for i in range(len(sub)):
        if pattern[i] != sub[i] and pattern[i] != '?':
            return False
   
    return True
cache = dict() # without cache too slow
def solve(state, numbers):
    cache_key = (state, tuple(numbers))
    if cache_key in cache:
        return cache[cache_key]

    min_length = sum(numbers) + len(numbers) - 1
    if len(state) < min_length:
        return 0
    
    if len(numbers) == 0:
        return int(state.find('#') == -1)

    delta = len(state) - min_length
    count = 0
    for i in range(delta+1):
        s1 = "."*i + "#"*numbers[0] +"."
        if is_valid_substr(s1, state):
            count+= solve(state[len(s1):], numbers[1:])
    
    cache[cache_key] = count
    return count

for row in field:
    if not row:
        print("fin:", "skip")
        continue
    [state, numbers] = row

    res = solve(state, numbers)
    print("fin:", res)
    part2 += res

print("part2:", part2)
