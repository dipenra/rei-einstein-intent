$(function(){
	//page data that are local to this page
	var pageData = {
		xhr: false,
		pagination: 1,
		limit: 30,
		endofrecord: false, //If xhr status is 404 set this to true, since there are no other test data
		currentSearch: 'camping'
	};

	$(window).on('scroll', windowScrollHandler).scroll();
	$('header').on('submit', 'form[name="search-form"]', submitSearchFormHandler);

	//load initial products
	fetchProductData(true);

	/* handlers */
	function windowScrollHandler() {
		if(isPageBottom() && !pageData.xhr) {
			fetchProductData(false);
		}
	}

	function submitSearchFormHandler(e) {
		e.preventDefault();

		var search = $(this).find('input[name="search"]').val();
		var Api = new ReiEinstein.Api();

		resetPageData();
		resetSearchList();
		showLoader();
		pageData.currentSearch = search;
		/**
		 * performs the correct action depending on the intent
		 * looking at their intent
		 */
		function doIntent(r) {
			switch(r.intent.label) {
				case 'Shopping':
					fetchProductData(true);
				break;
				default:
					hideLoader();
					showEinsteinIntent(r);
					fetchProductData(false);
				break;
			}
		}

		Api.fetchIntent(search).done(doIntent).fail(function(){
			fetchProductData(true);
		});
	}

	/* functions */
	function isPageBottom() {
		// Fetch variables
		var scrollTop = $(document).scrollTop();
		var windowHeight = $(window).height();
		var bodyHeight = $(document).height() - windowHeight;
		var scrollPercentage = (scrollTop / bodyHeight);

		// TRUE if the scroll is more than 90% from the top
		return (scrollPercentage > 0.9);
	}

	function fetchProductData(resetPage) {
		if(pageData.endofrecord) return;

		var Api = new ReiEinstein.Api();
		function done(r) {
			if(r.length) {
				renderProductItems(r, resetPage);
				pageData.pagination++;
				pageData.xhr = false;
			} else {
				fail();
			}
			
		}
		function fail(r) {
			pageData.xhr = false;
			pageData.endofrecord = true;
			if(pageData.pagination == 1 && resetPage) {
				renderNoProductFound();
			}
		}

		showLoader();
		pageData.xhr = true;

		Api.fetchProducts(pageData.currentSearch, pageData.pagination, pageData.limit)
			.done(done)
			.fail(fail)
			.always(function(){
				hideLoader();
				changeSearchTitle();
			}
		);
	}

	function renderProductItems(data, resetPage) {
		$.when($.ajax({url: 'templates/products.mst', dataType: 'text'}))
		.done(function(template){
			Mustache.parse(template);
			var $html = $(Mustache.render(template, {items: data}));
			if(resetPage) {
				$('#itemsList').html($html);
			} else {
				$('#itemsList').append($html);
			}
		});
	}

	function renderNoProductFound() {
		$('#itemsList').html('<li><h2>No Data Found</h2></li>');
	}

	function resetPageData(){
		pageData.xhr = false;
		pageData.pagination = 1;
		pageData.endofrecord = false;
	}

	function resetSearchList() {
		$('#itemsList').html('');
	}

	function showLoader() {
		if(!$('#loader').length) {
			$('#itemsWrapper').append('<div class="loader" id="loader"></div>');
		}
	}

	function hideLoader() {
		$('#itemsWrapper #loader').remove();
	}

	function changeSearchTitle() {
		$('#searchTitle').html('Results for "' + pageData.currentSearch + '"');
	}

	function showEinsteinIntent(data) {
		$.when($.ajax({url: 'templates/einstein-intent.mst', dataType: 'text'}))
		.done(function(template){
			var probability = ((data.einstein_response.probabilities[0].probability)*100).toFixed(2);

			Mustache.parse(template);
			var tdata = {
				link: data.intent.link, 
				thumbnailImageLink: data.intent.image, 
				title:'something', 
				brand: data.intent.label,
				text: 'Einstein Intent matches ' + data.intent.label + ' with ' + probability + '% probability'
			};
			var $html = $(Mustache.render(template, tdata));
			$('#itemsList').html($html);
		});
	}
});