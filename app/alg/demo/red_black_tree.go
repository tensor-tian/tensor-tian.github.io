package demo

const (
	colorRed   = true
	colorBlack = false
)

type node struct {
	key, val    int
	left, right *node
	color       bool
	sz          int
}

func (o *node) isRed() bool {
	if o == nil {
		return false
	}
	return o.color == colorRed
}

func (o *node) size() int {
	if o == nil {
		return 0
	}
	return o.sz
}

// RedBlackTree 一个红黑树实现的 ordered map
type RedBlackTree struct {
	root *node
}

func NewRedBlackTree() *RedBlackTree {
	return &RedBlackTree{}
}

func (t *RedBlackTree) Len() int {
	return t.root.size()
}

func (t *RedBlackTree) Get(key int) (val int, ok bool) {
	x := t.root.get(key)
	if x == nil {
		return
	}
	return x.val, true
}

func (o *node) get(key int) (x *node) {
	if o == nil {
		return nil
	}
	if key < o.key {
		return o.left.get(key)
	} else if key > o.key {
		return o.right.get(key)
	} else {
		return o
	}
}

func (t *RedBlackTree) Put(key, val int) {
	t.root = t.root.put(key, val)
	t.root.color = colorBlack
}

func (o *node) put(key, val int) (x *node) {
	x = o
	if x == nil {
		return &node{key: key, val: val, color: colorRed, sz: 1}
	}
	if key < x.key {
		x.left = x.left.put(key, val)
	} else if key > x.key {
		x.right = x.right.put(key, val)
	} else {
		x.val = val
	}
	return x.balance()
}

func (t *RedBlackTree) Delete(key int) (val int, ok bool) {
	x := t.root.get(key)
	if x == nil {
		return
	}
	val = x.val
	sz := t.root.size()
	if !t.root.left.isRed() && !t.root.right.isRed() {
		t.root.color = colorRed
	}
	t.root = t.root.del(key)
	if t.root != nil {
		t.root.color = colorBlack
	}
	ok = sz == t.root.size()+1
	return
}

func (o *node) del(key int) (x *node) {
	x = o
	if key < x.key {

		if !x.left.isRed() && !x.left.left.isRed() {
			x = x.moveRedLeft()
		}
		x.left = x.left.del(key)
	} else {
		if x.left.isRed() {
			x = x.rotateRight()
		}
		if key == x.key && x.right == nil {
			return nil
		}
		if !x.right.isRed() && !x.right.left.isRed() {
			x = x.moveRedRight()
		}
		if key == x.key {
			mn := x.right.getMin()
			x.key, x.val = mn.key, mn.val
			x.right = x.right.delMin()
		} else {
			x.right = x.right.del(key)
		}
	}
	return x.balance()
}

func (o *node) delMin() (x *node) {
	if o.left == nil {
		return nil
	}
	x = o
	if !x.left.isRed() && !x.left.left.isRed() {
		x = x.moveRedLeft()
	}
	x.left = x.left.delMin()
	return x.balance()
}

func (o *node) getMin() (x *node) {
	x = o
	for x.left != nil {
		x = x.left
	}
	return x
}


func (o *node) rotateLeft() (r *node) {
	r = o.right
	o.right, r.left = r.left, o
	r.color, o.color = o.color, colorRed
	r.sz, o.sz = o.sz, 1+o.left.size()+o.right.size()
	return r
}


func (o *node) rotateRight() (l *node) {
	l = o.left
	o.left, l.right = l.right, o
	l.color, o.color = o.color, colorRed
	l.sz, o.sz = o.sz, 1+o.left.size()+o.right.size()
	return l
}


func (o *node) flipColors() {
	o.color = !o.color
	o.left.color = !o.left.color
	o.right.color = !o.right.color
}

func (o *node) moveRedLeft() (x *node) {
	x = o
	x.flipColors()
	if x.right.left.isRed() {
		x.right = x.right.rotateRight()
		x = x.rotateLeft()
		x.flipColors()
	}
	return x
}

func (o *node) moveRedRight() (x *node) {
	x = o
	x.flipColors()
	if x.left.left.isRed() {
		x = x.rotateRight()
		x.flipColors()
	}
	return x
}


func (o *node) balance() (x *node) {
	x = o
	if x.right.isRed() && !x.left.isRed() {
		x = x.rotateLeft()
	}
	if x.left.isRed() && x.left.left.isRed() {
		x = x.rotateRight()
	}
	if x.right.isRed() && x.left.isRed() {
		x.flipColors()
	}
	x.sz = 1 + x.left.size() + x.right.size()
	return x
}
