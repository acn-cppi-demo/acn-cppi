export default function decorate(block) {
  // Get all direct child divs
  const children = Array.from(block.children);

  // First div contains the badge text, second div contains the class
  if (children.length >= 2) {
    const classDiv = children[1];
    const classParagraph = classDiv.querySelector('p');

    if (classParagraph) {
      // Get the class value from the text content
      const classValue = classParagraph.textContent.trim();

      // Apply the class to the badge block
      if (classValue) {
        block.classList.add(classValue);
      }

      // Remove the class div from DOM
      classDiv.remove();
    }
  }
}
