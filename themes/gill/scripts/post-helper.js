hexo.extend.helper.register(
	"getPostsByLayout",
	function (layout, limit = null) {
		const posts = this.site.posts
			.filter((post) => post.layout === layout)
			.sort("-date");

		return limit ? posts.limit(limit) : posts;
	},
);

hexo.extend.helper.register("getBlogPosts", function (limit = null) {
	return this.getPostsByLayout("post", limit);
});

hexo.extend.helper.register("getWorkPosts", function (limit = null) {
	return this.getPostsByLayout("work", limit);
});

const slugify = (str) =>
	str
		.toString() // Ensure it's a string
		.toLowerCase()
		.replace(/[^\w]+/g, "-")
		.replace(/(^-|-$)/g, "");

hexo.extend.helper.register("getWorkPostBySlug", function (slug) {
	// Convert Hexo collection to a standard array before finding
	const postsArray = this.site.posts.toArray();

	const foundPost = postsArray.find((post) => {
		// Check if the layout is 'work'
		const layoutMatch = post.layout === "work";

		if (!layoutMatch) {
			return false; // If layout doesn't match, skip this post
		}

		// If layout matches, check if the slugified title matches the target slug
		const postSlugifiedTitle = slugify(post.title);
		const targetSlug = slug;

		return postSlugifiedTitle === targetSlug; // Return true only if both layout and slug match
	});

	// Returns the found post object or undefined if not found
	return foundPost;
});

hexo.extend.helper.register("getRandomSuburbs", function (limit = 4) {
	// Get all suburb pages
	const suburbPages = this.site.pages.filter(
		(page) => page.layout === "suburb",
	);

	// Get unique suburbs (remove duplicates)
	const uniqueSuburbs = [];
	const seenSuburbs = new Set();

	suburbPages.forEach((page) => {
		if (page.suburb && !seenSuburbs.has(page.suburb)) {
			seenSuburbs.add(page.suburb);
			uniqueSuburbs.push({
				name: page.suburb,
				url: page.path,
			});
		}
	});

	// Shuffle the suburbs
	function shuffleArray(array) {
		let currentIndex = array.length,
			temporaryValue,
			randomIndex;
		while (0 !== currentIndex) {
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}
		return array;
	}

	const shuffledSuburbs = shuffleArray([...uniqueSuburbs]);

	// Return the specified number of suburbs
	return shuffledSuburbs.slice(0, limit);
});
