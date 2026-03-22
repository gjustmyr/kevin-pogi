# Python GUI Development (Tkinter)

### Python Teaching Material — Main Topic 6 | School Tutorial

---

## Course Information

| Detail       | Info                                     |
| ------------ | ---------------------------------------- |
| Subject      | Computer Programming (Python)            |
| Topic        | Python GUI Development using Tkinter     |
| Level        | Beginner to Intermediate                 |
| Prerequisite | Basic Python (variables, functions, OOP) |

---

## Learning Objectives

By the end of this lesson, you should be able to:

1. Explain what a GUI is and why it is important.
2. Create a basic window using Tkinter.
3. Add and configure widgets: Label, Button, Entry, Frame, and more.
4. Use Python variables, data types, control flow, functions, and OOP inside a GUI app.
5. Handle events such as button clicks, key presses, and mouse actions.
6. Build a small functional GUI application.

---

## Introduction

### What is a GUI?

A **Graphical User Interface (GUI)** is a visual way for users to interact with a program using windows, buttons, menus, and text fields — instead of typing commands in a terminal.

**Examples of GUI applications:**

- Microsoft Word
- Calculator
- Web browsers
- Games

### What is Tkinter?

**Tkinter** is Python's **built-in** library for creating GUI desktop applications. Because it comes with Python, you do not need to install anything extra.

> "Tkinter" stands for "Tk Interface" — it uses the Tk GUI toolkit under the hood.

### How a GUI App Works

Unlike a regular Python script that runs top to bottom, a GUI app runs in an **event loop**:

```
1. The program starts and creates a window.
2. The window waits for user actions (events).
3. When the user acts (clicks, types), the app responds.
4. This continues until the user closes the window.
```

---

## Part 1: Tkinter Basics

---

## Subtopic 1: Tkinter Basics — Creating Windows and Widgets

### Step 1: Importing Tkinter

```python
import tkinter as tk
```

We import Tkinter and give it the alias `tk` so we can type `tk.` instead of `tkinter.` every time.

---

### Step 2: Creating Your First Window

```python
import tkinter as tk

# Step 1: Create the main window
window = tk.Tk()

# Step 2: Configure the window
window.title("My First App")       # Title shown in the title bar
window.geometry("500x400")         # Width x Height in pixels
window.resizable(True, True)       # Allow resizing (width, height)
window.configure(bg="white")       # Background color

# Step 3: Start the event loop (keeps the window open)
window.mainloop()
```

**Line-by-line explanation:**

| Code                     | What it does                                  |
| ------------------------ | --------------------------------------------- |
| `tk.Tk()`                | Creates the main application window           |
| `.title("...")`          | Sets the window title                         |
| `.geometry("500x400")`   | Sets window size (width x height in pixels)   |
| `.resizable(True, True)` | Allows the user to resize the window          |
| `.configure(bg="white")` | Sets the background color                     |
| `.mainloop()`            | Starts the event loop — keeps the window open |

---

### Step 3: Layout Managers

Before adding widgets, you need to understand how Tkinter positions them. There are 3 layout managers:

| Manager   | How it works                              |
| --------- | ----------------------------------------- |
| `pack()`  | Stacks widgets vertically or horizontally |
| `grid()`  | Places widgets in a row/column table      |
| `place()` | Places widgets at exact x, y coordinates  |

> **Beginner tip:** Start with `pack()` or `grid()`. They are the most commonly used.

---

### Widget 1: Label

A **Label** displays text or an image on the window. It cannot be edited by the user.

```python
import tkinter as tk

window = tk.Tk()
window.title("Label Example")
window.geometry("400x200")

# Basic label
label1 = tk.Label(window, text="Hello, World!")
label1.pack(pady=10)

# Styled label
label2 = tk.Label(
    window,
    text="Welcome to Python GUI!",
    font=("Arial", 18, "bold"),
    fg="blue",          # Text color (foreground)
    bg="lightyellow",   # Background color
    padx=10,
    pady=10
)
label2.pack()

window.mainloop()
```

**Common Label options:**

