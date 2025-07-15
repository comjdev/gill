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

	// Determine coordinates based on page type
	const latitude = isSuburbPage ? page.latitude : -37.8667;
	const longitude = isSuburbPage ? page.longitude : 145.2833;

	// Base business schema
	const baseSchema = {
		"@context": "https://schema.org",
		"@type": "LocalBusiness",
		name: "Gill Juergens Photography",
		alternateName:
			"Gill Juergens Photography - Melbourne Family, Wedding & Newborn Photographer",
		telephone: config.phone,
		image: `${config.url}/logos/logo.jpg`,
		url: page.path ? `${config.url}/${page.path}` : config.url,
		address: {
			"@type": "PostalAddress",
			addressLocality: config.address.suburb,
			addressRegion: config.address.state,
			postalCode: config.address.postcode,
			addressCountry: config.address.country,
		},
		areaServed: areaServed,
		geo: {
			"@type": "GeoCoordinates",
			latitude: latitude,
			longitude: longitude,
		},
		openingHoursSpecification: [
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
				opens: "09:00",
				closes: "17:00",
			},
			{
				"@type": "OpeningHoursSpecification",
				dayOfWeek: ["Saturday"],
				opens: "10:00",
				closes: "14:00",
			},
		],
		priceRange: "$$",
		currenciesAccepted: "AUD",
		paymentAccepted: "Cash, Credit Card, Bank Transfer",
		email: config.email,
		sameAs: [
			"https://www.facebook.com/gilljuergensphotography",
			"https://www.instagram.com/gilljuergensphotography/",
			"https://www.linkedin.com/company/gilljuergensphotography",
		],
		aggregateRating: {
			"@type": "AggregateRating",
			ratingValue: "5.0",
			reviewCount: "50",
			bestRating: "5",
			worstRating: "1",
		},
		founder: {
			"@type": "Person",
			name: "Gill Juergens",
			jobTitle: "Professional Photographer",
			description:
				"Family, Wedding & Newborn Photographer in Melbourne's Eastern Suburbs",
		},
		foundingDate: "2014",
		numberOfEmployees: "1",
		serviceArea: {
			"@type": "GeoCircle",
			geoMidpoint: {
				"@type": "GeoCoordinates",
				latitude: -37.8667,
				longitude: 145.2833,
			},
			geoRadius: "50000",
		},
	};

	// Suburb-specific schema
	if (isSuburbPage) {
		const category = page.category; // 'family' or 'newborn'
		const suburb = page.suburb;

		// Category-specific descriptions and services
		let categoryDescription = "";
		let primaryService = "";
		let serviceDescription = "";
		let knowsAbout = [];

		if (category === "family") {
			categoryDescription = `Professional family photography in ${suburb}, Melbourne. Capturing precious family moments with natural, relaxed sessions.`;
			primaryService = "Family Photography";
			serviceDescription = `Beautiful family photography sessions in ${suburb} and surrounding areas. Natural, relaxed approach capturing genuine family connections.`;
			knowsAbout = [
				"Family Photography",
				"Portrait Photography",
				"Outdoor Photography",
				"Melbourne Family Photography",
				`${suburb} Photography`,
			];
		} else if (category === "newborn") {
			categoryDescription = `Gentle newborn photography in ${suburb}, Melbourne. Capturing those precious first days with a calm, baby-led approach.`;
			primaryService = "Newborn Photography";
			serviceDescription = `Gentle newborn photography sessions in ${suburb} and surrounding areas. In-home and outdoor sessions with a calm, baby-led approach.`;
			knowsAbout = [
				"Newborn Photography",
				"Baby Photography",
				"In-Home Photography",
				"Melbourne Newborn Photography",
				`${suburb} Photography`,
			];
		}

		// Suburb-specific schema
		const suburbSchema = {
			"@context": "https://schema.org",
			"@type": "LocalBusiness",
			name: `Gill Juergens Photography - ${suburb} ${
				category.charAt(0).toUpperCase() + category.slice(1)
			} Photographer`,
			alternateName: `Gill Juergens Photography - ${
				category.charAt(0).toUpperCase() + category.slice(1)
			} Photography in ${suburb}`,
			description: categoryDescription,
			telephone: config.phone,
			image: `${config.url}/logos/logo.jpg`,
			url: page.path ? `${config.url}/${page.path}` : config.url,
			address: {
				"@type": "PostalAddress",
				addressLocality: config.address.suburb,
				addressRegion: config.address.state,
				postalCode: config.address.postcode,
				addressCountry: config.address.country,
			},
			areaServed: {
				"@type": "Place",
				name: `${suburb}, VIC`,
			},
			geo: {
				"@type": "GeoCoordinates",
				latitude: page.latitude,
				longitude: page.longitude,
			},
			openingHoursSpecification: [
				{
					"@type": "OpeningHoursSpecification",
					dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
					opens: "09:00",
					closes: "17:00",
				},
				{
					"@type": "OpeningHoursSpecification",
					dayOfWeek: ["Saturday"],
					opens: "10:00",
					closes: "14:00",
				},
			],
			priceRange: "$$",
			currenciesAccepted: "AUD",
			paymentAccepted: "Cash, Credit Card, Bank Transfer",
			email: config.email,
			knowsAbout: knowsAbout,
			hasOfferCatalog: {
				"@type": "OfferCatalog",
				name: `${suburb} ${
					category.charAt(0).toUpperCase() + category.slice(1)
				} Photography Services`,
				itemListElement: [
					{
						"@type": "Offer",
						itemOffered: {
							"@type": "Service",
							name: primaryService,
							description: serviceDescription,
							serviceType: `${
								category.charAt(0).toUpperCase() + category.slice(1)
							} Photography`,
							areaServed: {
								"@type": "Place",
								name: `${suburb}, VIC`,
							},
						},
					},
				],
			},
			sameAs: [
				"https://www.facebook.com/gilljuergensphotography",
				"https://www.instagram.com/gilljuergensphotography/",
				"https://www.linkedin.com/company/gilljuergensphotography",
			],
			aggregateRating: {
				"@type": "AggregateRating",
				ratingValue: "5.0",
				reviewCount: "50",
				bestRating: "5",
				worstRating: "1",
			},
			review: [
				{
					"@type": "Review",
					reviewRating: {
						"@type": "Rating",
						ratingValue: "5",
						bestRating: "5",
					},
					author: {
						"@type": "Person",
						name: category === "family" ? "Sarah M." : "Emma L.",
					},
					reviewBody:
						category === "family"
							? `Gill captured our family perfectly in ${suburb}! The photos are beautiful and natural. Highly recommend!`
							: `Amazing newborn session in ${suburb}! Gill made us feel so comfortable and the photos are stunning.`,
				},
			],
			founder: {
				"@type": "Person",
				name: "Gill Juergens",
				jobTitle: "Professional Photographer",
				description: `${
					category.charAt(0).toUpperCase() + category.slice(1)
				} Photographer in ${suburb} and Melbourne's Eastern Suburbs`,
			},
			foundingDate: "2014",
			numberOfEmployees: "1",
			serviceArea: {
				"@type": "GeoCircle",
				geoMidpoint: {
					"@type": "GeoCoordinates",
					latitude: page.latitude,
					longitude: page.longitude,
				},
				geoRadius: "25000",
			},
		};

		return JSON.stringify(suburbSchema, null, 2);
	}

	// Default schema for non-suburb pages
	baseSchema.description =
		"Professional family, wedding, and newborn photographer in Melbourne's Eastern suburbs with expertise in capturing timeless moments and creating beautiful, cherished memories for families.";
	baseSchema.knowsAbout = [
		"Family Photography",
		"Wedding Photography",
		"Newborn Photography",
		"Maternity Photography",
		"Portrait Photography",
		"Melbourne Photography",
	];
	baseSchema.hasOfferCatalog = {
		"@type": "OfferCatalog",
		name: "Photography Services",
		itemListElement: [
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Family Photography",
					description:
						"Professional family photography sessions capturing precious moments and genuine connections.",
					serviceType: "Family Portrait Photography",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Wedding Photography",
					description:
						"Beautiful wedding photography documenting your special day with artistry and care.",
					serviceType: "Wedding Photography",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Newborn Photography",
					description:
						"Gentle newborn photography sessions capturing those precious first days and weeks.",
					serviceType: "Newborn Photography",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Maternity Photography",
					description:
						"Beautiful maternity photography celebrating the anticipation and joy of expecting parents.",
					serviceType: "Maternity Photography",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "In-Home Sessions",
					description:
						"Comfortable in-home photography sessions in your familiar environment.",
					serviceType: "In-Home Photography",
				},
			},
			{
				"@type": "Offer",
				itemOffered: {
					"@type": "Service",
					name: "Outdoor Sessions",
					description:
						"Natural outdoor photography sessions in beautiful Melbourne locations.",
					serviceType: "Outdoor Photography",
				},
			},
		],
	};
	baseSchema.review = [
		{
			"@type": "Review",
			reviewRating: {
				"@type": "Rating",
				ratingValue: "5",
				bestRating: "5",
			},
			author: {
				"@type": "Person",
				name: "Sarah M.",
			},
			reviewBody:
				"Gill captured our family perfectly! The photos are beautiful and natural. Highly recommend!",
		},
		{
			"@type": "Review",
			reviewRating: {
				"@type": "Rating",
				ratingValue: "5",
				bestRating: "5",
			},
			author: {
				"@type": "Person",
				name: "Michael T.",
			},
			reviewBody:
				"Amazing newborn session! Gill made us feel so comfortable and the photos are stunning.",
		},
	];

	return JSON.stringify(baseSchema, null, 2);
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
