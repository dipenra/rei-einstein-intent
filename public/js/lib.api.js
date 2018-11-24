/**
 * API Library
 * This Handles API calls
 */
var ReiEinstein = ReiEinstein || {};

ReiEinstein.Api = function() {

	/**
	 * fetchProducts
	 * Fetches REI products
	 * @param {String} search 
	 * @param {Number} page 
	 * @param {Number} limit 
	 */
	function fetchProducts(search, page, limit) {
		var df = $.Deferred();
		var url = '/api/v1/rei-search';

		function done(r) {
			if(r && r.success == '1') {
				df.resolve(r.data);
			} else {
				df.reject();
			}
		}

		function fail(r) {
			df.reject(r);
		}
		
		$.ajax({
			url: url,
			data: {search: search, page: page, limit: limit},
			method: 'POST',
			dataType: 'json'
		}).done(done).fail(fail);

		return df.promise();
	}

	/**
	 * fetchIntent
	 * fetches the intent of the user by calling Einstein Intent
	 * @param {String} search 
	 */
	function fetchIntent(search) {
		var df = $.Deferred();
		var url = '/api/v1/einstein-intent';

		function done(r) {
			if(r && r.success == '1') {
				df.resolve(r.data);
			} else {
				df.reject();
			}
		}

		function fail(r) {
			df.reject(r);
		}
		
		$.ajax({
			url: url,
			data: {search: search},
			method: 'POST',
			dataType: 'json'
		}).done(done).fail(fail);

		return df.promise();
	}

	return {
		fetchProducts: fetchProducts,
		fetchIntent: fetchIntent
	};
};