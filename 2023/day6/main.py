import os
folder = os.path.dirname(__file__)
lines = open(folder +  "/input1.txt", "r").read().splitlines()

times = list(map(int, filter(lambda k: k!='' , lines[0].split(' ')[1:])))
distances = list(map(int, filter(lambda k: k!='' , lines[1].split(' ')[1:])))

print(times)
print(distances)

# dist = v*(time- hold_time); v = 1 * hold_time; 
# dist = hold_time(time - hold_time)

#d1 < k*(t1-k)
#d1 < k*t1 - k^2

# roots:
# k = (t1 +- sqrt(t1^2 - 4*d1))/2
counts = []
for i in range(len(times)):
    t1 = times[i] 
    d1 = distances[i]
    k1 = int((t1 + (t1**2 - 4*d1)**0.5)/2)
    k2 = int((t1 - (t1**2 - 4*d1)**0.5)/2)
    ways_to_win =  k1 - k2
    counts.append(ways_to_win)

print(counts)
# multiply all counts
from functools import reduce

print("PART1:", reduce(lambda a, b: a*b, counts))

# concat all times
t1 = int(str.join('', map(str, times)))
d1 = int(str.join('', map(str, distances)))

print(t1)
print(d1)

k1 = int((t1 + (t1**2 - 4*d1)**0.5)/2)
k2 = int((t1 - (t1**2 - 4*d1)**0.5)/2)


#final range: 0..[k2, k1]..t1
ways_to_win =  k1 - k2

print(k1)
print(k2)
print("PART2:", ways_to_win)