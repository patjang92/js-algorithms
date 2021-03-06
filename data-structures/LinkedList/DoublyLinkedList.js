import DoublyLinkedListNode from './DoublyLinkedListNode';
import Comparator from '../../utils/comparator/Comparator';

/**
 * Implements Doubly Linked List class using Linked List nodes 
 */
export default class DoublyLinkedList {

  /**
   * Creates Linked List object with head node as argument
   * 
   */
  constructor(comparatorFunction) {
    this.head = null;
    this.compare = new Comparator(comparatorFunction);    
  }

  /**
   * Inserts node into beginning of list as new head
   * Runtime Complexity: O(1)
   * 
   * @param {LinkedListNode} node new node to be inserted in the beginning of the list
   */
  insertNode(node) {
    if (!node) return;

    // case where list is empty
    if (!this.head) {
      node.prev = null;
      node.next = null;
      this.head = node;
    } else {
      // all other cases more than 1 element
      this.head.prev = node;
      node.prev = null;
      node.next = this.head;
      this.head = node;
    }
  }

  /**
   * Creates a new node with given value and inserts it to the beginning of the list
   * Runtime Complexity: O(1)
   * 
   * @param {*} value 
   */
  insert(value) {
    const node = new DoublyLinkedListNode(value);
    this.insertNode(node);
  }

  /**
   * Appends node to the end of the list as new tail
   * Runtime Complexity: O(n)
   * 
   * @param {LinkedListNode} node new node to be appended at the end of the list
   */
  appendNode(node) {
    if (!node) return;

    // case where list is empty, head == tail == null
    if (!this.head) {
      node.prev = null;
      node.next = null;
      this.head = node;
    } else {
      let currentNode = this.head;
      while (currentNode.next != null) {
        currentNode = currentNode.next;
      }
      currentNode.next = node;
      node.prev = currentNode;
      node.next = null;
    }
  }

  /**
   * Creates a new node with given value and appends it to the end of the list
   * Runtime Complexity: O(n)
   * 
   * @param {*} value 
   */
  append(value) {
    const node = new DoublyLinkedListNode(value);
    this.appendNode(node);
  }

  /**
   * Deletes node from Linked List
   * Runtime Complexity: O(1)
   * 
   * @param {LinkedListNode} node node to be deleted from linked list 
   */
  deleteNode(node) {
    if (!node || !this.head) return;

    // case where node is head (1 element)
    if (this.head == node) {
      this.head = this.head.next;

      // case where list had more than 1 element and new head is not null
      if (this.head) {
        this.head.prev = null;
      }
    }
    // all other cases    
    else {
      // case where node is in the middle
      if (node.prev) {
        node.prev.next = node.next;
      }

      // case where node is in the end
      if (node.next != null) {
        node.next.prev = node.prev;
      }
    }
  }

  /**
   * Deletes first node with matching value from linked list
   * Runtime Complexity: O(n)
   * 
   * @param {*} value value to delete from linked list
   */
  delete(value) {
    let node = this.search(value);
    if (node) {
      deleteNode(node);
    }
  }

  /**
   * Searches and returns first node with matching value
   * Runtime Complexity: O(n)
   * 
   * @param {*} value: value that we wish to find in Linked List
   * @param {function} callback: optional callback to determine value equality
   */
  search(value, callback = null) {
    let currentNode = this.head;

    while (currentNode) {
      if (callback && callback(currentNode.value)) {
        return currentNode;
      } else if (value != undefined && this.compare.equal(currentNode.value, value)) {
        return currentNode;
      }

      currentNode = currentNode.next;
    }

    return currentNode;
  }

  /**
   * Inserts node into index
   * O(n)
   * 
   * @param {number} index 
   * @param {LinkedListNode} node 
   */
  insertNodeAtIndex(index, n) {
    // if index < 0 or !n return
    if (index < 0 || !n) return;

    // 1. index == 0, insert at front
    if (index == 0) {
      // is list nonempty?
      if (this.head) {
        this.head.prev = n;
        n.next = this.head;
        n.prev = null;
        this.head = n;
        return;
      }
      // list is empty
      else {
        n.next = null;
        n.prev = null;
        this.head = n;
        return;
      }
    }

    // 2. index must be > 0 so if list is empty then return
    if (!this.head) return;

    let distanceToIndex = index;
    let c = this.head;
    // 3. iterate until distance == 1 || c.next == null
    while (distanceToIndex > 1 && c.next != null) {
      distanceToIndex--;
      c = c.next;
    }

    // if distance > 1 and c.next == null, then return
    if (distanceToIndex > 1 && c.next == null) return;

    // insert node
    n.prev = c;
    n.next = c.next;

    // check if end of list
    if (c.next) {
      c.next.prev = n;
    }
    c.next = n;
  }

  
  /**
   * Deletes node at index
   * O(n)
   * 
   * @param {number} index 
   */
  deleteByIndex(index) {
    // 1. index < 0 || !this.head
    if (index < 0 || !this.head) return;


    // 2. index == 0
    if (index == 0) {
      this.head = this.head.next;

      // if not single element list
      if (this.head) {
        this.head.prev = null;
      }
      return;
    }

    // 3. go to index || c.next == null
    let c = this.head;
    let distanceToIndex = index;
    while (distanceToIndex > 1 && c.next != null) {
      distanceToIndex--;
      c = c.next;
    }

    // if distance >= 1 && c.next == null, out of bounds
    if (distanceToIndex >= 1 && c.next == null) return;

    // 4. delete and update
    c.next = c.next.next;
    if (c.next) {
      c.next.prev = c;
    }
  }

  /**
   * Get nth node from end (n being index)
   * 
   * @param {number} n 
   */
  getNthNodeFromEnd(n) {
    if (n < 0 || !this.head) return null;

    // get length
    let c = this.head;
    let length = 0;

    while (c) {
      length++;
      c = c.next;
    }

    // check n >= length
    if (n >= length) return null;

    // starting from length - 1 until n, cycle through
    c = this.head;
    let distanceToN = length - 1;

    while (distanceToN > n) {
      distanceToN--;
      c = c.next;
    }

    return c;
  }

  /**
   * Reverses nodes in list
   */
  reverse() {
    // 1. no list or single element
    if (!this.head || !this.head.next) return;

    // get c, prev, next and start
    let c = this.head;
    let prev = null;
    let next = null;
    while (c != null) {
      next = c.next;
      c.prev = c.next;
      c.next = prev;
      prev = c;
      c = next;
    }

    // reassign head
    this.head = prev;
  }

  /**
   * @param {function} [callback]
   * @return {string}
   */
  toString(callback) {
    return this.toArray().map(node => node.toString(callback)).toString();
  }
}