| Option   | Description                  | Example                      |
| -------- | ---------------------------- | ---------------------------- |
| `text`   | The text to display          | `text="Hello"`               |
| `font`   | Font family, size, and style | `font=("Arial", 14, "bold")` |
| `fg`     | Text (foreground) color      | `fg="red"`                   |
| `bg`     | Background color             | `bg="yellow"`                |
| `padx`   | Horizontal internal padding  | `padx=10`                    |
| `pady`   | Vertical internal padding    | `pady=5`                     |
| `width`  | Width in characters          | `width=20`                   |
| `anchor` | Text alignment inside label  | `anchor="w"` (left)          |

---

### Widget 2: Button

A **Button** performs an action when clicked.

```python
import tkinter as tk

def say_hello():
    print("Hello from the button!")

window = tk.Tk()
window.title("Button Example")
window.geometry("300x200")

btn = tk.Button(
    window,
    text="Click Me!",
    command=say_hello,        # Function to call when clicked
    font=("Arial", 12),
    bg="green",
    fg="white",
    padx=10,
    pady=5
)
btn.pack(pady=20)

window.mainloop()
```

> **Important:** Do NOT write `command=say_hello()` — the parentheses `()` would call the function immediately. Write `command=say_hello` without parentheses.

---

### Widget 3: Entry (Text Field)

An **Entry** widget lets the user type a single line of text.

```python
import tkinter as tk

window = tk.Tk()
window.title("Entry Example")
window.geometry("300x200")

# Label above the entry
label = tk.Label(window, text="Enter your name:")
label.pack(pady=5)

# Entry widget
entry = tk.Entry(window, width=25, font=("Arial", 12))
entry.pack(pady=5)

# Show what was typed when button is clicked
def show_input():
    text = entry.get()        # Get text from entry
    print("You typed:", text)

btn = tk.Button(window, text="Submit", command=show_input)
btn.pack(pady=5)

window.mainloop()
```

**Useful Entry methods:**

| Method                    | Description                            |
| ------------------------- | -------------------------------------- |
| `entry.get()`             | Returns the current text in the entry  |
| `entry.delete(0, tk.END)` | Clears the entry field                 |
| `entry.insert(0, "text")` | Inserts text at a position             |
| `show="*"`                | Hides typed characters (for passwords) |

---

### Widget 4: Text Box (Multi-line)

The **Text** widget is like Entry but allows multiple lines.

```python
import tkinter as tk

window = tk.Tk()
window.title("Text Widget")
window.geometry("400x300")

text_box = tk.Text(window, width=40, height=10, font=("Arial", 11))
text_box.pack(pady=10)

def get_text():
    content = text_box.get("1.0", tk.END)  # Get all text (from line 1, char 0 to end)
    print(content)

btn = tk.Button(window, text="Get Text", command=get_text)
btn.pack()

window.mainloop()
```

---

### Widget 5: Frame (Container)

A **Frame** is an invisible container used to group and organize other widgets.

```python
import tkinter as tk

window = tk.Tk()
window.title("Frame Example")
window.geometry("400x300")

# Top frame
top_frame = tk.Frame(window, bg="lightblue", pady=10)
top_frame.pack(fill="x")   # fill="x" stretches across the width

tk.Label(top_frame, text="Header Section", bg="lightblue", font=("Arial", 14)).pack()

# Bottom frame
bottom_frame = tk.Frame(window, bg="lightyellow", pady=10)
bottom_frame.pack(fill="both", expand=True)

tk.Label(bottom_frame, text="Content Section", bg="lightyellow").pack()

window.mainloop()
```

---

### Using the grid() Layout — A Better Way to Organize

```python
import tkinter as tk

window = tk.Tk()
window.title("Login Form")
window.geometry("300x200")

# Row 0
tk.Label(window, text="Username:").grid(row=0, column=0, padx=10, pady=10, sticky="w")
username_entry = tk.Entry(window, width=20)
username_entry.grid(row=0, column=1, padx=10, pady=10)

# Row 1
tk.Label(window, text="Password:").grid(row=1, column=0, padx=10, pady=10, sticky="w")
password_entry = tk.Entry(window, show="*", width=20)
password_entry.grid(row=1, column=1, padx=10, pady=10)

# Row 2 — spans both columns
tk.Button(window, text="Login", width=10).grid(row=2, column=0, columnspan=2, pady=10)

window.mainloop()
```

---

### Practice Exercise 1

**Create a "Profile Card" window with:**

1. A label at the top showing "Student Profile"
2. Labels and entry fields for: Name, Age, Course
3. A "Submit" button that prints all entered information to the terminal
4. Use `grid()` for layout

---

