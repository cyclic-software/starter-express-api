const cheerio = require('cheerio');
const request = require('request-promise');

const searchCache = {};
const moviesCache = {};
const seriesCache = {};
const tvshowsCache = {};
const recentlyCache = {};

async function search(title) {
	if (searchCache[title]) {
		console.log('From Cache', title);
		return Promise.resolve(searchCache[title]);
	}
	const searchQuery = await request.get(
		`https://www.cima4up.life/search/${encodeURI(title)}`
	);

	const result = [];

	const $ = await cheerio.load(searchQuery);
	const mainResult = [];
	$('.BoxItem').each((i, el) => {
		const $img = $(el).find('div img');
		const $title = $(el).find('.ContentHover>h2');
		const $href = $(el).find('.ButtonsArea a');

		const item = {
			title: $title.text().replace('()', ''),
			image: $img.attr('data-img'),
			url: $href.attr('href'),
		};

		if (item.image != undefined && item.url != undefined) {
			mainResult.push(item)
		};
	});

	const numberOfPages = $('.pagination').find(".page-numbers a");
	if (mainResult.length >= 1 && numberOfPages.length != 0) {
		const urlPage = $('.pagination').find(".page-numbers li a").attr("href");
		var splitName = urlPage.split('=');
		var NumberPage = parseInt(splitName[1])
		const restResult = [];
		for (let i = 2; i <= NumberPage + 3; i++) {

			const moviesQuery = await request.get(
				`https://www.cima4up.life/search/${encodeURI(title)}/page/${i}`
			);

			const $ = await cheerio.load(moviesQuery);
			$('.BoxItem').each((i, el) => {
				const $year = $(el).find('.ContentHover>h2>strong');
				const $img = $(el).find('div img');
				const $title = $(el).find('.ContentHover>h2');
				const $href = $(el).find('.ButtonsArea a');

				const item = {
					title: $title.text().replace($year.text(), ` (${$year.text()}) `),
					image: $img.attr('data-img'),
					url: $href.attr('href'),
				};

				if (item.image != undefined && item.url != undefined) {
					restResult.push(item)
				};

			});
		}
		if (mainResult.length <= 42) {
			var concatResult = mainResult.concat(restResult);
			result.push({
				concatResult
			});
			if (concatResult.length > 84) concatResult.splice(84, 84);
		} else {
			result.push({
				mainResult,
				restResult
			});
		}
	} else {
		result.push({
			mainResult
		});
	}

	searchCache[title] = result;
	return result;
}

async function movies() {
	if (moviesCache['Movies']) {
		console.log('From Cache Movies');
		return Promise.resolve(moviesCache['Movies']);
	}

	const result = [];
	const moviesQuery = await request.get(
		`https://www.cima4up.life/movies-hd18/`
	);

	const $ = await cheerio.load(moviesQuery);
	const firstResult = [];
	$('.BoxItem').each((i, el) => {
		const $year = $(el).find('.ContentHover>h2>strong');
		const $img = $(el).find('div img');
		const $title = $(el).find('.ContentHover>h2');
		const $href = $(el).find('.ButtonsArea a');

		const item = {
			title: $title.text(),
			image: $img.attr('data-img'),
			url: $href.attr('href'),
		};

		if (item.image != undefined && item.url != undefined) {
			firstResult.push(item)
		};
	});

	if (firstResult.length >= 1) {
		const restResult = [];
		for (let i = 2; i <= 3; i++) {
			const moviesQuery = await request.get(
				`https://www.cima4up.life/movies-hd18/page/${i}/`
			);

			const $ = await cheerio.load(moviesQuery);
			$('.BoxItem').each((i, el) => {
				const $year = $(el).find('.ContentHover>h2>strong');
				const $img = $(el).find('div img');
				const $title = $(el).find('.ContentHover>h2');
				const $href = $(el).find('.ButtonsArea a');

				const item = {
					title: $title.text(),
					image: $img.attr('data-img'),
					url: $href.attr('href'),
				};

				if (item.image != undefined && item.url != undefined) {
					restResult.push(item);
				};

			});
		}
		result.push({
			firstResult,
			restResult
		})
	}
	moviesCache['Movies'] = result;
	return result;
}

async function series() {
	if (seriesCache['Series']) {
		console.log('From Cache Series');
		return Promise.resolve(seriesCache['Series']);
	}

	const result = [];
	const SeriesQuery = await request.get(
		`https://www.cima4up.life/series-hd-1/`
	);

	const $ = await cheerio.load(SeriesQuery);
	const firstResult = [];
	$('.BoxItem').each((i, el) => {
		const $year = $(el).find('.ContentHover>h2>strong');
		const $img = $(el).find('div img');
		const $title = $(el).find('.ContentHover>h2');
		const $href = $(el).find('.ButtonsArea a');

		const item = {
			title: $title.text().replace($year.text(), ` (${$year.text()})`),
			image: $img.attr('data-img'),
			url: $href.attr('href'),
		};

		if (item.image != undefined && item.url != undefined) {
			firstResult.push(item)
		};
	});

	if (firstResult.length >= 1) {
		const restResult = [];
		for (let i = 2; i <= 3; i++) {
			const SeriesQuery = await request.get(
				`https://www.cima4up.life/series-hd-1/page/${i}/`
			);

			const $ = await cheerio.load(SeriesQuery);
			$('.BoxItem').each((i, el) => {
				const $year = $(el).find('.ContentHover>h2>strong');
				const $img = $(el).find('div img');
				const $title = $(el).find('.ContentHover>h2');
				const $href = $(el).find('.ButtonsArea a');

				const item = {
					title: $title.text().replace($year.text(), ` (${$year.text()})`),
					image: $img.attr('data-img'),
					url: $href.attr('href'),
				};

				if (item.image != undefined && item.url != undefined) {
					restResult.push(item);
				};

			});
		}

		result.push({
			firstResult,
			restResult
		})

	}
	seriesCache['Series'] = result;
	return result;
}

