package main

import (
	"fmt"
	"io/ioutil"
	"time"
)

// tocktypes as array
var rockTypes = [5][][]bool{
	{
		{true, true}, // square
		{true, true},
	},
	{
		{true}, // horizontal
		{true}, // stick
		{true},
		{true},
	},
	{
		{false, true, false}, // plus
		{true, true, true},
		{false, true, false},
	},
	{
		{true, false, false}, // mirrored L, will fall ^ this way
		{true, false, false},
		{true, true, true},
	},
	{{true, true, true, true}},
}
var yOffset = 3
var rockCounter = 1
var superCave = [7]int{-1, -1, -1, -1, -1, -1, -1}

func main() {
	maxRocks := 2022
	jetPatterns := readInput()

	fmt.Println("Hello, playground", jetPatterns)

	start := time.Now()
	for i := 0; i <= maxRocks; i++ {
		if i%100000000 == 0 {
			elapsed := time.Since(start)
			fmt.Printf("Elapsed time after %d cycles: %s\n", i, elapsed)
			percentage := float64(i) / 1000000000000.0 * 100.0
			fmt.Printf("Progress: %.2f%%\n", percentage)
		}
		rock := generateRock(rockCounter)
		dropRock(rock, &jetPatterns)
		rockCounter += 1
	}
	fmt.Println("DONE", superCave)
}

func generateRock(rockCounter int) [][]bool {
	rockType := rockTypes[rockCounter%5]
	return rockType
}

func dropRock(rock [][]bool, jetPatterns *[]int) {
	// fmt.Println("dropping rock", rock)
	move := 0
	xOffset := 2 // 2 positions from the left wall

	for {
		// read jet pattern
		j := nextJet(jetPatterns)
		// // check of jet can push rock
		// // if yes, push rock
		isValidJetMove := checkNextStepValid(rock, xOffset+j, yOffset, move)

		if isValidJetMove {
			xOffset += j
		}

		// check if rock can fall
		// if yes, fall rock
		// if no, draw rock as # and move to next rock
		canFall := checkNextStepValid(rock, xOffset, yOffset, move+1)
		if canFall {
			move++
		} else {
			// draw rock as # and move to next rock
			//   console.log("DONE with rock:", rockCounter);
			rockCounter++

			draw(rock, xOffset, yOffset, move, "#") // freeze rock
			yOffset = Max(yOffset, yOffset+len(rock[0])-move+3)

			//   printCave();
			break
		}
	}
}
func Max(x, y int) int {
	if x < y {
		return y
	}
	return x
}
func draw(rock [][]bool, xOffset int, yOffset int, move int, symbol string) {
	for x := 0; x < len(rock); x++ {
		for y := 0; y < len(rock[0]); y++ {
			if rock[x][y] == true {
				superCave[x+xOffset] = y + yOffset - move
			}
		}
	}
}

func checkNextStepValid(rock [][]bool, xOffset int, yOffset int, move int) bool {

	if xOffset+len(rock) > len(superCave) || xOffset < 0 {
		return false
	}
	if move < 3 {
		// no obstacles
		return true
	}

	yShift := yOffset - move
	for x := 0; x < len(rock); x++ {
		for y := 0; y < len(rock[0]); y++ {
			if rock[x][y] != true {
				continue
			}
			newX := x + xOffset
			newY := y + yShift
			if superCave[newX] >= newY || // overlap
				newY < 0 {
				return false
			}
		}
	}
	return true
}

func readInput() []int {
	data, err := ioutil.ReadFile("./day17/input_test.txt")
	if err != nil {
		panic(err)
	}

	str := string(data)

	// Create a slice to hold the resulting values.
	result := make([]int, len(str))
	for i, c := range str {
		switch c {
		case '<':
			result[i] = -1
		case '>':
			result[i] = 1
		}
	}

	return result
}

func nextJet(jetPatterns *[]int) int {
	next := (*jetPatterns)[0]
	*jetPatterns = append((*jetPatterns)[1:], next)

	return next
}
