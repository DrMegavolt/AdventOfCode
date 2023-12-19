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
        [x1,m1,a1,s1] = row[1:-1].split(',')
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

# print(parts)
# print()
# print(workflows)

accepted = []

def exec_workflow(name, part):
    rules = workflows[name]
    for rule in rules:
        if rule.find(":")==-1:
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
    pile.append(('in',part))

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