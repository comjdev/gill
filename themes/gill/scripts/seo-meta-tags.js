hexo.extend.helper.register("seoTitle", function () {
	const page = this.page;
	const config = this.config;

	// Start with the page title (or fallback to config.title if no page title)
	const baseTitle = page.title || config.title || "Gill Juergens Photography";

	// Define the dynamic suffixes
	const suffixes = [
		"Gill Juergens Photography",
		"Family, Wedding & Newborn Photographer",
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
