const fs = require("fs");
const path = require("path");

/**
 * Listing pages (portfolio, services, suburbs, homepage) render other posts
 * in sliders. Their sitemap lastmod should follow that related content, not
 * only the listing file's own mtime.
 */
function toTime(value) {
	if (!value) return 0;
	const time = value instanceof Date ? value.getTime() : new Date(value).getTime();
	return Number.isFinite(time) ? time : 0;
}

function laterDate(...values) {
	let max = 0;
	for (const value of values) {
		const time = toTime(value);
		if (time > max) max = time;
	}
	return max ? new Date(max) : null;
}

function contentChangedAt(entry) {
	return laterDate(entry && entry.updated, entry && entry.date);
}

function categoryNames(entry) {
	const names = [];
	if (!entry || !entry.categories) return names;
	entry.categories.forEach((category) => {
		if (category && category.name) {
			names.push(String(category.name).toLowerCase());
		}
	});
	return names;
}

function latestMatching(posts, predicate) {
	let latest = null;
	posts.forEach((post) => {
		if (predicate && !predicate(post)) return;
		latest = laterDate(latest, contentChangedAt(post));
	});
	return latest;
}

function matchesCategory(post, category) {
	if (!category) return false;
	return categoryNames(post).includes(String(category).toLowerCase());
}

hexo.extend.filter.register("before_generate", function () {
	const pages = this.locals.get("pages");
	const posts = this.locals.get("posts");
	if (!pages || !posts) return;

	const allPosts = posts.toArray ? posts.toArray() : posts;
	const allPages = pages.toArray ? pages.toArray() : pages;

	const latestWork = latestMatching(
		allPosts,
		(post) => post.layout === "work",
	);
	const latestBlog = latestMatching(
		allPosts,
		(post) => post.layout === "post",
	);
	const latestAnyPost = laterDate(latestWork, latestBlog);

	const listingLastmods = Object.create(null);

	allPages.forEach((page) => {
		const layout = page.layout;
		let related = null;

		if (layout === "portfolio" || layout === "suburbs") {
			related = latestWork;
		} else if (layout === "service") {
			related = latestMatching(allPosts, (post) =>
				matchesCategory(post, page.data),
			);
		} else if (layout === "suburb") {
			related = latestMatching(allPosts, (post) =>
				matchesCategory(post, page.category),
			);
		}

		if (!related) return;

		const lastmod = laterDate(contentChangedAt(page), related);
		if (!lastmod || !page.permalink) return;
		listingLastmods[page.permalink] = lastmod;
	});

	let homepageYamlMtime = null;
	const homepageYaml = path.join(this.source_dir, "_data/homepage.yml");
	if (fs.existsSync(homepageYaml)) {
		homepageYamlMtime = fs.statSync(homepageYaml).mtime;
	}

	const homePage = allPages.find((page) => page.layout === "index");
	this.config.sitemap = this.config.sitemap || {};
	this.config.sitemap.listing_lastmods = listingLastmods;
	this.config.sitemap.homepage_lastmod = laterDate(
		latestAnyPost,
		homepageYamlMtime,
		homePage && contentChangedAt(homePage),
	);
});
