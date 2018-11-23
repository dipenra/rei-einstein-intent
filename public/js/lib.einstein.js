/**
 * Einstein Library
 * Makes Calls to Einstein APIs and Handles Einstein Data
 */
var ReiEinstein = ReiEinstein || {};

ReiEinstein.Einstein = function() {
	//Einstein Configuration
	var config = {
		token: "OQSGEZMBYI76ZK7O4EFCHPHC55GLF7QSZJZT4C6DCNM6K7XDY4GVIRM35INSNQJZPL6BRKAXMPPWLCFUHDWZHZ2Z63SDSPB27XBPJFA", //Token
		modelId: "DK6FZZFSKGMT4T2UI5FYLPMMBA" //Intent modelId
	};

	/**
	 * getUserIntent
	 * Call Einstein Language Intent API to get the intent of the User
	 * @param {STRING} search 
	 */
	function getUserIntent(search) {
		var df = $.Deferred();
		var url = "https://api.einstein.ai/v2/language/intent";
		var postData = {
			modelId: config.modelId,
			document: search
		};

		function setHeader(xhr) {
			xhr.setRequestHeader("Authorization", "Bearer " + config.token);
			xhr.setRequestHeader("Cache-Control", "no-cache");
			xhr.setRequestHeader("Content-Type", "multipart/form-data");
		}

		function done(r) {
			df.resolve(r.results);
		}

		function fail() {
			/**
			 * For testing purpose and due to limitation of CORS 
			 * passing test data and marking the ajax call success
			 * Note: The response always has Shopping with TOP probability 
			*/
			df.resolve(getTestData(search));
		}
		
		$.ajax({
			url: url,
			method: "POST",
			data: postData,
			beforeSend: setHeader,
			dataType: "json"
		}).done(done).fail(fail);

		return df.promise();
	}

	/**
	 * getIntent 
	 * Checks if the 1st probability 
	 * passes the probability threshold. 
	 * If so returns the label as Intent 
	 * else passes a Default Intent
	 * @param {JSON} data 
	 * @return {String}
	 */
	function getIntent(data) {
		var defaultIntent = "Shopping";
		var threshHold = 50;
		if(data && data.probabilities) {
			var p = data.probabilities[0];
			if((p.probability * 100) >= threshHold) {
				return p.label;
			}
		}
		return defaultIntent;
	}

	/**
	 * getTestData
	 * This is just some controlled test data when Einstein API call fails
	 * @param {String} search 
	 * @return {JSON} JSON object that is in the format Intent API returns in
	 */
	function getTestData(search) {
		//Default intent that gets the top priority for test data 
		var intentLabelFiller = 'Shopping';

		//simple keywords mapping for project app for testing only
		var keywords = {
			"Hiking Project App": ["hiking map", "hiking routes", "trail maps", "hiking near here", "i want to go hiking", "show me trail maps"],
			"Powder Project App": ["ski map", "ski routes", "powder maps", "sking near here", "snowboarding maps", "show me ski maps"],
			"National Parks App": ["yosemite map", "national park", "national parks", "national parks map"],
			"MTB Project App": ["mountain biking map", "mountain map", "biking map", "what are the best places to mountain bike"]
		};

		//Check if the search text is in the keywords
		for(var key in keywords) {
			if(keywords[key].indexOf(search.toLowerCase())> -1) {
				intentLabelFiller = key;
			}
		}

		return {
			"probabilities": [
				{
					"label": intentLabelFiller,
					"probability": 0.92021406
				},
				{
					"label": "Hiking Project App",
					"probability": 0.024322152
				},
				{
					"label": "Powder Project App",
					"probability": 0.023376303
				},
			],
			"object": "predictresponse"
		};
	}

	return {
		getUserIntent: getUserIntent,
		getIntent: getIntent
	};
};