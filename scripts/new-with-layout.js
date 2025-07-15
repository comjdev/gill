// scripts/new-with-layout.js

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

function slugify(str) {
	return str
		.toString()
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "") // Remove non-word characters
		.replace(/[\s_-]+/g, "-") // Replace spaces and underscores with -
		.replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

hexo.extend.console.register(
	"new-post",
	"Create a new post with layout and scaffold template",
	{
		usage: "<folder/filename>",
		arguments: [
			{ name: "path", desc: "Post path like blog/my-post or work/my-project" },
		],
	},
	async function (args) {
		const inputPath = args._[0];
		if (!inputPath || !inputPath.includes("/")) {
			console.log("❌ Usage: hexo new-post blog/my-post or work/my-project");
			return;
		}

		const folder = path.dirname(inputPath); // blog or work
		const filename = path.basename(inputPath); // my-post
		const layout = folder.includes("work") ? "work" : "post";

		const postsDir = path.join(hexo.source_dir, "_posts", folder);
		const postFile = path.join(postsDir, `${filename}.md`);

		if (!fs.existsSync(postsDir)) {
			fs.mkdirSync(postsDir, { recursive: true });
			console.log(`📁 Created folder: ${postsDir}`);
		}

		// Load scaffold
		const scaffoldPath = path.join(hexo.scaffold_dir, `${layout}.md`);
		let scaffold = "";
		if (fs.existsSync(scaffoldPath)) {
			scaffold = fs.readFileSync(scaffoldPath, "utf8");
		} else {
			console.log(
				`⚠️ No scaffold found for layout "${layout}". Creating empty post.`,
			);
			scaffold =
				"---\ntitle: {{ title }}\ndate: {{ date }}\nlayout: {{ layout }}\n---\n";
		}

		// Human title and slug
		const humanTitle = filename
			.replace(/[-_]/g, " ")
			.replace(/\b\w/g, (s) => s.toUpperCase());
		const slug = slugify(filename);

		// Values to insert
		const now = new Date();
		const replacements = {
			title: humanTitle,
			date: now.toISOString(),
			layout,
			subtitle: "",
			description: "",
			slug,
		};

		// Replace all {{ key }} placeholders
		const finalContent = scaffold.replace(/{{\s*(\w+)\s*}}/g, (_, key) => {
			return replacements[key] || "";
		});

		fs.writeFileSync(postFile, finalContent);
		console.log(`✅ Created ${layout} post at: ${postFile}`);

		// Asset folder
		if (hexo.config.post_asset_folder === true) {
			const assetFolder = postFile.replace(/\.md$/, "");
			if (!fs.existsSync(assetFolder)) {
				fs.mkdirSync(assetFolder);
				console.log(`🖼️ Created asset folder: ${assetFolder}`);
			}
		}
	},
);
