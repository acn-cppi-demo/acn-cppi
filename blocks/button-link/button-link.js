export default function decorate(block) {
  // Find all links in the block
  const links = block.querySelectorAll('a[href]');

  links.forEach((link) => {
    // Apply primary-link styling to all links in this block
    link.classList.add('link-primary');
    // Remove any button classes
    link.classList.remove('button', 'primary', 'secondary');
    // Add arrow SVG if not already present
    if (!link.querySelector('svg')) {
      const arrowIcon = document.createRange().createContextualFragment(`
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="#0273CF"></path>
        </svg>
      `).firstElementChild;
      link.appendChild(arrowIcon);
    }
    // Add button-container class to parent
    const parent = link.parentElement;
    if (parent && (parent.tagName === 'P' || parent.tagName === 'DIV')) {
      parent.classList.add('button-container');
    }
  });
}
