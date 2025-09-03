package redBlackTree

import (
	"math/rand"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

const (
	mn = -10
	mx = 10
)

func TestNewRedBlackTree(t *testing.T) {
	rbt := NewRedBlackTree()
	mp := make(map[int]int)

	nums := randInts(mn, mx, 50)
	for i, num := range nums {
		rbt.Put(num, i)
		mp[num] = i
		checkRedBlackTree(rbt, t)
	}
	t.Run("get", func(t *testing.T) {
		for k, v := range mp {
			v2, ok := rbt.Get(k)
			assert.Truef(t, ok, "Get(%d)", k)
			assert.Equalf(t, v, v2, "Get(%d)", k)
		}
	})

	t.Run("delete", func(t *testing.T) {
		n := len(mp)
		assert.Equal(t, n, rbt.Len())
		for _, k := range nums {
			v1, ok1 := mp[k]
			if !ok1 {
				continue
			}
			v2, ok2 := rbt.Get(k)
			assert.Equal(t, ok1, ok2, "before Delete(%d)", k)
			assert.Equalf(t, v1, v2, "before Delete(%d)", k)

			if ok1 {
				n--
			}

			delete(mp, k)
			v3, ok3 := rbt.Delete(k)

			assert.Equal(t, v2, v3)
			assert.Equal(t, ok2, ok3)

			assert.Equal(t, ok1, ok3, "Delete(%d)", k)
			assert.Equalf(t, v1, v3, "Delete(%d)", k)
			assert.Equalf(t, n, rbt.Len(), "Delete(%d)", k)
			checkRedBlackTree(rbt, t)
		}
	})
}

func checkRedBlackTree(x *RedBlackTree, t *testing.T) {
	if x.root == nil {
		return
	}
	assert.True(t, isBST(x.root, mn-1, mx+1))
	assert.True(t, is23Tree(x.root))
	assert.True(t, isBalance(x.root))
	assert.True(t, isSizeConsistent(x.root))
}

func isBST(x *node, lb, rb int) bool {
	if x == nil {
		return true
	}
	return (lb < x.key && x.key < rb) && isBST(x.left, lb, x.key) && isBST(x.right, x.key, rb)
}

func is23Tree(x *node) bool {
	if x == nil {
		return true
	}
	return (!x.isRed() || !x.left.isRed() && !x.right.isRed()) && is23Tree(x.left) && is23Tree(x.right)
}

func isBalance(x *node) bool {
	if x == nil {
		return true
	}
	black := 0
	for o := x; o != nil; o = o.left {
		if !o.isRed() {
			black++
		}
	}
	var dfs func(o *node, black int) bool
	dfs = func(o *node, black int) bool {
		if o == nil {
			return black == 0
		}
		if !o.isRed() {
			black--
		}
		return dfs(o.left, black) && dfs(o.right, black)
	}
	return dfs(x, black)
}

func isSizeConsistent(x *node) bool {
	if x == nil {
		return true
	}
	return x.size() == 1+x.left.size()+x.right.size() && isSizeConsistent(x.left) && isSizeConsistent(x.right)
}

func randInts(mn, mx, n int) []int {
	rand.NewSource(time.Now().UnixNano())
	l := mx - mn + 1
	arr := make([]int, n)
	for i := 0; i < n; i++ {
		arr[i] = mn + rand.Intn(l)
	}
	return arr
}
