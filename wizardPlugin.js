'use strict';
/*
 * usage:
 * wizardPlugin.init(wizardDiv);
 *    wizardDiv is a jQuery object of the wizardDiv which contains the html defined below
 *
 * requires jQuery
 * requires bootstrap validator http://1000hz.github.io/bootstrap-validator/ for validation
 *
 * html:
 * wizardDiv
 *    div#wizardprogress with aria-valuemin and aria-valuemax set
 *    form#mainForm to contain the inputs
 *    div.tab-pane with data-progress set to a value which will be used as a progress bar step number
 *    button#next
 *    button#previous
 *
 */
var wizardPlugin = (function(wizardDiv){

	var my = {};

	//PRIVATE
	var wizardDiv, nextButton, prevButton, progressBar;

	function init(initWizardDiv) {
		wizardDiv = initWizardDiv;
		nextButton = wizardDiv.find("button#next");
		prevButton = wizardDiv.find("button#previous");
		progressBar = wizardDiv.find("#wizardprogress");

		//register events for next/previous buttons
		nextButton.click(function () { activateNextPane(); });
		prevButton.click(function() { activatePrevPane(); });

		//register events for valid/invalid state change
		$("#mainForm").on("invalid.bs.validator", function(e) {
			//mark the field as invalid
			$(e.relatedTarget).attr("data-isvalid", false);

			activateButtons();
		});

		$("#mainForm").on("valid.bs.validator", function(e) {
			//mark the field as valid
			$(e.relatedTarget).attr("data-isvalid", true);

			activateButtons();
		});
	}

	function isFormValid(options) {
		var visibility = (options.visibleOnly ? ":visible" : "");
		var valid = true;
		$("#mainForm input" + visibility).each(function(index, element) {
			if (! ($(element).attr("data-isvalid") && $(element).attr("data-isvalid") === 'true') ) {
				valid = false;
			}
		});

		return valid;
	}

	//progress bar has attributes that define min, max. we just need to know the current step
	function updateProgressBar(progressBar, step) {
		var minStep = progressBar.attr("aria-valuemin");
		var maxStep = progressBar.attr("aria-valuemax");

		var numSteps = maxStep - minStep;
		var stepWidth = 100 / numSteps;

		progressBar.css("width", (step*stepWidth) + "%");
		progressBar.html(step + "/" + maxStep);
		progressBar.attr("aria-valuenow", step);
	}


	//activePane is the currently active pane, and newActivePane is the one to make active.
	function activatePane(activePane, newActivePane) {
		var newStep = newActivePane.attr("data-progress");

		//hide/show the proper tab-pane
		activePane.removeClass("active").hide();
		newActivePane.addClass("active").show();

		updateProgressBar(progressBar, newStep);

		activateButtons();
	}

	function activatePrevPane() {
		var activePane = wizardDiv.find(".tab-pane.active");
		if (! activePane.is(":first-child")) {
			var newActivePane = activePane.prev("div.tab-pane");
			activatePane(activePane, newActivePane);
		}
	}

	function activateNextPane() {
		var activePane = wizardDiv.find(".tab-pane.active");
		if (! activePane.is(":last-child")) {
			var newActivePane = activePane.next("div.tab-pane");
			activatePane(activePane, newActivePane);
		}
	}

	function activateButtons() {
		var activePane = wizardDiv.find(".tab-pane.active");

		// next button should be active if the visible form fields are validated
		// and the active pane is not the last pane
		if (isFormValid({visibleOnly: true}) && ! activePane.is(":last-child")) {
			nextButton.prop('disabled', false);
		}
		else {
			nextButton.prop('disabled', true);
		}

		// previous button should be active as long as the active pane isn't the first
		if (activePane.is(":first-child")) {
			prevButton.prop('disabled', true);
		}
		else {
			prevButton.prop('disabled', false);
		}
	}


	//PUBLIC
	my.init = function(wizardDiv) {
		init(wizardDiv);
	}

	return my;
}());
