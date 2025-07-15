// Suppress passive event listener warnings for GSAP/ScrollTrigger
const originalWarn = console.warn;
console.warn = function (...args) {
	if (
		args[0] &&
		typeof args[0] === "string" &&
		args[0].includes("passive event listener")
	) {
		return; // Suppress passive event listener warnings
	}
	originalWarn.apply(console, args);
};

gsap.registerPlugin(ScrollTrigger);

// ——————————————————————————————————————————————————
// Navigation
// ——————————————————————————————————————————————————

document.addEventListener("DOMContentLoaded", () => {
	const hamburger = document.querySelector("#hamburger");
	const nav = document.querySelector("#nav");
	const mobileOverlay = document.querySelector("#mobile-overlay");
	const navLinks = document.querySelectorAll("#nav a");

	// Toggle mobile menu
	hamburger.addEventListener("click", () => {
		const isMenuOpen = !nav.classList.contains("translate-x-full");

		if (isMenuOpen) {
			// Close menu
			closeMobileMenu();
		} else {
			// Open menu
			nav.classList.remove("translate-x-full");
			mobileOverlay.classList.remove("hidden");
			document.body.style.overflow = "hidden";

			// Animate hamburger to X
			const lines = hamburger.querySelectorAll(".hamburger-line");
			lines[0].style.transform = "rotate(45deg) translate(-1px, 9px)";
			lines[1].style.opacity = "0";
			lines[2].style.transform = "rotate(-45deg) translate(-1px, -9px)";
		}
	});

	// Close mobile menu
	function closeMobileMenu() {
		nav.classList.add("translate-x-full");
		mobileOverlay.classList.add("hidden");
		document.body.style.overflow = "";

		// Reset hamburger animation
		const lines = hamburger.querySelectorAll(".hamburger-line");
		lines[0].style.transform = "";
		lines[1].style.opacity = "";
		lines[2].style.transform = "";
	}

	// Close menu when clicking overlay
	if (mobileOverlay) {
		mobileOverlay.addEventListener("click", closeMobileMenu);
	}

	// Close menu when clicking on navigation links
	navLinks.forEach((link) => {
		link.addEventListener("click", closeMobileMenu);
	});

	// Close menu on escape key
	document.addEventListener("keydown", (e) => {
		if (e.key === "Escape" && !nav.classList.contains("translate-x-full")) {
			closeMobileMenu();
		}
	});
});

document.addEventListener("DOMContentLoaded", function () {
	var user = "gill"; // Replace with the part before the @
	var domain = "gill-photography.com.au"; // Replace with the part after the @
	var email = user + "@" + domain;
	var emailLink = document.createElement("a");
	emailLink.href = "mailto:" + email;
	emailLink.textContent = email;
	const emailField = document.getElementById("emailAddress");
	if (emailField) {
		emailField.appendChild(emailLink);
	}
});

// ——————————————————————————————————————————————————
// Contact form
// ——————————————————————————————————————————————————

