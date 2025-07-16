hexo.extend.generator.register(
	"melbourne_photos_categories",
	function (locals) {
		// Get all unique categories from work posts
		const workPosts = locals.posts.filter((post) => post.layout === "work");
		const categorySet = new Set();
		workPosts.forEach((post) => {
			if (post.categories && post.categories.length) {
				post.categories.forEach((category) => {
					categorySet.add(category.name);
				});
			}
		});

		// Generate a page for each category
		return Array.from(categorySet).map((categoryName) => {
			// Get all posts for this category
			const posts = workPosts.filter(
				(post) =>
					post.categories &&
					post.categories.some((cat) => cat.name === categoryName),
			);
			// URL-friendly category name
			const urlName = categoryName
				.toLowerCase()
				.replace(/\s+/g, "-")
				.replace(/&/g, "and")
				.replace(/\+/g, "plus");
			return {
				path: `melbourne-photos/${urlName}/index.html`,
				layout: "category",
				data: {
					category: categoryName,
					posts: posts.sort("-date"),
				},
			};
		});
	},
);
