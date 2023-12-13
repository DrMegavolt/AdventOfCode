import os
import collections
import re
folder = os.path.dirname(__file__)
data = open(folder +  "/input1.txt", "r").read().splitlines()

field = []
for row in data:
    [state, numbers] = row.split(' ')
    damaged_sequences = list(map(int, numbers.split(',')))
    field.append([state, damaged_sequences])

# brute force
def generate_combinations(input):
    # . - working spring
    # # - damaged spring
    # ? - unknown spring
    [state, numbers] = input
    # print("state:", state, "numbers:", numbers)
    # ???.### 1,1,3

    # clean edges
    state = state.strip('.')
    # print("state:", state, "numbers:", numbers)

    combos = ['']
    # replace ? with . and # each symbol will generate 2 combinations
    for i in range(len(state)):

        if state[i] != '?':
            for j in range(len(combos)):
                combos[j] += state[i]
        else:
            new_combos = []
            for c in combos:
                new_combos.append((c + '.'))
                new_combos.append(c + '#')
            combos = new_combos
    return combos

def validate(state, numbers):
    # clean edges
    state = state.strip('.')
    state = re.sub(r'\.{2,}', '.', state)

    hashes = list(map(lambda n: "#"*n , numbers))
    expected = ".".join(hashes)
    return state == expected

part1 = 0
for i in range(len(field)):
    combos = generate_combinations(field[i])
    counter = 0
    for combo in combos:
        if validate(combo, field[i][1]):
            counter += 1
            # print("VALID", combo)
        # print(combo)
    print("counter:", counter)
    part1 += counter
    print()

print("part1:", part1)
