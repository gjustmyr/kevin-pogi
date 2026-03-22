# Exception Handling and File Operations

### Python Teaching Material — School Tutorial

---

## Course Information

| Detail       | Info                                 |
| ------------ | ------------------------------------ |
| Subject      | Computer Programming (Python)        |
| Topic        | Exception Handling & File Operations |
| Level        | Beginner to Intermediate             |
| Reading List | References 3, 4, 5, 6                |

---

## Learning Objectives

By the end of this lesson, you should be able to:

1. Explain what an exception is and why it occurs in a program.
2. Use `try`, `except`, `else`, and `finally` blocks to handle errors.
3. Identify and handle specific types of exceptions.
4. Open, read, write, and close files using Python.
5. Use different file modes appropriately.
6. Apply the context manager (`with` statement) for safe file handling.

---

## Introduction

When writing programs, two very common challenges are:

- **Errors at runtime** — what happens when the user types the wrong thing, or a file is missing?
- **Working with files** — how do we save data permanently or load data from a file?

This lesson teaches you both skills, which are essential for building real-world Python programs.

---

## Part 1: Exception Handling

---

## Subtopic 1: Exception Handling

### What is an Exception?

An **exception** is an error that happens while your program is _running_ (not while writing it). When Python encounters an error it cannot handle, it **raises** (throws) an exception and stops the program.

**Example without exception handling (program crashes):**

```python
number = int(input("Enter a number: "))   # User types "hello"
print(10 / number)                         # Program crashes!
```

Output if user types `"hello"`:

```
ValueError: invalid literal for int() with base 10: 'hello'
```

This is not good for users. Exception handling prevents this crash.

---

### The try-except Block

The basic structure of exception handling:

```
try:
    [code that might cause an error]
except [ErrorType]:
    [code that runs if the error happens]
```

**Simple Example:**

```python
try:
    number = int(input("Enter a number: "))
    print("You entered:", number)
except ValueError:
    print("That is not a valid number!")
```

Now if the user types `"hello"`, the program shows a friendly message instead of crashing.

---

### The finally Block

The `finally` block **always runs**, whether an error happens or not. It is useful for cleanup tasks (like closing a file).

```
try:
    [code that might cause an error]
except [ErrorType]:
    [code that runs if the error happens]
finally:
    [code that ALWAYS runs]
```

---

### The else Block

The `else` block runs **only if no error occurred** in the `try` block.

```
try:
    [code that might cause an error]
except [ErrorType]:
    [code that runs if the error happens]
else:
    [code that runs only when no error occurred]
finally:
    [code that ALWAYS runs]
```

---

### Complete Example — All Four Blocks

```python
try:
    number = int(input("Enter a number: "))
    result = 10 / number

except ValueError:
    print("Error: Please enter a valid whole number.")

except ZeroDivisionError:
    print("Error: Cannot divide by zero.")

else:
    print("Success! Result is:", result)   # Only runs if no error

finally:
    print("Program finished.")              # Always runs
```

**Test it with these inputs:**

| Input   | What Happens                         |
| ------- | ------------------------------------ |
| `5`     | Prints result = 2.0, then "finished" |
| `0`     | ZeroDivisionError, then "finished"   |
| `hello` | ValueError, then "finished"          |

---

### Handling Multiple Exceptions

You can catch different error types separately:

```python
try:
    age = int(input("Enter your age: "))
    result = 100 / age
    print("100 divided by your age is:", result)

except ValueError:
    print("Please enter a number, not text.")

except ZeroDivisionError:
    print("Age cannot be zero!")

except Exception as e:
    # Catch ANY other unexpected error
    print("An unexpected error occurred:", e)
```

> **Tip:** `except Exception as e` is a catch-all that captures any error and stores its message in `e`.

---

### Common Exception Types

| Exception           | When It Occurs                                   | Example                          |
| ------------------- | ------------------------------------------------ | -------------------------------- |
| `ValueError`        | Wrong value for the data type                    | `int("hello")`                   |
| `ZeroDivisionError` | Dividing a number by zero                        | `10 / 0`                         |
| `FileNotFoundError` | Trying to open a file that doesn't exist         | `open("missing.txt", "r")`       |
| `TypeError`         | Operation on incompatible data types             | `"age" + 5`                      |
| `IndexError`        | Accessing a list index that doesn't exist        | `mylist[100]` when list is short |
| `KeyError`          | Accessing a dictionary key that doesn't exist    | `mydict["missing_key"]`          |
| `NameError`         | Using a variable before defining it              | `print(x)` without `x = ...`     |
| `AttributeError`    | Calling a method that doesn't exist on an object | `"hello".push("x")`              |

---

### Raising Your Own Exceptions

You can raise exceptions intentionally using the `raise` keyword:

```python
def set_age(age):
    if age < 0:
        raise ValueError("Age cannot be negative!")
    print("Age set to:", age)

try:
    set_age(-5)
except ValueError as e:
    print("Error:", e)
```

