/**
 * "Melbourne" suburb pages 301 to the city-wide service URLs, so they must
 * not appear in generated internal links or nearby-suburb lists.
 */
function isMelbourneCatchAll(page) {
	return String((page && page.suburb) || "").toLowerCase() === "melbourne";
}

/**
 * Root-absolute suburb href. Never return a relative path — markdown links
 * without a leading slash resolved against the current suburb URL and 404'd
 * as /newborn-photographer/bayswater/newborn-photographer/ringwood/.
 */
function suburbHref(page) {
	const raw = String((page && page.path) || "")
		.replace(/\/index\.html$/i, "/")
		.replace(/^\//, "");
	if (!raw) return "/";
	return raw.slice(-1) === "/" ? `/${raw}` : `/${raw}/`;
}

hexo.extend.helper.register("suburbPageHref", function (page) {
	return suburbHref(page);
});

hexo.extend.helper.register(
	"getSiblingSuburbPages",
	function (suburb, currentCategory) {
		if (!suburb) return [];

		return this.site.pages
			.filter(
				(page) =>
					page.layout === "suburb" &&
					page.suburb === suburb &&
					page.category &&
					page.category !== currentCategory &&
					!isMelbourneCatchAll(page),
			)
			.sort((a, b) => a.category.localeCompare(b.category))
			.map((page) => ({
				suburb: page.suburb,
				category: page.category,
				title: page.title,
				path: page.path,
				href: suburbHref(page),
				permalink: page.permalink || suburbHref(page),
			}));
	},
);

hexo.extend.helper.register(
	"getNearbySuburbPages",
	function (category, currentSuburb, limit = 6) {
		if (!category) return [];

		const pages = this.site.pages
			.filter(
				(page) =>
					page.layout === "suburb" &&
					page.category === category &&
					page.suburb &&
					page.suburb !== currentSuburb &&
					!isMelbourneCatchAll(page),
			)
			.map((page) => ({
				suburb: page.suburb,
				category: page.category,
				title: page.title,
				path: page.path,
				href: suburbHref(page),
				permalink: page.permalink || suburbHref(page),
			}));

		pages.sort((a, b) => a.suburb.localeCompare(b.suburb));

		if (!pages.length) return [];

		// Rotate from a stable suburb-based offset so each page links to a
		// different nearby set (better equity than always linking A–F suburbs).
		let hash = 0;
		const seed = `${currentSuburb || ""}-${category}`;
		for (let i = 0; i < seed.length; i++) {
			hash = (hash << 5) - hash + seed.charCodeAt(i);
			hash |= 0;
		}
		const start = Math.abs(hash) % pages.length;
		const rotated = pages.slice(start).concat(pages.slice(0, start));

		return rotated.slice(0, limit);
	},
);

/**
 * Resolve primary work-post category → Melbourne service URL.
 */
hexo.extend.helper.register("getWorkServiceLink", function (page) {
	try {
		if (!page || !page.categories || !page.categories.length) return null;

		let categoryName = null;
		page.categories.forEach((cat) => {
			if (!categoryName && cat && cat.name) categoryName = cat.name;
		});
		if (!categoryName) return null;

		const key = categoryName.toString().toLowerCase();
		const map = {
			family: {
				label: "family photography",
				url: "/melbourne-family-photographer/",
			},
			newborn: {
				label: "newborn photography",
				url: "/melbourne-newborn-photographer/",
			},
			maternity: {
				label: "maternity photography",
				url: "/melbourne-maternity-photographer/",
			},
			wedding: {
				label: "wedding photography",
				url: "/melbourne-wedding-photographer/",
			},
			engagement: {
				label: "wedding photography",
				url: "/melbourne-wedding-photographer/",
			},
		};

		return map[key] || null;
	} catch (e) {
		return null;
	}
});

/**
 * If work location mentions a known suburb with a matching category page, return it.
 */
hexo.extend.helper.register("getWorkSuburbLink", function (page) {
	try {
		if (!page || !page.location) return null;

		let categoryName = null;
		if (page.categories && page.categories.length) {
			page.categories.forEach((cat) => {
				if (!categoryName && cat && cat.name) categoryName = cat.name;
			});
		}
		const category = (categoryName || "").toString().toLowerCase();
		if (!category || category === "wedding" || category === "engagement") {
			return null;
		}

		const locationText = page.location.toString().toLowerCase();
		const pages = this.site.pages.toArray
			? this.site.pages.toArray()
			: this.site.pages;
		const suburbPages = [];

		pages.forEach((p) => {
			if (
				p &&
				p.layout === "suburb" &&
				p.category === category &&
				p.suburb &&
				!isMelbourneCatchAll(p) &&
				locationText.includes(String(p.suburb).toLowerCase())
			) {
				suburbPages.push(p);
			}
		});

		if (!suburbPages.length) return null;

		suburbPages.sort(
			(a, b) => String(b.suburb).length - String(a.suburb).length,
		);
		const match = suburbPages[0];
		if (!match || !match.suburb || !match.path) return null;

		return {
			suburb: match.suburb,
			label: `${match.suburb} ${category} photographer`,
			path: suburbHref(match),
		};
	} catch (e) {
		return null;
	}
});