## Part 2: Using Python in GUI

---

## Subtopic 2: Python Core Concepts Inside GUI Applications

Everything you already know about Python works the same way inside GUI apps.

---

### Tkinter Variable Types

Tkinter has special variable types that automatically update the GUI when their value changes:

| Tkinter Type      | Python Equivalent | Use For              |
| ----------------- | ----------------- | -------------------- |
| `tk.StringVar()`  | `str`             | Text entries, labels |
| `tk.IntVar()`     | `int`             | Numbers, checkboxes  |
| `tk.DoubleVar()`  | `float`           | Decimal numbers      |
| `tk.BooleanVar()` | `bool`            | True/False values    |

**Example with StringVar:**

```python
import tkinter as tk

window = tk.Tk()
window.title("StringVar Demo")

name_var = tk.StringVar()
name_var.set("Default Name")   # Set an initial value

def update_label():
    label.config(text="Hello, " + name_var.get() + "!")

entry = tk.Entry(window, textvariable=name_var, width=20)
entry.pack(pady=5)

btn = tk.Button(window, text="Greet", command=update_label)
btn.pack(pady=5)

label = tk.Label(window, text="")
label.pack(pady=5)

window.mainloop()
```

> When `textvariable=name_var` is set, the entry and `name_var` stay in sync automatically.

---

### Input and Output in GUI

In a GUI, user input comes from widgets (Entry, Text, etc.) and output is shown via Labels.

**Full Input/Output Example — BMI Calculator:**

```python
import tkinter as tk

def calculate_bmi():
    try:
        weight = float(weight_entry.get())   # Get input
        height = float(height_entry.get())
        bmi = weight / (height ** 2)
        result_label.config(text=f"BMI: {bmi:.2f}", fg="black")  # Show output
    except ValueError:
        result_label.config(text="Please enter valid numbers.", fg="red")

window = tk.Tk()
window.title("BMI Calculator")
window.geometry("300x250")

tk.Label(window, text="Weight (kg):").pack(pady=3)
weight_entry = tk.Entry(window)
weight_entry.pack()

tk.Label(window, text="Height (m):").pack(pady=3)
height_entry = tk.Entry(window)
height_entry.pack()

tk.Button(window, text="Calculate BMI", command=calculate_bmi).pack(pady=10)
result_label = tk.Label(window, text="", font=("Arial", 12))
result_label.pack()

window.mainloop()
```

---

### Control Flow in GUI (if/elif/else)

```python
import tkinter as tk

def check_grade():
    try:
        score = int(score_entry.get())
        if score >= 90:
            grade, color = "A — Excellent!", "green"
        elif score >= 80:
            grade, color = "B — Good", "blue"
        elif score >= 70:
            grade, color = "C — Average", "orange"
        elif score >= 60:
            grade, color = "D — Below Average", "darkorange"
        else:
            grade, color = "F — Failed", "red"
        result_label.config(text=grade, fg=color)
    except ValueError:
        result_label.config(text="Enter a valid score!", fg="red")

window = tk.Tk()
window.title("Grade Checker")
window.geometry("300x200")

tk.Label(window, text="Enter your score (0-100):").pack(pady=5)
score_entry = tk.Entry(window, width=10)
score_entry.pack(pady=5)

tk.Button(window, text="Check Grade", command=check_grade).pack(pady=5)
result_label = tk.Label(window, text="", font=("Arial", 13, "bold"))
result_label.pack(pady=10)

window.mainloop()
```

---

### Functions in GUI

Define helper functions to keep your code organized:

```python
import tkinter as tk

def add():
    show_result(calculate("+"))

def subtract():
    show_result(calculate("-"))

def calculate(operator):
    try:
        a = float(num1_entry.get())
        b = float(num2_entry.get())
        if operator == "+":
            return a + b
        elif operator == "-":
            return a - b
    except ValueError:
        return "Invalid input"

def show_result(result):
    result_label.config(text=f"Result: {result}")

window = tk.Tk()
window.title("Simple Calculator")
window.geometry("300x250")

tk.Label(window, text="Number 1:").pack()
num1_entry = tk.Entry(window)
num1_entry.pack()

tk.Label(window, text="Number 2:").pack(pady=(5, 0))
num2_entry = tk.Entry(window)
num2_entry.pack()

tk.Button(window, text="Add",      command=add).pack(pady=3)
tk.Button(window, text="Subtract", command=subtract).pack(pady=3)

result_label = tk.Label(window, text="Result: ", font=("Arial", 12))
result_label.pack(pady=10)

window.mainloop()
```

