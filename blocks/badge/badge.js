export default function decorate(block) {
  // Get badge text and type from the block
  const badgeText = block.textContent.trim();
  const badgeType = block.classList.contains('primary') ? 'primary' : 'secondary';

  // Clear and rebuild the badge
  block.textContent = '';
  block.classList.add('badge', badgeType);

  const span = document.createElement('span');
  span.textContent = badgeText;
  block.appendChild(span);
}
