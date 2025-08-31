package main

import "fmt"

func indexOf(nums []int, target int) int {
	l, r := 0, len(nums)-1
	for l <= r {
		m := l + (r-l)/2
		if nums[m] == target {
			return m
		} else if nums[m] < target {
			l = m + 1
		} else {
			r = m - 1
		}
	}
	return -1
}

// binarySearch 左闭右闭
func binarySearch(n int, f func(int) bool) int {
	l, r := 0, n-1
	for l <= r {
		m := l + (r-l)/2
		if f(m) {
			r = m - 1
		} else {
			l = m + 1
		}
	}
	return l
}

// binarySearch2 左闭右开
func binarySearch2(n int, f func(int) bool) int {
	l, r := 0, n
	for l < r {
		m := l + (r-l)/2
		if f(m) {
			r = m
		} else {
			l = m + 1
		}
	}
	return l
}

func main() {
	const N = 1000
	nums := make([]int, N)
	for i := range nums {
		nums[i] = 1 + i*2
	}
	target := 40
	idx := binarySearch(len(nums), func(mid int) bool {
		return nums[mid] >= target
	})
	fmt.Println(idx < N && nums[idx] == target, idx, nums[idx], nums[idx-1], nums[idx+1])
}
