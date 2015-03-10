/*jshint jquery: true*/
$.fn.tassel = function (options) {
    'use strict';

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
	function layout(event) {

		//necessary part to construct background image reference, wrap with url()
		options.tassels.forEach(function (element, index, array) {
			array[index] = "".concat("url(", element, ")");
		});

		//depending on having 2 or 3 images for the hr we are starting to decorate
		hr.css({
			"background-image": options.tassels.join(","),
			"background-position": "top left, top right" + (options.tassels.length == 3 ? ", 0% 10%" : ""),
			"background-repeat": "no-repeat, no-repeat" + (options.tassels.length == 3 ? ", repeat-x" : ""),
			"background-clip": "padding-box, padding-box" + (options.tassels.length == 3 ? ", content-box" : ""),
			"padding": "0 " + options.tasselWidth + "px",
			"height": options.tasselHeight + "px",
			"border": "0"
		})
			.addClass('tasselled');

		if(parseInt(options.repetition, 10) > 0){
			hr.width(options.repetition * options.repetitionWidth);
		}
		else if (parseInt(options.repetition, 10) === -1){
			hr.width(availableWidth);
		}
	}

	function availableWidth(){
		//we can't always assume hr's parent will have width value as the perfect multiplier of 2 * options.tasselWidth + options.repetition * options.repetitionWidth
		//since tasselWidth is already added to the component through padding-box we have to subtract it from parent width
		var componentWidth = hr.parent().width() - 2 * options.tasselWidth;
		//then the remaining space may not necesarily divide by repetitionWidth evenly so let's find the excess
		var excess = componentWidth % options.repetitionWidth;
		//finally the available widht is what's left from componentWidth - excess to add up to a round multiplier of options.repetition * options.repetitionWidth
		return componentWidth - excess;
	}

	return this.each(function () {

		var numOfLoadedTessels = 0;

		/*
		each image will be loaded so they can later be used as background image to decorate hr
		but the main point is to detect the width and height of the images so we can construct the hr properly
		this section also ensures that the image path is correct, otherwise it'll trigger an ImageLoadError
		*/
		$.each(options.tassels, function (index, element) {

			$('<img/>')
				.load(function (event) {
				numOfLoadedTessels++;

				//first indexed image carries enough information to register width and heigth of the outermost tassels
				if (index === 0) {
					options.tasselWidth = event.currentTarget.width;
					options.tasselHeight = event.currentTarget.height;
				}

				//if index is 2 that means we have middle tessel as well
				if(index === 2){
					options.repetitionWidth = event.currentTarget.width;
				}

				// we want to layout only when last image has been loaded whether it's the middle or the right piece
				if(numOfLoadedTessels===options.tassels.length){
					layout(event);
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
