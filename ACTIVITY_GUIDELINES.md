# Web Development Activity Guidelines

## Activity: Create Your Mockup as a Web Page

### Objective

Transform the mockup you created in your previous activity into a functional web page using HTML and CSS.

---

## Requirements

### 1. HTML Structure (Semantic Tags Required)

Use proper semantic HTML5 tags to structure your content:

- `<header>` - For the top section of your page
- `<nav>` - For navigation menus
- `<main>` - For the main content area
- `<section>` - For distinct content sections
- `<article>` - For independent, self-contained content
- `<aside>` - For sidebar content
- `<footer>` - For the bottom section of your page
- `<figure>` and `<figcaption>` - For images with captions

### 2. CSS Styling (Required)

Apply CSS to make your page visually appealing:

- Use colors, fonts, and spacing that match your mockup
- Apply the CSS display properties you've learned
- Make your layout responsive and organized
- Style text, backgrounds, borders, and other elements

### 3. Content

Include the same content from your mockup:

- Text content (headings, paragraphs)
- Images or placeholders
- Navigation links
- Any other elements from your design

---

## Basic Template

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Your Page Title</title>
    <style>
      /* Your CSS goes here */
      * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
      }

      header {
        background-color: #333;
        color: white;
        padding: 1rem;
      }

      nav {
        background-color: #555;
        padding: 0.5rem;
      }

      main {
        padding: 2rem;
      }

      footer {
        background-color: #333;
        color: white;
        text-align: center;
        padding: 1rem;
        margin-top: 2rem;
      }
    </style>
  </head>
  <body>
    <header>
      <h1>Your Website Title</h1>
    </header>

    <nav>
      <ul>
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>

    <main>
      <section>
        <h2>Section Title</h2>
        <p>Your content here...</p>
      </section>

      <article>
        <h3>Article Title</h3>
        <p>Article content...</p>
      </article>
    </main>

    <footer>
      <p>&copy; 2026 Your Name. All rights reserved.</p>
    </footer>
  </body>
</html>
```

---

## Submission Guidelines

1. Create a single HTML file named `index.html`
2. Include all CSS within a `<style>` tag in the `<head>` section
3. Ensure your code is properly indented and organized
4. Test your page in a web browser before submitting
5. Make sure all semantic tags are used appropriately

---

## Grading Criteria

- **HTML Structure (40%)** - Proper use of semantic tags
- **CSS Styling (40%)** - Visual design and layout
- **Code Quality (10%)** - Clean, organized, and properly indented code
- **Mockup Accuracy (10%)** - How well it matches your original mockup

---

## Tips for Success

✓ Start with the HTML structure first, then add CSS
✓ Use comments to organize your code
✓ Test frequently in your browser
✓ Keep your design simple and clean
✓ Make sure text is readable (good contrast)
✓ Use consistent spacing and alignment

---

## Need Help?

- Review the CSS Display Guide
- Check your previous mockup for reference
- Ask your instructor for clarification
- Work with classmates to troubleshoot issues

Good luck with your activity!