---

### OOP (Object-Oriented Programming) in GUI

Organizing your GUI as a class makes large applications easier to manage.

**Structure:**

```python
class AppName:
    def __init__(self, root):
        self.root = root
        # Set up all widgets here

    def method_name(self):
        # Event handlers and logic here
```

**Full OOP Example — To-Do List App:**

```python
import tkinter as tk
import tkinter.messagebox

class ToDoApp:
    def __init__(self, root):
        self.root = root
        self.root.title("My To-Do List")
        self.root.geometry("400x450")

        # Title
        tk.Label(root, text="To-Do List", font=("Arial", 16, "bold")).pack(pady=10)

        # Entry for new tasks
        self.task_entry = tk.Entry(root, width=30, font=("Arial", 12))
        self.task_entry.pack(pady=5)

        # Add button
        tk.Button(root, text="Add Task", command=self.add_task,
                  bg="green", fg="white").pack(pady=5)

        # Listbox to show tasks
        self.task_listbox = tk.Listbox(root, width=40, height=12, font=("Arial", 11))
        self.task_listbox.pack(pady=5)

        # Delete button
        tk.Button(root, text="Delete Selected", command=self.delete_task,
                  bg="red", fg="white").pack(pady=5)

    def add_task(self):
        task = self.task_entry.get().strip()
        if task:
            self.task_listbox.insert(tk.END, task)
            self.task_entry.delete(0, tk.END)
        else:
            tkinter.messagebox.showwarning("Empty Input", "Please enter a task.")

    def delete_task(self):
        selected = self.task_listbox.curselection()
        if selected:
            self.task_listbox.delete(selected)

root = tk.Tk()
app = ToDoApp(root)
root.mainloop()
```

---

### Practice Exercise 2

**Build a "Unit Converter" app:**

1. Two entry fields: one for input value, one to show output
2. Buttons for: km to miles, Celsius to Fahrenheit
3. Use functions to perform each conversion
4. Display the result in a label

---

## Part 3: Event Handling

---

## Subtopic 3: Event Handling — Responding to User Actions

### What is an Event?

An **event** is anything the user does: clicking a button, pressing a key, moving the mouse, or closing a window.

Tkinter listens for events through two mechanisms:

1. **`command=`** — for Button widgets
2. **`.bind()`** — for keyboard, mouse, and other events

---

### Method 1: command= Parameter

Used specifically for Button widgets:

```python
import tkinter as tk

def on_click():
    label.config(text="Button was clicked!")

window = tk.Tk()
window.geometry("300x150")

btn = tk.Button(window, text="Click Me", command=on_click)
btn.pack(pady=10)

label = tk.Label(window, text="")
label.pack()

window.mainloop()
```

---

### Method 2: .bind() Method

Use `.bind()` to listen to keyboard or mouse events on any widget or the window.

**Syntax:**

```python
widget.bind("<EventString>", handler_function)
```

The handler function **must** accept an `event` parameter:

```python
def handler(event):
    # event contains information about what happened
    pass
```

---

### Keyboard Events

```python
import tkinter as tk

def on_key(event):
    key_label.config(text=f"Key pressed: {event.keysym}")

def on_enter(event):
    enter_label.config(text="Enter key pressed!")

window = tk.Tk()
window.title("Keyboard Events")
window.geometry("350x200")

window.bind("<Key>", on_key)       # Any key press
window.bind("<Return>", on_enter)  # Enter key specifically

key_label = tk.Label(window, text="Press any key...", font=("Arial", 12))
key_label.pack(pady=20)

enter_label = tk.Label(window, text="", font=("Arial", 12), fg="blue")
enter_label.pack()

window.mainloop()
```

---

### Mouse Events

```python
import tkinter as tk

def on_left_click(event):
    info_label.config(text=f"Left click at ({event.x}, {event.y})")

def on_right_click(event):
    info_label.config(text=f"Right click at ({event.x}, {event.y})")

def on_hover(event):
    hover_label.config(text=f"Mouse at ({event.x}, {event.y})")

window = tk.Tk()
window.title("Mouse Events")
window.geometry("400x250")

window.bind("<Button-1>", on_left_click)    # Left click
window.bind("<Button-3>", on_right_click)   # Right click
window.bind("<Motion>", on_hover)           # Mouse movement

info_label = tk.Label(window, text="Click anywhere...", font=("Arial", 12))
info_label.pack(pady=30)

hover_label = tk.Label(window, text="", font=("Arial", 10), fg="gray")
hover_label.pack()

window.mainloop()
```

