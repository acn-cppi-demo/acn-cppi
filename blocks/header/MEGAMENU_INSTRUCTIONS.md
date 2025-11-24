# How to Add Megamenu Links

This guide explains how to add and manage links in the megamenu navigation. Follow these instructions carefully to ensure your links appear correctly in both desktop and mobile views.

## Overview

The megamenu has two types of content:
1. **Main Menu Items** - Categories with submenu links (e.g., "The Fund", "About Us")
2. **Quick Links** - Direct links shown at the bottom of the menu

---

## Step 1: Access the Navigation Fragment

1. Go to your AEM admin panel
2. Navigate to the navigation fragment (usually located at `/nav` or as specified in your metadata)
3. Edit the **nav-tools** section

---

## Step 2: Add Main Menu Items

### Format for Main Menu Items

Each main menu item consists of:
- A **heading** (H2 tag) with text in parentheses `()`
- **Submenu links** (P tag) with link text in square brackets `[]`

### Example Structure

```html
<h2 id="the-fund-arrow_forward">(The Fund<span class="icon icon-arrow_forward"><img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16"></span></h2>
<p><a href="https://example.com/fund-facts" title="[Fund Facts]">[Fund Facts]</a> <a href="https://example.com/performance" title="[Our Performance]">[Our Performance]</a> <a href="https://example.com/investments" title="[Investments]">[Investments]</a></p>
```

### Step-by-Step Instructions

1. **Create a heading** with this format:
   ```
   <h2 id="your-menu-id-arrow_forward">(Your Menu Title<span class="icon icon-arrow_forward"><img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16"></span></h2>
   ```
   
   - Replace `your-menu-id` with a unique ID (use hyphens, no spaces)
   - Replace `Your Menu Title` with your actual menu name
   - **Important**: The title must start with `(` (opening parenthesis)

2. **Add submenu links** in the next paragraph tag:
   ```
   <p><a href="URL" title="[Link Text]">[Link Text]</a> <a href="URL" title="[Link Text]">[Link Text]</a></p>
   ```
   
   - Each link text must be wrapped in square brackets `[Link Text]`
   - You can add multiple links in the same paragraph, separated by spaces
   - Replace `URL` with the actual link destination
   - Replace `[Link Text]` with the link name

### Complete Example

```html
<h2 id="about-us-arrow_forward">(About Us<span class="icon icon-arrow_forward"><img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16"></span></h2>
<p><a href="/our-story" title="[Our Story]">[Our Story]</a> <a href="/team" title="[Our Team]">[Our Team]</a> <a href="/contact" title="[Contact Us]">[Contact Us]</a></p>
```

This will create:
- **Desktop**: "About Us" heading in left sidebar, links appear on right when hovering
- **Mobile**: "About Us" accordion that expands to show links

---

## Step 3: Add Quick Links

Quick Links appear at the bottom of the left sidebar (desktop) and after the accordion items (mobile).

### Format for Quick Links

Quick Links are wrapped between `{ Quick Links` and `}` markers.

### Step-by-Step Instructions

1. **Start the Quick Links section**:
   ```html
   <p>{ Quick Links</p>
   ```

2. **Add each quick link** in separate paragraph tags:
   ```html
   <p>[<a href="URL" title="Link Text">Link Text <span class="icon icon-arrow_forward"><img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16"></span></a>]</p>
   ```
   
   OR if the text is before the link:
   ```html
   <p>[Annual Reports&nbsp;<a href="URL" title=""><span class="icon icon-arrow_forward"><img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16"></span></a>]</p>
   ```

3. **Close the Quick Links section**:
   ```html
   <p>}</p>
   ```

### Complete Example

```html
<p>{ Quick Links</p>
<p>[<a href="/contact" title="Contact Us ">Contact Us <span class="icon icon-arrow_forward"><img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16"></span></a>]</p>
<p>[Annual Reports&nbsp;<a href="/reports" title=""><span class="icon icon-arrow_forward"><img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16"></span></a>]</p>
<p>[Data Dashboard&nbsp;<a href="/dashboard" title=""><span class="icon icon-arrow_forward"><img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16"></span></a>]</p>
<p>}</p>
```

---

## Complete Example Structure

Here's a complete example with multiple menu items and Quick Links:

