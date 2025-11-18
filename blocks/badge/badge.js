export default function decorate(block) {
  // Find the class element
  const classElement = block.querySelector('[data-aue-prop="class"]');

  if (classElement) {
    // Get the class value from the text content
    const classValue = classElement.textContent.trim();

    // Apply the class to the badge block
    if (classValue) {
      block.classList.add(classValue);
    }

    // Remove the class element and its parent div from DOM
    const classParent = classElement.closest('div');
    if (classParent) {
      classParent.remove();
    }
  }
}
