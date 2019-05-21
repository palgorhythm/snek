function LinkedList(...args) {
  this.head = null;
  this.tail = null;
  args.forEach(el => {
    this.push(el);
  })
}

function Node(val) {
  this.value = val;
  this.next = null;
  this.back = null;
}

LinkedList.prototype.findTail = function (curNode) {
  return !curNode.next ? curNode : this.findTail(curNode.next);
}

LinkedList.prototype.findVal = function (curNode, val) { // space/time complexity of using while vs. using recursion here ???
  return curNode === null ? null : curNode.value === val ? curNode : this.findVal(curNode.next, val);
}
// adds node to end of list
LinkedList.prototype.push = function(value) {
  const newNode = new Node(value);
  if (this.head){
    const oldTail = this.findTail(this.head);
    oldTail.next = newNode;
    newNode.back = oldTail;
  } else this.head = newNode;
};

// returns true if value is present in the list
LinkedList.prototype.contains = function(value) {
  return this.findVal(this.head, value) ? true : false;
};

// const LL = new LinkedList();
// LL.push(1);
// LL.push(2);
// LL.push(3);

// console.log(LL.contains(1));

// Bonus
// adds node to beginning of list
LinkedList.prototype.addToHead = function(value) {
  const newHead = new Node(value);
  newHead.next = this.head;
  this.head = newHead;
};

// Extra Bonus
// insert an item at the position specified
LinkedList.prototype.insert = function(value, position) {
  if (position === 0) this.addToHead(value);
  else {
    let currNode = this.head;
    let prevNode;
    for (let i = 0; i < position; i += 1){
      prevNode = currNode;
      currNode = currNode.next
    }
    prevNode.next = new Node(value);
    prevNode.next.next = currNode;
  }
}
// Extra Bonus
// remove first occurrence of value from list
LinkedList.prototype.removeItem = function(value) {

};

// Extra Bonus
// remove element at specified position in list
LinkedList.prototype.removePosition = function(position) {

};
