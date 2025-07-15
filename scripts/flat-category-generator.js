const { join } = require("path");

hexo.extend.generator.register("flat-categories", function (locals) {
	const categories = [];
	const workPosts = locals.posts.filter((post) => post.layout === "work");

	// Collect all unique categories from work posts
	const categorySet = new Set();
	workPosts.forEach((post) => {
		if (post.categories && post.categories.length) {
			post.categories.forEach((category) => {
				categorySet.add(category.name);
			});
		}
	});

	// Create a page for each unique category
	categorySet.forEach((categoryName) => {
		const urlName = categoryName
			.toLowerCase()
			.replace(/\s+/g, "-")
			.replace(/&/g, "and")
			.replace(/\+/g, "plus");

		// Get posts for this category
		const categoryPosts = workPosts.filter(
			(post) =>
				post.categories &&
				post.categories.some((cat) => cat.name === categoryName),
		);

		categories.push({
			path: `portfolio/${urlName}/index.html`,
			layout: "category",
			data: {
				category: categoryName,
				posts: categoryPosts,
				title: `${categoryName} Work`,
				description: `Explore our portfolio of ${categoryName.toLowerCase()} projects and successful work.`,
			},
		});
	});

	return categories;
});
