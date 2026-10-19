/* =========================
   ELEMENTS
========================= */

const galleryItems = document.querySelectorAll(".gallery-item");

const filterButtons = document.querySelectorAll(".category-card");

const searchInput = document.getElementById("searchInput");

const searchBtn = document.getElementById("searchBtn");

const resultText = document.getElementById("resultText");

const noResult = document.getElementById("noResult");


/* Lightbox */

const lightbox = document.getElementById("lightbox");

const lightboxImg = document.getElementById("lightbox-img");

const lightboxTitle = document.getElementById("lightbox-title");

const closeBtn = document.getElementById("close");

const prevBtn = document.getElementById("prev");

const nextBtn = document.getElementById("next");


/* =========================
   VARIABLES
========================= */

let currentCategory = "all";
let currentIndex = 0;


/* =========================
   FILTER + SEARCH
========================= */

function filterGallery() {

    const searchText = searchInput.value.toLowerCase().trim();

    let visibleItems = [];

    galleryItems.forEach(item => {

        const category = item.dataset.category.toLowerCase()
         .split(/\s+/);

        const image = item.querySelector("img");

        const altText = image.alt.toLowerCase();

        const isFavorite = favoriteImages.has(getImageKey(item));

        /* Category check */

        const categoryMatch =
            currentCategory === "all" ||
            (
                currentCategory === "favorites" ? isFavorite :
            category.includes(currentCategory.toLowerCase())
            );

        /* Search check */

        const searchMatch =
            searchText === "" ||
            altText.includes(searchText) ||
            category.some(cat => cat.includes(searchText));


        /* Final check */

        if (categoryMatch && searchMatch) {
            item.style.display = "";
            visibleItems.push(item);

        } else {
            item.style.display = "none";
        }
    });


    /* =========================
       RESULT MESSAGE
    ========================= */

    if (visibleItems.length === 0) {
        noResult.style.display = "block";
        resultText.textContent = "No images found";

    } else {
        noResult.style.display = "none";

        if (searchText !== "") {
            resultText.textContent = `Found ${visibleItems.length} image(s) for "${searchText}"`;

        } else if (currentCategory !== "all") {
            resultText.textContent = `Showing ${visibleItems.length} ${currentCategory} image(s)`;

        } else {
            resultText.textContent = `Showing ${visibleItems.length} images`;
        }
    }
}


/* CATEGORY BUTTONS */

filterButtons.forEach(button => {
    button.addEventListener("click", () => {

        /* Remove active class */

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        /* Add active class */

        button.classList.add("active");

        /* Get category */

        currentCategory = button.dataset.filter;

        /* Apply filter */

        filterGallery();
    });
});


/* FAVORITES FEATURE */

// Restore favorites after page refresh
let favoriteImages = new Set(
    JSON.parse(localStorage.getItem("gallery-favorites") || "[]")
);

// Use the image's original src as its unique key
function getImageKey(item) {
    return item.querySelector("img").getAttribute("src");
}

// Save favorites
function saveFavorites() {
    localStorage.setItem(
        "gallery-favorites",
        JSON.stringify([...favoriteImages])
    );
}

// Add a heart button to every gallery image
galleryItems.forEach(item => {
    const image = item.querySelector("img");

    const heart = document.createElement("button");
    heart.className = "favorite-btn";
    heart.type = "button";
    heart.innerHTML = "&#9825;";
    heart.setAttribute("aria-label", "Add to favorites");
    heart.title = "Add to favorites";

    item.appendChild(heart);

    // Restore saved favorite state
    updateHeart(heart, favoriteImages.has(getImageKey(item)));

    heart.addEventListener("click", event => {
        // Don't open the lightbox when clicking the heart
        event.stopPropagation();

        const key = getImageKey(item);

        if (favoriteImages.has(key)) {
            favoriteImages.delete(key);
        } else {
            favoriteImages.add(key);
        }

        saveFavorites();
        updateHeart(heart, favoriteImages.has(key));

        // Refresh the gallery if Favorites is selected
        updateFavoritesPreview();
        filterGallery();
    });
});

// Update heart appearance
function updateHeart(button, isFavorite) {
    button.classList.toggle("favorited", isFavorite);

    button.innerHTML = isFavorite
        ? "&#9829;"
        : "&#9825;";

    button.title = isFavorite
        ? "Remove from favorites"
        : "Add to favorites";

    button.setAttribute(
        "aria-label",
        isFavorite
            ? "Remove from favorites"
            : "Add to favorites"
    );

    button.setAttribute(
        "aria-pressed",
        String(isFavorite)
    );
}

