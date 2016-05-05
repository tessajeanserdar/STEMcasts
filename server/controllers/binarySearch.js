// Binary search

// While Loop

function binarySearch (list,item) {
  var first = 0;
  var last = list.length - 1;
  var found = false;
  var midpoint;

  while (first <= last && !found){
    midpoint = Math.floor(first + last);
    if (list[midpoint] === item) {
      found = true;
    } else {
      if (item <= list[midpoint]) {
         last = midpoint - 1;
      } else {
         first = midpoint + 1;
      }
    }
  }

  return found 
}

var testlist = [0, 1, 2, 8, 13, 17, 19, 32, 42,]

console.log(binarySearch(testlist, 3))
console.log(binarySearch(testlist, 13))



// Recursive Solution 