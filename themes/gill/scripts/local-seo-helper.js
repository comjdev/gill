// Local SEO Helper for suburb pages
hexo.extend.helper.register("localSeoContent", function (page, config) {
	if (page.layout !== "suburb" || !page.suburb) {
		return "";
	}

	const suburb = page.suburb;
	const category = page.category;

	// Generate location-specific content for better local SEO
	let content = "";

	if (category === "family") {
		content = `
## ${suburb} Family Photography - Local Professional Service

Looking for a **family photographer in ${suburb}**? I'm your local professional photographer serving ${suburb} and Melbourne's Eastern Suburbs. With over 10 years of experience, I specialize in capturing authentic family moments in ${suburb} and surrounding areas.

### Why Choose a Local ${suburb} Family Photographer?

As a **local family photographer in ${suburb}**, I understand the unique character of your area. I know the best locations in ${suburb} for beautiful family photos, from local parks to scenic spots that showcase the charm of your suburb. My local knowledge means I can suggest perfect locations that reflect your family's personality and the beauty of ${suburb}.

### ${suburb} Family Photography Sessions

My **family photography sessions in ${suburb}** are designed to be relaxed and enjoyable for everyone. Whether we're exploring local ${suburb} parks, capturing moments in your home, or discovering hidden gems in your area, I focus on creating natural, authentic images that tell your family's story.

### Serving ${suburb} and Nearby Areas

I'm conveniently located to serve ${suburb} and surrounding suburbs including Melbourne's Eastern Suburbs. This means I can easily travel to your location for in-home sessions or meet you at beautiful local spots in and around ${suburb}.

### Book Your ${suburb} Family Photography Session

Ready to capture your family's precious moments in ${suburb}? Contact me to book your local family photography session. I'm here to create beautiful memories that you'll treasure for years to come.
        `;
	} else if (category === "newborn") {
		content = `
## ${suburb} Newborn Photography - Local Professional Service

Looking for a **newborn photographer in ${suburb}**? I'm your local professional photographer specializing in gentle newborn photography in ${suburb} and Melbourne's Eastern Suburbs. With over 10 years of experience, I capture those precious first days with care and expertise.

### Why Choose a Local ${suburb} Newborn Photographer?

As a **local newborn photographer in ${suburb}**, I provide convenient in-home sessions that minimize stress for new parents. I understand the unique needs of families in ${suburb} and can travel to your home for comfortable, relaxed newborn photography sessions. My local service means you don't have to travel with your newborn.

### ${suburb} Newborn Photography Sessions

My **newborn photography sessions in ${suburb}** are baby-led and gentle, focusing on capturing natural moments in the comfort of your own home. I bring all necessary equipment and work around your baby's schedule to ensure a calm, peaceful session that captures those precious early days.

### Serving ${suburb} and Nearby Areas

I'm conveniently located to serve ${suburb} and surrounding suburbs in Melbourne's Eastern Suburbs. This local service means I can easily travel to your home for newborn sessions, making the experience as comfortable and convenient as possible for your family.

### Book Your ${suburb} Newborn Photography Session

Ready to capture your newborn's precious first days in ${suburb}? Contact me to book your local newborn photography session. I'm here to create beautiful memories of this special time in your family's life.
        `;
	} else if (category === "maternity") {
		content = `
## ${suburb} Maternity Photography - Local Professional Service

Looking for a **maternity photographer in ${suburb}**? I'm your local professional photographer specializing in beautiful maternity photography in ${suburb} and Melbourne's Eastern Suburbs. With over 10 years of experience, I capture the beauty and anticipation of your pregnancy journey.

### Why Choose a Local ${suburb} Maternity Photographer?

As a **local maternity photographer in ${suburb}**, I understand the unique character of your area and can suggest beautiful local locations for your maternity session. I know the best spots in ${suburb} that provide stunning backdrops for your maternity photos, from local parks to scenic areas that showcase the beauty of your suburb.

### ${suburb} Maternity Photography Sessions

My **maternity photography sessions in ${suburb}** are relaxed and natural, focusing on capturing the beauty and joy of your pregnancy. Whether we choose outdoor locations in ${suburb} or the comfort of your home, I create elegant, timeless images that celebrate this special time in your life.

### Serving ${suburb} and Nearby Areas

I'm conveniently located to serve ${suburb} and surrounding suburbs in Melbourne's Eastern Suburbs. This local service means I can easily travel to your preferred location for maternity sessions, making the experience as comfortable and convenient as possible.

### Book Your ${suburb} Maternity Photography Session

Ready to capture the beauty of your pregnancy journey in ${suburb}? Contact me to book your local maternity photography session. I'm here to create beautiful memories of this special time in your life.
        `;
	}

	return content;
});

// Helper for generating location-specific keywords
hexo.extend.helper.register("localSeoKeywords", function (page) {
	if (page.layout !== "suburb" || !page.suburb) {
		return "";
	}

	const suburb = page.suburb;
	const category = page.category;

	let keywords = [];

	if (category === "family") {
		keywords = [
			`${suburb} family photographer`,
			`family photographer ${suburb}`,
			`${suburb} family photography`,
			`family photography ${suburb}`,
			`${suburb} photographer`,
			`photographer ${suburb}`,
			`Melbourne family photographer`,
			`Eastern Suburbs family photographer`,
			`local family photographer`,
			`${suburb} family photos`,
			`family photos ${suburb}`,
		];
	} else if (category === "newborn") {
		keywords = [
			`${suburb} newborn photographer`,
			`newborn photographer ${suburb}`,
			`${suburb} newborn photography`,
			`newborn photography ${suburb}`,
			`${suburb} baby photographer`,
			`baby photographer ${suburb}`,
			`Melbourne newborn photographer`,
			`Eastern Suburbs newborn photographer`,
			`local newborn photographer`,
			`${suburb} newborn photos`,
			`newborn photos ${suburb}`,
		];
	} else if (category === "maternity") {
		keywords = [
			`${suburb} maternity photographer`,
			`maternity photographer ${suburb}`,
			`${suburb} maternity photography`,
			`maternity photography ${suburb}`,
			`${suburb} pregnancy photographer`,
			`pregnancy photographer ${suburb}`,
			`Melbourne maternity photographer`,
			`Eastern Suburbs maternity photographer`,
			`local maternity photographer`,
			`${suburb} maternity photos`,
			`maternity photos ${suburb}`,
		];
	}

	return keywords.join(", ");
});
