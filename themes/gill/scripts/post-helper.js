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
