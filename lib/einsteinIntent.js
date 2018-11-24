module.exports = function() {
	//Einstein Configuration
	var config = {
		token: 'G3NLJ4SWBGI5UEG7Q7FHXUBA2WQW623EIVGNRX7UR64UGS5OBFUGRUZBPKLK2IABH6XCG43KLSNWLCLIAPO37ZJHP2EXDMAKVWDTI2Y', //Token
		modelId: 'DK6FZZFSKGMT4T2UI5FYLPMMBA', //Intent modelId
		intentThreshold: 50,
		defaultIntent: 'Shopping'
	};

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
				return p.label;
			}
		}
		return config.defaultIntent;
	}
}