
const galleryItems = document.querySelectorAll(".gallery-item");
const filterButtons = document.querySelectorAll(".filter-btn");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

const closeBtn = document.getElementById("close");
const prevBtn = document.getElementById("prev");
const nextBtn = document.getElementById("next");

let currentIndex = 0;


/* Get currently visible images */

function getVisibleImages() {
    return [...galleryItems].filter(item => {
        return item.style.display !== "none";
    });
}


/* Open Lightbox */

galleryItems.forEach(item => {

    item.addEventListener("click", () => {

        const visibleImages = getVisibleImages();

        currentIndex = visibleImages.indexOf(item);

        showImage();

        lightbox.classList.add("show");
    });

});


/* Display Image */

function showImage() {

    const visibleImages = getVisibleImages();

    if (visibleImages.length === 0) return;

    const image = visibleImages[currentIndex].querySelector("img");

    lightboxImg.src = image.src;
    lightboxImg.alt = image.alt;
}


/* Next Image */

nextBtn.addEventListener("click", () => {

    const visibleImages = getVisibleImages();

    currentIndex++;

    if (currentIndex >= visibleImages.length) {
        currentIndex = 0;
    }

    showImage();

});


/* Previous Image */

prevBtn.addEventListener("click", () => {

    const visibleImages = getVisibleImages();

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = visibleImages.length - 1;
    }

    showImage();

});


/* Close Lightbox */

closeBtn.addEventListener("click", () => {
    lightbox.classList.remove("show");
});


/* Close when clicking outside image */

lightbox.addEventListener("click", (event) => {

    if (event.target === lightbox) {
        lightbox.classList.remove("show");
    }

});


/* Keyboard Navigation */

document.addEventListener("keydown", (event) => {

    if (!lightbox.classList.contains("show")) return;

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


/* Category Filters */

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        const filter = button.dataset.filter;

        /* Active button */

        filterButtons.forEach(btn => {
            btn.classList.remove("active");
        });

        button.classList.add("active");


        /* Filter images */

        galleryItems.forEach(item => {

            const category = item.dataset.category;

            if (filter === "all" || category === filter) {
                item.style.display = "block";
            } else {
                item.style.display = "none";
            }

        });

    });

});

