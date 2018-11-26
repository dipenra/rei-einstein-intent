module.exports = function() {
	/**
	 * config
	 * Einstein Configuration.
	 * token: this is a temp token and needs to be updated once it is experied. Due to this project being public not adding funtionallity 
	 * to create tokens dynamically due to risk of exposing private key
	 * modelId: Intent model Id that has been trained on the test data
	 * intentThreshold: Number Percentage which will be used to compute Intent probability
	 * defaultIntent: Default Intent if the intentThreshold is not meat and/or Intent is not found
	 */
	var config = {
		token: '6BLDQSLL7QQNTHAXVAV5DNQG73D3X36AI7W5UCYAZR7GXRTP5GWPLEPDQTMZGYJPLHBOUEQ4UEFGTTAHDPWP2IXBKWYMS2DTK2MDAQA',
		modelId: 'L224UESV3I7JEVWGCUBGJKNJYY', //Intent modelId
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
	 * Call Einstein Language Intent API to get the User intent
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
	 * @return {JSON}
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