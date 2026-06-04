(function () {
	"use strict";

	var currentScale = 1;
	var lightbox = null;
	var lightboxImage = null;
	var scaleLabel = null;

	function clamp(value, min, max) {
		return Math.min(Math.max(value, min), max);
	}

	function setScale(nextScale) {
		currentScale = clamp(nextScale, 0.5, 4);

		if (lightboxImage) {
			lightboxImage.style.width = (currentScale * 90) + "vw";
		}

		if (scaleLabel) {
			scaleLabel.textContent = Math.round(currentScale * 100) + "%";
		}
	}

	function closeLightbox() {
		if (!lightbox) {
			return;
		}

		lightbox.hidden = true;
		document.body.classList.remove("image-lightbox-open");

		if (document.fullscreenElement === lightbox && document.exitFullscreen) {
			document.exitFullscreen();
		}
	}

	function toggleLightboxFullScreen() {
		if (!lightbox) {
			return;
		}

		if (document.fullscreenElement === lightbox && document.exitFullscreen) {
			document.exitFullscreen();
		} else if (lightbox.requestFullscreen) {
			lightbox.requestFullscreen();
		}
	}

	function ensureLightbox() {
		if (lightbox) {
			return lightbox;
		}

		lightbox = document.createElement("div");
		lightbox.className = "image-lightbox";
		lightbox.hidden = true;
		lightbox.innerHTML = [
			'<div class="image-lightbox-toolbar">',
			'<button type="button" class="image-viewer-button" data-image-action="zoom-out">Zoom out</button>',
			'<span class="image-scale-label">100%</span>',
			'<button type="button" class="image-viewer-button" data-image-action="zoom-in">Zoom in</button>',
			'<button type="button" class="image-viewer-button" data-image-action="fullscreen">Full screen</button>',
			'<button type="button" class="image-viewer-button" data-image-action="close">Close</button>',
			'</div>',
			'<div class="image-lightbox-stage">',
			'<img class="image-lightbox-image" alt="" />',
			'</div>'
		].join("");

		document.body.appendChild(lightbox);
		lightboxImage = lightbox.querySelector(".image-lightbox-image");
		scaleLabel = lightbox.querySelector(".image-scale-label");

		lightbox.addEventListener("click", function (event) {
			var target = event.target;
			var button = target && target.closest ? target.closest("[data-image-action]") : null;

			if (!button) {
				return;
			}

			if (button.dataset.imageAction === "zoom-in") {
				setScale(currentScale + 0.25);
			} else if (button.dataset.imageAction === "zoom-out") {
				setScale(currentScale - 0.25);
			} else if (button.dataset.imageAction === "fullscreen") {
				toggleLightboxFullScreen();
			} else if (button.dataset.imageAction === "close") {
				closeLightbox();
			}
		});

		document.addEventListener("keydown", function (event) {
			if (event.key === "Escape" && lightbox && !lightbox.hidden) {
				closeLightbox();
			}
		});

		return lightbox;
	}

	function openImage(image) {
		if (!image) {
			return;
		}

		ensureLightbox();
		lightboxImage.src = image.currentSrc || image.src;
		lightboxImage.alt = image.alt || "Result image";
		lightbox.hidden = false;
		document.body.classList.add("image-lightbox-open");
		setScale(1);
	}

	document.addEventListener("DOMContentLoaded", function () {
		document.querySelectorAll(".result-image-viewer").forEach(function (viewer) {
			var image = viewer.querySelector("img");
			var button = viewer.querySelector("[data-result-image]");

			if (image) {
				image.addEventListener("click", function () {
					openImage(image);
				});
			}

			if (button) {
				button.addEventListener("click", function () {
					openImage(image);
				});
			}
		});
	});
}());