document.addEventListener("DOMContentLoaded", function () {
	// Get contact form
	var contactForm = document.getElementById("contactForm");

	var loadingStatus = document.getElementById("formLoading");
	var formSuccess = document.getElementById("formSuccess");
	var errorStatus = document.getElementById("formError");

	// Ensure the status messages are hidden initially
	if (loadingStatus) loadingStatus.classList.add("hidden");
	if (formSuccess) formSuccess.classList.add("hidden");
	if (errorStatus) errorStatus.classList.add("hidden");

	async function handleContactSubmit(event) {
		event.preventDefault();

		// Show loading state
		const submitButton = event.target.querySelector('button[type="submit"]');
		const originalText = submitButton.textContent;
		submitButton.textContent = "Sending...";
		submitButton.disabled = true;

		if (loadingStatus) loadingStatus.classList.remove("hidden");
		if (formSuccess) formSuccess.classList.add("hidden");
		if (errorStatus) errorStatus.classList.add("hidden");

		try {
			// Get form data
			const formData = {
				name: document.getElementById("name").value.trim(),
				email: document.getElementById("email").value.trim(),
				subject: document.getElementById("subject").value.trim(),
				message: document.getElementById("message").value.trim(),
			};

			// Basic validation
			if (
				!formData.name ||
				!formData.email ||
				!formData.subject ||
				!formData.message
			) {
				throw new Error("Please fill in all required fields.");
			}

			// Email validation
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			if (!emailRegex.test(formData.email)) {
				throw new Error("Please enter a valid email address.");
			}

			// Get API URL from form action or use default
			const apiUrl =
				event.target.action || "https://YOUR_API_GATEWAY_URL_HERE/contact";

			// Send to Lambda function
			const response = await fetch(apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const result = await response.json();

			if (response.ok && result.success) {
				// Success
				if (loadingStatus) loadingStatus.classList.add("hidden");
				if (formSuccess) formSuccess.classList.remove("hidden");
				if (errorStatus) errorStatus.classList.add("hidden");

				// Show success message
				alert("Thank you for your message! We'll get back to you soon.");
				event.target.reset();
			} else {
				// Handle API errors
				throw new Error(
					result.error || "Failed to send message. Please try again later.",
				);
			}
		} catch (error) {
			// Handle errors
			if (loadingStatus) loadingStatus.classList.add("hidden");
			if (formSuccess) formSuccess.classList.add("hidden");
			if (errorStatus) errorStatus.classList.remove("hidden");

			console.error("Form submission error:", error);
			alert(error.message || "Failed to send message. Please try again later.");
		} finally {
			// Reset button state
			submitButton.textContent = originalText;
			submitButton.disabled = false;
		}
	}

	// Attach event listener to contact form if it exists
	if (contactForm) {
		contactForm.addEventListener("submit", handleContactSubmit);
	}
});

// ——————————————————————————————————————————————————
// Scrolling
// ——————————————————————————————————————————————————

// src/js/post-scroll.js
document.addEventListener("DOMContentLoaded", () => {
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
		console.error("GSAP and ScrollTrigger not loaded!");
		return;
	}

	ScrollTrigger.matchMedia({
		"(min-width: 768px)": function () {
			// Apply on desktop/tablet

			const scrollContainer = document.querySelector(".scroll-container");

			if (!scrollContainer) {
				return;
			}

			const leftColumn = scrollContainer.querySelector(".left-column");
			const leftContent = leftColumn?.querySelector(".image-gallery-inner"); // The content to animate
			const rightColumn = scrollContainer.querySelector(".right-column");
			const rightContent = rightColumn?.querySelector(".right-content-inner"); // The element to pin
			const triggerElement = rightContent?.querySelector(".post-title"); // H1 title as trigger

			if (
				!leftColumn ||
				!leftContent ||
				!rightColumn ||
				!rightContent ||
				!triggerElement
			) {
				console.warn("Scroll animation elements not found.");
				return;
			}

			// Function to initialize the animation after images are loaded
			function initializeScrollAnimation() {
				// Calculate the total height the left content needs to scroll *within its container*
				const leftScrollDistance =
					leftContent.scrollHeight - leftColumn.clientHeight;

				// Add a buffer to the end point to ensure the footer clears
				const endBuffer = 400;

				// Only create the animation if there is scrollable content in the left column
				if (leftScrollDistance > 0) {
					const tl = gsap.timeline({
						scrollTrigger: {
							trigger: triggerElement, // Start when H1 hits the top
							start: "top top",
							// Add the buffer to the end point
							end: "+=" + (leftScrollDistance + endBuffer), // <--- MODIFIED LINE
							scrub: true,
							pin: rightContent, // Pin the right column content
							pinSpacing: true, // Maintain space for the pinned element
							// markers: true, // Uncomment for debugging
							onToggle: (self) => {
								if (self.isActive) {
									leftColumn.classList.add("is-sticky-scrolling");
								} else {
									leftColumn.classList.remove("is-sticky-scrolling");
								}
							},
						},
					});

					// Animate the translateY of the inner image gallery
					// Ensure the animation duration matches the actual scrollable distance
					tl.to(leftContent, { y: -leftScrollDistance }); // <--- Animation still uses leftScrollDistance
				} else {
					// Fallback: if left column content is shorter than the viewport,
					// just pin the right column when the H1 reaches the top.
					ScrollTrigger.create({
						trigger: triggerElement,
						start: "top top",
						pin: rightContent,
						pinSpacing: true,
						// Add buffer to the fallback pin as well if it exists
						end: "+=" + endBuffer, // <--- MODIFIED LINE for fallback
						// markers: true // Uncomment for debugging
					});
				}
			}

			// Check if all images are already loaded
			const images = leftContent.querySelectorAll("img");

			if (images.length === 0) {
				initializeScrollAnimation();
				return;
			}

			let loadedImages = 0;
			let hasInitialized = false;

			// Function to check if all images are loaded and initialize animation
			function checkAllImagesLoaded() {
				if (hasInitialized) return;

				if (loadedImages === images.length) {
					hasInitialized = true;

					// Small delay to ensure DOM is fully updated
					setTimeout(() => {
						initializeScrollAnimation();
					}, 50);
				}
			}

			// Check each image
			images.forEach((img, index) => {
				if (img.complete && img.naturalHeight !== 0) {
					loadedImages++;
					checkAllImagesLoaded();
				} else {
					img.addEventListener("load", () => {
						loadedImages++;
						checkAllImagesLoaded();
					});

					img.addEventListener("error", () => {
						loadedImages++; // Count as loaded to prevent infinite waiting
						checkAllImagesLoaded();
					});
				}
			});

			// Fallback: if images take too long to load, initialize anyway
			setTimeout(() => {
				if (!hasInitialized) {
					hasInitialized = true;
					initializeScrollAnimation();
				}
			}, 3000); // 3 second timeout
		},

		"(max-width: 767px)": function () {
			// Kill ScrollTrigger on mobile
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			document.querySelectorAll(".left-column").forEach((col) => {
				col.classList.remove("is-sticky-scrolling"); // Clean up debug class
			});
		},
	});
});