Output:

```
Error: Age cannot be negative!
```

---

### Real-World Example — Input Validation Loop

This keeps asking until the user gives valid input:

```python
while True:
    try:
        score = int(input("Enter your score (0-100): "))
        if score < 0 or score > 100:
            raise ValueError("Score must be between 0 and 100.")
        print("Score accepted:", score)
        break   # Exit the loop if everything is fine
    except ValueError as e:
        print("Invalid input:", e)
        print("Please try again.\n")
```

---

### Practice Exercise 1

**Instructions:** Write a program that:

1. Asks the user to enter two numbers.
2. Divides the first number by the second.
3. Handles `ValueError` (non-numeric input) and `ZeroDivisionError`.
4. Prints the result if successful, or an error message if not.
5. Always prints "Calculation complete." at the end using `finally`.

**Sample Output:**

```
Enter first number: 10
Enter second number: 2
Result: 5.0
Calculation complete.
```

---

---

## Part 2: File Operations

---

## Subtopic 2: File Operations

### What is a File?

A **file** is a collection of data stored permanently on your computer (hard drive, USB, etc.). Unlike variables, files keep their data even after your program closes.

Python can work with two kinds of files:

- **Text files** — plain text (`.txt`, `.csv`, `.py`, etc.)
- **Binary files** — images, videos, PDFs, etc.

In this lesson, we focus on **text files**.

---

### 1. Opening and Closing Files

Before reading or writing a file, you must **open** it. After you are done, you must **close** it.

**Syntax:**

```python
file = open("filename.txt", "mode")
# ... do things with the file ...
file.close()
```

**Example:**

```python
# Open a file for reading
file = open("notes.txt", "r")
content = file.read()
print(content)
file.close()   # Always close after use!
```

> **Important:** If you forget to close a file, it can cause data loss or errors. That is why the context manager (covered later) is recommended.

---

### 2. File Modes

The **mode** tells Python what you want to do with the file.

| Mode | Full Name    | Description                                              | Creates file if missing? |
| ---- | ------------ | -------------------------------------------------------- | ------------------------ |
| `r`  | Read         | Opens file for reading. Error if file doesn't exist.     | No                       |
| `w`  | Write        | Opens file for writing. **Erases existing content!**     | Yes                      |
| `a`  | Append       | Adds new content to the end without erasing old content. | Yes                      |
| `r+` | Read & Write | Opens for both reading and writing.                      | No                       |
| `rb` | Read Binary  | Reads binary data (images, videos, etc.)                 | No                       |
| `wb` | Write Binary | Writes binary data.                                      | Yes                      |

**Key difference between `w` and `a`:**

```python
# "w" mode — OVERWRITES the file every time
file = open("log.txt", "w")
file.write("First entry\n")
file.close()

file = open("log.txt", "w")
file.write("Second entry\n")   # First entry is GONE!
file.close()

# "a" mode — ADDS to the file each time
file = open("log.txt", "a")
file.write("First entry\n")
file.close()

file = open("log.txt", "a")
file.write("Second entry\n")   # Both entries are kept!
file.close()
```

---

### 3. Reading Files

Python provides three methods to read file content:

| Method        | Returns | Description                            |
| ------------- | ------- | -------------------------------------- |
| `read()`      | `str`   | Reads the entire file as one string    |
| `readline()`  | `str`   | Reads a single line (moves the cursor) |
| `readlines()` | `list`  | Reads all lines into a list            |

**Step 1:** First, create a sample text file to work with.

Create a file called `students.txt` with this content (manually or with Python):

```
Alice
Bob
Carla
David
```

**Using `read()` — Read entire file:**

```python
with open("students.txt", "r") as file:
    content = file.read()   # Returns the full text as one string
    print(content)
```

Output:

```
Alice
Bob
Carla
David
```

---

**Using `readline()` — Read one line at a time:**

```python
with open("students.txt", "r") as file:
    line1 = file.readline()   # Reads first line
    line2 = file.readline()   # Reads second line
    print(line1)
    print(line2)
```

Output:

```
Alice
Bob
```

---

**Using `readlines()` — Read all lines into a list:**

```python
with open("students.txt", "r") as file:
    lines = file.readlines()   # Returns a list of lines
    print(lines)
```

Output:

```
['Alice\n', 'Bob\n', 'Carla\n', 'David\n']
```

---

**Looping through all lines (most common approach):**

```python
with open("students.txt", "r") as file:
    for line in file:
        print(line.strip())   # .strip() removes the \n at the end
```

Output:

```
Alice
Bob
Carla
David
```

---

### 4. Writing Files

**Using `write()` — Write a single string:**

```python
with open("output.txt", "w") as file:
    file.write("Hello, World!\n")
    file.write("This is a second line.\n")
```

