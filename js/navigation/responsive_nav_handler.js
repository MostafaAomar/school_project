
// /js/navigation/responsive_nav_handler.js

/**
 * @fileoverview Handles the toggle functionality for the responsive
 * main navigation menu (hamburger menu).
 */

let toggleButton = null;
let navLinksContainer = null;
let navContainer = null; // The parent container

/**
 * Toggles the visibility and ARIA state of the mobile navigation menu.
 */
function toggleMobileNav() {
    if (!toggleButton || !navLinksContainer) {
        console.warn("[Responsive Nav] Toggle button or links container not found.");
        return;
    }

    const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';

    // Toggle visibility class on the links container
    navLinksContainer.classList.toggle('main-nav-links--active');

    // Update ARIA state on the toggle button
    toggleButton.setAttribute('aria-expanded', String(!isExpanded));

    console.log(`[Responsive Nav] Toggled. Expanded: ${!isExpanded}`);
}

/**
 * Closes the mobile navigation if it's currently open.
 */
function closeMobileNav() {
     if (!toggleButton || !navLinksContainer) return;

     if (navLinksContainer.classList.contains('main-nav-links--active')) {
         navLinksContainer.classList.remove('main-nav-links--active');
         toggleButton.setAttribute('aria-expanded', 'false');
         console.log('[Responsive Nav] Closed.');
     }
}

/**
 * Initializes the responsive navigation handlers.
 */
export function initializeResponsiveNavHandler() {
    navContainer = document.querySelector('.main-nav-container');
    if (!navContainer) {
        console.warn('[Responsive Nav] Init failed: .main-nav-container not found.');
        return;
    }

    toggleButton = navContainer.querySelector('.main-nav-toggle');
    navLinksContainer = navContainer.querySelector('.main-nav-links');

    if (!toggleButton || !navLinksContainer) {
        console.warn('[Responsive Nav] Init failed: Toggle button or links container missing.');
        return;
    }

    // --- Hamburger Button Click ---
    toggleButton.addEventListener('click', toggleMobileNav);

    // --- Close on Link Click ---
    // Use event delegation on the links container
    navLinksContainer.addEventListener('click', (event) => {
        // Check if the click was directly on a button inside the nav
        if (event.target.closest('.main-nav-button')) {
            closeMobileNav(); // Close menu after link click
            // The actual view switching is handled by main_nav_handler.js
        }
    });

    // --- Optional: Close on Click Outside ---
    document.addEventListener('click', (event) => {
         if (!navLinksContainer.classList.contains('main-nav-links--active')) {
            return; // Menu is already closed
         }
         // Check if the click happened *outside* the entire nav container
         const isClickInsideNav = navContainer.contains(event.target);
         if (!isClickInsideNav) {
               closeMobileNav();
         }
    });


    console.log("[Responsive Nav] Handler Initialized.");
}


console.log('[Responsive Nav Handler] Module Initialized.');