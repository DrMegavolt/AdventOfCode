import os
import collections
folder = os.path.dirname(__file__)
lines = open(folder + "/input1.txt", "r").read().splitlines()


nodes = dict()
for l in lines[2:]:
    [node, lr] = l.split(' = ')
    [left, right] = lr.split(', ')
    left = left[1:]
    right = right[:-1]
    nodes[node] = [left, right]

# print(nodes)
starts = list(filter(lambda x: x[2] == 'A', nodes.keys()))


cycle_counters = []
for start in starts:
    counter = 0
    current = start
    directions = collections.deque(lines[0])
    while True:
        if current[2] == 'Z':
            break
        counter += 1

        d = directions[0]
        [left, right] = nodes[current]
        if d == 'L':
            current = left
        else:
            current = right

        directions.rotate(-1)
    cycle_counters.append(counter)

print("PART2:", cycle_counters)

# common denominator of cycle_counters
# 1. find prime factors of each number
# 2. choose common required prime factors to make each number
# 3. multiply common prime factors

# 1. find prime factors of each number


def get_prime_factors(num):
    factors = []
    i = 2
    while i * i <= num:
        if num % i:
            i += 1
        else:
            num //= i
            factors.append(i)
    if num > 1:
        factors.append(num)
    return factors


prime_factors = []
for c in cycle_counters:
    prime_factors.append(get_prime_factors(c))

print(prime_factors, get_prime_factors(8))

# 2. choose common required prime factors to make each number
factors = collections.Counter()
for i in range(len(prime_factors)):
    counted_factors = collections.Counter(prime_factors[i])
    for f in counted_factors:
        if f in factors:
            # let say we have 8=2*2*2 and 4=2*2, we need 2,2,2
            factors[f] = max(factors[f], counted_factors[f])
        else:
            factors[f] = counted_factors[f]


print(factors)

# 3. multiply common prime factors
common_denominator = 1
for f in factors:
    common_denominator *= f**factors[f]

print("PART2:", common_denominator) # 19185263738117
