/**
 * Products Library
 * This Handles Calling Products API and Sanitizing Product Data for the Frontend
 */
var ReiEinstein = ReiEinstein || {};

ReiEinstein.Products = function() {

	function fetchProducts(page) {
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
			data: {search: 'bags', page: 1, limit: 30},
			method: 'POST',
			dataType: 'json'
		}).done(done).fail(fail);

		return df.promise();
	}

	return {
		fetchProducts: fetchProducts
	};
};