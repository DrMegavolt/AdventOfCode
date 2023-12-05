import os
folder = os.path.dirname(__file__)
lines = open(folder +  "/input1.txt", "r").read().splitlines()

seeds = []
tables = dict()
tmp = []
key = ""
for l in lines:
    if l == '':
        continue
    # print(l)
    if l.startswith('seeds:'):
        seeds = list(map(int, l[7:].split(' ')))
        print(seeds)
    # seed-to-soil map:
    
    if l[0].isdigit():
        rules = list(map(int, l.split(' ')))
        tmp.append(rules)
    else:
        tables[key] = tmp
        key = l[:-5]
        tmp = []

tables[key] = tmp


def convert(source: int, rules) -> int:
    # brute force
    for i in range(len(rules)):
        [dest_start, src_start, length] = rules[i]
        src_end = src_start + length
        # print(source, "seeds:", f"{src_start}-{src_end}", f"soil: {dest_start}-{dest_start + length}", length)
        if source >= src_start and source < src_end:
            return dest_start + source - src_start

    return source # no rule, so same as source

locations = []
for seed in seeds:
    soil = convert(seed, tables['seed-to-soil'])
    # print(f"seed:{seed}->{soil}")
    fertilizer = convert(soil, tables['soil-to-fertilizer'])
    # print(f"soil:{soil}->{fertilizer}")
    water = convert(fertilizer, tables['fertilizer-to-water'])
    # print(f"fertilizer:{fertilizer}->{water}")
    light = convert(water, tables['water-to-light'])
    # print(f"water:{water}->{light}")
    temperature = convert(light, tables['light-to-temperature'])
    # print(f"light:{light}->{temperature}")
    humidity = convert(temperature, tables['temperature-to-humidity'])
    # print(f"temperature:{temperature}->{humidity}")
    location = convert(humidity, tables['humidity-to-location'])
    # print(f"humidity:{humidity}->{location}")
    locations.append(location)

print("PART1:", min(locations))

def convert_range(start: int, length: int, rules) -> []:
    """converts a range of numbers according to the rules
    only at edge points of the range or rules
    returns a list of [start, length] pairs
    """
    rules.sort(key=lambda x: x[1])
    maps = []
    for i in range(len(rules)):
        [dest_start, src_start, rule_length] = rules[i]
        src_end = src_start + rule_length
        
        # start is after the rule
        if (start >= src_end):
            print("rule skipped:", rules[i], start, src_end)
            continue
        # entire range is before the rule
        if (start + length < src_start):
            print("entire range is before the rule:", rules[i], start, length, src_start)
            maps.append([start, length]) # will map to the same number
            return maps
        # numbers before the rule maps to the same number
        if (start < src_start):
            maps.append([start, src_start - start])
            start = src_start
            length -= src_start - start
        if (length <=0):
            return maps
        # numbers inside the rule
        range_length = min(length, src_end - start)
        maps.append([dest_start + start - src_start, range_length])
        start += range_length
        length -= range_length
        if (length <=0):
            return maps
        # numbers after the rule
        # continue to the next rule


        print("rule processed:", rules[i])
    if (len(maps) == 0):
        # no rules matched, so same as source
        maps.append([start, length])
    return maps
    print(rules)

def convert_ranges(sources: [], rules) -> []:
    out = []
    for source in sources:
        out.extend(convert_range(source[0], source[1], rules))
    return out

# seeds on pairs
locations = []
# print(range(len(seeds),0, 2))
for i in range(0,len(seeds), 2):
    start = seeds[i]
    length = seeds[i+1]
    print(f"seed:{start}-{start+length}")
    soil = convert_range(start,length, tables['seed-to-soil'])
    print(soil)

    fertilizer=convert_ranges(soil, tables['soil-to-fertilizer'])
    print(f"soil:{soil}->{fertilizer}")
    water = convert_ranges(fertilizer, tables['fertilizer-to-water'])
    print(f"fertilizer:{fertilizer}->{water}")
    light = convert_ranges(water, tables['water-to-light'])
    print(f"water:{water}->{light}")
    temperature = convert_ranges(light, tables['light-to-temperature'])
    print(f"light:{light}->{temperature}")
    humidity = convert_ranges(temperature, tables['temperature-to-humidity'])
    print(f"temperature:{temperature}->{humidity}")
    location = convert_ranges(humidity, tables['humidity-to-location'])
    print(f"humidity:{humidity}->{location}")

    for l in location:
        locations.append(l[0]) # start of the range is the min location
print(len(locations))
print("PART2:", min(locations))