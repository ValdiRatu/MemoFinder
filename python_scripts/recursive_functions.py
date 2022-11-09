def fib(n):
    if n == 0 or n == 1:
        return 1
    return fib(n-1) + fib(n-2)

def binary_search(arr, target):
    if len(arr) == 0:
        return -1

    left, right = 0, len(arr)-1
    mid = left + right // 2

    if (arr[mid] == target):
        return mid
    elif (arr[mid] < target):
        return binary_search(arr[mid+1:], target)
    else:
        return binary_search(arr[:mid-1], target)

def fizzbuzz(n):
    if n == 1:
        print(1)
        return
    
    fizzbuzz(n-1)
    if n % 15 == 0:
        print("FizzBuzz")
    elif n % 3 == 0:
        print("Fizz")
    elif n % 5 == 0:
        print("Buzz")
    else:
        print(n)



if __name__ == "__main__":
    fib(20)
    binary_search([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 11)
    fizzbuzz(30)