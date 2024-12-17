// handle content movement
function handleContentPlacement() {
    const sidebar = document.querySelector('.sidebar-content');
    const additionalInfo = document.querySelector('.additional-info-mobile');
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    function moveContent(e) {
        if (e.matches) {
            // mobile: move content to bottom
            if (sidebar && sidebar.parentNode.contains(sidebar)) {
                additionalInfo.appendChild(sidebar);
            }
        } else {
            // desktop: move content back to sidebar
            const sidebarParent = document.querySelector('.sidebar');
            const contactInfo = document.querySelector('.contact-info');
            if (sidebar && !sidebarParent.contains(sidebar)) {
                sidebarParent.insertBefore(sidebar, contactInfo.nextSibling.nextSibling);
            }
        }
    }

    // initial check
    moveContent(mediaQuery);
    // listen for viewport changes
    mediaQuery.addListener(moveContent);
}

// run after dom load
document.addEventListener('DOMContentLoaded', handleContentPlacement);

// run on resize
window.addEventListener('resize', () => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');
    handleContentPlacement(mediaQuery);
});

// email protection
const protectEmail = () => {
    const emailElements = document.querySelectorAll('.protected-email');
    emailElements.forEach(element => {
        // get components and immediately remove attributes
        const components = {
            prefix1: element.getAttribute('data-p1'),
            prefix2: element.getAttribute('data-p2'),
            domain1: element.getAttribute('data-d1'),
            domain2: element.getAttribute('data-d2'),
            tld: element.getAttribute('data-t')
        };

        // clean up data attributes
        Object.keys(components).forEach(key => {
            element.removeAttribute(`data-${key}`);
        });

        // prevent easy text scraping
        const prefixSpan = document.createElement('span');
        const atSpan = document.createElement('span');
        const domainSpan = document.createElement('span');
        const dotSpan = document.createElement('span');
        const tldSpan = document.createElement('span');
        prefixSpan.textContent = `${components.prefix1}${components.prefix2}`;
        atSpan.textContent = '@';
        domainSpan.textContent = `${components.domain1}${components.domain2}`;
        dotSpan.textContent = '.';
        tldSpan.textContent = components.tld;
        element.appendChild(prefixSpan);
        element.appendChild(atSpan);
        element.appendChild(domainSpan);
        element.appendChild(dotSpan);
        element.appendChild(tldSpan);

        // add tooltip
        element.title = "Click to email";
        const handleEmailReveal = (event) => {
            // handle both click and Enter key
            if (event.type === 'keydown' && event.key !== 'Enter') return;
            event.preventDefault();

            // construct real email only when needed
            const emailAddress = `${components.prefix1}${components.prefix2}@${components.domain1}${components.domain2}.${components.tld}`;

            // create and trigger mailto link
            const tempLink = document.createElement('a');
            tempLink.href = `mailto:${emailAddress}`;
            tempLink.style.display = 'none';
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
        };

        element.addEventListener('click', handleEmailReveal);
        element.addEventListener('keydown', handleEmailReveal);
    });
};

// add styles
const style = document.createElement('style');
style.textContent = `
    .protected-email {
      color: inherit;
      border-bottom: 1px solid currentColor;
      cursor: pointer;
      transition: opacity 0.2s ease;
      display: inline-block;
    }

    .protected-email:hover {
      opacity: 0.8;
    }

    .protected-email:focus {
      outline: 2px solid rgba(218, 165, 32, 0.4);
      outline-offset: 2px;
    }
  `;
document.head.appendChild(style);

// initialize on dom load
document.addEventListener('DOMContentLoaded', protectEmail);
