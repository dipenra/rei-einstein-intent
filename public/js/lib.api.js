/**
 * Products Library
 * This Handles calls to local API
 */
var ReiEinstein = ReiEinstein || {};

ReiEinstein.Api = function() {

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