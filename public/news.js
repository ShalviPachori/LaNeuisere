document.addEventListener("DOMContentLoaded", () => {
    const newsContainer = document.getElementById("news-container");
    const homePageHeading = document.querySelector(".homePageHeading");
    const breakingNewsTicker = document.getElementById("breaking-news-ticker"); // For breaking news banner

    let allNews = []; // Store all fetched news
    let displayedNewsCount = 0; // Track how many news cards are shown
    const batchSize = 8; // Number of news articles per batch

    // Create a loader and add it before fetching news
    const loader = document.createElement("div");
    loader.classList.add("loader");
    newsContainer.appendChild(loader);

    fetch("https://my-projects-6fcq.onrender.com/news") // Fetch news from backend
        .then(response => response.json())
        .then(data => {
            loader.remove(); // Remove loader after fetching

            allNews = data.filter(article => article.description && article.description.trim() !== ""); // Remove empty descriptions
            displayNextBatch(); // Show first batch of news

            // ✅ Breaking News: Show top 5 headlines in ticker
            const topHeadlines = allNews.slice(0, 5).map(article => article.title).join(" || ");
            breakingNewsTicker.innerHTML = topHeadlines;
        })
        .catch(error => {
            console.error("Error fetching news:", error);
            newsContainer.innerHTML = "Failed to load news. Try again later.";
            homePageHeading.innerHTML = "SORRY!";
        });

    // Function to display the next batch of news
    function displayNextBatch() {
        const nextBatch = allNews.slice(displayedNewsCount, displayedNewsCount + batchSize);
        nextBatch.forEach(article => {
            const { title, description, link } = article;
            const maxLength = 200; 
            let trimmedDescription = description;
            if (description.length > maxLength) {
                trimmedDescription = description.slice(0, maxLength).trim() + "...";
            }
            const newsCard = document.createElement("div");
            newsCard.classList.add("news-card");
            newsCard.innerHTML = `
            <h3 style="margin-bottom: 20px; font-weight: bolder;">${title}</h2>
            <p style="flex-grow: 1">${trimmedDescription}</p>
            <a href="${link}" target="_blank">Read More</a>
            `;
            newsContainer.appendChild(newsCard);
        });

        displayedNewsCount += batchSize;
    }

    // Detect when the user scrolls to the bottom & load more news
    window.addEventListener("scroll", () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200) {
            displayNextBatch();
        }
    });
});

function toggleMenu() {
    let menu = document.getElementById("nav-menu");
    menu.style.display = menu.style.display === "block" ? "none" : "block";
}