---

### Common Event Strings Reference

| Event String        | Description                             |
| ------------------- | --------------------------------------- |
| `<Button-1>`        | Left mouse button click                 |
| `<Button-2>`        | Middle mouse button click               |
| `<Button-3>`        | Right mouse button click                |
| `<Double-Button-1>` | Double left click                       |
| `<Motion>`          | Mouse movement (no button held)         |
| `<B1-Motion>`       | Mouse dragged while holding left button |
| `<Key>`             | Any key pressed                         |
| `<Return>`          | Enter key                               |
| `<BackSpace>`       | Backspace key                           |
| `<Escape>`          | Escape key                              |
| `<space>`           | Space bar                               |
| `<Control-s>`       | Ctrl + S shortcut                       |
| `<FocusIn>`         | Widget gains keyboard focus             |
| `<FocusOut>`        | Widget loses keyboard focus             |
| `<Configure>`       | Window is resized                       |

---

### The Event Object

When an event fires, Tkinter passes an **event object** to your handler with useful information:

| Attribute      | Description                              |
| -------------- | ---------------------------------------- |
| `event.x`      | Mouse x position (from left of widget)   |
| `event.y`      | Mouse y position (from top of widget)    |
| `event.keysym` | Name of the key pressed (e.g., "Return") |
| `event.char`   | Character of the key pressed             |
| `event.widget` | The widget that triggered the event      |
| `event.type`   | Type of event                            |

---

### Using lambda for Commands with Arguments

Sometimes you need to pass arguments to a command. Use `lambda` for this:

```python
import tkinter as tk

def greet(name):
    label.config(text=f"Hello, {name}!")

window = tk.Tk()
window.geometry("300x150")

# lambda delays the function call until the button is clicked
tk.Button(window, text="Greet Alice", command=lambda: greet("Alice")).pack(pady=5)
tk.Button(window, text="Greet Bob",   command=lambda: greet("Bob")).pack(pady=5)

label = tk.Label(window, text="", font=("Arial", 12))
label.pack(pady=10)

window.mainloop()
```

---

### Message Boxes (Pop-up Dialogs)

```python
import tkinter as tk
import tkinter.messagebox as mb

def show_info():
    mb.showinfo("Information", "This is an info message.")

def show_warning():
    mb.showwarning("Warning", "This is a warning!")

def show_error():
    mb.showerror("Error", "Something went wrong.")

def ask_yes_no():
    answer = mb.askyesno("Confirm", "Do you want to continue?")
    label.config(text="You chose YES." if answer else "You chose NO.")

window = tk.Tk()
window.title("Message Boxes")
window.geometry("300x250")

tk.Button(window, text="Info",    command=show_info,    width=15).pack(pady=5)
tk.Button(window, text="Warning", command=show_warning, width=15).pack(pady=5)
tk.Button(window, text="Error",   command=show_error,   width=15).pack(pady=5)
tk.Button(window, text="Yes/No",  command=ask_yes_no,   width=15).pack(pady=5)

label = tk.Label(window, text="", font=("Arial", 11))
label.pack(pady=10)

window.mainloop()
```

---

### Capstone Project — Simple Login System

Putting everything together (Tkinter basics + Python concepts + event handling):

