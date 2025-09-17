hexo.extend.helper.register("seoTitle", function () {
	const page = this.page;
	const config = this.config;

	// For homepage, use specific title
	if (page.layout === "index" || page.__index) {
		return "Melbourne Photography: Family, Wedding & Newborn Photographer - Gill Photography";
	}

	// For portfolio page (main work archive)
	if (page.layout === "portfolio") {
		return "Lifestyle Photography in Melbourne | Gill Photography";
	}

	// For category pages (work posts by category)
	if (page.layout === "category") {
		// The category is stored in page.category (from the generator data)
		const category = page.category;
		if (category === "family") {
			return "Melbourne Family Photos | Lifestyle Photography Melbourne";
		}
		if (category === "maternity") {
			return "Melbourne Maternity Photos | Lifestyle Photography Melbourne";
		}
		if (category === "newborn") {
			return "Melbourne Newborn Photos | Lifestyle Photography Melbourne";
		}
		if (category === "wedding") {
			return "Melbourne Wedding Photos | Lifestyle Photography Melbourne";
		}
	}

	// Check for specific paths as fallback
	if (page.path && page.path.includes("melbourne-photos/")) {
		if (page.path.includes("/family/")) {
			return "Melbourne Family Photos | Lifestyle Photography Melbourne";
		}
		if (page.path.includes("/maternity/")) {
			return "Melbourne Maternity Photos | Lifestyle Photography Melbourne";
		}
		if (page.path.includes("/newborn/")) {
			return "Melbourne Newborn Photos | Lifestyle Photography Melbourne";
		}
		if (page.path.includes("/wedding/")) {
			return "Melbourne Wedding Photos | Lifestyle Photography Melbourne";
		}
		if (
			page.path === "melbourne-photos/" ||
			page.path === "melbourne-photos/index.html"
		) {
			return "Lifestyle Photography in Melbourne | Gill Photography";
		}
	}

	// For suburb pages, create highly targeted local SEO titles with secondary keywords
	if (page.layout === "suburb" && page.suburb && page.category) {
		const suburb = page.suburb;
		const category = page.category;

		// Category-specific titles for local SEO with secondary keywords
		if (category === "family") {
			return `${suburb} Family Photographer & Lifestyle Photos | Gill Photography`;
		} else if (category === "newborn") {
			return `${suburb} Newborn Photographer & Family Photos | Gill Photography`;
		} else if (category === "maternity") {
			return `${suburb} Maternity Photographer & Pregnancy Photos | Gill Photography`;
		} else if (category === "wedding") {
			return `${suburb} Wedding Photographer & Engagement Photos | Gill Photography`;
		}
	}

	// Start with the page title (or fallback to config.title if no page title)
	const baseTitle = page.title || config.title || "Gill Juergens Photography";

	// Define the dynamic suffixes
	const suffixes = [
		"Gill Juergens Photography",
		"Family, Maternity & Newborn Photographer",
		"Melbourne",
	];

	// Start with the page title
	let title = baseTitle;

	// Add each suffix if it's not already in the title
	suffixes.forEach((suffix) => {
		// Check if suffix is already in the title
		if (!title.includes(suffix)) {
			// Check if adding this suffix will exceed 70 characters
			if (title.length + 3 + suffix.length <= 70) {
				title += ` | ${suffix}`;
			}
		}
	});

	// Ensure the title doesn't exceed 70 characters
	if (title.length > 70) {
		// Trim to 70 characters if necessary, cutting at the last separator
		title = title.substring(0, 70);
	}

	// Return the fully composed title
	return title;
});

hexo.extend.helper.register("seoDescription", function () {
	const page = this.page;
	const config = this.config;
	const maxLength = 200;

	// For suburb pages, create highly targeted local SEO descriptions
	if (page.layout === "suburb" && page.suburb && page.category) {
		const suburb = page.suburb;
		const category = page.category;

		// Category-specific descriptions for local SEO with location optimization
		if (category === "family") {
			return `Professional family photographer in ${suburb}, Melbourne. Natural, relaxed family photography sessions in ${suburb} and surrounding areas. Serving ${suburb}, Melbourne's Eastern Suburbs and nearby locations. Book your ${suburb} family photos today.`;
		} else if (category === "newborn") {
			return `Gentle newborn photographer in ${suburb}, Melbourne. Capturing precious first days with calm, baby-led sessions in ${suburb} and nearby areas. Serving ${suburb}, Melbourne's Eastern Suburbs and surrounding locations. Book your ${suburb} newborn photos.`;
		} else if (category === "maternity") {
			return `Beautiful maternity photographer in ${suburb}, Melbourne. Capturing your pregnancy journey with natural, elegant sessions in ${suburb} and surrounding areas. Serving ${suburb}, Melbourne's Eastern Suburbs and nearby locations. Book your ${suburb} maternity photos.`;
		}
	}

	// Raw description: priority order
	const baseDescRaw =
		page.description ||
		config.description ||
		"Gill Juergens Photography | Capture timeless moments with professional family, wedding, and newborn photography in Melbourne's Eastern Suburbs. Creating beautiful, cherished memories for your family.";

	// Prefix for suburb pages or fallback to title
	let prefix = "";
	if (page.layout === "suburb" && page.suburb) {
		// Category-specific prefix based on the page category
		if (page.category === "newborn") {
			prefix = `${page.suburb} Newborn Photographer | `;
		} else if (page.category === "family") {
			prefix = `${page.suburb} Family Photographer | `;
		} else {
			prefix = `${page.suburb} Family, Wedding & Newborn Photographer | `;
		}
	} else if (!page.description && page.title) {
		prefix = `${page.title} | `;
	}

	// Strip HTML and normalize whitespace
	let cleanDesc = (prefix + baseDescRaw)
		.replace(/<[^>]*>/g, "")
		.replace(/&[a-z]+;/gi, "")
		.replace(/\s+/g, " ")
		.trim();

	if (cleanDesc.length >= maxLength) {
		return cleanDesc.substring(0, maxLength);
	}

	// SEO keyword extensions
	const keywords = [
		"Gill Juergens Photography",
		"Family Photography",
		"Wedding Photography",
		"Newborn Photography",
		"Professional Photography",
		"Melbourne Photography",
		"Eastern Suburbs Photography",
		"Melbourne",
	];

	for (let keyword of keywords) {
		const addition = ` | ${keyword}`;
		if (cleanDesc.length + addition.length <= maxLength) {
			cleanDesc += addition;
		} else {
			break;
		}
	}

	return cleanDesc;
});

hexo.extend.helper.register("seoOgTitle", function () {
	return this.seoTitle();
});

hexo.extend.helper.register("seoOgDescription", function () {
	return this.seoDescription();
});

hexo.extend.helper.register("seoTwitterTitle", function () {
	return this.seoTitle();
});

hexo.extend.helper.register("seoTwitterDescription", function () {
	return this.seoDescription();
});
