module.exports = function() {
	function sanitizeProductData(data) {
		return data.map(obj => {
			var totalRatingStars = 5;
			var reiDomain = 'https://www.rei.com/';
			var priceDisplay = obj.displayPrice.priceDisplay;
			var rating = obj.rating * (100/totalRatingStars);
			return {
				title: obj.title,
				brand: obj.brand,
				link: reiDomain + obj.link,
				thumbnailImageLink : obj.thumbnailImageLink,
				reviewCount: (obj.reviewCount) ? obj.reviewCount : 0,
				priceType: priceDisplay.priceDisplayType.toLowerCase(),
				price: (priceDisplay.price) ? priceDisplay.price : priceDisplay.compareAtPrice,
				salePrice: priceDisplay.salePrice,
				savingsPercent: priceDisplay.savingsPercent,
				ratingPercent: rating
			};
		});
	}

	this.fetch = function(search, page, limit) {
		let request = require('request');
		let options = {
			url: `https://www.rei.com/search-ui/rest/search/products/results?q=${search}&origin=web&page=${page}&pagesize=${limit}`
		};
		return new Promise(function(resolve, reject) {
			request(options, function(err, resp, body) {
				if (err) {
					reject(err);
				} if(resp.statusCode != 200) {
					reject(`REI SERVER ERROR: ${resp.statusMessage}`);
				} else {
					try {
						var info = JSON.parse(body);
						if(info.results.length > 0) {
							resolve(sanitizeProductData(info.results));
						} else {
							resolve([]);
						}
					} catch(e) {
						reject(e);
					}
				}
			});
		});
	}
}