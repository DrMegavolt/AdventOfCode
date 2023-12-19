import os
import collections
import re
folder = os.path.dirname(__file__)
data = open(folder + "/input1.txt", "r").read().splitlines()

parts = []
workflows = dict()

for row in data:
    if row == '':
        continue

    if row[0] == '{':
        [x1, m1, a1, s1] = row[1:-1].split(',')
        part = {
            "x": int(x1[2:]),
            "m": int(m1[2:]),
            "a": int(a1[2:]),
            "s": int(s1[2:])
        }
        parts.append(part)

    [name, rules] = row[0:-1].split('{')
    rules = rules.split(',')
    workflows[name] = rules

accepted = []


def exec_workflow(name, part):
    rules = workflows[name]
    for rule in rules:
        if rule.find(":") == -1:
            return rule

        [cmd, next] = rule.split(':')
        field = cmd[0]
        op = cmd[1]
        value = int(cmd[2:])

        if op == '>':
            if part[field] > value:
                return next
        if op == '<':
            if part[field] < value:
                return next


pile = collections.deque()
for part in parts:
    pile.append(('in', part))

while len(pile) > 0:
    [name, part] = pile.pop()
    res = exec_workflow(name, part)
    if res == "A":
        accepted.append(part)
    elif res == "R":
        continue
    else:
        pile.append((res, part))

print(accepted)
part1 = 0
for part in accepted:
    part1 += part['s'] + part['a'] + part['m'] + part['x']

print(part1)

min_val =1
max_val = 4001
breaking_points = {
    "x": set([min_val, max_val]),
    "m": set([min_val, max_val]),
    "a": set([min_val, max_val]),
    "s": set([min_val, max_val])
}


def test_point(part):
    pile = collections.deque()
    pile.append(('in', part))

    while len(pile) > 0:
        [name, part] = pile.pop()
        res = exec_workflow(name, part)
        if res == "A":
            return True
        elif res == "R":
            return False
        else:
            pile.append((res, part))
    return False


for w in workflows:
    rules = workflows[w]
    for rule in rules:
        if rule.find(":") == -1:
            continue

        [cmd, next] = rule.split(':')
        field = cmd[0]
        op = cmd[1]
        value = int(cmd[2:])

        if op == '>':
            breaking_points[field].add(value+1)  # convert to equivalent <
        if op == '<':
            breaking_points[field].add(value)


for bp in breaking_points:
    breaking_points[bp] = sorted(breaking_points[bp])

print(breaking_points)
part2 = 0
for ix in range(len(breaking_points['x'])-1):
    x1 = breaking_points['x'][ix]
    x2 = breaking_points['x'][ix+1]

    x_test = x1
    print("x_test", x_test)
    for im in range(len(breaking_points['m'])-1):
        m1 = breaking_points['m'][im]
        m2 = breaking_points['m'][im+1]

        m_test = m1
        print("  m_test",m_test)
        for ia in range(len(breaking_points['a'])-1):
            a1 = breaking_points['a'][ia]
            a2 = breaking_points['a'][ia+1]

            a_test = a1
            for is_ in range(len(breaking_points['s'])-1):
                s1 = breaking_points['s'][is_]
                s2 = breaking_points['s'][is_+1]

                s_test = s1
                part = {
                    "x": x_test,
                    "m": m_test,
                    "a": a_test,
                    "s": s_test
                }
                if test_point(part):
                    # print("found:", part)
                    # print(x1, x2, m1, m2, a1, a2, s1, s2)
                    # print(x2-x1, m2-m1, a2-a1, s2-s1)
                    part2 += (x2-x1)*(m2-m1)*(a2-a1)*(s2-s1)
                    # print(part2)

print("part2", part2)