> `"\n"` is the newline character — it moves the cursor to the next line.

---

**Using `writelines()` — Write a list of strings:**

```python
students = ["Alice\n", "Bob\n", "Carla\n", "David\n"]

with open("class-list.txt", "w") as file:
    file.writelines(students)
```

> **Note:** `writelines()` does NOT automatically add newlines. You must include `\n` in each string yourself.

---

**Appending to a file:**

```python
# Start with an existing file
with open("class-list.txt", "a") as file:
    file.write("Eve\n")    # Adds "Eve" without deleting others
```

---

### 5. Context Manager — The Recommended Way

The **context manager** uses the `with` keyword and automatically closes the file when done, even if an error occurs.

**Without context manager (risky):**

```python
file = open("data.txt", "r")
content = file.read()
# If an error happens here, file.close() is never called!
file.close()
```

**With context manager (safe and recommended):**

```python
with open("data.txt", "r") as file:
    content = file.read()
# File is automatically closed here — even if an error occurred
print(content)
```

---

### 6. Combining Exception Handling with File Operations

In real programs, always combine both skills together:

```python
try:
    with open("grades.txt", "r") as file:
        for line in file:
            print(line.strip())
except FileNotFoundError:
    print("Error: The file 'grades.txt' was not found.")
except PermissionError:
    print("Error: You do not have permission to read this file.")
```

---

### 7. Real-World Example — Simple Student Grade Recorder

This program lets the user add student names and grades to a file:

```python
def save_grade():
    name = input("Enter student name: ")
    try:
        grade = float(input("Enter grade (0-100): "))
        if grade < 0 or grade > 100:
            raise ValueError("Grade must be between 0 and 100.")
    except ValueError as e:
        print("Invalid grade:", e)
        return

    with open("grades.txt", "a") as file:
        file.write(f"{name}: {grade}\n")
    print(f"Grade for {name} saved successfully.")

def view_grades():
    print("\n--- Student Grades ---")
    try:
        with open("grades.txt", "r") as file:
            content = file.read()
            if content:
                print(content)
            else:
                print("No grades recorded yet.")
    except FileNotFoundError:
        print("No grade file found. Add a student first.")

# Main menu
while True:
    print("\n1. Add Grade  2. View Grades  3. Exit")
    choice = input("Choose: ")
    if choice == "1":
        save_grade()
    elif choice == "2":
        view_grades()
    elif choice == "3":
        print("Goodbye!")
        break
    else:
        print("Invalid choice, try again.")
```

---

### Practice Exercise 2

**Instructions:** Write a program that:

1. Creates a file called `to-do.txt`.
2. Allows the user to **add tasks** (append to file).
3. Allows the user to **view all tasks** (read and print file).
4. Handles `FileNotFoundError` when viewing if the file hasn't been created yet.
5. Continues in a loop until the user chooses to exit.

---

## Common Mistakes to Avoid

| Mistake                                | Problem                         | Fix                                  |
| -------------------------------------- | ------------------------------- | ------------------------------------ |
| Forgetting to close the file           | Data may not be saved           | Use `with` statement                 |
| Using `w` mode when you want to append | Old data gets deleted           | Use `a` mode instead                 |
| Not handling `FileNotFoundError`       | Program crashes if file missing | Wrap in `try-except`                 |
| Forgetting `\n` in `write()`           | All text appears on one line    | Add `\n` at end of each string       |
| Using `readlines()` without `.strip()` | Lines include `\n` characters   | Use `.strip()` when processing lines |

---

## Review Questions

1. What is the difference between `try` and `except`?
2. When does the `finally` block execute?
3. What happens if you open a file in `"w"` mode and the file already exists?
4. What is the difference between `read()`, `readline()`, and `readlines()`?
5. Why is the context manager (`with` statement) preferred over manually calling `close()`?
6. Write the code to open a file, read all its lines, and print each line without the `\n` character.
7. What exception is raised when you try to open a file that does not exist?

---

## Summary

### Exception Handling

| Block     | Purpose                                 |
| --------- | --------------------------------------- |
| `try`     | Contains code that might raise an error |
| `except`  | Runs when a specific error is caught    |
| `else`    | Runs only when no error occurred        |
| `finally` | Always runs, used for cleanup           |

### File Operations

| Task                  | Method / Keyword                      |
| --------------------- | ------------------------------------- |
| Open a file           | `open("file.txt", "mode")`            |
| Read all content      | `file.read()`                         |
| Read one line         | `file.readline()`                     |
| Read all lines (list) | `file.readlines()`                    |
| Write to file         | `file.write("text")`                  |
| Write list to file    | `file.writelines(["line1", "line2"])` |
| Safe file handling    | `with open("file.txt", "r") as file:` |

---

## Reading List

- Reference 3
- Reference 4
- Reference 5
- Reference 6

---

_End of Lesson — Exception Handling and File Operations_
