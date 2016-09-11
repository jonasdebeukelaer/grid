'use strict';

var currentCellId = ""
var aboutVisible = false

$(document).ready(function () {
	var gridSize = setGridSize()
	loadGrid(gridSize);

	$('.grid-cell').click(function (event) {
		if (event.currentTarget.id != currentCellId) {
			focusCell(event.currentTarget.id, selectColour)
		}
	})

	$('.grid-container').click(function (event) {
		if (event.toElement.className == "grid-container") {
			$('select[name="colorpicker"]').simplecolorpicker('destroy');
			$('select[name="colorpicker"]').remove()
			$('.grid-cell').removeClass('focusCell')
		}
	})

	$('#title').click( function () {
		$('#aboutDiv').addClass('visible')
		$('#darken').addClass('show')
		$('#darken').removeClass('displayNone')
		if (!aboutVisible) {aboutVisible = true}
	})

	$('#darken').click( function (event) {
		if ($('#darken').hasClass('show')) {
			$('#darken').removeClass('show')
			$('#aboutDiv').removeClass('visible')
		}
	})
});

function focusCell(id, callback) {
	$('select[name="colorpicker"]').simplecolorpicker('destroy');
	$('select[name="colorpicker"]').remove()
	$('.grid-cell').removeClass('focusCell')
	$('#' + id).addClass('focusCell')
	currentCellId = id
	callback(id)
}

function selectColour(clickedId) {
	insertSelect(clickedId)
	$('select[name="colorpicker"]').simplecolorpicker({
	  picker: true
	}).on('change', function() {
	  $("#" + clickedId).css('background-color', $('select[name="colorpicker"]').val());
	  $('select[name="colorpicker"]').simplecolorpicker('destroy');
	  $('select[name="colorpicker"]').remove()
	  $('#' + clickedId).removeClass('focusCell')
	  currentCellId = ""
	});
	
}

function insertSelect(id) {
	log(id)
	var template = '<select id="' + id + '-select" name="colorpicker"> \
					<option value="#ffffff">White</option> \
					<option value="#7bd148">Green</option> \
					<option value="#5484ed">Bold blue</option> \
					<option value="#a4bdfc">Blue</option> \
					<option value="#46d6db">Turquoise</option> \
					<option value="#7ae7bf">Light green</option> \
					<option value="#51b749">Bold green</option> \
					<option value="#fbd75b">Yellow</option> \
					<option value="#ffb878">Orange</option> \
					<option value="#ff887c">Red</option> \
					<option value="#dc2127">Bold red</option> \
					<option value="#dbadff">Purple</option> \
					<option value="#e1e1e1">Gray</option> \
					</select>'
	document.getElementById(id).innerHTML = template
	var cellBackground = $('#' + id).css('background-color')
	if (cellBackground != "#ffffff") {
		var select = document.getElementById(id + '-select')
		select.value = cellBackground
	}
}


function setGridSize() {
	var height = $(document).height() - $('navbar').height()
	$('.grid-container').css('height', height.toString())
	$('.grid-square').css('height', height.toString())
	$('.grid-square').css('width', height.toString())

	return height
}

function loadGrid(height) {
	createDivs(height)
}

function createDivs(height) {
	var i = 0
	var j = 0
	var limit = 20
	var size = parseInt(height / 20)

	for (i = 0; i < 20; i++) {
		var divRow = document.createElement("Div");
		divRow.id = "grid-row-" + i;
		divRow.className = "grid-row";
		divRow.style.width = "100%";
		divRow.style.height = size.toString() + "px";

		document.getElementById('grid').appendChild(divRow)

		for (j = 0; j < 20; j++) {
			var divElement = document.createElement("Div");
			divElement.id = "cell-" + (i * 20 + j);
			divElement.className = "grid-cell";
			divElement.style.textAlign = "center";
			divElement.style.width = size.toString() + "px";
			divElement.style.height = size.toString() + "px";

			// var paragraph = document.createElement("P");
			// var text = document.createTextNode((i * 20 + j));
			// paragraph.appendChild(text);
			// divElement.appendChild(paragraph);

			document.getElementById('grid-row-' + i).appendChild(divElement)
		}
	}

}

function log(s) {
	console.log(s)
}