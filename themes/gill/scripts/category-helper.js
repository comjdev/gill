hexo.extend.helper.register("getFlatCategories", function () {
	// Get all work posts
	const workPosts = this.site.posts.filter((post) => post.layout === "work");

	// Collect all unique categories from work posts
	const categorySet = new Set();
	workPosts.forEach((post) => {
		if (post.categories && post.categories.length) {
			post.categories.forEach((category) => {
				categorySet.add(category.name);
			});
		}
	});

	// Convert to array and sort
	return Array.from(categorySet).sort();
});

hexo.extend.helper.register("getCategoryUrl", function (categoryName) {
	// Convert category name to URL-friendly format
	const urlName = categoryName
		.toLowerCase()
		.replace(/\s+/g, "-")
		.replace(/&/g, "and")
		.replace(/\+/g, "plus");

	return `/melbourne-photos/${urlName}/`;
});

hexo.extend.helper.register("getWorkPostsByCategory", function (categoryName) {
	// Get all work posts that have this category
	const workPosts = this.site.posts.filter(
		(post) =>
			post.layout === "work" &&
			post.categories &&
			post.categories.some((cat) => cat.name === categoryName),
	);

	return workPosts.sort("-date");
});

hexo.extend.helper.register(
	"getCategoryUrlForService",
	function (serviceTitle) {
		// Get all service pages and create a dynamic mapping
		const servicePages = this.site.pages.filter(
			(page) => page.layout === "service",
		);

		// Create a mapping from service titles to category names
		// This assumes service titles match category names, which seems to be the case
		const serviceToCategoryMap = {};
		servicePages.forEach((servicePage) => {
			serviceToCategoryMap[servicePage.title] = servicePage.title;
		});

		const categoryName = serviceToCategoryMap[serviceTitle];
		if (categoryName) {
			// Convert category name to URL-friendly format (same logic as getCategoryUrl)
			const urlName = categoryName
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/&/g, "and")
				.replace(/\+/g, "plus");

			return `/melbourne-photos/${urlName}/`;
		}

		// Fallback to service page if no category mapping found
		return null;
	},
);
