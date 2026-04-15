# CSS Display Property - Complete Guide

> A comprehensive tutorial covering CSS display property with examples, inspired by GeeksforGeeks and W3Schools

---

## Table of Contents

1. [CSS Display Property](#css-display-property)
2. [CSS Display Values](#css-display-values)
3. [Display Block](#display-block)
4. [Display Inline](#display-inline)
5. [Display Inline-Block](#display-inline-block)
6. [Display None](#display-none)
7. [Display Flex](#display-flex)
8. [Display Grid](#display-grid)
9. [Display Table](#display-table)
10. [Visibility vs Display](#visibility-vs-display)
11. [Practical Examples](#practical-examples)
12. [Browser Support](#browser-support)
13. [Try It Yourself](#try-it-yourself)

---

## CSS Display Property

The `display` property specifies the display behavior (the type of rendering box) of an element.

### Syntax

```css
display: value;
```

### Default Value

Every HTML element has a default display value depending on what type of element it is. The default display value for most elements is `block` or `inline`.

---

## CSS Display Values

| Value          | Description                                                                 |
| -------------- | --------------------------------------------------------------------------- |
| `inline`       | Displays an element as an inline element                                    |
| `block`        | Displays an element as a block element                                      |
| `inline-block` | Displays an element as an inline-level block container                      |
| `none`         | The element is completely removed                                           |
| `flex`         | Displays an element as a block-level flex container                         |
| `inline-flex`  | Displays an element as an inline-level flex container                       |
| `grid`         | Displays an element as a block-level grid container                         |
| `inline-grid`  | Displays an element as an inline-level grid container                       |
| `table`        | Element behaves like `<table>` element                                      |
| `table-row`    | Element behaves like `<tr>` element                                         |
| `table-cell`   | Element behaves like `<td>` element                                         |
| `contents`     | Makes the container disappear, making child elements children of the parent |
| `initial`      | Sets this property to its default value                                     |
| `inherit`      | Inherits this property from its parent element                              |

---

## Display Block

A block-level element always starts on a new line and takes up the full width available.

### Example

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      div {
        display: block;
        background-color: lightblue;
        padding: 10px;
        margin: 5px 0;
      }
    </style>
  </head>
  <body>
    <h2>Display Block Example</h2>
    <div>This is a block element</div>
    <div>This is another block element</div>
  </body>
</html>
```

### Block-level Elements

The following elements are block-level by default:

- `<div>`
- `<h1>` - `<h6>`
- `<p>`
- `<form>`
- `<header>`
- `<footer>`
- `<section>`

### Try It Yourself

```html
<div style="display: block; background-color: #f1f1f1; padding: 20px;">
  <h3>Block Element 1</h3>
  <p>This div takes the full width available.</p>
</div>

<div style="display: block; background-color: #ddd; padding: 20px;">
  <h3>Block Element 2</h3>
  <p>This div also takes the full width and starts on a new line.</p>
</div>
```

---

## Display Inline

An inline element does not start on a new line and only takes up as much width as necessary.

### Example

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      span {
        display: inline;
        background-color: yellow;
        padding: 5px;
      }
    </style>
  </head>
  <body>
    <h2>Display Inline Example</h2>
    <p>
      This is a paragraph with <span>inline elements</span> inside it.
      <span>They flow</span> with the text.
    </p>
  </body>
</html>
```

### Inline Elements

The following elements are inline by default:

- `<span>`
- `<a>`
- `<img>`
- `<strong>`
- `<em>`
- `<b>`
- `<i>`

### Important Notes

- Inline elements do NOT respect `width` and `height` properties
- Inline elements only respect horizontal `margin` and `padding`
- Vertical `margin` and `padding` are ignored

### Try It Yourself

```html
<p>
  This is a paragraph with
  <span style="background-color: yellow; padding: 5px;">inline span 1</span> and
  <span style="background-color: lightgreen; padding: 5px;">inline span 2</span>
  elements that flow with the text.
</p>
```

---

## Display Inline-Block

The `inline-block` value allows you to set a width and height on the element while keeping it inline.

### Example

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .box {
        display: inline-block;
        width: 100px;
        height: 100px;
        background-color: coral;
        margin: 10px;
        text-align: center;
        line-height: 100px;
      }
    </style>
  </head>
  <body>
    <h2>Display Inline-Block Example</h2>
    <div class="box">Box 1</div>
    <div class="box">Box 2</div>
    <div class="box">Box 3</div>
  </body>
</html>
```

### Inline-Block vs Inline vs Block

| Property                     | Block | Inline          | Inline-Block |
| ---------------------------- | ----- | --------------- | ------------ |
| Starts on new line           | Yes   | No              | No           |
| Takes full width             | Yes   | No              | No           |
| Respects width/height        | Yes   | No              | Yes          |
| Respects all margins/padding | Yes   | Horizontal only | Yes          |

### Try It Yourself

```html
<div
  style="display: inline-block; width: 150px; height: 150px; background-color: #4CAF50; margin: 10px; text-align: center; line-height: 150px; color: white;"
>
  Box 1
</div>
<div
  style="display: inline-block; width: 150px; height: 150px; background-color: #2196F3; margin: 10px; text-align: center; line-height: 150px; color: white;"
>
  Box 2
</div>
<div
  style="display: inline-block; width: 150px; height: 150px; background-color: #f44336; margin: 10px; text-align: center; line-height: 150px; color: white;"
>
  Box 3
</div>
```

---

## Display None

`display: none` removes the element from the document. The element will not take up any space.

### Example

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .hidden {
        display: none;
      }
    </style>
  </head>
  <body>
    <h2>Display None Example</h2>
    <p>This paragraph is visible.</p>
    <p class="hidden">This paragraph is hidden.</p>
    <p>This paragraph is visible and moved up.</p>
  </body>
</html>
```

### JavaScript Toggle Example

```html
<!DOCTYPE html>
<html>
  <head>
    <script>
      function toggleElement() {
        var x = document.getElementById("myDiv");
        if (x.style.display === "none") {
          x.style.display = "block";
        } else {
          x.style.display = "none";
        }
      }
    </script>
  </head>
  <body>
    <button onclick="toggleElement()">Toggle Element</button>
    <div id="myDiv" style="background-color: lightblue; padding: 20px;">
      This is a toggleable div element.
    </div>
  </body>
</html>
```

---

## Display Flex

The Flexible Box Layout Module makes it easier to design flexible responsive layout structure.

### Basic Flex Container

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .flex-container {
        display: flex;
        background-color: #f1f1f1;
        padding: 10px;
      }

      .flex-container > div {
        background-color: #4caf50;
        color: white;
        margin: 10px;
        padding: 20px;
        font-size: 30px;
      }
    </style>
  </head>
  <body>
    <h2>Flex Container</h2>
    <div class="flex-container">
      <div>1</div>
      <div>2</div>
      <div>3</div>
    </div>
  </body>
</html>
```

### Flex Properties

#### 1. flex-direction

```css
.container {
  display: flex;
  flex-direction: row; /* row | row-reverse | column | column-reverse */
}
```

**Example:**

```html
<!-- Row Direction (default) -->
<div
  style="display: flex; flex-direction: row; background: #f1f1f1; padding: 10px; margin-bottom: 20px;"
>
  <div style="background: #4CAF50; color: white; padding: 20px; margin: 5px;">
    1
  </div>
  <div style="background: #2196F3; color: white; padding: 20px; margin: 5px;">
    2
  </div>
  <div style="background: #f44336; color: white; padding: 20px; margin: 5px;">
    3
  </div>
</div>

<!-- Column Direction -->
<div
  style="display: flex; flex-direction: column; background: #f1f1f1; padding: 10px;"
>
  <div style="background: #4CAF50; color: white; padding: 20px; margin: 5px;">
    1
  </div>
  <div style="background: #2196F3; color: white; padding: 20px; margin: 5px;">
    2
  </div>
  <div style="background: #f44336; color: white; padding: 20px; margin: 5px;">
    3
  </div>
</div>
```

#### 2. justify-content

Controls horizontal alignment of flex items.

```css
.container {
  display: flex;
  justify-content: flex-start; /* flex-start | flex-end | center | space-between | space-around | space-evenly */
}
```

**Example:**

```html
<!-- Center -->
<div
  style="display: flex; justify-content: center; background: #f1f1f1; padding: 10px; margin-bottom: 10px;"
>
  <div style="background: #4CAF50; color: white; padding: 20px;">Item 1</div>
  <div style="background: #2196F3; color: white; padding: 20px;">Item 2</div>
</div>

<!-- Space Between -->
<div
  style="display: flex; justify-content: space-between; background: #f1f1f1; padding: 10px; margin-bottom: 10px;"
>
  <div style="background: #4CAF50; color: white; padding: 20px;">Item 1</div>
  <div style="background: #2196F3; color: white; padding: 20px;">Item 2</div>
  <div style="background: #f44336; color: white; padding: 20px;">Item 3</div>
</div>

<!-- Space Around -->
<div
  style="display: flex; justify-content: space-around; background: #f1f1f1; padding: 10px;"
>
  <div style="background: #4CAF50; color: white; padding: 20px;">Item 1</div>
  <div style="background: #2196F3; color: white; padding: 20px;">Item 2</div>
  <div style="background: #f44336; color: white; padding: 20px;">Item 3</div>
</div>
```

#### 3. align-items

Controls vertical alignment of flex items.

```css
.container {
  display: flex;
  align-items: stretch; /* stretch | flex-start | flex-end | center | baseline */
}
```

**Example:**

```html
<div
  style="display: flex; align-items: center; height: 200px; background: #f1f1f1; padding: 10px;"
>
  <div style="background: #4CAF50; color: white; padding: 20px;">Short</div>
  <div style="background: #2196F3; color: white; padding: 60px;">Tall</div>
  <div style="background: #f44336; color: white; padding: 20px;">Short</div>
</div>
```

#### 4. flex-wrap

```css
.container {
  display: flex;
  flex-wrap: wrap; /* nowrap | wrap | wrap-reverse */
}
```

#### 5. gap

```css
.container {
  display: flex;
  gap: 20px; /* Space between flex items */
}
```

---

## Display Grid

CSS Grid Layout is a two-dimensional layout system for the web.

### Basic Grid Container

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .grid-container {
        display: grid;
        grid-template-columns: auto auto auto;
        background-color: #2196f3;
        padding: 10px;
        gap: 10px;
      }

      .grid-item {
        background-color: rgba(255, 255, 255, 0.8);
        padding: 20px;
        font-size: 30px;
        text-align: center;
      }
    </style>
  </head>
  <body>
    <h2>Grid Container</h2>
    <div class="grid-container">
      <div class="grid-item">1</div>
      <div class="grid-item">2</div>
      <div class="grid-item">3</div>
      <div class="grid-item">4</div>
      <div class="grid-item">5</div>
      <div class="grid-item">6</div>
    </div>
  </body>
</html>
```

### Grid Properties

#### 1. grid-template-columns

Defines the columns of the grid.

```css
.container {
  display: grid;
  grid-template-columns: 100px 200px 100px; /* Fixed widths */
  grid-template-columns: 1fr 2fr 1fr; /* Fractional units */
  grid-template-columns: repeat(3, 1fr); /* Repeat function */
}
```

**Example:**

```html
<!-- 3 Equal Columns -->
<div
  style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; background: #f1f1f1; padding: 10px; margin-bottom: 20px;"
>
  <div
    style="background: #4CAF50; color: white; padding: 20px; text-align: center;"
  >
    Column 1
  </div>
  <div
    style="background: #2196F3; color: white; padding: 20px; text-align: center;"
  >
    Column 2
  </div>
  <div
    style="background: #f44336; color: white; padding: 20px; text-align: center;"
  >
    Column 3
  </div>
</div>

<!-- Different Sizes -->
<div
  style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 10px; background: #f1f1f1; padding: 10px;"
>
  <div
    style="background: #4CAF50; color: white; padding: 20px; text-align: center;"
  >
    2fr
  </div>
  <div
    style="background: #2196F3; color: white; padding: 20px; text-align: center;"
  >
    1fr
  </div>
  <div
    style="background: #f44336; color: white; padding: 20px; text-align: center;"
  >
    1fr
  </div>
</div>
```

#### 2. grid-template-rows

Defines the rows of the grid.

```css
.container {
  display: grid;
  grid-template-rows: 100px 200px 100px;
}
```

#### 3. gap (grid-gap)

Defines the space between grid items.

```css
.container {
  display: grid;
  gap: 20px; /* Both row and column gap */
  row-gap: 10px; /* Row gap only */
  column-gap: 20px; /* Column gap only */
}
```

#### 4. Responsive Grid

```html
<div
  style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; background: #f1f1f1; padding: 10px;"
>
  <div
    style="background: #4CAF50; color: white; padding: 20px; text-align: center;"
  >
    Auto 1
  </div>
  <div
    style="background: #2196F3; color: white; padding: 20px; text-align: center;"
  >
    Auto 2
  </div>
  <div
    style="background: #f44336; color: white; padding: 20px; text-align: center;"
  >
    Auto 3
  </div>
  <div
    style="background: #FF9800; color: white; padding: 20px; text-align: center;"
  >
    Auto 4
  </div>
</div>
```

#### 5. Grid Item Spanning

```css
.item {
  grid-column: span 2; /* Span 2 columns */
  grid-row: span 2; /* Span 2 rows */
}
```

**Example:**

```html
<div
  style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; background: #f1f1f1; padding: 10px;"
>
  <div
    style="background: #4CAF50; color: white; padding: 20px; text-align: center; grid-column: span 2;"
  >
    Spans 2 Columns
  </div>
  <div
    style="background: #2196F3; color: white; padding: 20px; text-align: center;"
  >
    1
  </div>
  <div
    style="background: #f44336; color: white; padding: 20px; text-align: center;"
  >
    2
  </div>
  <div
    style="background: #FF9800; color: white; padding: 20px; text-align: center; grid-column: span 2;"
  >
    Spans 2 Columns
  </div>
</div>
```

---

## Display Table

Makes an element behave like a table element.

### Example

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .table {
        display: table;
        width: 100%;
        border-collapse: collapse;
      }

      .table-row {
        display: table-row;
      }

      .table-cell {
        display: table-cell;
        border: 1px solid #ddd;
        padding: 10px;
      }
    </style>
  </head>
  <body>
    <h2>Display Table Example</h2>
    <div class="table">
      <div class="table-row">
        <div class="table-cell">Cell 1</div>
        <div class="table-cell">Cell 2</div>
        <div class="table-cell">Cell 3</div>
      </div>
      <div class="table-row">
        <div class="table-cell">Cell 4</div>
        <div class="table-cell">Cell 5</div>
        <div class="table-cell">Cell 6</div>
      </div>
    </div>
  </body>
</html>
```

### Table Display Values

| Value                | Description            |
| -------------------- | ---------------------- |
| `table`              | Behaves like `<table>` |
| `table-row`          | Behaves like `<tr>`    |
| `table-cell`         | Behaves like `<td>`    |
| `table-header-group` | Behaves like `<thead>` |
| `table-footer-group` | Behaves like `<tfoot>` |
| `table-row-group`    | Behaves like `<tbody>` |

---

## Visibility vs Display

### display: none

- Removes element from document flow
- Element takes no space
- Cannot be accessed by screen readers

### visibility: hidden

- Hides element but keeps its space
- Element still takes up space
- Can be accessed by screen readers

### Example

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .display-none {
        display: none;
      }

      .visibility-hidden {
        visibility: hidden;
      }

      div {
        background-color: lightblue;
        padding: 20px;
        margin: 10px 0;
      }
    </style>
  </head>
  <body>
    <h2>Visibility vs Display</h2>

    <div>Visible Element 1</div>
    <div class="display-none">Hidden with display: none (no space)</div>
    <div>Visible Element 2 (moved up)</div>

    <div>Visible Element 3</div>
    <div class="visibility-hidden">
      Hidden with visibility: hidden (takes space)
    </div>
    <div>Visible Element 4 (space above)</div>
  </body>
</html>
```

---

## Practical Examples

### Example 1: Navigation Bar

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .navbar {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color: #333;
        padding: 15px 30px;
      }

      .logo {
        color: white;
        font-size: 24px;
        font-weight: bold;
      }

      .nav-links {
        display: flex;
        gap: 20px;
      }

      .nav-links a {
        color: white;
        text-decoration: none;
        padding: 10px 15px;
      }

      .nav-links a:hover {
        background-color: #555;
        border-radius: 4px;
      }
    </style>
  </head>
  <body>
    <nav class="navbar">
      <div class="logo">MyWebsite</div>
      <div class="nav-links">
        <a href="#home">Home</a>
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
      </div>
    </nav>
  </body>
</html>
```

### Example 2: Card Grid Layout

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      .card-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 20px;
        padding: 20px;
      }

      .card {
        background-color: white;
        border: 1px solid #ddd;
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }

      .card h3 {
        margin-top: 0;
        color: #333;
      }

      .card p {
        color: #666;
        line-height: 1.6;
      }

      .card button {
        background-color: #4caf50;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
      }

      .card button:hover {
        background-color: #45a049;
      }
    </style>
  </head>
  <body>
    <div class="card-grid">
      <div class="card">
        <h3>Card Title 1</h3>
        <p>This is some card content that describes the feature or product.</p>
        <button>Learn More</button>
      </div>
      <div class="card">
        <h3>Card Title 2</h3>
        <p>This is some card content that describes the feature or product.</p>
        <button>Learn More</button>
      </div>
      <div class="card">
        <h3>Card Title 3</h3>
        <p>This is some card content that describes the feature or product.</p>
        <button>Learn More</button>
      </div>
    </div>
  </body>
</html>
```

### Example 3: Centered Login Form

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
      }

      .login-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      .login-box {
        background: white;
        padding: 40px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        width: 300px;
      }

      .login-box h2 {
        margin-top: 0;
        text-align: center;
        color: #333;
      }

      .form-group {
        margin-bottom: 20px;
      }

      .form-group label {
        display: block;
        margin-bottom: 5px;
        color: #666;
      }

      .form-group input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
      }

      .login-button {
        width: 100%;
        padding: 12px;
        background-color: #667eea;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
      }

      .login-button:hover {
        background-color: #5568d3;
      }
    </style>
  </head>
  <body>
    <div class="login-container">
      <div class="login-box">
        <h2>Login</h2>
        <form>
          <div class="form-group">
            <label>Username</label>
            <input type="text" placeholder="Enter username" />
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" placeholder="Enter password" />
          </div>
          <button type="submit" class="login-button">Login</button>
        </form>
      </div>
    </div>
  </body>
</html>
```

### Example 4: Dashboard Layout

```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      body {
        margin: 0;
        font-family: Arial, sans-serif;
      }

      .dashboard {
        display: grid;
        grid-template-columns: 250px 1fr;
        grid-template-rows: 60px 1fr;
        height: 100vh;
      }

      .header {
        grid-column: 1 / 3;
        background-color: #333;
        color: white;
        display: flex;
        align-items: center;
        padding: 0 20px;
        font-size: 20px;
      }

      .sidebar {
        background-color: #f4f4f4;
        padding: 20px;
      }

      .sidebar ul {
        list-style: none;
        padding: 0;
      }

      .sidebar li {
        padding: 10px;
        margin-bottom: 5px;
        cursor: pointer;
      }

      .sidebar li:hover {
        background-color: #ddd;
        border-radius: 4px;
      }

      .main-content {
        padding: 20px;
        background-color: white;
      }

      .stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 20px;
        margin-bottom: 30px;
      }

      .stat-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px;
        border-radius: 8px;
      }

      .stat-card h3 {
        margin: 0 0 10px 0;
        font-size: 14px;
        opacity: 0.9;
      }

      .stat-card .number {
        font-size: 32px;
        font-weight: bold;
      }
    </style>
  </head>
  <body>
    <div class="dashboard">
      <div class="header">Dashboard</div>

      <div class="sidebar">
        <ul>
          <li>📊 Overview</li>
          <li>👥 Users</li>
          <li>📈 Analytics</li>
          <li>⚙️ Settings</li>
        </ul>
      </div>

      <div class="main-content">
        <h2>Overview</h2>
        <div class="stats">
          <div class="stat-card">
            <h3>Total Users</h3>
            <div class="number">1,234</div>
          </div>
          <div class="stat-card">
            <h3>Revenue</h3>
            <div class="number">$45,678</div>
          </div>
          <div class="stat-card">
            <h3>Orders</h3>
            <div class="number">567</div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
```

---

## Browser Support

The CSS display property is supported in all modern browsers:

| Browser | Version |
| ------- | ------- |
| Chrome  | All     |
| Edge    | All     |
| Firefox | All     |
| Safari  | All     |
| Opera   | All     |

### Flexbox Support

- Chrome 29+
- Firefox 28+
- Safari 9+
- Edge 12+

### Grid Support

- Chrome 57+
- Firefox 52+
- Safari 10.1+
- Edge 16+

---

## Try It Yourself

### Exercise 1: Create a Navigation Bar

Create a horizontal navigation bar using flexbox with the following requirements:

- Logo on the left
- Navigation links on the right
- Links should have hover effects

### Exercise 2: Build a Card Grid

Create a responsive card grid that:

- Shows 3 cards per row on desktop
- Shows 2 cards per row on tablet
- Shows 1 card per row on mobile

### Exercise 3: Center a Div

Center a div both horizontally and vertically using:

1. Flexbox
2. Grid
3. Position (bonus)

---

## Summary

- `display: block` - Takes full width, starts on new line
- `display: inline` - Takes only necessary width, flows with text
- `display: inline-block` - Inline flow with block properties
- `display: none` - Completely removes element
- `display: flex` - Creates flexible layouts
- `display: grid` - Creates grid-based layouts
- `display: table` - Makes element behave like table

---

## References

- [W3Schools CSS Display](https://www.w3schools.com/css/css_display_visibility.asp)
- [GeeksforGeeks CSS Display Property](https://www.geeksforgeeks.org/css-display-property/)
- [MDN Web Docs - Display](https://developer.mozilla.org/en-US/docs/Web/CSS/display)
- [CSS-Tricks - A Complete Guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/)
- [CSS-Tricks - A Complete Guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/)

---

**Last Updated:** 2026
**Author:** CSS Learning Guide
**License:** Free to use for educational purposes
