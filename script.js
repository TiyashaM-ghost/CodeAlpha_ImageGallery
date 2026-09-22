/* =========================
   ELEMENTS
========================= */

const galleryItems =
    document.querySelectorAll(".gallery-item");

const filterButtons =
    document.querySelectorAll(".category-card");

const searchInput =
    document.getElementById("searchInput");

const searchBtn =
    document.getElementById("searchBtn");

const resultText =
    document.getElementById("resultText");

const noResult =
    document.getElementById("noResult");


/* Lightbox */

const lightbox =
    document.getElementById("lightbox");

const lightboxImg =
    document.getElementById("lightbox-img");

const lightboxTitle =
    document.getElementById("lightbox-title");

const closeBtn =
    document.getElementById("close");

const prevBtn =
    document.getElementById("prev");

const nextBtn =
    document.getElementById("next");


/* =========================
   VARIABLES
========================= */

let currentCategory = "all";

let currentIndex = 0;


/* =========================
   FILTER + SEARCH
========================= */

function filterGallery() {

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();

    let visibleItems = [];


    galleryItems.forEach(item => {

        const category =
            item.dataset.category.toLowerCase();

        const image =
            item.querySelector("img");

        const altText =
            image.alt.toLowerCase();


        /* Category check */

        const categoryMatch =
            currentCategory === "all" ||
            category === currentCategory;


        /* Search check */

        const searchMatch =
            searchText === "" ||
            altText.includes(searchText) ||
            category.includes(searchText);


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

        resultText.textContent =
            "No images found";

    } else {

        noResult.style.display = "none";


        if (searchText !== "") {

            resultText.textContent =
                `Found ${visibleItems.length} image(s) for "${searchText}"`;

        } else if (currentCategory !== "all") {

            resultText.textContent =
                `Showing ${visibleItems.length} ${currentCategory} image(s)`;

        } else {

            resultText.textContent =
                `Showing ${visibleItems.length} images`;

        }

    }

}


/* =========================
   CATEGORY BUTTONS
========================= */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        /* Remove active class */

        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        /* Add active class */

        button.classList.add("active");


        /* Get category */

        currentCategory =
            button.dataset.filter;


        /* Apply filter */

        filterGallery();

    });

});


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

        const visibleImages =
            getVisibleImages();


        currentIndex =
            visibleImages.indexOf(item);


        showImage();


        lightbox.classList.add("show");

    });

});


/* =========================
   SHOW IMAGE
========================= */

function showImage() {

    const visibleImages =
        getVisibleImages();


    if (visibleImages.length === 0) {

        return;

    }


    if (currentIndex >= visibleImages.length) {

        currentIndex = 0;

    }


    if (currentIndex < 0) {

        currentIndex =
            visibleImages.length - 1;

    }


    const image =
        visibleImages[currentIndex]
            .querySelector("img");


    lightboxImg.src =
        image.src;


    lightboxImg.alt =
        image.alt;


    lightboxTitle.textContent =
        image.alt;

}


/* =========================
   NEXT IMAGE
========================= */

nextBtn.addEventListener("click", event => {

    event.stopPropagation();


    const visibleImages =
        getVisibleImages();


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


    const visibleImages =
        getVisibleImages();


    if (visibleImages.length === 0) {

        return;

    }


    currentIndex--;


    if (currentIndex < 0) {

        currentIndex =
            visibleImages.length - 1;

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