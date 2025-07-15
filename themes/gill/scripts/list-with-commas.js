hexo.extend.helper.register("list_with_commas", function (str) {
	if (!str) return "";

	const items = str.split(",").map((s) => s.trim());

	const listItems = items.map((item, index) => {
		const comma = index < items.length - 1 ? "," : "";
		return `<li class="inline after:content-['${comma}']">${item}</li>`;
	});

	return `<ul class="list-none p-0 m-0">${listItems.join(" ")}</ul>`;
});
