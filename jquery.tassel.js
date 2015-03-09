/*jshint jquery: true*/
$.fn.tassel = function (options) {

	options = $.extend({}, options);

	/*
	start collecting left and right tassels since they are mandatory
	exit if not configured properly
	*/
	if (options.tassel_left && options.tassel_right) {
		options.tassels = [options.tassel_left, options.tassel_right];
	} else {
		return this.trigger(new Event("tasselConfigurationError"));
	}

	//middle part is optional
	if (options.tassel_middle) {
		options.tassels.push(options.tassel_middle);
	}

	//reference to the selector
	var hr = this;

	//this will be called only when the last image is loaded which means we either have 2 or 3 images
	var _layout = function () {

		//necessary part to construct background image reference, wrap with url()
		options.tassels.forEach(function (element, index, array) {
			array[index] = "".concat("url(", element, ")");
		});

		//depending on having 2 or 3 images for the hr we are starting to decorate
		hr.css({
				"background-image": options.tassels.join(","),
				"background-position": "top left, top right" + (options.tassels.length == 3 ? ", top center" : ""),
				"background-repeat": "no-repeat, no-repeat" + (options.tassels.length == 3 ? ", repeat-x" : ""),
				"background-clip": "padding-box, padding-box" + (options.tassels.length == 3 ? ", content-box" : ""),
				"padding": "0 " + options.tassel_width + "px",
				"height": options.tassel_height + "px",
				"border": "0",
				"width": (options.tassels.length === 2 ? "0" : "initial")
			})
			.addClass('tasselled');

	};

	return this.each(function () {


		/*
		each image will be loaded so they can later be used as background image to decorate hr
		but the main point is to detect the width and height of the images so we can construct the hr properly
		this section also ensures that the image path is correct, otherwise it'll trigger an ImageLoadError
		*/
		$.each(options.tassels, function (index, element) {

			$('<img/>')
				.load(function (event) {

					if (index === 0) {
						options.tassel_width = event.currentTarget.width;
						options.tassel_height = event.currentTarget.height;
					}

					// we want to layout only when last image has been loaded
					if (index === options.tassels.length - 1) {
						_layout(event);
					}


				})
				.error(function (event) {
					hr.trigger({
						type: "tasselImageLoadError",
						tassel: index === 0 ? "left" : (index === 2 ? "middle" : "right"),
						path: event.currentTarget.src
					});

				})
				.attr('src', element);


		});
	});
};