```html
<!-- Menu Item 1 -->
<h2 id="the-fund-arrow_forward">(The Fund<span class="icon icon-arrow_forward"><img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16"></span></h2>
<p><a href="/fund-facts" title="[Fund Facts]">[Fund Facts]</a> <a href="/performance" title="[Our Performance]">[Our Performance]</a> <a href="/investments" title="[Investments]">[Investments]</a></p>

<!-- Menu Item 2 -->
<h2 id="about-us-arrow_forward">(About Us<span class="icon icon-arrow_forward"><img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16"></span></h2>
<p><a href="/our-story" title="[Our Story]">[Our Story]</a> <a href="/team" title="[Our Team]">[Our Team]</a></p>

<!-- Menu Item 3 -->
<h2 id="insights-arrow_forward">(Insights<span class="icon icon-arrow_forward"><img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16"></span></h2>
<p><a href="/research" title="[Research]">[Research]</a> <a href="/publications" title="[Publications]">[Publications]</a></p>

<!-- Quick Links -->
<p>{ Quick Links</p>
<p>[<a href="/contact" title="Contact Us ">Contact Us <span class="icon icon-arrow_forward"><img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16"></span></a>]</p>
<p>[Annual Reports&nbsp;<a href="/reports" title=""><span class="icon icon-arrow_forward"><img data-icon-name="arrow_forward" src="/icons/arrow_forward.svg" alt="" loading="lazy" width="16" height="16"></span></a>]</p>
<p>}</p>
```

---

## Important Rules

### ✅ DO:

- **Always start headings with `(`** - Example: `(The Fund`
- **Always wrap link text in square brackets** - Example: `[Fund Facts]`
- **Keep the arrow icon code** - Copy it exactly as shown in examples
- **Use unique IDs for each heading** - Format: `menu-name-arrow_forward`
- **Place Quick Links at the end** - After all main menu items

### ❌ DON'T:

- **Don't remove the parentheses** from headings
- **Don't remove the square brackets** from link text
- **Don't skip the arrow icon code**
- **Don't forget to close Quick Links** with `}`
- **Don't add menu items outside the nav-tools section**

---

## Placement in nav-tools Section

Place your megamenu content **after** the search icon, language link, and menu icon, but still inside the `default-content-wrapper`:

```html
<div class="default-content-wrapper">
  <!-- Search icon (keep this) -->
  <p><span class="icon icon-search">...</span></p>
  
  <!-- Language link (keep this) -->
  <a href="/fr" title="FR">FR</a>
  
  <!-- Menu icon (keep this) -->
  <p><span class="icon icon-menu">...</span></p>
  
  <!-- YOUR MEGAMENU CONTENT GOES HERE -->
  <h2 id="the-fund-arrow_forward">(The Fund...)</h2>
  <p><a href="..." title="[Fund Facts]">[Fund Facts]</a></p>
  <!-- etc. -->
</div>
```

---

## Testing Your Changes

After adding your megamenu content:

1. **Save** the navigation fragment
2. **Preview** your site
3. **Click the menu icon** to open the megamenu
4. **Verify**:
   - Desktop: Main headings appear in left sidebar
   - Desktop: Sub-links appear on right when hovering
   - Mobile: Main headings appear as accordion items
   - Mobile: Tap headings to expand and see sub-links
   - Quick Links appear at the bottom in both views

---

## Troubleshooting

### Links Not Appearing?

- Check that heading text starts with `(`
- Check that link text is wrapped in `[]`
- Verify you're editing the correct section (nav-tools)

### Quick Links Not Showing?

- Ensure Quick Links section starts with `{ Quick Links`
- Ensure Quick Links section ends with `}`
- Check that links are wrapped in `[]`

### Menu Not Opening?

- Verify the menu icon is present in nav-tools
- Check browser console for errors
- Ensure the navigation fragment loads correctly

---

## Quick Reference

| Element | Format | Example |
|---------|--------|---------|
| Main Heading | `<h2 id="id-arrow_forward">(Title...` | `<h2 id="the-fund-arrow_forward">(The Fund...` |
| Submenu Link | `<a href="url" title="[Text]">[Text]</a>` | `<a href="/facts" title="[Fund Facts]">[Fund Facts]</a>` |
| Quick Links Start | `<p>{ Quick Links</p>` | Must be exact |
| Quick Link | `<p>[<a href="url">Text...</a>]</p>` | `<p>[<a href="/contact">Contact Us...</a>]</p>` |
| Quick Links End | `<p>}</p>` | Must be exact |

---

## Need Help?

If you're having trouble, check:
1. Your HTML syntax matches the examples exactly
2. All parentheses and brackets are in place
3. The content is in the nav-tools section
4. The navigation fragment is saved and published