// Update the Favourites category card preview
function updateFavoritesPreview() {
    const favoritesCard = document.querySelector(
        '.category-card[data-filter="favorites"]'
    );

    if (!favoritesCard) return;

    const favoriteKey = [...favoriteImages][0];

    if (!favoriteKey) {
        // No favourites saved
        favoritesCard.querySelector("img").src =
            "https://placehold.co/400x250?text=No+Favorites";
        return;
    }

    // Find the corresponding gallery image
    const favoriteItem = [...galleryItems].find(item =>
        getImageKey(item) === favoriteKey
    );

    if (favoriteItem) {
        favoritesCard.querySelector("img").src =
            favoriteItem.querySelector("img").src;
    }
}

// Run on page load
updateFavoritesPreview();


/* =========================
   SEARCH BUTTON
========================= */

searchBtn.addEventListener("click", () => {
    filterGallery();
});


/* =========================
   LIVE SEARCH
========================= */

searchInput.addEventListener("input", () => {
    filterGallery();
});


/* =========================
   ENTER KEY SEARCH
========================= */

searchInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {

        filterGallery();
    }
});


/* =========================
   GET VISIBLE IMAGES
========================= */

function getVisibleImages() {
    return [...galleryItems].filter(item => {

        return item.style.display !== "none";
    });
}


/* =========================
   OPEN LIGHTBOX
========================= */

galleryItems.forEach(item => {
    item.addEventListener("click", () => {

        const visibleImages = getVisibleImages();

        currentIndex = visibleImages.indexOf(item);

        showImage();

        lightbox.classList.add("show");
    });
});


/* =========================
   SHOW IMAGE
========================= */

function showImage() {

    const visibleImages = getVisibleImages();

    if (visibleImages.length === 0) {
        return;
    }

    if (currentIndex >= visibleImages.length) {
        currentIndex = 0;
    }

    if (currentIndex < 0) {
        currentIndex = visibleImages.length - 1;
    }

    const image = visibleImages[currentIndex] .querySelector("img");

    lightboxImg.src = image.src;

    lightboxImg.alt = image.alt;

    lightboxTitle.textContent = image.alt;
}


/* =========================
   NEXT IMAGE
========================= */

nextBtn.addEventListener("click", event => {
    event.stopPropagation();

    const visibleImages = getVisibleImages();

    if (visibleImages.length === 0) {
        return;
    }

    currentIndex++;

    if (currentIndex >= visibleImages.length) {
        currentIndex = 0;
    }

    showImage();
});


/* =========================
   PREVIOUS IMAGE
========================= */

prevBtn.addEventListener("click", event => {
    event.stopPropagation();

    const visibleImages = getVisibleImages();

    if (visibleImages.length === 0) {
        return;
    }

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = visibleImages.length - 1;
    }
    showImage();
});


/* =========================
   CLOSE LIGHTBOX
========================= */

closeBtn.addEventListener("click", () => {
    lightbox.classList.remove("show");
});


/* =========================
   CLICK OUTSIDE IMAGE
========================= */

lightbox.addEventListener("click", event => {
    if (event.target === lightbox) {
        lightbox.classList.remove("show");
    }
});


/* =========================
   KEYBOARD NAVIGATION
========================= */

document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("show")) {
        return;
    }


    if (event.key === "ArrowRight") {
        nextBtn.click();
    }

    if (event.key === "ArrowLeft") {
        prevBtn.click();
    }

    if (event.key === "Escape") {
        lightbox.classList.remove("show");
    }
});


/* =========================
   INITIAL LOAD
========================= */

filterGallery();

// Dark Mode Toggle
const themeToggle = document.getElementById("theme-toggle");

// Restore saved theme
const savedTheme = localStorage.getItem("gallery-theme");

if (savedTheme === "dark") {
    document.body.classList.add("dark-mode");
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem(
        "gallery-theme",
        isDark ? "dark" : "light"
    );

    updateThemeButton();
});

function updateThemeButton() {
    const isDark = document.body.classList.contains("dark-mode");

    themeToggle.textContent = isDark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";

    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );
}

// Expand / Collapse Categories
const toggleCategories =
    document.getElementById("toggle-categories");

const categoryList =
    document.getElementById("category-list");

const categoryArrow =
    document.getElementById("category-arrow");

// Start collapsed
categoryList.classList.add("collapsed");

toggleCategories.addEventListener("click", () => {
    const isCollapsed =
        categoryList.classList.toggle("collapsed");

    toggleCategories.setAttribute(
        "aria-expanded",
        String(!isCollapsed)
    );

    toggleCategories.title = isCollapsed
        ? "Show categories"
        : "Hide categories";

    categoryArrow.textContent = isCollapsed ? "▼" : "▲";
});