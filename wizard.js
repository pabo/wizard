$(document).ready(function () {
	var wizardDiv = $("#wizard");

	//progress bar has attr that define min, max. we just need to know the current step
	function updateProgressBar(progressBar, step) {
		var minStep = progressBar.attr("aria-valuemin");
		var maxStep = progressBar.attr("aria-valuemax");

		var numSteps = maxStep - minStep;
		var stepWidth = 100 / numSteps;

		progressBar.css("width", (step*stepWidth) + "%");
		progressBar.html(step + "/" + maxStep);
		progressBar.attr("aria-valuenow", step);
	}

	//register events for next/previous buttons
	$(wizardDiv).find("button#previous").click(function() { prev(wizardDiv); });
	$(wizardDiv).find("button#next").click(function () { next(wizardDiv); });
	$("#mainForm").on("invalid.bs.validator", function(e) {
		console.log("something's invalid!");
		wizardDiv.find("button#next").prop('disabled', true);
		
	});

	$("#mainForm").on("valid.bs.validator", function(e) {
		console.log("something's valid!");
		wizardDiv.find("button#next").prop('disabled', false);
	});

	function prev(wizardDiv) {
		var activePane = $(wizardDiv).find(".tab-pane.active");
		if (activePane.is(":first-child")) {
			//can't go back
		}
		else {
			var newActivePane = activePane.prev("div.tab-pane");
			var progressBar = $(wizardDiv).find("#wizardprogress");
			var newStep = newActivePane.attr("data-progress");

			activePane.removeClass("active").hide();
			newActivePane.addClass("active").show();

			//update progressbar
			updateProgressBar(progressBar, newStep);

			//make sure next button is enabled
			wizardDiv.find("button#next").prop('disabled', false);

			//disable previous button if this is first
			if (newActivePane.is(":first-child")) {
				wizardDiv.find("button#previous").prop('disabled', true);
			}
		}
	}

	function next(wizardDiv) {
		var activePane = $(wizardDiv).find(".tab-pane.active");
		if (activePane.is(":last-child")) {
			//can't go forward
		}
		else {
			var newActivePane = activePane.next("div.tab-pane");
			var progressBar = $(wizardDiv).find("#wizardprogress");
			var newStep = newActivePane.attr("data-progress");

			activePane.removeClass("active").hide();
			newActivePane.addClass("active").show();
			$(wizardDiv).find("#wizardprogress").html(newActivePane.attr("data-progress") + "/3");

			//update progressbar
			updateProgressBar(progressBar, newStep);

			//make sure previous button is enabled
			wizardDiv.find("button#previous").prop('disabled', false);

			//disable next button if this is last
			//if (newActivePane.is(":last-child")) {

			//actually, just disable it always
			wizardDiv.find("button#next").prop('disabled', true);
			//}
		}
	}
});