```python
import tkinter as tk
import tkinter.messagebox as mb

class LoginApp:
    VALID_USERNAME = "student"
    VALID_PASSWORD = "python123"

    def __init__(self, root):
        self.root = root
        self.root.title("Login System")
        self.root.geometry("350x250")
        self.root.resizable(False, False)
        self.attempts = 0

        # Title
        tk.Label(root, text="Login", font=("Arial", 18, "bold")).pack(pady=15)

        # Username field
        tk.Label(root, text="Username:").pack()
        self.username_entry = tk.Entry(root, width=25)
        self.username_entry.pack(pady=3)

        # Password field
        tk.Label(root, text="Password:").pack()
        self.password_entry = tk.Entry(root, show="*", width=25)
        self.password_entry.pack(pady=3)

        # Login button
        tk.Button(root, text="Login", command=self.login,
                  bg="blue", fg="white", width=15).pack(pady=10)

        # Status label
        self.status_label = tk.Label(root, text="", fg="red", font=("Arial", 10))
        self.status_label.pack()

        # Bind Enter key to login
        root.bind("<Return>", lambda e: self.login())

    def login(self):
        username = self.username_entry.get().strip()
        password = self.password_entry.get()

        if username == self.VALID_USERNAME and password == self.VALID_PASSWORD:
            mb.showinfo("Success", f"Welcome, {username}!")
            self.root.destroy()
        else:
            self.attempts += 1
            remaining = 3 - self.attempts
            if remaining > 0:
                self.status_label.config(
                    text=f"Incorrect credentials. {remaining} attempt(s) left.")
                self.password_entry.delete(0, tk.END)
            else:
                mb.showerror("Locked", "Too many failed attempts. Application will close.")
                self.root.destroy()

root = tk.Tk()
app = LoginApp(root)
root.mainloop()
```

---

### Practice Exercise 3

**Build a "Student Registration Form" with:**

1. Fields: Full Name, Student ID, Course, Year Level
2. A "Register" button that validates all fields are filled
3. A "Clear" button that resets all fields
4. A message box confirming successful registration
5. A label showing a running count of registered students
6. Use OOP (class-based) structure

---

## Common Mistakes to Avoid

| Mistake                                     | Problem                              | Fix                                        |
| ------------------------------------------- | ------------------------------------ | ------------------------------------------ |
| `command=my_function()`                     | Calls the function immediately       | Use `command=my_function` (no parentheses) |
| Forgetting to call `mainloop()`             | Window appears then disappears       | Always end with `window.mainloop()`        |
| Mixing `pack()` and `grid()` in same window | Causes a layout error                | Use only one layout manager per container  |
| Using `entry.get()` before window opens     | Returns empty string                 | Only call `.get()` inside event handlers   |
| Not using `.strip()` on entry input         | Extra spaces cause wrong comparisons | Use `entry.get().strip()`                  |

---

## Review Questions

1. What does `mainloop()` do in a Tkinter application?
2. What is the difference between `pack()` and `grid()` layout managers?
3. What is the difference between a `Label` and an `Entry` widget?
4. Why should you NOT write `command=my_function()` with parentheses?
5. What method do you use to get text from an Entry widget?
6. What is the difference between using `<Button-1>` with `.bind()` and using `command=` on a Button?
7. What does `event.keysym` contain?
8. How do you clear an Entry widget programmatically?
9. What is the advantage of using OOP (classes) for GUI applications?
10. Write code to create a window that displays "Hello!" in a label and closes when the Escape key is pressed.

---

## Widget Quick Reference

| Widget        | Purpose                          | Key Options                     |
| ------------- | -------------------------------- | ------------------------------- |
| `Label`       | Display text or image            | `text`, `font`, `fg`, `bg`      |
| `Button`      | Clickable button                 | `text`, `command`, `bg`, `fg`   |
| `Entry`       | Single-line text input           | `width`, `show`, `textvariable` |
| `Text`        | Multi-line text input            | `width`, `height`               |
| `Frame`       | Container for grouping widgets   | `bg`, `padx`, `pady`            |
| `Listbox`     | Scrollable list of items         | `width`, `height`, `selectmode` |
| `Checkbutton` | Checkbox (on/off)                | `variable`, `text`              |
| `Radiobutton` | One choice from multiple options | `variable`, `value`, `text`     |
| `Scale`       | Slider bar                       | `from_`, `to`, `orient`         |
| `Scrollbar`   | Scroll through content           | `orient`, `command`             |
| `Menu`        | Menu bar                         | `tearoff`                       |
| `messagebox`  | Pop-up dialog boxes              | `.showinfo()`, `.askyesno()`    |

---

## Summary

| Topic          | Key Concepts                                                |
| -------------- | ----------------------------------------------------------- |
| Tkinter Basics | `Tk()`, widgets, `pack()`, `grid()`, `mainloop()`           |
| Python in GUI  | StringVar, input/output, if/else, functions, OOP classes    |
| Event Handling | `command=`, `.bind()`, event object, `lambda`, `messagebox` |

---

_End of Lesson — Python GUI Development (Tkinter)_
