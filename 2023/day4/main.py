import os
folder = os.path.dirname(__file__)
lines = open(folder +  "/input1.txt", "r").read().splitlines()

part1 = 0
cards_matches = dict()
cards_count = dict()
for l in lines:
    [card, numbers] = l.split(':')
    [winning, my] = numbers.split('|')
    winning_numbers = winning.split(' ')
    my_numbers = my.split(' ')
    print(card, winning_numbers, my_numbers)
    match_count = 0
    for n in my_numbers:
        if n == '':
            continue
        if n in winning_numbers:
            print("MATCH:",n)
            match_count += 1

    print("MATCH COUNT:",match_count)
    key = int(card[5:])
    cards_matches[key] = match_count
    cards_count[key] = 1
    if match_count > 0:
        part1 += 2**(match_count-1)

print("PART1:",part1)

print(cards_matches)
print(cards_count)
for card in cards_matches:
    for i in range(card, card + cards_matches[card]):
        print("CARD:",card, i)
        if i+1 in cards_count:
            cards_count[i+1] += cards_count[card]
    print(cards_count)

part2 = 0
for card in cards_count:
    part2 += cards_count[card]

print("PART2:",part2)