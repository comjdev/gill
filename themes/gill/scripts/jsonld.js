hexo.extend.helper.register("jsonld", function (page, site, config) {
	const isSuburbPage = page.layout === "suburb";

	const areaServed = isSuburbPage
		? {
				"@type": "Place",
				name: `${page.suburb}, VIC`,
		  }
		: [
				...site.pages
					.filter((p) => p.layout === "suburb")
					.map((p) => ({
						"@type": "Place",
						name: `${p.suburb}, VIC`,
					})),
		  ];

	const json = {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		name: "Hindsight Creative - Melbourne Design Studio",
		telephone: "03 9758 0207",
		image: `${config.url}/img/logos/logo.png`,
		url: page.path ? `${config.url}/${page.path}` : config.url,
		address: {
			"@type": "PostalAddress",
			addressLocality: "Ferntree Gully",
			addressRegion: "VIC",
			postalCode: "3156",
			addressCountry: "AU",
		},
		description: isSuburbPage
			? `Hindsight Creative | Creative branding studio for ${page.suburb} and surrounding areas. Strategic and creative services for inspired brands in ${page.suburb}.`
			: page.description,
		areaServed: areaServed,
		geo: {
			"@type": "GeoCoordinates",
			latitude: page.latitude || -37.8846,
			longitude: page.longitude || 145.2954,
		},
		openingHoursSpecification: [
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
				opens: "09:00",
				closes: "17:00",
			},
		],
		priceRange: "$$",
		description:
			"Stratigic and creative design studio for inspired brands in Melbourne's Eastern suburbs with over 25 years experience in branding, graphic design, web design, and photography.",
		sameAs: [
			"https://www.facebook.com/HindsightDesign",
			"https://www.instagram.com/hindsight_creative/",
			"https://www.linkedin.com/company/hindsightdesign",
		],
		aggregateRating: {
			// Optional: If you have reviews marked up
			"@type": "AggregateRating",
			ratingValue: "5", // Your average rating
			reviewCount: "2", // Total number of reviews
			bestRating: "5",
			worstRating: "1",
		},
		makesOffer: [
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Branding & Design",
					description:
						"Creative branding and design services to build impactful brand identities.",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Digital Marketing",
					description:
						"Digital marketing strategies to grow your online presence and drive engagement.",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Social Media Strategy",
					description:
						"Comprehensive social media strategies to connect with your audience and build brand loyalty.",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Packaging & Print",
					description:
						"Creative packaging and print design that captivates and communicates your brand message.",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Websites",
					description:
						"Custom website design and development to showcase your brand and drive results.",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Production & Video",
					description:
						"Professional video production services to bring your brand story to life.",
				},
			},
		],
	};

	return JSON.stringify(json, null, 2);
});

hexo.extend.helper.register("faqJsonld", function (page) {
	const sourceContent = typeof page._content === "string" ? page._content : "";

	// --- FAQ Parsing ---
	const faqs = [];
	const lines = sourceContent.split("\n");
	let current = null;

	lines.forEach((line) => {
		const trimmedLine = line.trim();
		if (trimmedLine.startsWith("### ")) {
			if (current) faqs.push(current);
			current = {
				question: trimmedLine.replace("### ", "").trim(),
				answer: "",
			};
		} else if (current && trimmedLine.length > 0) {
			current.answer += line + "\n";
		} else if (
			current &&
			line.length === 0 &&
			current.answer.length > 0 &&
			!current.answer.endsWith("\n\n")
		) {
			current.answer += "\n";
		}
	});
	if (current) faqs.push(current);

	if (!faqs.length) return "";

	// --- Build FAQPage JSON-LD ---
	const jsonLd = {
		"@context": "https://schema.org",
		"@type": "FAQPage",
		mainEntity: faqs.map((faq) => ({
			"@type": "Question",
			name: faq.question,
			acceptedAnswer: {
				"@type": "Answer",
				text: this.strip_html(faq.answer.trim()).replace(/\s+/g, " "),
			},
		})),
	};

	return JSON.stringify(jsonLd, null, 2);
});
