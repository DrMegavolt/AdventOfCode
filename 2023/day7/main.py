import os
folder = os.path.dirname(__file__)
lines = open(folder +  "/input1.txt", "r").read().splitlines()

hands = []
for line in lines:
    print(line)
    [hand, bid]= line.split(" ")
    hands.append([hand, int(bid)])

# I can just have a list per type, but offset works fine too
l5_scale = 10**15
l4_scale = 10**14
l3_scale = 10**13
l2_scale = 10**12
l1_scale = 10**11
l0_scale = 10**10 # max card sum is a bit more than 1400000000 (<2*10^9) so 10^10 is enough

def resolve_type(hand):
    h = hand
    s = list(set(h))
    offset = 0
        # all cards are the same suit
    if len(s) == 1: # Five of a kind
        offset += l5_scale 
    
    elif len(s) == 2:
        if (h.count(s[0]) == 4 or h.count(s[1]) == 4):
            # Four of a kind
            offset += l4_scale
        else:
            # Full house
            offset += l3_scale
    elif len(s) == 3:
        if (h.count(s[0]) == 3 or h.count(s[1]) == 3 or h.count(s[2]) == 3):
            # Three of a kind
            offset += l2_scale
        else:
            # Two pairs
            offset += l1_scale
    elif len(s) == 4:
        # One pair
        offset += l0_scale
    return offset

cards = ["_", "2", "3", "4", "5", "6", "7", "8", "9", 'T', 'J', 'Q', 'K', 'A']
def sort_hands(hands):
    h =  hands[0]
    score = 0
    for i, card in enumerate(h):
        score += (cards.index(card) + 1) * 10**(2*(4-i)) # max is 14 * 10^8 = 1400000000
    score += resolve_type(h)
    # High card
    print(h, score)
    return score

hands.sort(key=sort_hands, reverse=True)

print(hands)
part1 = 0
for i, hand in enumerate(hands):
    print(len(hands)-i, hand[0], hand[1])
    part1 += (len(hands)-i) * hand[1]

print("PART1:", part1)

# PART2
# Joker weakest
cards = ["_", 'J', "2", "3", "4", "5", "6", "7", "8", "9", 'T', 'Q', 'K', 'A']
def sort_hands_joker(hands):
    h =  hands[0]
    s = list(set(h))
    offset = 0
    for i, card in enumerate(h):
        offset += (cards.index(card) + 1) * 10**(2*(4-i)) # max is 14 * 10^8 = 1400000000
    jokers = h.count("J")
    if (jokers==0):
        # no jokers
        offset += resolve_type(h)
    else:
        offsets = []
        for crd in s:
            subst_hand = h.replace("J", crd)
            # try all existing cards in place of joker
            offsets.append(resolve_type(subst_hand))
        offset += max(offsets)
    return offset

hands.sort(key=sort_hands_joker, reverse=True)
part2 = 0
for i, hand in enumerate(hands):
    print(len(hands)-i, hand[0], hand[1])
    part2 += (len(hands)-i) * hand[1]

print("part2:", part2)