document.addEventListener('DOMContentLoaded', () => {
  // --- Accordion Functionality ---
  const accordionContainers = document.querySelectorAll('.day-content'); // Get main content container

  accordionContainers.forEach(container => {
    const headers = container.querySelectorAll('h2'); // Find section headers within this container

    headers.forEach(header => {
      const toggleButton = header.querySelector('.accordion-toggle');
      // IMPORTANT: Assumes the accordion content DIV is the *immediate next sibling* of the H2
      const content = header.nextElementSibling;

      if (toggleButton && content && content.classList.contains('accordion-content')) {
        // Set initial state based on aria-expanded attribute
        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
        if (isExpanded) {
          content.classList.add('active');
        } else {
          content.classList.remove('active');
          // Ensure content is hidden if not active initially (JS fallback)
          content.style.display = 'none';
        }

        // Make the H2 itself clickable, not just the button
        header.style.cursor = 'pointer';
        header.addEventListener('click', (e) => {
          // Prevent toggling if a link inside the header was clicked
          if (e.target.closest('a')) {
            return;
          }

          const currentlyExpanded = toggleButton.getAttribute('aria-expanded') === 'true';

          // Toggle aria-expanded attribute
          toggleButton.setAttribute('aria-expanded', !currentlyExpanded);

          // Toggle the 'active' class and display style
          content.classList.toggle('active');
          if (!currentlyExpanded) {
            content.style.display = 'block'; // Show content
          } else {
            content.style.display = 'none'; // Hide content
          }
        });

        // Also make the button itself trigger the toggle (for accessibility/redundancy)
         toggleButton.addEventListener('click', (e) => {
             e.stopPropagation(); // Prevent the header click listener from firing twice
             const currentlyExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
             toggleButton.setAttribute('aria-expanded', !currentlyExpanded);
             content.classList.toggle('active');
              if (!currentlyExpanded) {
                 content.style.display = 'block';
             } else {
                 content.style.display = 'none';
             }
         });


      } else {
        // Optional: Add warnings for debugging structure issues
        // if (!toggleButton) console.warn("Accordion H2 missing toggle button:", header);
        // if (!content) console.warn("Accordion H2 missing next sibling content element:", header);
        // if (content && !content.classList.contains('accordion-content')) console.warn("Accordion H2 next sibling is not .accordion-content:", header);
      }
    });
  });


  // --- Add section IDs for deep linking ---
  // Find all H2s inside the main day content area that have a toggle button
    const sectionHeaders = document.querySelectorAll('.day-content h2 .accordion-toggle');

     sectionHeaders.forEach(button => {
        const header = button.closest('h2'); // Get the parent H2
        if (!header) return;

         // Create an ID from the header text content, removing the button text
         const textContent = header.textContent || '';
         const buttonText = button.textContent || '';
         const cleanText = textContent.replace(buttonText, '').trim(); // Remove button text

         // Generate a URL-friendly ID
         const id = cleanText.toLowerCase()
                             .replace(/[^a-z0-9\s-]/g, '') // Remove unwanted characters (allow spaces and hyphens)
                             .trim()                     // Trim leading/trailing spaces
                             .replace(/\s+/g, '-')       // Replace spaces with hyphens
                             .replace(/-+/g, '-');       // Replace multiple hyphens with single one

         if (id) {
            header.id = id; // Assign the generated ID to the H2 element itself
            // console.log(`Assigned ID: #${id} to header: ${cleanText}`); // For debugging

            // Optional: Add ID to the content div for potential styling/targeting
            const contentDiv = header.nextElementSibling;
            if (contentDiv && contentDiv.classList.contains('accordion-content')) {
                contentDiv.id = `${id}-content`;
            }
         } else {
            // console.warn(`Could not generate valid ID for header: ${textContent}`); // For debugging
         }
     });

    // --- Smooth scrolling for hash links --- (Optional but nice)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Adjust alignment ('start', 'center', 'end') as needed
                });
                 // Optional: Briefly highlight the target section
                 targetElement.style.transition = 'outline 0.1s ease-in-out';
                 targetElement.style.outline = '2px solid #c8504a'; // Use accent color
                 setTimeout(() => {
                     targetElement.style.outline = 'none';
                 }, 1000); // Remove highlight after 1 second
            }
        });
    });

}); // End DOMContentLoaded