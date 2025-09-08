package demo

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