// Add window load event listener as additional fallback
window.addEventListener("load", () => {
	// Check if we're on a work page and animation hasn't been initialized
	const scrollContainer = document.querySelector(".scroll-container");
	if (scrollContainer) {
		// Force a refresh of ScrollTrigger after all images are loaded
		setTimeout(() => {
			ScrollTrigger.refresh();
		}, 100);
	}
});

document.addEventListener("DOMContentLoaded", () => {
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
		console.error("GSAP and ScrollTrigger not loaded!");
		return;
	}

	gsap.utils.toArray(".gsap-parallax-image").forEach((image) => {
		gsap.to(image, {
			yPercent: 25,
			ease: "none",
			scrollTrigger: {
				trigger: image,
				start: "top bottom", // when image enters the viewport
				end: "bottom top", // when image leaves the viewport
				scrub: true, // ties animation to scroll
			},
		});
	});
});

// ——————————————————————————————————————————————————
// Services Page Parallax Effect
// ——————————————————————————————————————————————————

let parallaxInitialized = false;

// Function to initialize parallax
function initParallax() {
	// Prevent multiple initializations
	if (parallaxInitialized) {
		return;
	}

	// Check if we're on the services page by looking for the services layout and URL
	const isServicesPage =
		window.location.pathname.includes("/services") ||
		window.location.pathname.includes("/creative-services") ||
		document.querySelector("section.bg-white .service");

	if (!isServicesPage) {
		return;
	}

	// Check if GSAP and ScrollTrigger are available
	if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
		return;
	}

	// Only apply parallax on desktop/tablet
	ScrollTrigger.matchMedia({
		"(min-width: 768px)": function () {
			const parallaxImages = document.querySelectorAll(".parallax-image");

			if (parallaxImages.length === 0) {
				return;
			}

			parallaxImages.forEach((image) => {
				// Add overflow hidden to container to prevent image overflow
				const container = image.closest(".parallax-container");
				if (container) {
					container.style.overflow = "hidden";
				}

				// Create the parallax animation
				const tl = gsap.timeline({
					scrollTrigger: {
						trigger: image,
						start: "top bottom",
						end: "bottom top",
						scrub: 1, // Smooth scrubbing with 1 second delay
						markers: false,
					},
				});

				tl.to(image, {
					yPercent: -40,
					ease: "none",
				});
			});

			// Mark as initialized
			parallaxInitialized = true;
		},

		"(max-width: 767px)": function () {
			// Kill parallax ScrollTriggers on mobile for better performance
			ScrollTrigger.getAll().forEach((trigger) => {
				if (
					trigger.vars.trigger &&
					trigger.vars.trigger.classList.contains("parallax-image")
				) {
					trigger.kill();
				}
			});
		},
	});
}

// Initialize on DOM content loaded
document.addEventListener("DOMContentLoaded", initParallax);

// Also try on window load as a fallback
window.addEventListener("load", () => {
	// Small delay to ensure everything is ready
	setTimeout(initParallax, 100);
});
