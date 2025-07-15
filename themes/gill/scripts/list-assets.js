hexo.extend.helper.register("post_assets", function (post) {
	const fs = require("fs");
	const path = require("path");

	const sourceDir = hexo.source_dir;
	const postAssetFolder = path.join(
		sourceDir,
		post.source.replace(/\.md$/, ""),
	);

	if (!fs.existsSync(postAssetFolder)) return [];

	const files = fs
		.readdirSync(postAssetFolder)
		.filter((file) => /\.(jpe?g|png|gif|svg)$/i.test(file));

	// Build URLs using the visible output path
	const postSlug = path.basename(postAssetFolder);
	const outputPath = `/portfolio/${postSlug}`;

	return files.map((file) => `${outputPath}/${file}`);
});
