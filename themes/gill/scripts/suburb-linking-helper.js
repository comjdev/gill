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
					page.category !== currentCategory,
			)
			.sort((a, b) => a.category.localeCompare(b.category))
			.map((page) => ({
				suburb: page.suburb,
				category: page.category,
				title: page.title,
				path: page.path,
				permalink: page.permalink || "/" + page.path,
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
					page.suburb !== currentSuburb,
			)
			.map((page) => ({
				suburb: page.suburb,
				category: page.category,
				title: page.title,
				path: page.path,
				permalink: page.permalink || "/" + page.path,
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
