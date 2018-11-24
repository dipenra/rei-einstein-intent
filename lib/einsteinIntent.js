module.exports = function() {
	//Einstein Configuration
	var config = {
		token: 'XHDWFTIHEPLPBLMGGG56W6KOQC4PTNRGKYN7645ZCPV2XLOWJ4W7JYJ2E5XCO52SHFXLAG6BEMUAWVUDLD3HQ5W4GOOT44LE3XLQWGQ', //Token
		modelId: 'DK6FZZFSKGMT4T2UI5FYLPMMBA', //Intent modelId
		intentThreshold: 30,
		defaultIntent: 'Shopping'
	};

	var projectAppMap = {
		'Hiking Project App': {link: 'https://www.hikingproject.com/', image: '/images/hiking.jpg'},
		'MTB Project App': {link: 'https://www.mtbproject.com/', image: '/images/mtb.jpg'},
		'Mountain Project App': {link: 'https://www.mountainproject.com/', image: '/images/mountain.jpg'},
		'Trail Run Project App': {link: 'https://www.trailrunproject.com/', image: '/images/trail.jpg'},
		'Powder Project App': {link: 'https://www.powderproject.com/', image: '/images/powder.jpg'},
		'National Parks App': {link: 'https://www.rei.com/adventures', image: '/images/national.jpg'}
	}
	/**
	 * getUserIntent
	 * Call Einstein Language Intent API to get the intent of the User
	 * @param {STRING} search
	 */
	this.getUserIntent = function(search) { 
		let request = require('request');
		var options = {
			url: 'https://api.einstein.ai/v2/language/intent',
			method: 'post',
			formData: {modelId: config.modelId, document: search},
			headers: {
				'Authorization': `Bearer ${config.token}`
			}
		};
		return new Promise(function(resolve, reject) {
			request(options, function(err, resp, body) {
				if (err) {
					reject(err);
				} if(resp.statusCode != 200) {
					reject(`SALESFORCE SERVER ERROR: ${resp.statusMessage}`);
				} else {
					try {
						resolve(JSON.parse(body));
					} catch(e) {
						reject(e);
					}
				}
			});
		});
	}

	/**
	 * getIntent 
	 * Checks if the first probability 
	 * passes the probability threshold. 
	 * If so returns the label as Intent 
	 * else passes a Default Intent
	 * @param {JSON} data 
	 * @return {String}
	 */
	this.getIntent = function(data) {
		if(data && data.probabilities) {
			var p = data.probabilities[0];
			if((p.probability * 100) >= config.intentThreshold) {
				if(typeof projectAppMap[p.label] != 'undefined') {
					return {label: p.label, link: projectAppMap[p.label].link, image: projectAppMap[p.label].image};
				} else {
					return {label: p.label, link: '', image: ''};
				}
			}
		}
		return config.defaultIntent;
	}
}