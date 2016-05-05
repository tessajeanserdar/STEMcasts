# Binary Search

#While loop
def binarySearch(alist, item):
  first = 0
  last = len(alist) - 1
  found = False
  
  while first <= last and not found:
    # // is floor division 
    midpoint = alist//2
    if item == alist[midpoint]:
      found = true
    else :
      if item < alist[midpoint]:
        last = midpoint - 1
      else :
        last = midpoint + 1 

    return found

    testlist = [0, 1, 2, 8, 13, 17, 19, 32, 42,]
    print(binarySearch(testlist, 3))
    print(binarySearch(testlist, 13))

#Recursive
