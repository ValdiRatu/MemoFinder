def fib(n):
    demo(n)
    if n == 0 or n == 1:
        return 1
    return fib(n-1) + fib(n-2)

def demo(n):
    n = n+1

if __name__ == "__main__":
    fib(5)