async function tvshows() {
	if (tvshowsCache['TvShows']) {
		console.log('From Cache TvShows');
		return Promise.resolve(tvshowsCache['TvShows']);
	}

	const result = [];
	const TvShowsQuery = await request.get(
		`https://www.cima4up.life/tv/`
	);

	const $ = await cheerio.load(TvShowsQuery);
	const firstResult = [];
	$('.BoxItem').each((i, el) => {
		const $year = $(el).find('.ContentHover>h2>strong');
		const $img = $(el).find('div img');
		const $title = $(el).find('.ContentHover>h2');
		const $href = $(el).find('.ButtonsArea a');

		const item = {
			title: $title.text().replace($year.text(), ` (${$year.text()})`),
			image: $img.attr('data-img'),
			url: $href.attr('href'),
		};

		if (item.image != undefined && item.url != undefined) {
			firstResult.push(item)
		};
	});

	if (firstResult.length >= 1) {
		const restResult = []
		for (let i = 2; i <= 3; i++) {
			const TvShowsQuery = await request.get(
				`https://www.cima4up.life/tv/page/${i}/`
			);

			const $ = await cheerio.load(TvShowsQuery);
			$('.BoxItem').each((i, el) => {
				const $year = $(el).find('.ContentHover>h2>strong');
				const $img = $(el).find('div img');
				const $title = $(el).find('.ContentHover>h2');
				const $href = $(el).find('.ButtonsArea a');

				const item = {
					title: $title.text().replace($year.text(), ` (${$year.text()})`),
					image: $img.attr('data-img'),
					url: $href.attr('href'),
				};

				if (item.image != undefined && item.url != undefined) {
					restResult.push(item);
				};

			});
		}
		result.push({
			firstResult,
			restResult
		})
	}
	tvshowsCache['TvShows'] = result;
	return result;
}

async function recently() {
	if (recentlyCache['latest']) {
		console.log('From Cache latest');
		return Promise.resolve(recentlyCache['latest']);
	}

	const result = [];
	const recentlyQuery = await request.get(
		`https://www.cima4up.life/recently/`
	);


	const $ = await cheerio.load(recentlyQuery);
	const firstResult = [];
	$('.BoxItem').each((i, el) => {
		const $year = $(el).find('.ContentHover>h2>strong');
		const $img = $(el).find('div img');
		const $title = $(el).find('.ContentHover>h2');
		const $href = $(el).find('.ButtonsArea a');

		const item = {
			title: $title.text().replace($year.text(), ` (${$year.text()})`),
			image: $img.attr('data-img'),
			url: $href.attr('href'),
		};

		if (item.image != undefined && item.url != undefined) {
			firstResult.push(item)
		};
	});

	if (firstResult.length >= 1) {
		const restResult = [];

		for (let i = 2; i <= 2; i++) {
			const recentlyQuery = await request.get(
				`https://www.cima4up.life/recently/page//${i}/`
			);

			const $ = await cheerio.load(recentlyQuery);
			$('.BoxItem').each((i, el) => {
				const $year = $(el).find('.ContentHover>h2>strong');
				const $img = $(el).find('div img');
				const $title = $(el).find('.ContentHover>h2');
				const $href = $(el).find('.ButtonsArea a');

				var item = {
					title: $title.text().replace($year.text(), ` (${$year.text()})`),
					image: $img.attr('data-img'),
					url: $href.attr('href'),
				};

				restResult.push(item);

			});
		}

		result.push({
			firstResult,
			restResult
		});

	}
	recentlyCache['latest'] = result;
	return result;
}

// async function test() {

// 	const result = [];
// 	const testQuery = await request.get(
// 		`https://s.brstej.net/ind3`
// 	);

// 	const $ = await cheerio.load(testQuery);
// 	const firstResult = [];
// 	$('ul.row.pm-ul-browse-videos.list-unstyled').each((i, el) => {
// 		// const $year = $(el).find('.ContentHover>h2>strong');
// 		const $title = $(el).find('li .caption h3 a');
// 		const $href = $(el).find('.ButtonsArea a');
// 		const $img = $(el).find('div img');

// 		console.log($title);
// 		const item = {
// 			title: $title.text(),
// 			image: $img.attr('data-img'),
// 			url: $href.attr('href'),
// 		};

// 		result.push(item)
// 	});

// 	// if (firstResult.length >= 1) {
// 	// 	const restResult = []
// 	// 	for (let i = 2; i <= 3; i++) {
// 	// 		const testQuery = await request.get(
// 	// 			`https://www.cima4up.life/tv/page/${i}/`
// 	// 		);

// 	// 		const $ = await cheerio.load(testQuery);
// 	// 		$('.BoxItem').each((i, el) => {
// 	// 			const $year = $(el).find('.ContentHover>h2>strong');
// 	// 			const $img = $(el).find('div img');
// 	// 			const $title = $(el).find('.ContentHover>h2');
// 	// 			const $href = $(el).find('.ButtonsArea a');

// 	// 			const item = {
// 	// 				title: $title.text().replace($year.text(), ` (${$year.text()})`),
// 	// 				image: $img.attr('data-img'),
// 	// 				url: $href.attr('href'),
// 	// 			};

// 	// 			if (item.image != undefined && item.url != undefined) {
// 	// 				restResult.push(item);
// 	// 			};

// 	// 		});
// 	// 	}
// 	// 	result.push({
// 	// 		firstResult,
// 	// 		restResult
// 	// 	})
// 	// }
// 	return result;
// }

module.exports = {
	search,
	movies,
	series,
	tvshows,
	recently,
	// test
};