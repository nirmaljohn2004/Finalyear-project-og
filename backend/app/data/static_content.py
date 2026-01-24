TOPIC_DATA = {
    "python": {
        "1": {
            "title": "Variables & Data Types",
            "content": """
# Variables & Data Types in Python

In Python, a variable is not just a storage box; it is a label pointing to an object in memory. Because Python is **dynamically typed**, you don't declare the type explicitly. The interpreter infers it at runtime.

### Variable Assignment
Assignment creates a reference to an object.
```python
x = 10          # x now refers to an integer object 10
y = x           # y now refers to the SAME object 10
x = 20          # x now refers to a new object 20, y still refers to 10
```

### Standard Data Types
Python has several built-in types to handle data:

1.  **Numeric Types**:
    *   `int`: Arbitrary precision integers (e.g., `10`, `9999999999999`).
    *   `float`: Double precision floating-point numbers (e.g., `3.14`, `1.0`).
    *   `complex`: Complex numbers (e.g., `1 + 2j`).

2.  **Sequence Types**:
    *   `str`: Immutable sequence of Unicode characters.
    *   `list`: Mutable sequence of mixable types.
    *   `tuple`: Immutable sequence.

3.  **Mapping Type**:
    *   `dict`: Key-value pairs (Hash Map).

4.  **Set Types**:
    *   `set`: Unordered collection of unique items.
    *   `frozenset`: Immutable set.

5.  **Boolean Type**:
    *   `bool`: `True` or `False`.

6.  **None Type**:
    *   `None`: Represents the absence of a value.

### Type Conversion (Casting)
You can force an object to be a specific type.
```python
a = int(2.8)    # 2 (truncates decimal)
b = float(5)    # 5.0
c = str(100)    # "100"
d = list("abc") # ['a', 'b', 'c']
```
""",
            "examples": [
                """# Comprehensive Type Check
x = 10
y = 10.5
z = 1j
text = "Python"
is_fun = True

print(f"Type of x: {type(x)}")
print(f"Type of y: {type(y)}")
print(f"Type of z: {type(z)}")
print(f"Type of text: {type(text)}")
print(f"Type of is_fun: {type(is_fun)}")

# Casting
num_str = "123"
num_int = int(num_str)
print(f"Casted {num_str} to {num_int} + 1 = {num_int + 1}")
"""
            ],
            "practice_problem": "Create variables for your name (str), age (int), and height (float). Print a sentence using f-strings like: 'My name is X, I am Y years old and Z meters tall'.",
            "quiz": [
                {
                    "id": 101,
                    "question": "What happens if you assign a new value to an existing variable?",
                    "options": ["It throws an error", "The variable updates to reference the new object", "The old object is deleted immediately", "The variable keeps both values"],
                    "correctAnswer": "The variable updates to reference the new object"
                },
                {
                    "id": 102,
                    "question": "Which of these is immutable?",
                    "options": ["List", "Dictionary", "Set", "Tuple"],
                    "correctAnswer": "Tuple"
                }
            ]
        },
        "2": {
            "title": "Operators & Expressions",
            "content": """
# Operators & Expressions

Operators are special symbols that perform operations on operands (variables and values).

### 1. Arithmetic Operators
Used for mathematical calculations.
*   `+` (Add), `-` (Subtract), `*` (Multiply)
*   `/` (True Division): `5 / 2` is `2.5`
*   `//` (Floor Division): `5 // 2` is `2`
*   `%` (Modulus): Remainder of division. `5 % 2` is `1`.
*   `**` (Exponentiation): `2 ** 3` is `8`.

### 2. Comparison Operators
Return `True` or `False`.
*   `==` (Equal), `!=` (Not Equal)
*   `>`, `<`, `>=`, `<=`

### 3. Logical Operators
Combine conditional statements.
*   `and`: True if both are true.
*   `or`: True if at least one is true.
*   `not`: Inverses the boolean value.

### 4. Assignment Operators
*   `=`: Assigns value.
*   `+=`: `x += 5` is same as `x = x + 5`.
*   `*=`, `/=`, etc.

### 5. Identity & Membership Operators
*   `is`: Returns True if both variables are the *same object* in memory.
*   `in`: Returns True if a sequence with the specified value is present in the object.
""",
            "examples": [
                """# Modulus and Floor Division
seconds = 367
minutes = seconds // 60
remaining_seconds = seconds % 60
print(f"{seconds} seconds is {minutes} minutes and {remaining_seconds} seconds.")

# Logic
x = 10
y = 5
if x > 5 and y < 10:
    print("Both conditions met.")
"""
            ],
            "practice_problem": "Write a script that calculates the area of a circle (pi * r^2) given a radius r=5.",
            "quiz": [
                {
                    "id": 201,
                    "question": "What is the result of 2 ** 3?",
                    "options": ["6", "8", "9", "5"],
                    "correctAnswer": "8"
                },
                {
                    "id": 202,
                    "question": "What does 'is' operator check?",
                    "options": ["Value equality", "Memory reference identity", "Type equality", "Membership"],
                    "correctAnswer": "Memory reference identity"
                }
            ]
        },
        "3": {
            "title": "Control Flow (if / else)",
            "content": """
# Control Flow: if, elif, else

Control flow allows your program to make decisions. Python uses **indentation** (whitespace) to define code blocks, unlike C++ or Java which use braces `{}`.

### The `if` Statement
Evaluates a condition. If true, the indented block runs.

```python
age = 18
if age >= 18:
    print("You are an adult.")
```

### The `else` Statement
Runs if the `if` condition was false.

```python
if age >= 18:
    print("Adult")
else:
    print("Minor")
```

### The `elif` Statement
Checks multiple conditions sequentially.
```python
score = 85
if score >= 90:
    print("A")
elif score >= 80:
    print("B")
else:
    print("C")
```

### Nested Ifs
You can place if statements inside other if statements. Just increase indentation.

### Ternary Operator
One-line conditional assignment:
```python
status = "Adult" if age >= 18 else "Minor"
```
""",
            "examples": [
                """# Grading System
score = int(input("Enter score: "))

if score >= 90:
    grade = 'A'
elif score >= 80:
    grade = 'B'
elif score >= 70:
    grade = 'C'
elif score >= 60:
    grade = 'D'
else:
    grade = 'F'

print(f"Your grade is: {grade}")
"""
            ],
            "practice_problem": "Write a program that takes three numbers as input and prints the largest one.",
            "quiz": [
                {
                    "id": 301,
                    "question": "What signifies a block of code in Python?",
                    "options": ["Parentheses", "Curly Braces", "Indentation", "Semicolons"],
                    "correctAnswer": "Indentation"
                },
                {
                    "id": 302,
                    "question": "How to write a one-line if-else?",
                    "options": ["x = 5 if y > 0 else 0", "if y > 0 then x = 5 else x = 0", "x = (y > 0) ? 5 : 0", "None of these"],
                    "correctAnswer": "x = 5 if y > 0 else 0"
                }
            ]
        },
        "4": {
            "title": "Loops (for / while)",
            "content": """
# Loops in Python

Loops allow you to execute a block of code repeatedly.

### The `while` Loop
Repeats as long as a boolean condition is true. Be careful of infinite loops!

```python
i = 1
while i <= 5:
    print(i)
    i += 1
```

### The `for` Loop
Iterates over a sequence (list, tuple, dictionary, set, or string).

```python
fruits = ["apple", "banana", "cherry"]
for x in fruits:
    print(x)
```

### The `range()` Function
Generates a sequence of numbers.
*   `range(5)` -> 0, 1, 2, 3, 4
*   `range(2, 6)` -> 2, 3, 4, 5
*   `range(0, 10, 2)` -> 0, 2, 4, 6, 8 (Step value)

### Loop Control Statements
*   `break`: Terminates the loop completely.
*   `continue`: Skips the rest of the current iteration and jumps to next.
*   `pass`: Do nothing (placeholder).
""",
            "examples": [
                """# Sum of numbers 1 to 100
total = 0
for i in range(1, 101):
    total += i
print(f"Sum 1-100: {total}")

# Finding strict match
target = "Banana"
for f in ["Apple", "Banana", "Cherry"]:
    if f == target:
        print("Found it!")
        break
"""
            ],
            "practice_problem": "Write a loop that prints all even numbers between 1 and 20.",
            "quiz": [
                {
                    "id": 401,
                    "question": "What does range(1, 5) produce?",
                    "options": ["1, 2, 3, 4, 5", "1, 2, 3, 4", "0, 1, 2, 3, 4", "2, 3, 4"],
                    "correctAnswer": "1, 2, 3, 4"
                },
                {
                    "id": 402,
                    "question": "Which statement skips the current iteration?",
                    "options": ["break", "skip", "continue", "pass"],
                    "correctAnswer": "continue"
                }
            ]
        },
        "5": {
            "title": "Functions (Basics)",
            "content": """
# Functions (Basics)

Functions are reusable blocks of code. They allow you to modularize your logic.

### Defining a Function
Use the `def` keyword.

```python
def my_function():
    print("Hello from a function")
```

### Parameters & Arguments
You can pass data to functions.
```python
def greet(name):
    print(f"Hello, {name}")
```

### Return Values
Use `return` to send a result back to the caller. If no `return` statement is used, the function returns `None` by default.

```python
def add(a, b):
    return a + b
```

### Default Parameter Values
You can specify default values.
```python
def country(c = "India"):
    print(c)
    
country("USA") # USA
country()      # India
```

### Keyboard Arguments (kwargs)
You can send arguments with `key=value` syntax to ignore order.
""",
            "examples": [
                """def calculate_total(price, tax_rate=0.05):
    return price + (price * tax_rate)

print(calculate_total(100))        # 105.0
print(calculate_total(100, 0.1))   # 110.0
"""
            ],
            "practice_problem": "Write a function `is_palindrome(s)` that takes a string and returns True if it reads the same backward as forward.",
            "quiz": [
                {
                    "id": 501,
                    "question": "What is the default return value of a function?",
                    "options": ["0", "False", "None", "Undefined"],
                    "correctAnswer": "None"
                },
                {
                    "id": 502,
                    "question": "How do you define a default parameter value?",
                    "options": ["def func(p: 5)", "def func(p = 5)", "def func(p -> 5)", "def func(p == 5)"],
                    "correctAnswer": "def func(p = 5)"
                }
            ]
        },
        "6": {
            "title": "Data Structures",
            "content": """
# Python Data Structures

Python provides flexible built-in data structures.

### Lists
Ordered, mutable, allows duplicates.
```python
mylist = ["apple", "banana", "cherry"]
mylist[1] = "blackcurrant" # Changing an item
mylist.append("orange")    # Adding item
```

### Tuples
Ordered, immutable, allows duplicates. Faster than lists.
```python
mytuple = ("apple", "banana", "cherry")
# mytuple[1] = "kiwi"  # This would raise an error
```

### Sets
Unordered, unindexed, NO duplicates. Good for membership testing.
```python
myset = {"apple", "banana", "cherry"}
myset.add("orange")
```

### Dictionaries
Key-Value pairs. Keys must be unique and immutable.
```python
mydict = {
  "brand": "Ford",
  "model": "Mustang",
  "year": 1964
}
x = mydict["model"]
```
""",
            "examples": [
                """# List Operations
nums = [1, 2, 3, 4, 5]
nums.append(6)
nums.pop()    # Removes last
nums.reverse()
print(nums)

# Dict Operations
phonebook = {"Alice": "123", "Bob": "456"}
for name, number in phonebook.items():
    print(f"{name}: {number}")
"""
            ],
            "practice_problem": "Given a list of numbers, write a program to remove duplicates using a Set.",
            "quiz": [
                {
                    "id": 601,
                    "question": "Which data structure is immutable?",
                    "options": ["List", "Dictionary", "Tuple", "Set"],
                    "correctAnswer": "Tuple"
                },
                {
                    "id": 602,
                    "question": "How do you access a value in a dictionary?",
                    "options": ["dict[index]", "dict.get(value)", "dict[key]", "dict(key)"],
                    "correctAnswer": "dict[key]"
                }
            ]
        },
        "7": {
            "title": "String & List Manipulation",
            "content": """
# String & List Manipulation

Using built-in methods effectively is key to Python programming.

### String Methods
*   `s.lower()`, `s.upper()`: Case conversion.
*   `s.strip()`: Removes whitespace.
*   `s.split(delimiter)`: Splits string into list.
*   `s.replace(old, new)`: Replaces substrings.
*   `s.find(sub)`: Returns index or -1.

### Slicing
Access parts of strings or lists.
`sequence[start:stop:step]`
```python
text = "Hello World"
print(text[0:5])   # Hello
print(text[::-1])  # dlroW olleH (Reverse)
```

### List Comprehensions
A concise way to create lists.
```python
squares = [x**2 for x in range(10)]
evens = [x for x in range(10) if x % 2 == 0]
```
""",
            "examples": [
                """# Palindrome check with slicing
def is_palindrome(s):
    cleaned = s.lower().replace(" ", "")
    return cleaned == cleaned[::-1]

print(is_palindrome("Race car")) # True

# List Comprehension
words = ["apple", "banana", "cherry"]
lengths = [len(w) for w in words]
print(lengths)
"""
            ],
            "practice_problem": "Write a one-line list comprehension to generate a list of all numbers divisible by 3 from 1 to 50.",
            "quiz": [
                {
                    "id": 701,
                    "question": "What does 'text[::-1]' do?",
                    "options": ["Returns the last char", "Reverses the string", "Slices first char", "Error"],
                    "correctAnswer": "Reverses the string"
                },
                {
                    "id": 702,
                    "question": "Which method splits a string into a list?",
                    "options": ["splice()", "cut()", "split()", "divide()"],
                    "correctAnswer": "split()"
                }
            ]
        },
        "8": {
            "title": "File Handling",
            "content": """
# File Handling

Python uses the `open()` function to interact with files.

### Opening Files
`f = open("filename.txt", mode)`
Modes:
*   `'r'`: Read (default). Error if missing.
*   `'w'`: Write. Creates file, truncates existing content.
*   `'a'`: Append. Creates if missing, adds to end.
*   `'x'`: Create. Error if exists.

### Context Managers (`with`)
Always use `with` to ensure files close automatically.
```python
with open("test.txt", "w") as f:
    f.write("Hello World")
```

### Reading
*   `f.read()`: Read entire file.
*   `f.readline()`: Read one line.
*   `f.readlines()`: Read lines into a list.
""",
            "examples": [
                """# Write and Read
filename = "notes.txt"

# Writing
with open(filename, "w") as f:
    f.write("Line 1\\n")
    f.write("Line 2\\n")

# Reading
with open(filename, "r") as f:
    for line in f:
        print(line.strip())
"""
            ],
            "practice_problem": "Write a script that reads a text file and counts the number of words in it.",
            "quiz": [
                {
                    "id": 801,
                    "question": "Which mode truncates the file before writing?",
                    "options": ["'r'", "'a'", "'w'", "'x'"],
                    "correctAnswer": "'w'"
                },
                {
                    "id": 802,
                    "question": "Why use 'with open(...)'?",
                    "options": ["Faster execution", "Automatic file closing", "Required syntax", "Better memory usage"],
                    "correctAnswer": "Automatic file closing"
                }
            ]
        },
        "9": {
            "title": "Exception Handling",
            "content": """
# Exception Handling

Manage runtime errors using `try`, `except`, `else`, and `finally`.

### Basic Syntax
```python
try:
    # Risky code
    x = 1 / 0
except ZeroDivisionError:
    # Handle specific error
    print("Cannot divide by zero")
except Exception as e:
    # Handle generic error
    print(f"Error: {e}")
else:
    # Runs if NO exception occurred
    print("Success")
finally:
    # Runs ALWAYS (cleanup)
    print("Done")
```

### Raising Exceptions
You can enforce errors using `raise`.
```python
if x < 0:
    raise ValueError("Number must be positive")
```
""",
            "examples": [
                """def safe_divide(a, b):
    try:
        return a / b
    except ZeroDivisionError:
        return None

print(safe_divide(10, 2)) # 5.0
print(safe_divide(5, 0))  # None
"""
            ],
            "practice_problem": "Write a function that asks for integer input and simply keeps asking until the user enters a valid integer (handling ValueError).",
            "quiz": [
                {
                    "id": 901,
                    "question": "Which block executes if NO error occurs?",
                    "options": ["try", "except", "else", "finally"],
                    "correctAnswer": "else"
                },
                {
                    "id": 902,
                    "question": "Which block executes ALWAYS?",
                    "options": ["try", "except", "else", "finally"],
                    "correctAnswer": "finally"
                }
            ]
        },
        "10": {
            "title": "Functions (Advanced)",
            "content": """
# Helper Functions & Advanced Concepts

### Lambda Functions
Anonymous small functions.
`lambda arguments : expression`
```python
add = lambda a, b : a + b
print(add(5, 6))
```

### Map, Filter, Reduce
Functional programming tools.
*   `map(func, iter)`: Apply func to all items.
*   `filter(func, iter)`: Keep items where func returns true.
*   `reduce(func, iter)`: Aggregate items.

### args and kwargs
*   `*args`: Pass variable number of non-keyword arguments (tuple).
*   `**kwargs`: Pass variable number of keyword arguments (dict).

```python
def sum_all(*args):
    return sum(args)
```
""",
            "examples": [
                """# Filter with Lambda
nums = [1, 2, 3, 4, 5, 6]
evens = list(filter(lambda x: x % 2 == 0, nums))
print(evens) # [2, 4, 6]

# Args
def student_info(**kwargs):
    for key, value in kwargs.items():
        print(f"{key}: {value}")

student_info(name="John", age=22, course="CS")
"""
            ],
            "practice_problem": "Use map() and lambda to square all numbers in a list [1, 2, 3, 4, 5].",
            "quiz": [
                {
                    "id": 1001,
                    "question": "What is a lambda function?",
                    "options": ["A large function", "An anonymous single-expression function", "A loop", "A type of class"],
                    "correctAnswer": "An anonymous single-expression function"
                },
                {
                    "id": 1002,
                    "question": "What does *args receive?",
                    "options": ["A dictionary", "A list", "A tuple of positional arguments", "A string"],
                    "correctAnswer": "A tuple of positional arguments"
                }
            ]
        },
        "11": {
            "title": "OOP in Python",
            "content": """
# Object-Oriented Programming (OOP)

Python is an object-oriented language. Almost everything in Python is an object, with its own properties (attributes) and methods.

### Classes and Objects
*   **Class**: Blueprint.
*   **Object**: Instance.

### `__init__` Method
The constructor. Called when object is created.
### `self` Parameter
Reference to the current instance.

```python
class Dog:
    def __init__(self, name, breed):
        self.name = name
        self.breed = breed
    
    def bark(self):
        print("Woof!")
```

### Inheritance
Child class inherits from Parent class.
```python
class Puppy(Dog):
    pass
```
""",
            "examples": [
                """class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance
        
    def deposit(self, amount):
        self.balance += amount
        print(f"Deposited {amount}. New Balance: {self.balance}")
        
    def withdraw(self, amount):
        if amount > self.balance:
            print("Insufficient funds")
        else:
            self.balance -= amount
            print(f"Withdrew {amount}. New Balance: {self.balance}")

acct = BankAccount("Alice", 100)
acct.deposit(50)
acct.withdraw(20)
"""
            ],
            "practice_problem": "Create a class Rectangle with attributes length and width, and a method area().",
            "quiz": [
                {
                    "id": 1101,
                    "question": "What is __init__?",
                    "options": ["A regular method", "The constructor method", "The destructor", "A variable"],
                    "correctAnswer": "The constructor method"
                },
                {
                    "id": 1102,
                    "question": "What keyword is used for inheritance?",
                    "options": ["extends", "inherits", "Parent(Child)", "class Child(Parent):"],
                    "correctAnswer": "class Child(Parent):"
                }
            ]
        },
        "12": {
            "title": "Modules & Packages",
            "content": """
# Modules and Packages

Modular programming helps organize code.

### Modules
A file containing Python definitions and statements.
```python
import math
print(math.sqrt(16))
```

### Packages
A directory containing multiple modules and a special `__init__.py` file.

### Installing Packages (pip)
Use `pip install package_name` to install third-party libraries (e.g., `requests`, `numpy`).

### Import Variations
*   `import module`
*   `from module import function`
*   `import module as alias`
""",
            "examples": [
                """# Custom Module Usage
# Save this in utils.py
# def add(x, y): return x + y

# In main.py
# from utils import add
# print(add(5, 3))

import random
print(f"Random dice roll: {random.randint(1, 6)}")
"""
            ],
            "practice_problem": "Import the 'datetime' module and print the current date and time.",
            "quiz": [
                {
                    "id": 1201,
                    "question": "What file marks a directory as a package?",
                    "options": ["main.py", "__init__.py", "package.py", "config.py"],
                    "correctAnswer": "__init__.py"
                },
                {
                    "id": 1202,
                    "question": "How to give a module an alias?",
                    "options": ["import numpy alias np", "import numpy as np", "include numpy as np", "using numpy = np"],
                    "correctAnswer": "import numpy as np"
                }
            ]
        },
        "13": {
            "title": "Working with APIs",
            "content": """
# Working with APIs

Python is excellent for interacting with REST APIs, primarily using the `requests` library.

### GET Request
Retrieve data from a server.
```python
import requests
response = requests.get('https://api.github.com')
print(response.status_code)
print(response.json())
```

### POST Request
Send data to a server.
```python
requests.post('url', data={'key': 'value'})
```

### JSON Handling
APIs typically communicate via JSON. Python's `json` module helps parse this.
""",
            "examples": [
                """import requests
import json

# Mock API request
# response = requests.get("https://jsonplaceholder.typicode.com/todos/1")
# if response.status_code == 200:
#     data = response.json()
#     print(f"Task Title: {data['title']}")

print("Use 'pip install requests' to run real examples.")
"""
            ],
            "practice_problem": "Write a script using 'requests' to fetch data from a public API (like CoinGecko or a weather API) and print specific fields.",
            "quiz": [
                {
                    "id": 1301,
                    "question": "Which HTTP method retrieves data?",
                    "options": ["POST", "PUT", "GET", "DELETE"],
                    "correctAnswer": "GET"
                },
                {
                    "id": 1302,
                    "question": "Which Python library is standard for HTTP requests?",
                    "options": ["http", "urllib", "requests", "fetch"],
                    "correctAnswer": "requests"
                }
            ]
        },
        "14": {
            "title": "Algorithms Basics",
            "content": """
# Algorithms Basics: Sorting & Searching

Understanding basic algorithms is key to writing efficient code.

### Time Complexity (Big O)
Measure of how execution time grows with input size.
*   O(1): Constant
*   O(n): Linear
*   O(n^2): Quadratic

### Sorting Algorithms
*   **Bubble Sort**: Simple, slow (O(n^2)).
*   **Merge Sort**: Faster (O(n log n)).
*   Python's built-in `sort()` uses Timsort (highly optimized).

### Searching
*   **Linear Search**: Check every item. O(n).
*   **Binary Search**: Sorted lists only. Divide and conquer. O(log n).
""",
            "examples": [
                """# Binary Search Implementation
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1

nums = [1, 3, 5, 7, 9, 11]
idx = binary_search(nums, 7)
print(f"Found 7 at index {idx}")
"""
            ],
            "practice_problem": "Implement Bubble Sort manually for a list of integers.",
            "quiz": [
                {
                    "id": 1401,
                    "question": "What is the time complexity of Binary Search?",
                    "options": ["O(n)", "O(n^2)", "O(log n)", "O(1)"],
                    "correctAnswer": "O(log n)"
                },
                {
                    "id": 1402,
                    "question": "Binary Search requires the list to be...",
                    "options": ["Large", "Numeric", "Sorted", "Unique"],
                    "correctAnswer": "Sorted"
                }
            ]
        },
        "15": {
            "title": "Mini Project",
            "content": """
# Mini Project: Automation Script

Let's combine our skills (File Handling, Strings, OS) to build something useful.

### Project: File Organizer
**Goal**: Organize a downloads folder by moving files into folders based on extension (Images, PDFs, Installers).

### Logic
1.  List all files in directory.
2.  Extract file extension.
3.  Check if dictionary maps extension to a folder.
4.  If yes, move file to that folder.

### Libraries
*   `os`: For directory listing and path manipulation.
*   `shutil`: For moving files.
""",
            "examples": [
                """import os
import shutil

# Mock logic
def organize_files():
    extensions = {
        'Images': ['.jpg', '.png', '.jpeg'],
        'Docs': ['.pdf', '.txt', '.docx']
    }
    
    print("Organizer script template ready.")
    # for filename in os.listdir('.'):
    #     ... logic here
"""
            ],
            "practice_problem": "Complete the File Organizer script to actually move files in a test directory.",
            "quiz": [
                {
                    "id": 1501,
                    "question": "Which module allows moving files?",
                    "options": ["os", "sys", "shutil", "move"],
                    "correctAnswer": "shutil"
                },
                {
                    "id": 1502,
                    "question": "What function lists files in a directory?",
                    "options": ["os.list()", "os.listdir()", "shutil.list()", "dir()"],
                    "correctAnswer": "os.listdir()"
                }
            ]
        }
    },
    "java": {
        "1": {
            "title": "Variables & Data Types",
            "content": """
# Java Variables & Data Types

Java is a **statically typed** language, meaning you must declare the variable type before using it. This helps catch errors at compile time.

### Declaring Variables
Syntax: `type variableName = value;`

```java
int myNum = 5;               // Integer (whole number)
float myFloatNum = 5.99f;    // Floating point number
char myLetter = 'D';         // Character
boolean myBool = true;       // Boolean
String myText = "Hello";     // String (Text)
```

### Primitive Data Types
Java has 8 primitive data types:
*   `byte`, `short`, `int`, `long`: Whole numbers
*   `float`, `double`: Fractional numbers
*   `boolean`: True or False
*   `char`: Single character (surrounded by single quotes)

### Non-Primitive Types
*   `String`, `Arrays`, `Classes` (These refer to objects)
""",
            "examples": [
                """public class Main {
  public static void main(String[] args) {
    String name = "John Doe";
    int age = 25;
    double height = 5.9;
    boolean isStudent = true;

    System.out.println("Name: " + name);
    System.out.println("Age: " + age);
    System.out.println("Is Student: " + isStudent);
  }
}
"""
            ],
            "practice_problem": "Create a Java program that declares variables for a book's title (String), pages (int), and price (double), then prints them.",
            "quiz": [
                {
                    "id": 1101,
                    "question": "Which data type is used to store text in Java?",
                    "options": ["String", "Char", "Text", "str"],
                    "correctAnswer": "String"
                },
                {
                    "id": 1102,
                    "question": "How do you correctly declare an integer?",
                    "options": ["num x = 5;", "int x = 5;", "x = 5;", "Integer x = 5;"],
                    "correctAnswer": "int x = 5;"
                },
                {
                    "id": 1103,
                    "question": "Which of these is a primitive data type?",
                    "options": ["String", "ArrayList", "boolean", "Scanner"],
                    "correctAnswer": "boolean"
                }
            ]
        },
        "2": {
            "title": "Operators & Expressions",
            "content": """
# Operators in Java

Operators are used to perform operations on variables and values. Java divides operators into the following groups:

### Arithmetic Operators
*   `+` Adds two values
*   `-` Subtracts one value from another
*   `*` Multiplies two values
*   `/` Divides one value by another
*   `%` Modulus (returns the division remainder)
*   `++` Increment (increases value by 1)
*   `--` Decrement (decreases value by 1)

### Comparison Operators
*   `==` Equal to
*   `!=` Not equal
*   `>` Greater than
*   `<` Less than

### Logical Operators
*   `&&` standard "AND"
*   `||` standard "OR"
*   `!` standard "NOT"
""",
            "examples": [
                """public class Main {
  public static void main(String[] args) {
    int x = 10;
    int y = 3;
    
    System.out.println("Addition: " + (x + y));
    System.out.println("Modulus: " + (x % y)); // Remainder of 10/3 is 1
    
    boolean isAdult = x > 18;
    System.out.println("Is Adult (x>18): " + isAdult);
  }
}
"""
            ],
            "practice_problem": "Write a program to calculate the area and perimeter of a rectangle with length=5 and width=8.",
            "quiz": [
                {
                    "id": 1201,
                    "question": "Which operator returns the remainder of a division?",
                    "options": ["/", "rem", "%", "mod"],
                    "correctAnswer": "%"
                },
                {
                    "id": 1202,
                    "question": "What is the result of 5 > 3 && 2 < 4?",
                    "options": ["true", "false", "error", "null"],
                    "correctAnswer": "true"
                },
                {
                    "id": 1203,
                    "question": "Which operator increments an integer by 1?",
                    "options": ["+", "++", "+=", "add"],
                    "correctAnswer": "++"
                }
            ]
        },
        "3": {
            "title": "Control Flow (if/else)",
            "content": """
# Java Conditions and If Statements

Java supports logical conditions from mathematics. You can use these conditions to perform different actions for different decisions.

### The `if` Statement
Use `if` to specify a block of Java code to be executed if a condition is `true`.

### The `else` Statement
Use `else` to specify a block of code to be executed if the same condition is `false`.

### The `else if` Statement
Use `else if` to specify a new condition to test, if the first condition is `false`.

### Syntax
```java
if (condition) {
  // block of code to be executed if the condition is true
} else if (condition2) {
  // block of code to be executed if condition2 is true
} else {
  // block of code to be executed if conditions are false
}
```
""",
            "examples": [
                """public class Main {
  public static void main(String[] args) {
    int time = 20;
    
    if (time < 12) {
      System.out.println("Good morning.");
    } else if (time < 18) {
      System.out.println("Good day.");
    } else {
      System.out.println("Good evening.");
    }
  }
}
"""
            ],
            "practice_problem": "Write a Java program that checks if a number is even or odd.",
            "quiz": [
                {
                    "id": 1301,
                    "question": "Which keyword matches 'else if' in Java?",
                    "options": ["elif", "elseif", "else if", "unless"],
                    "correctAnswer": "else if"
                },
                {
                    "id": 1302,
                    "question": "Conditions in an if-statement must be enclosed in...",
                    "options": ["{}", "[]", "()", "<>"],
                    "correctAnswer": "()"
                }
            ]
        },
        "4": {
            "title": "Loops (for / while)",
            "content": """
# Java Loops

Loops can execute a block of code as long as a specified condition is reached. Loops are handy because they save time, reduce errors, and make code more readable.

### While Loop
The `while` loop loops through a block of code as long as a specified condition is `true`.

### For Loop
When you know exactly how many times you want to loop through a block of code, use the `for` loop.

```java
for (statement 1; statement 2; statement 3) {
  // code block to be executed
}
```
*   **Statement 1**: Executed one time before the block.
*   **Statement 2**: Defines the condition for executing the block.
*   **Statement 3**: Executed every time after the block.
""",
            "examples": [
                """public class Main {
  public static void main(String[] args) {
    // While Loop
    int i = 0;
    while (i < 5) {
      System.out.println("While Count: " + i);
      i++;
    }

    // For Loop
    for (int j = 0; j < 5; j++) {
      System.out.println("For Count: " + j);
    }
  }
}
"""
            ],
            "practice_problem": "Write a Java program to print the multiplication table of 5 using a for loop.",
            "quiz": [
                {
                    "id": 1401,
                    "question": "Which loop is best when you know the number of iterations?",
                    "options": ["while", "do-while", "for", "foreach"],
                    "correctAnswer": "for"
                },
                {
                    "id": 1402,
                    "question": "In 'for(int i=0; i<5; i++)', what does 'i++' do?",
                    "options": ["Initializes i", "Checks condition", "Increments i", "Stops loop"],
                    "correctAnswer": "Increments i"
                }
            ]
        },
        "5": {
            "title": "Methods (Basics)",
            "content": """
# Java Methods

A method is a block of code which only runs when it is called. Methods are used to perform certain actions (functions).
Why duplicate code? Methods allow you to reuse code: define the code once, and use it many times.

### Declaring a Method
```java
public class Main {
  static void myMethod() {
    System.out.println("I just got executed!");
  }
}
```
*   `myMethod()` is the name of the method
*   `static` means the method belongs to the Main class and not an object of the Main class.
*   `void` means that this method does not have a return value.

### Parameters and Return Values
You can pass data to methods as parameters, and methods can return data using the `return` keyword.
""",
            "examples": [
                """public class Main {
  // Method meant to calculate sum
  static int add(int x, int y) {
    return x + y;
  }

  public static void main(String[] args) {
    int result = add(5, 10);
    System.out.println("Result: " + result);
  }
}
"""
            ],
            "practice_problem": "Write a method called 'checkAge' that takes an integer age and prints 'Access Granted' if age >= 18, else 'Access Denied'.",
            "quiz": [
                {
                    "id": 1501,
                    "question": "Which keyword indicates a method returns no value?",
                    "options": ["null", "void", "empty", "static"],
                    "correctAnswer": "void"
                },
                {
                    "id": 1502,
                    "question": "How do you call a method named 'test'?",
                    "options": ["test;", "call test();", "test();", "run test"],
                    "correctAnswer": "test();"
                }
            ]
        },
        "6": {
            "title": "Data Structures",
            "content": """
# Java Data Structures

Java provides several data structures to store and organize data efficiently. The most common built-in array is limited in flexibility, so Java offers the **Collections Framework**.

### Arrays
Fixed size, fast access.
```java
int[] myNum = {10, 20, 30, 40};
```

### ArrayList
Resizable array. Found in `java.util` package.
```java
import java.util.ArrayList;

ArrayList<String> cars = new ArrayList<String>();
cars.add("Volvo");
cars.add("BMW");
```

### HashMap
Stores data in key/value pairs.
```java
import java.util.HashMap;

HashMap<String, String> cities = new HashMap<String, String>();
cities.put("England", "London");
cities.put("Germany", "Berlin");
```
""",
            "examples": [
                """import java.util.ArrayList;

public class Main {
  public static void main(String[] args) {
    ArrayList<String> fruits = new ArrayList<String>();
    fruits.add("Apple");
    fruits.add("Banana");
    fruits.add("Cherry");
    
    System.out.println(fruits);
    System.out.println("Size: " + fruits.size());
  }
}
"""
            ],
            "practice_problem": "Create an ArrayList of Integers, add the numbers 1 through 5, and print the sum of all elements.",
            "quiz": [
                {
                    "id": 1601,
                    "question": "Which class is a resizable array?",
                    "options": ["Array", "ArrayList", "ListArray", "ResizableArray"],
                    "correctAnswer": "ArrayList"
                },
                {
                    "id": 1602,
                    "question": "HashMap stores data as...",
                    "options": ["Single values", "Key/Value pairs", "Linked lists", "Binary trees"],
                    "correctAnswer": "Key/Value pairs"
                }
            ]
        },
        "7": {
            "title": "String & Arrays",
            "content": """
# Strings and Arrays in Java

### Strings
Strings in Java are objects. The `String` class provides many methods to perform operations on strings.

*   `length()`
*   `toUpperCase()` / `toLowerCase()`
*   `indexOf()`
*   `substring()`

### Arrays
Arrays are used to store multiple values in a single variable.

```java
String[] cars = {"Volvo", "BMW", "Ford", "Mazda"};
System.out.println(cars[0]); // Outputs Volvo
```

### Loop Through an Array
```java
for (int i = 0; i < cars.length; i++) {
  System.out.println(cars[i]);
}
```
""",
            "examples": [
                """public class Main {
  public static void main(String[] args) {
    String txt = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    System.out.println("The length of the txt string is: " + txt.length());
    
    String[] letters = {"A", "B", "C"};
    for (String i : letters) {
      System.out.println(i);
    }
  }
}
"""
            ],
            "practice_problem": "Write a program that takes a sentence as a String and prints it in reverse order.",
            "quiz": [
                {
                    "id": 1701,
                    "question": "How do you find the length of a string named 'text'?",
                    "options": ["text.size()", "text.length()", "len(text)", "text.length"],
                    "correctAnswer": "text.length()"
                },
                {
                    "id": 1702,
                    "question": "Arrays in Java have a fixed...",
                    "options": ["Type", "Size", "Value", "Name"],
                    "correctAnswer": "Size"
                }
            ]
        },
        "8": {
            "title": "File Handling",
            "content": """
# Java File Handling

File handling is an important part of any application. Java has several methods for creating, reading, updating, and deleting files.

### The File Class
The `File` class from the `java.io` package allows us to work with files.

```java
import java.io.File;

File myObj = new File("filename.txt");
```

### Creating and Writing
Use `FileWriter` to write to a file.

### Reading
Use `Scanner` to read from a file.
""",
            "examples": [
                """import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class Main {
  public static void main(String[] args) {
    try {
      FileWriter myWriter = new FileWriter("filename.txt");
      myWriter.write("Files in Java might be tricky, but it is fun enough!");
      myWriter.close();
      System.out.println("Successfully wrote to the file.");
    } catch (IOException e) {
      System.out.println("An error occurred.");
      e.printStackTrace();
    }
  }
}
"""
            ],
            "practice_problem": "Write a program that creates a file named 'data.txt' and writes 'Hello World' to it.",
            "quiz": [
                {
                    "id": 1801,
                    "question": "Which package contains the File class?",
                    "options": ["java.util", "java.io", "java.file", "java.system"],
                    "correctAnswer": "java.io"
                },
                {
                    "id": 1802,
                    "question": "Which class is commonly used to read text files line by line?",
                    "options": ["FileReader", "Scanner", "FileParser", "Reader"],
                    "correctAnswer": "Scanner"
                }
            ]
        },
        "9": {
            "title": "Exception Handling",
            "content": """
# Java Exceptions (Try...Catch)

When executing Java code, different errors can occur: coding errors made by the programmer, errors due to wrong input, or other unforeseeable things.

### Try and Catch
The `try` statement allows you to define a block of code to be tested for errors while it is being executed.
The `catch` statement allows you to define a block of code to be executed, if an error occurs in the try block.

```java
try {
  //  Block of code to try
}
catch(Exception e) {
  //  Block of code to handle errors
}
```

### Finally
The `finally` statement lets you execute code, after try...catch, regardless of the result.
""",
            "examples": [
                """public class Main {
  public static void main(String[] args) {
    try {
      int[] myNumbers = {1, 2, 3};
      System.out.println(myNumbers[10]);
    } catch (Exception e) {
      System.out.println("Something went wrong.");
    } finally {
      System.out.println("The 'try catch' is finished.");
    }
  }
}
"""
            ],
            "practice_problem": "Write a program that divides two numbers provided by the user and catches the ArithmeticException if division by zero occurs.",
            "quiz": [
                {
                    "id": 1901,
                    "question": "Which block executes regardless of whether an exception occurred?",
                    "options": ["always", "finally", "catch", "default"],
                    "correctAnswer": "finally"
                },
                {
                    "id": 1902,
                    "question": "Which keyword is used to throw an exception manually?",
                    "options": ["raise", "throw", "throws", "exception"],
                    "correctAnswer": "throw"
                }
            ]
        },
        "10": {
            "title": "Methods (Advanced)",
            "content": """
# Advanced Method Concepts

### Method Overloading
With method overloading, multiple methods can have the same name with different parameters.

```java
int myMethod(int x)
float myMethod(float x)
double myMethod(double x, double y)
```

### Recursion
Recursion is the technique of making a function call itself. This technique provides a way to break complicated problems down into simple problems which are easier to solve.

```java
public static int sum(int k) {
  if (k > 0) {
    return k + sum(k - 1);
  } else {
    return 0;
  }
}
```
""",
            "examples": [
                """public class Main {
  static int plusMethod(int x, int y) {
    return x + y;
  }
  
  static double plusMethod(double x, double y) {
    return x + y;
  }

  public static void main(String[] args) {
    int myNum1 = plusMethod(8, 5);
    double myNum2 = plusMethod(4.3, 6.26);
    System.out.println("int: " + myNum1);
    System.out.println("double: " + myNum2);
  }
}
"""
            ],
            "practice_problem": "Write a recursive method to calculate the factorial of a number.",
            "quiz": [
                {
                    "id": 2001,
                    "question": "What allows methods to have the same name but different parameters?",
                    "options": ["Overriding", "Overloading", "Recursion", "Resizing"],
                    "correctAnswer": "Overloading"
                },
                {
                    "id": 2002,
                    "question": "What is essential in a recursive function to stop it from running forever?",
                    "options": ["A loop", "A halting condition (Base Case)", "A counter", "A return 0"],
                    "correctAnswer": "A halting condition (Base Case)"
                }
            ]
        },
        "11": {
            "title": "OOP in Java",
            "content": """
# Object-Oriented Programming in Java

OOP is a programming paradigm based on the concept of "objects".

### Classes and Objects
*   **Class**: Template/Blueprint.
*   **Object**: Instance of the class.

### Attributes and Methods
Variables in classes are attributes, and functions are methods.
""",
            "examples": [
                """public class Main {
  int x = 5;

  public static void main(String[] args) {
    Main myObj = new Main();
    System.out.println(myObj.x);
  }
}
"""
            ],
            "practice_problem": "Create a class 'Person' with private variables name and age. Provide public getter and setter methods to access and update them.",
            "quiz": [
                {
                    "id": 2101,
                    "question": "Which keyword is used for inheritance?",
                    "options": ["implements", "inherits", "extends", "super"],
                    "correctAnswer": "extends"
                },
                {
                    "id": 2102,
                    "question": "Why use encapsulation?",
                    "options": ["To hide implementations details", "To make code faster", "To use less memory", "Required by Java"],
                    "correctAnswer": "To hide implementations details"
                }
            ]
        },
        "12": {
            "title": "Packages & Interfaces",
            "content": """
# Packages and Interfaces

### Java Packages
A package is a grouping of related classes and interfaces.
*   **Built-in Packages**: `java.util`, `java.io`, etc.
*   **User-defined Packages**: Create your own.

### Interfaces
An `interface` is a completely "abstract class" that is used to group related methods with empty bodies.
""",
            "examples": [
                """interface Animal {
  public void animalSound();
  public void sleep();
}

class Pig implements Animal {
  public void animalSound() {
    System.out.println("The pig says: wee wee");
  }
  public void sleep() {
    System.out.println("Zzz");
  }
}

public class Main {
  public static void main(String[] args) {
    Pig myPig = new Pig();
    myPig.animalSound();
    myPig.sleep();
  }
}
"""
            ],
            "practice_problem": "Create an interface 'Shape' with a method 'getArea()'. Implement it in classes 'Rectangle' and 'Circle'.",
            "quiz": [
                {
                    "id": 2201,
                    "question": "Which keyword is used to use an interface?",
                    "options": ["extends", "implements", "inherits", "matches"],
                    "correctAnswer": "implements"
                },
                {
                    "id": 2202,
                    "question": "Can an interface have method bodies?",
                    "options": ["Yes", "No (prior to Java 8 default methods)", "Only static ones", "Always"],
                    "correctAnswer": "No (prior to Java 8 default methods)"
                }
            ]
        },
        "13": {
            "title": "Multithreading",
            "content": """
# Multithreading in Java

Threads allows a program to operate more efficiently by doing multiple things at the same time.

### Creating a Thread
1.  Extend the `Thread` class.
2.  Implement the `Runnable` interface.
""",
            "examples": [
                """public class Main extends Thread {
  public static void main(String[] args) {
    Main thread = new Main();
    thread.start();
    System.out.println("This code is outside of the thread");
  }
  
  public void run() {
    System.out.println("This code is running in a thread");
  }
}
"""
            ],
            "practice_problem": "Write a program with two threads. One prints numbers 1-5, the other prints letters A-E.",
            "quiz": [
                {
                    "id": 2301,
                    "question": "Which method must be implemented for a Thread?",
                    "options": ["start()", "init()", "run()", "execute()"],
                    "correctAnswer": "run()"
                },
                {
                    "id": 2302,
                    "question": "How do you start a thread implementation?",
                    "options": ["run()", "start()", "go()", "begin()"],
                    "correctAnswer": "start()"
                }
            ]
        },
        "14": {
            "title": "Collections Framework",
            "content": """
# Java Collections Framework

The Collections Framework is a unified architecture for representing and manipulating collections (groups of objects).

### Key Interfaces
*   **List**: Ordered, allow duplicates. (`ArrayList`, `LinkedList`)
*   **Set**: Unordered, no duplicates. (`HashSet`, `TreeSet`)
*   **Map**: Key-Value pairs. (`HashMap`, `TreeMap`)
""",
            "examples": [
                """import java.util.ArrayList;
import java.util.Collections;

public class Main {
  public static void main(String[] args) {
    ArrayList<Integer> myNumbers = new ArrayList<Integer>();
    myNumbers.add(33);
    myNumbers.add(15);
    myNumbers.add(20);
    
    Collections.sort(myNumbers);  // Sort cars
    
    for (int i : myNumbers) {
      System.out.println(i);
    }
  }
}
"""
            ],
            "practice_problem": "Create a HashMap storing student names(String) and grades(Integer). Print only students with grades > 75.",
            "quiz": [
                {
                    "id": 2401,
                    "question": "Which collection prevents duplicate elements?",
                    "options": ["List", "Map", "Set", "Queue"],
                    "correctAnswer": "Set"
                },
                {
                    "id": 2402,
                    "question": "Which class helps sort lists?",
                    "options": ["Arrays", "Collections", "Lists", "Sorter"],
                    "correctAnswer": "Collections"
                }
            ]
        },
        "15": {
            "title": "Mini Project (JDBC)",
            "content": """
# Mini Project: Database Connectivity (JDBC)

Java Database Connectivity (JDBC) is an API which defines how a client may access a database. It is a Java-based data access technology used for Java database connectivity.

### Key Components
1.  **DriverManager**: Manages a list of database drivers.
2.  **Connection**: Interface with specific database.
3.  **Statement**: Objects used to execute SQL queries.
4.  **ResultSet**: Holds data retrieved from a database.

### Project Task
Create a simple console-based Student Management System that can:
1.  Add a Student
2.  View all Students
3.  Update Student details
4.  Delete a Student

(Note: You will need a database like MySQL or H2 set up for this).
""",
            "examples": [
                """import java.sql.*;

public class Main {
  public static void main(String[] args) {
    try {
      // Mock connection for example
      // Connection con = DriverManager.getConnection("jdbc:mysql://localhost:3306/sonoo", "root", "root");
      System.out.println("Connecting to database...");
      System.out.println("Connected (Mock)!");
      
      // Statement stmt = con.createStatement();
      // ResultSet rs = stmt.executeQuery("select * from emp");
      // while (rs.next())
      //   System.out.println(rs.getInt(1) + "  " + rs.getString(2));
      // con.close();
    } catch (Exception e) {
      System.out.println(e);
    }
  }
}
"""
            ],
            "practice_problem": "Implement the 'Add Student' functionality using JDBC PreparedStatement.",
            "quiz": [
                {
                    "id": 2501,
                    "question": "What does JDBC stand for?",
                    "options": ["Java Database Connectivity", "Java Data Base Connection", "Joint Database Connector", "Java Data Connector"],
                    "correctAnswer": "Java Database Connectivity"
                },
                {
                    "id": 2502,
                    "question": "Which object is used to execute a static SQL statement?",
                    "options": ["Connection", "Statement", "ResultSet", "DriverManager"],
                    "correctAnswer": "Statement"
                }
            ]
        }
    }
}
