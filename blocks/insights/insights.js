export default function decorate(block) {
  // Add insights-specific styling class
  block.classList.add('insights-container');

  // Process content
  const rows = [...block.children];
  rows.forEach((row) => {
    const cells = [...row.children];
    cells.forEach((cell) => {
      if (cell.classList.contains('badge')) {
        cell.classList.add('insights-badge');
      } else if (cell.querySelector('h1, h2, h3, h4, h5, h6')) {
        cell.classList.add('insights-heading');
      } else if (cell.querySelector('a')) {
        cell.classList.add('insights-button');
      } else if (cell.textContent.trim()) {
        cell.classList.add('insights-text');
      }
    });
  });
}
