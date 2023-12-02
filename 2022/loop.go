package main

import (
	"fmt"
	"time"
)

func main() {
	start := time.Now()
	for i := 0; i <= 1000000000000; i++ {
		if i%100000000 == 0 {
			elapsed := time.Since(start)
			fmt.Printf("Elapsed time after %d cycles: %s\n", i, elapsed)
			percentage := float64(i) / 1000000000000.0 * 100.0
			fmt.Printf("Progress: %.2f%%\n", percentage)
		}
	}
}
