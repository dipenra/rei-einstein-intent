/**
 * Contains all the Index page related actions
 */
$(function(){
	//page data that are local to this page
	var pageData = {
		xhr: false, //set to TRUE if xhr is making a request
		pagination: 1, //tracks search page count
		limit: 30, //search limit per page
		endofrecord: false, //TRUE is search does not return any data
		currentSearch: 'camping' //Default arbitrary search text that loads when the page initially loads
	};

	$(window).on('scroll', windowScrollHandler).scroll();
	$('header').on('submit', 'form[name="search-form"]', submitSearchFormHandler);

	//load initial search products
	fetchProductData(true);

	/* handlers */
	function windowScrollHandler() {
		if(isPageBottom() && !pageData.xhr) {
			fetchProductData(false);
		}
	}

	/**
	 * submitSearchFormHandler
	 * Handles form submission and processes search Intent 
	 */
	function submitSearchFormHandler(e) {
		e.preventDefault();

		var search = $(this).find('input[name="search"]').val();

		resetPageData();
		resetSearchList();
		showLoader();
		pageData.currentSearch = search;
		
		processIntent();
	}

	/* Functions */

	/**
	 * isPageBottom
	 * Checks if the the scroll position is at the bottom of the page
	 * @return: {Boolean} - TRUE if at scroll is at bottom
	 */
	function isPageBottom() {
		var scrollTop = $(document).scrollTop();
		var windowHeight = $(window).height();
		var bodyHeight = $(document).height() - windowHeight;
		var scrollPercentage = (scrollTop / bodyHeight);

		// TRUE if the scroll is more than 90% from the top
		return (scrollPercentage > 0.9);
	}

	/**
	 * processIntent
	 * Gets the user Intent and calls the right actions for the intent
	 */
	function processIntent() {
		var Api = new ReiEinstein.Api();
		/**
		 * Loads the correct methods depending on the search intent
		 */
		function doIntent(r) {
			switch(r.intent.label) {
				case 'Shopping':
					fetchProductData(true);
				break;
				default: //defaults currently are all the REI Project APP Intents
					hideLoader();
					showEinsteinIntent(r);
					fetchProductData(false);
				break;
			}
		}

		/**
		 * Get the intent of the user
		 */
		Api.fetchIntent(pageData.currentSearch).done(doIntent).fail(function(){
			fetchProductData(true);
		});
	}
	
	/**
	 * fetchProductData
	 * Calls Product API with the search text and renders page with the returned data
	 * @param {Boolean} resetPage - Set to TRUE to overwrite html elements FALSE to append
	 */
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

	/**
	 * renderProductItems
	 * @param {ARRAY} data - Array of JSON Product data 
	 * @param {Boolean} resetPage - Set to TRUE to overwrite html elements FALSE to append
	 * 
	*/
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

	/** 
	 * renderNoProductFound
	 * Renders No Data Found Element
	 */
	function renderNoProductFound() {
		$('#itemsList').html('<li><h2>No Data Found</h2></li>');
	}

	/**
	 * resetPageData
	 * Resets page data to defaults
	 */
	function resetPageData(){
		pageData.xhr = false;
		pageData.pagination = 1;
		pageData.endofrecord = false;
	}

	/**
	 * resetSearchList
	 * removes All the list elements from the List container
	 */
	function resetSearchList() {
		$('#itemsList').html('');
	}

	/**
	 * showLoader
	 * Appends and displays the loader element
	 */
	function showLoader() {
		if(!$('#loader').length) {
			$('#itemsWrapper').append('<div class="loader" id="loader"></div>');
		}
	}

	/**
	 * hideLoader
	 * Removes the loader element
	 */
	function hideLoader() {
		$('#itemsWrapper #loader').remove();
	}

	/**
	 * changeSearchTitle
	 * Updates search title with the current search
	 */
	function changeSearchTitle() {
		$('#searchTitle').html('Results for "' + pageData.currentSearch + '"');
	}

	/**
	 * showEinsteinIntent
	 * Displays the project app template in the search result
	 * @param {JSON} data 
	 */
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