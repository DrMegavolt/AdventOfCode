import os
folder = os.path.dirname(__file__)
games = open(folder +  "/input1.txt", "r").read().splitlines()
sum = 0

max = {
    "green": 13,
    "red": 12,
    "blue": 14,
}
valid_ids = []
game_maxes = []
for g in games:
    [game, sets_data] = g.split(':')
    [_, gameId] = game.split(' ')
    sets = sets_data.split(';')

    game_max = {
        "green": 0,
        "red": 0,
        "blue": 0,
    }
    for i in range(len(sets)):
        color_data = sets[i].split(',')
        # print(color_data)
        for j in range(len(color_data)):
            [count, color] = color_data[j][1:].split(' ')
            # print(gameId, count, color)
            if int(count) > game_max[color]:
                game_max[color] = int(count)


    print(gameId, game_max)
    if game_max["green"] <= max["green"] and game_max["red"] <= max["red"] and game_max["blue"] <= max["blue"]:
        valid_ids.append(gameId)
        sum += int(gameId)
    
    game_maxes.append(game_max)

print("PART1:",sum)

sum2 = 0
for maxes in game_maxes:
    sum2 += maxes["green"]*maxes["red"]*maxes["blue"]
    # print(maxes, maxes['green']*maxes['red']*maxes['blue'])

print("PART2:",sum2)