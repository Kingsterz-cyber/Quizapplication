

window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) { 
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

  document.addEventListener('DOMContentLoaded', () => {
    const categorySpans = document.querySelectorAll('.category-headers span');
    const cards = document.querySelectorAll('.card-category');

    categorySpans.forEach(span => {
        span.addEventListener('click', () => {
            // Remove the 'active' class from all spans
            categorySpans.forEach(s => s.classList.remove('active'));

            // Add the 'active' class to the clicked span
            span.classList.add('active');

            // Get the selected category
            const selectedCategory = span.textContent.trim().toLowerCase().replace(/\s+/g, '-');

            // Show or hide cards based on the selected category
            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'block'; // Show the card
                } else {
                    card.style.display = 'none'; // Hide the card
                }
            });
        });
    });
});
document.addEventListener('DOMContentLoaded', () => {
    const categorySpans = document.querySelectorAll('.category-headers span');
    const cards = document.querySelectorAll('.card-category');

    // Automatically trigger the "All" category on page load
    const allCategorySpan = Array.from(categorySpans).find(span => span.textContent.trim().toLowerCase() === 'all');
    if (allCategorySpan) {
        allCategorySpan.classList.add('active'); // Add the active class to the "All" span
        cards.forEach(card => {
            card.style.display = 'block'; // Show all cards
            setTimeout(() => card.classList.add('show'), 50); // Add animation class
        });
    }

    categorySpans.forEach(span => {
        span.addEventListener('click', () => {
            // Remove the 'active' class from all spans
            categorySpans.forEach(s => s.classList.remove('active'));

            // Add the 'active' class to the clicked span
            span.classList.add('active');

            // Get the selected category
            const selectedCategory = span.textContent.trim().toLowerCase().replace(/\s+/g, '-');

            // Animate cards
            cards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');

                if (selectedCategory === 'all' || cardCategory === selectedCategory) {
                    card.style.display = 'block'; // Show the card
                    setTimeout(() => card.classList.add('show'), 50); // Add animation class with a slight delay
                } else {
                    card.classList.remove('show'); // Remove animation class
                    setTimeout(() => card.style.display = 'none', 500); // Hide the card after animation
                }
            });
        });
    });
});
  document.addEventListener('DOMContentLoaded', () => {
    const startQuizButton = document.querySelectorAll('nav img');
    const slidingPage = document.getElementById('slidingPage');

    startQuizButton.addEventListener('click', () => {
        slidingPage.classList.add('active'); // Add the active class to slide the page in
    });
});
