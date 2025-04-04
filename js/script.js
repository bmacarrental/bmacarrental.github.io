document.addEventListener('DOMContentLoaded', function() {

    // --- Smooth Scroll for Anchor Links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const hrefAttribute = this.getAttribute('href');
            // Ensure it's a real anchor link on the same page and not just "#"
            if (hrefAttribute && hrefAttribute.length > 1 && document.querySelector(hrefAttribute)) {
                e.preventDefault();
                document.querySelector(hrefAttribute).scrollIntoView({
                    behavior: 'smooth',
                    block: 'start' // Align to top, adjust if needed (e.g., 'center')
                });
                 // Close mobile menu if open after clicking a link
                 closeMobileMenu();
            }
        });
    });


    // --- Sticky Navbar & Scroll Effects ---
    const navbar = document.getElementById('navbar');
    let lastScrollTop = 0; // Keep track of scroll direction

    if (navbar) {
        window.addEventListener('scroll', function() {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Sticky class based on scroll position
            if (scrollTop > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Optional: Hide navbar on scroll down, show on scroll up
            // if (scrollTop > lastScrollTop && scrollTop > navbar.offsetHeight){
            //     // Scroll Down
            //     navbar.style.top = `-${navbar.offsetHeight}px`; // Adjust based on padding change
            // } else {
            //     // Scroll Up
            //     navbar.style.top = "0";
            // }
            // lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling

            // Trigger scroll animations
            activateScrollAnimations();
        }, false);
    }

    // --- Mobile Menu Toggle ---
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    function closeMobileMenu() {
        if(navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false'); // Accessibility
        }
    }

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive); // Accessibility
        });
    }

    // --- Section Scroll Animations ---
    const sections = document.querySelectorAll('section'); // Target all sections
    const activateScrollAnimations = () => {
        const triggerBottom = window.innerHeight / 5 * 4; // Trigger point

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop < triggerBottom) {
                section.classList.add('visible');
            } else {
                // Optional: Remove class to re-animate on scroll up
                // section.classList.remove('visible');
            }
        });
    };
    // Initial check in case sections are already in view
    activateScrollAnimations();


    // --- Footer Current Year ---
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Form Handling Helper ---
    function handleFormSubmission(form, statusElement, recipientEmail, subjectPrefix) {
         form.addEventListener('submit', function(event) {
             event.preventDefault();
             statusElement.textContent = 'Sending...';
             statusElement.className = 'form-status info visible'; // Show info status

             const formData = new FormData(form);
             const data = Object.fromEntries(formData.entries()); // Get form data as object

             // Basic client-side validation (enhance as needed)
             let isValid = true;
             let errorMessage = "Please fill in all required fields correctly.";

             form.querySelectorAll('[required]').forEach(input => {
                 if (!input.value || input.value.trim() === '') {
                     isValid = false;
                 }
                 if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)) {
                     isValid = false;
                     errorMessage = "Please enter a valid email address.";
                 }
                  if (input.type === 'tel' && input.pattern && !new RegExp(input.pattern).test(input.value)) {
                     isValid = false;
                     errorMessage = "Please enter a valid phone number format.";
                 }
             });

             if (!isValid) {
                 statusElement.textContent = errorMessage;
                 statusElement.className = 'form-status error visible';
                 return;
             }

             // Prepare Mailto Link
             let body = `New Request from Website (${subjectPrefix}):\n\n`;
             for (const key in data) {
                 if (Object.hasOwnProperty.call(data, key)) {
                    // Make keys more readable
                    const formattedKey = key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                    body += `${formattedKey}: ${data[key]}\n`;
                 }
             }
             body += `\n--- Please respond to ${data.email || data['contact-email'] || 'the sender'} ---`;

             const subject = encodeURIComponent(`${subjectPrefix} - ${data.name || data['contact-name'] || ''}`);
             const mailtoLink = `mailto:${recipientEmail}?subject=${subject}&body=${encodeURIComponent(body)}`;

             // Attempt to open mail client
             statusElement.textContent = 'Preparing your request...';
             statusElement.className = 'form-status info visible';

             setTimeout(() => {
                 try {
                    // Use window.open for slightly better compatibility sometimes
                    const mailWindow = window.open(mailtoLink, '_blank');
                    if (!mailWindow) { // If window.open was blocked or failed
                         window.location.href = mailtoLink; // Fallback to window.location
                    }

                    statusElement.textContent = 'Redirecting to your email client. Please review and send the email.';
                    statusElement.className = 'form-status success visible';
                    form.reset(); // Reset form after successful prep
                 } catch (error) {
                    console.error("Mailto link error:", error);
                    statusElement.textContent = 'Could not open email client automatically. Please copy the details and email us directly.';
                    statusElement.className = 'form-status error visible';
                    // Optionally, display the generated body for manual copy
                    // statusElement.innerHTML += `<br><textarea rows="5" style="width:100%; margin-top:10px;" readonly>${body}</textarea>`;
                 }
             }, 500); // Shorter delay
         });
    }

    // --- Initialize Booking Form ---
    const bookingForm = document.getElementById('quick-booking-form');
    const bookingStatus = document.getElementById('booking-status');
    if (bookingForm && bookingStatus) {
         // **** REPLACE WITH YOUR ACTUAL BOOKING EMAIL ****
        handleFormSubmission(bookingForm, bookingStatus, 'booking@bmacarrental.com', 'Booking Request');
    }

     // --- Initialize Contact Form ---
     const contactForm = document.getElementById('contact-inquiry-form');
     const contactStatus = document.getElementById('contact-status');
     if (contactForm && contactStatus) {
          // **** REPLACE WITH YOUR ACTUAL CONTACT EMAIL ****
         handleFormSubmission(contactForm, contactStatus, 'contact@bmacarrental.com', 'Website Inquiry');
     }


    // --- Basic Customer Reviews Carousel ---
    const reviewItems = document.querySelectorAll('.review-item');
    const prevReviewBtn = document.getElementById('prev-review');
    const nextReviewBtn = document.getElementById('next-review');
    let currentReviewIndex = 0;
    let reviewInterval; // Variable to hold the interval timer

    function showReview(index) {
        reviewItems.forEach((item, i) => {
            item.classList.remove('active');
            if (i === index) {
                item.classList.add('active');
            }
        });
    }

     function startReviewAutoplay() {
        stopReviewAutoplay(); // Clear existing interval if any
        reviewInterval = setInterval(() => {
            nextReviewBtn.click();
        }, 6000); // Change slide every 6 seconds
    }

    function stopReviewAutoplay() {
        clearInterval(reviewInterval);
    }


    if (reviewItems.length > 0 && prevReviewBtn && nextReviewBtn) {
        showReview(currentReviewIndex); // Show the first review initially

        nextReviewBtn.addEventListener('click', () => {
            currentReviewIndex = (currentReviewIndex + 1) % reviewItems.length;
            showReview(currentReviewIndex);
            stopReviewAutoplay(); // Stop autoplay when user interacts
        });

        prevReviewBtn.addEventListener('click', () => {
            currentReviewIndex = (currentReviewIndex - 1 + reviewItems.length) % reviewItems.length;
            showReview(currentReviewIndex);
            stopReviewAutoplay(); // Stop autoplay when user interacts
        });

        // Optional: Start autoplay on load
        // startReviewAutoplay();

        // Optional: Pause autoplay on hover
        // const carouselContainer = document.querySelector('.review-carousel');
        // if (carouselContainer) {
        //     carouselContainer.addEventListener('mouseenter', stopReviewAutoplay);
        //     carouselContainer.addEventListener('mouseleave', startReviewAutoplay);
        // }
    }


    // --- FAQs Accordion (FIXED HEIGHT) ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const questionButton = item.querySelector('.faq-question');
            const answerDiv = item.querySelector('.faq-answer');

            if (questionButton && answerDiv) {
                // Set initial state for transition
                answerDiv.style.maxHeight = '0';
                answerDiv.style.paddingTop = '0';
                 answerDiv.style.paddingBottom = '0';
                 answerDiv.style.overflow = 'hidden'; // Ensure content is clipped

                questionButton.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');

                    // Optional: Close other open items
                    // faqItems.forEach(otherItem => {
                    //     if (otherItem !== item && otherItem.classList.contains('active')) {
                    //         otherItem.classList.remove('active');
                    //         const otherAnswer = otherItem.querySelector('.faq-answer');
                    //         otherAnswer.style.maxHeight = '0';
                    //         otherAnswer.style.paddingTop = '0';
                    //         otherAnswer.style.paddingBottom = '0';
                    //     }
                    // });

                    if (!isActive) {
                        item.classList.add('active');
                        // Set max-height to scrollHeight for smooth transition
                        answerDiv.style.maxHeight = answerDiv.scrollHeight + "px";
                        answerDiv.style.paddingTop = '25px'; // Match CSS padding
                        answerDiv.style.paddingBottom = '25px';
                    } else {
                         item.classList.remove('active');
                         answerDiv.style.maxHeight = '0'; // Collapse
                         answerDiv.style.paddingTop = '0';
                         answerDiv.style.paddingBottom = '0';
                    }
                });
            }
        });
    }

    // --- (Simulated) Availability Checker Placeholder ---
    // No changes needed here unless you implement it


}); // End DOMContentLoaded
