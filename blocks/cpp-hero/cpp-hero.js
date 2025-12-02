export default function decorate(block) {
  // Icon SVG map
  const iconMap = {
    bulb: '<svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M7 19.077C6.49483 19.077 6.05925 18.902 5.69325 18.552C5.32725 18.202 5.12825 17.7744 5.09625 17.2693H8.90375C8.87175 17.7744 8.67275 18.202 8.30675 18.552C7.94075 18.902 7.50517 19.077 7 19.077ZM3.25 15.8845V14.3845H10.75V15.8845H3.25ZM3.40375 13C2.35642 12.3487 1.52733 11.4977 0.9165 10.447C0.3055 9.3965 0 8.2475 0 7C0 5.05133 0.6795 3.3975 2.0385 2.0385C3.3975 0.6795 5.05133 0 7 0C8.94867 0 10.6025 0.6795 11.9615 2.0385C13.3205 3.3975 14 5.05133 14 7C14 8.2475 13.6945 9.3965 13.0835 10.447C12.4727 11.4977 11.6436 12.3487 10.5962 13H3.40375ZM3.85 11.5H10.15C10.9 10.9667 11.4792 10.3083 11.8875 9.525C12.2958 8.74167 12.5 7.9 12.5 7C12.5 5.46667 11.9667 4.16667 10.9 3.1C9.83333 2.03333 8.53333 1.5 7 1.5C5.46667 1.5 4.16667 2.03333 3.1 3.1C2.03333 4.16667 1.5 5.46667 1.5 7C1.5 7.9 1.70417 8.74167 2.1125 9.525C2.52083 10.3083 3.1 10.9667 3.85 11.5Z" fill="#F5F7FA"/></svg>',
    tactic: '<svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12.7557 18L11.7115 16.9557L13.2865 15.3558L11.7115 13.7807L12.7557 12.7115L14.3558 14.3115L15.9307 12.7115L17 13.7807L15.4 15.3558L17 16.9557L15.9307 18L14.3558 16.425L12.7557 18ZM2.75 16.5C3.0975 16.5 3.39267 16.3785 3.6355 16.1355C3.8785 15.8927 4 15.5975 4 15.25C4 14.9025 3.8785 14.6073 3.6355 14.3645C3.39267 14.1215 3.0975 14 2.75 14C2.4025 14 2.10733 14.1215 1.8645 14.3645C1.6215 14.6073 1.5 14.9025 1.5 15.25C1.5 15.5975 1.6215 15.8927 1.8645 16.1355C2.10733 16.3785 2.4025 16.5 2.75 16.5ZM2.75 18C1.98717 18 1.33817 17.7323 0.803 17.197C0.267667 16.6618 0 16.0128 0 15.25C0 14.4872 0.267667 13.8382 0.803 13.303C1.33817 12.7677 1.98717 12.5 2.75 12.5C3.35383 12.5 3.89708 12.6773 4.37975 13.0318C4.86242 13.3863 5.19158 13.8552 5.36725 14.4385C6.08142 14.3128 6.67308 13.9737 7.14225 13.4212C7.61158 12.8686 7.84625 12.2282 7.84625 11.5V7.64425C7.84625 6.33142 8.30967 5.21158 9.2365 4.28475C10.1635 3.35775 11.2834 2.89425 12.5962 2.89425H14.1115L12.2865 1.06925L13.3558 0L17 3.64425L13.3558 7.2885L12.2865 6.24425L14.102 4.39425H12.5962C11.6924 4.39425 10.9247 4.70992 10.2933 5.34125C9.66192 5.97275 9.34625 6.74042 9.34625 7.64425V11.5C9.34625 12.6333 8.969 13.6208 8.2145 14.4625C7.46 15.3042 6.52117 15.8013 5.398 15.9538C5.243 16.5576 4.919 17.0496 4.426 17.4298C3.933 17.8099 3.37433 18 2.75 18ZM1.04425 6.2885L0 5.24425L1.575 3.64425L0 2.06925L1.04425 1L2.64425 2.6L4.21925 1L5.2885 2.06925L3.6885 3.64425L5.2885 5.24425L4.21925 6.2885L2.64425 4.7135L1.04425 6.2885Z" fill="#2C3D50"/></svg>',
    'conversion-path': '<svg width="20" height="18" viewBox="0 0 20 18" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16.75 17.5C16.1257 17.5 15.5696 17.3125 15.0818 16.9375C14.5939 16.5625 14.2724 16.0833 14.1173 15.5H8.75C7.71417 15.5 6.83017 15.134 6.098 14.402C5.366 13.6698 5 12.7858 5 11.75C5 10.7142 5.366 9.83017 6.098 9.098C6.83017 8.366 7.71417 8 8.75 8H10.75C11.3688 8 11.8985 7.7795 12.339 7.3385C12.7797 6.8975 13 6.36742 13 5.74825C13 5.12892 12.7797 4.59933 12.339 4.1595C11.8985 3.71983 11.3688 3.5 10.75 3.5H5.38275C5.21725 4.08333 4.89317 4.5625 4.4105 4.9375C3.92783 5.3125 3.37433 5.5 2.75 5.5C1.98617 5.5 1.33683 5.23275 0.802 4.69825C0.267333 4.16375 0 3.51475 0 2.75125C0 1.98758 0.267333 1.33817 0.802 0.803C1.33683 0.267667 1.98617 0 2.75 0C3.37433 0 3.92783 0.1875 4.4105 0.5625C4.89317 0.9375 5.21725 1.41667 5.38275 2H10.75C11.7858 2 12.6698 2.366 13.402 3.098C14.134 3.83017 14.5 4.71417 14.5 5.75C14.5 6.78583 14.134 7.66983 13.402 8.402C12.6698 9.134 11.7858 9.5 10.75 9.5H8.75C8.13117 9.5 7.6015 9.7205 7.161 10.1615C6.72033 10.6025 6.5 11.1326 6.5 11.7517C6.5 12.3711 6.72033 12.9007 7.161 13.3405C7.6015 13.7802 8.13117 14 8.75 14H14.1173C14.2828 13.4167 14.6068 12.9375 15.0895 12.5625C15.5722 12.1875 16.1257 12 16.75 12C17.5138 12 18.1632 12.2673 18.698 12.8018C19.2327 13.3363 19.5 13.9853 19.5 14.7488C19.5 15.5124 19.2327 16.1618 18.698 16.697C18.1632 17.2323 17.5138 17.5 16.75 17.5ZM2.75 4C3.0975 4 3.39267 3.8785 3.6355 3.6355C3.8785 3.39267 4 3.0975 4 2.75C4 2.4025 3.8785 2.10733 3.6355 1.8645C3.39267 1.6215 3.0975 1.5 2.75 1.5C2.4025 1.5 2.10733 1.6215 1.8645 1.8645C1.6215 2.10733 1.5 2.4025 1.5 2.75C1.5 3.0975 1.6215 3.39267 1.8645 3.6355C2.10733 3.8785 2.4025 4 2.75 4Z" fill="#2C3D50"/></svg>',
    news: '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.80775 17C1.30258 17 0.875 16.825 0.525 16.475C0.175 16.125 0 15.6974 0 15.1923V1.80775C0 1.30258 0.175 0.875 0.525 0.525C0.875 0.175 1.30258 0 1.80775 0H12.2885L17 4.7115V15.1923C17 15.6974 16.825 16.125 16.475 16.475C16.125 16.825 15.6974 17 15.1923 17H1.80775ZM1.80775 15.5H15.1923C15.2821 15.5 15.3558 15.4712 15.4135 15.4135C15.4712 15.3558 15.5 15.2821 15.5 15.1923V5.5H11.5V1.5H1.80775C1.71792 1.5 1.64417 1.52883 1.5865 1.5865C1.52883 1.64417 1.5 1.71792 1.5 1.80775V15.1923C1.5 15.2821 1.52883 15.3558 1.5865 15.4135C1.64417 15.4712 1.71792 15.5 1.80775 15.5ZM3.75 13H13.25V11.5H3.75V13ZM3.75 5.5H8.5V4H3.75V5.5ZM3.75 9.25H13.25V7.75H3.75V9.25Z" fill="#2C3D50"/></svg>',
    'moving-arrow': '<svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.054 11.4038L0 10.35L5.127 5.223C5.6655 4.691 6.3145 4.42342 7.074 4.42025C7.83367 4.41708 8.48275 4.68467 9.02125 5.223L10.1712 6.373C10.4226 6.62433 10.7193 6.74842 11.0615 6.74525C11.4038 6.74208 11.7007 6.618 11.952 6.373L16.8348 1.5H13.904V0H19.404V5.5H17.904V2.56925L13.0058 7.44225C12.4674 7.97425 11.8168 8.24192 11.054 8.24525C10.2912 8.24842 9.64375 7.984 9.11175 7.452L7.93675 6.277C7.69558 6.03583 7.40292 5.91692 7.05875 5.92025C6.71442 5.92342 6.42175 6.04233 6.18075 6.277L1.054 11.4038Z" fill="#2C3D50"/></svg>',
    'pie-chart': '<svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10.25 8.75H17.4693C17.2769 6.8205 16.508 5.18142 15.1625 3.83275C13.817 2.48392 12.1795 1.71658 10.25 1.53075V8.75ZM8.75 17.4693V1.53075C6.6885 1.71658 4.96475 2.57008 3.57875 4.09125C2.19292 5.61242 1.5 7.41533 1.5 9.5C1.5 11.5847 2.19292 13.3876 3.57875 14.9087C4.96475 16.4299 6.6885 17.2834 8.75 17.4693ZM10.25 17.4693C12.1795 17.2936 13.8196 16.5288 15.1702 15.175C16.5209 13.8212 17.2873 12.1795 17.4693 10.25H10.25V17.4693ZM9.50175 19C8.18775 19 6.95267 18.7507 5.7965 18.252C4.64033 17.7533 3.63467 17.0766 2.7795 16.2218C1.92433 15.3669 1.24725 14.3617 0.74825 13.206C0.249417 12.0503 0 10.8156 0 9.50175C0 8.18775 0.249333 6.95267 0.748 5.7965C1.24667 4.64033 1.92342 3.63467 2.77825 2.7795C3.63308 1.92433 4.63833 1.24725 5.794 0.74825C6.94967 0.249417 8.18442 0 9.49825 0C10.8123 0 12.0446 0.249667 13.1953 0.749001C14.3459 1.24833 15.3513 1.92817 16.2115 2.7885C17.0718 3.64867 17.7517 4.65375 18.251 5.80375C18.7503 6.95358 19 8.18667 19 9.503C19 10.8035 18.7507 12.0312 18.252 13.1863C17.7533 14.3411 17.0766 15.3496 16.2218 16.2118C15.3669 17.0739 14.3617 17.7542 13.206 18.2525C12.0503 18.7508 10.8156 19 9.50175 19Z" fill="#2C3D50"/></svg>',
    'bar-chart': '<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M11.5 15V9.09625H15V15H11.5ZM5.75 15V0H9.25V15H5.75ZM0 15V4.904H3.5V15H0Z" fill="#2C3D50"/></svg>',
    analytics: '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.8655 13.25H5.36525V8.5H3.8655V13.25ZM11.6348 13.25H13.1345V3.5H11.6348V13.25ZM7.75 13.25H9.25V10.5H7.75V13.25ZM7.75 8.5H9.25V6.5H7.75V8.5ZM1.80775 17C1.30258 17 0.875 16.825 0.525 16.475C0.175 16.125 0 15.6974 0 15.1923V1.80775C0 1.30258 0.175 0.875 0.525 0.525C0.875 0.175 1.30258 0 1.80775 0H15.1923C15.6974 0 16.125 0.175 16.475 0.525C16.825 0.875 17 1.30258 17 1.80775V15.1923C17 15.6974 16.825 16.125 16.475 16.475C16.125 16.825 15.6974 17 15.1923 17H1.80775ZM1.80775 15.5H15.1923C15.2692 15.5 15.3398 15.4679 15.4038 15.4038C15.4679 15.3398 15.5 15.2692 15.5 15.1923V1.80775C15.5 1.73075 15.4679 1.66025 15.4038 1.59625C15.3398 1.53208 15.2692 1.5 15.1923 1.5H1.80775C1.73075 1.5 1.66025 1.53208 1.59625 1.59625C1.53208 1.66025 1.5 1.73075 1.5 1.80775V15.1923C1.5 15.2692 1.53208 15.3398 1.59625 15.4038C1.66025 15.4679 1.73075 15.5 1.80775 15.5Z" fill="#2C3D50"/></svg>',
    'chart-data': '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.9 12.1442L6.95 9.10375L8.95 11.1038L12.75 7.31925V9.25H14.25V4.75H9.75V6.25H11.6807L8.95 8.98075L6.95 6.98075L2.85575 11.1L3.9 12.1442ZM1.80775 17C1.30258 17 0.875 16.825 0.525 16.475C0.175 16.125 0 15.6974 0 15.1923V1.80775C0 1.30258 0.175 0.875 0.525 0.525C0.875 0.175 1.30258 0 1.80775 0H15.1923C15.6974 0 16.125 0.175 16.475 0.525C16.825 0.875 17 1.30258 17 1.80775V15.1923C17 15.6974 16.825 16.125 16.475 16.475C16.125 16.825 15.6974 17 15.1923 17H1.80775ZM1.80775 15.5H15.1923C15.2692 15.5 15.3398 15.4679 15.4038 15.4038C15.4679 15.3398 15.5 15.2692 15.5 15.1923V1.80775C15.5 1.73075 15.4679 1.66025 15.4038 1.59625C15.3398 1.53208 15.2692 1.5 15.1923 1.5H1.80775C1.73075 1.5 1.66025 1.53208 1.59625 1.59625C1.53208 1.66025 1.5 1.73075 1.5 1.80775V15.1923C1.5 15.2692 1.53208 15.3398 1.59625 15.4038C1.66025 15.4679 1.73075 15.5 1.80775 15.5Z" fill="#F5F7FA"/></svg>',
    'view-timeline': '<svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.76925 13.25H8.23075V11.75H2.76925V13.25ZM5.76925 9.25H11.2308V7.75H5.76925V9.25ZM8.76925 5.25H14.2308V3.75H8.76925V5.25ZM1.80775 17C1.30258 17 0.875 16.825 0.525 16.475C0.175 16.125 0 15.6974 0 15.1923V1.80775C0 1.30258 0.175 0.875 0.525 0.525C0.875 0.175 1.30258 0 1.80775 0H15.1923C15.6974 0 16.125 0.175 16.475 0.525C16.825 0.875 17 1.30258 17 1.80775V15.1923C17 15.6974 16.825 16.125 16.475 16.475C16.125 16.825 15.6974 17 15.1923 17H1.80775ZM1.80775 15.5H15.1923C15.2692 15.5 15.3398 15.4679 15.4038 15.4038C15.4679 15.3398 15.5 15.2692 15.5 15.1923V1.80775C15.5 1.73075 15.4679 1.66025 15.4038 1.59625C15.3398 1.53208 15.2692 1.5 15.1923 1.5H1.80775C1.73075 1.5 1.66025 1.53208 1.59625 1.59625C1.53208 1.66025 1.5 1.73075 1.5 1.80775V15.1923C1.5 15.2692 1.53208 15.3398 1.59625 15.4038C1.66025 15.4679 1.73075 15.5 1.80775 15.5Z" fill="#F5F7FA"/></svg>',
  };

  // Extract all data from the block into a JSON object
  const cppHeroData = {
    badge: null,
    iconSVG: 'none',
    title: null,
    description: null,
    buttons: [],
  };

  // Get all direct child divs
  const children = Array.from(block.children);
  let currentIndex = 0;

  // Extract badge (first div with text)
  if (children[currentIndex]) {
    const badgeText = children[currentIndex].textContent.trim();
    if (badgeText && badgeText.toLowerCase() !== 'none') {
      cppHeroData.badge = badgeText;
      currentIndex += 1;
    } else if (badgeText && badgeText.toLowerCase() === 'none') {
      // Skip "none" badge and move to next
      currentIndex += 1;
    }
  }

  // Extract iconSVG (second div with text) - if it matches an icon name (not "none")
  if (children[currentIndex]) {
    const iconText = children[currentIndex].textContent.trim();
    if (iconText && iconText.toLowerCase() !== 'none' && iconMap[iconText]) {
      cppHeroData.iconSVG = iconText;
      currentIndex += 1;
    } else if (iconText && iconText.toLowerCase() === 'none') {
      // Skip "none" icon and move to next
      currentIndex += 1;
    }
  }

  // Extract title (next div with paragraph containing strong or text)
  // Skip any divs that only contain "none" text
  if (children[currentIndex]) {
    const titleDiv = children[currentIndex];
    const titleText = titleDiv.textContent.trim();
    const titleParagraph = titleDiv.querySelector('p');

    // Get text from paragraph if exists, otherwise from div
    const extractedText = titleParagraph
      ? (titleParagraph.textContent.trim() || titleParagraph.innerHTML.trim())
      : titleText;

    // Skip if text is "none"
    if (extractedText && extractedText.toLowerCase() === 'none') {
      currentIndex += 1;
    } else if (extractedText && extractedText.toLowerCase() !== 'none') {
      if (titleParagraph) {
        cppHeroData.title = titleParagraph.innerHTML.trim();
      } else {
        cppHeroData.title = titleText;
      }
      currentIndex += 1;
    } else {
      currentIndex += 1;
    }
  }

  // Extract description (next div with paragraph)
  if (children[currentIndex]) {
    const descDiv = children[currentIndex];
    const descParagraph = descDiv.querySelector('p');
    if (descParagraph) {
      cppHeroData.description = descParagraph.innerHTML.trim();
      currentIndex += 1;
    }
  }

  // Extract buttons and links (they come in pairs: label, then link)
  const buttonPairs = [];
  while (currentIndex < children.length) {
    const labelDiv = children[currentIndex];
    const linkDiv = children[currentIndex + 1];

    if (labelDiv && linkDiv) {
      const labelText = labelDiv.textContent.trim();
      const linkText = linkDiv.textContent.trim();

      if (labelText && linkText) {
        // Handle relative paths - if it doesn't start with http, treat as relative
        const href = linkText.startsWith('http') ? linkText : linkText;
        buttonPairs.push({
          text: labelText,
          href,
        });
        currentIndex += 2;
      } else {
        currentIndex += 1;
      }
    } else {
      currentIndex += 1;
    }
  }

  cppHeroData.buttons = buttonPairs;

  // Generate unique IDs for accessibility
  const titleId = `cpp-hero-title-${Date.now()}`;
  const descriptionId = `cpp-hero-description-${Date.now()}`;

  // Build button HTML: render <a> for valid hrefs and <button disabled> for missing links
  let buttonsHtml = '';
  if (cppHeroData.buttons.length > 0) {
    buttonsHtml = `
        <nav class="cpp-hero-buttons" aria-label="Hero actions">
          ${cppHeroData.buttons.map((button, index) => {
    const buttonClass = index === 0 ? 'button-primary' : 'button-secondary';
    const hasHref = button.href && button.href !== '#';
    if (hasHref) {
      return `<a href="${button.href}" class="button ${buttonClass}">${button.text}</a>`;
    }
    // render a disabled button when there's no valid href
    // this shows a non-clickable control to keyboard users
    return `<button type="button" class="button ${buttonClass}" disabled aria-disabled="true">${button.text}</button>`;
  }).join('')}
        </nav>
      `;
  }

  // Build badge HTML with icon support
  let badgeHTML = '';
  if (cppHeroData.badge) {
    const iconSVG = (cppHeroData.iconSVG && cppHeroData.iconSVG !== 'none' && iconMap[cppHeroData.iconSVG])
      ? iconMap[cppHeroData.iconSVG]
      : '';

    badgeHTML = `
      <div class="cpp-hero-badge">
        ${iconSVG ? `<span class="badge-icon" aria-hidden="true">${iconSVG}</span>` : ''}
        <span>${cppHeroData.badge}</span>
      </div>
    `;
  }

  // Build HTML structure; include aria-describedby if a description exists
  const descAttr = cppHeroData.description ? ` aria-describedby="${descriptionId}"` : '';

  const html = `
    <div class="cpp-hero-wrapper" role="region" aria-labelledby="${titleId}"${descAttr}>
      <div class="cpp-hero-main">
        ${badgeHTML}
        ${cppHeroData.title ? `<h2 class="cpp-hero-title" id="${titleId}">${cppHeroData.title}</h2>` : ''}
        ${cppHeroData.description ? `<div class="cpp-hero-description" id="${descriptionId}">${cppHeroData.description}</div>` : ''}
        ${buttonsHtml}
      </div>
    </div>
  `;

  // Replace block content with new HTML
  block.innerHTML = html;
}
