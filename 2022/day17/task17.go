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
		{false, true}, // plus
		{true, true, true},
		{false, true},
	},
	{
		{true}, // J: mirrored L, will fall < this way
		{true},
		{true, true, true},
	},
	{{true, true, true, true}},
}
var yOffset = 3
var rockCounter = 1

// simplification that can cause bugs:
//
//	REAl 2d      effective representation
//	@######      @######
//	 @  ###      @######
//	  @ ###      @######
//
// we are potentially missing scenario where rock can go under overhang
// ideally keep track of 2d array of rock positions, but that's too much memory/performance
// even if we constantly trim fully closed rows
// after ~31h run returns 1539644970428 counted by max column height, which is too high
var superCave = [7]int{-1, -1, -1, -1, -1, -1, -1}

var jetIndex = 0
var tmp = 0

func main() {
	// maxRocks := 2022
	maxRocks := 1000000000000
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
		dropRock(&rockCounter, jetPatterns)
	}
	maxHeight := 0
	for _, v := range superCave {
		if v > maxHeight {
			maxHeight = v
		}
	}

	fmt.Println("DONE", superCave)
	fmt.Println("DONE", maxHeight, tmp)
	fmt.Println("DONE", maxHeight-1)
	fmt.Println("DONE", yOffset-1)
}

//	func generateRock(rockCounter int) [][]bool {
//		rockType := rockTypes[rockCounter%5]
//		return rockType
//	}
var rockHeights = [5]int{2, 1, 3, 3, 4}

func rockHeight(rockType int) int {
	return rockHeights[rockType]
}

func dropRock(rockCounter *int, jetPatterns []int) {
	rockType := *rockCounter % 5
	rock := rockTypes[rockType]

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
			draw(rock, xOffset, yOffset-move) // freeze rock

			yOffset = Max(yOffset, yOffset+rockHeight(rockType)-move+3)
			*rockCounter++
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
func draw(rock [][]bool, xBase int, yBase int) {
	for x := 0; x < len(rock); x++ {
		row := rock[x]
		for y := 0; y < len(row); y++ {
			if row[y] {
				superCave[x+xBase] = y + yBase
			}
		}
	}
	// fmt.Println("superCave", superCave)
}

func checkNextStepValid(rock [][]bool, xOffset int, yOffset int, move int) bool {

	if xOffset+len(rock) > len(superCave) || xOffset < 0 {
		return false
	}
	if move <= 3 {
		// no obstacles
		return true
	}

	for x := 0; x < len(rock); x++ {
		row := rock[x]
		for y := 0; y < len(row); y++ {
			if !row[y] {
				continue
			}
			if superCave[x+xOffset] >= y+yOffset-move { // overlap
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

func nextJet(jetPatterns []int) int {
	jetIndex = (jetIndex) % len(jetPatterns)
	next := (jetPatterns)[jetIndex]
	jetIndex++
	return next
}
