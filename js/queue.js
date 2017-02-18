/*

Queue.js

A function to represent a queue

Created by Stephen Morley - http://code.stephenmorley.org/ - and released under
the terms of the CC0 1.0 Universal legal code:

http://creativecommons.org/publicdomain/zero/1.0/legalcode

*/

/* Creates a new queue. A queue is a first-in-first-out (FIFO) data structure -
 * items are added to the end of the queue and removed from the front.
 */
function Queue() {

    // initialise the queue and offset
    var queue = [];

    /* Returns the length of the queue.
     */
    this.getLength = function () {

        // return the length of the queue
        return (queue.length);

    }

    this.getAt = function (index) {
        if (index > this.getLength())
            throw "Index overflow exception";
        return queue[index];
    }

    /* Returns true if the queue is empty, and false otherwise.
     */
    this.isEmpty = function () {

        // return whether the queue is empty
        return (queue.length == 0);

    }

    /* Enqueues the specified item. The parameter is:
     *
     * item - the item to enqueue
     */
    this.enqueue = function (item) {

        // enqueue the item
        queue.push(item);

    }

    this.data = function () {
        return queue;
    }

    /* Dequeues an item and returns it. If the queue is empty then undefined is
     * returned.
     */
    this.dequeue = function () {

        // if the queue is empty, return undefined
        if (queue.length == 0) return undefined;

        // store the item at the front of the queue
        var item = queue[0];

        queue.splice(0, 1);
        // return the dequeued item
        return item;

    }
}