'use strict';

var currentCellId = ""
var aboutVisible = false;

$(document).ready(function () {
	var gridSize = setGridSize();
	var socket = io();

	$('.grid-cell').click(function (event) {
		if (event.currentTarget.id != currentCellId) {
			focusCell(event.currentTarget.id, socket, selectColour)
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

	socket.on('new pixel', function(pixelData) {
		fillPixel(pixelData);
	})
});

function focusCell(id, socket, callback) {
	$('select[name="colorpicker"]').simplecolorpicker('destroy');
	$('select[name="colorpicker"]').remove()
	$('.grid-cell').removeClass('focusCell')
	$('#' + id).addClass('focusCell')
	currentCellId = id
	callback(id, socket)
}

function selectColour(clickedId, socket) {
	var http = new XMLHttpRequest();
	insertSelect(clickedId)
	$('select[name="colorpicker"]').simplecolorpicker({
	  picker: true
	}).on('change', function() {
		var newColour = $('select[name="colorpicker"]').val();

		var data = {
	  	coords: clickedId.split("-")[1],
	  	colour: newColour.replace("#", ""),
	  	user: document.getElementById("ip").textContent
	  }

	  fillPixel(data);

	  $('select[name="colorpicker"]').simplecolorpicker('destroy');
	  $('select[name="colorpicker"]').remove()
	  $('#' + clickedId).removeClass('focusCell')
	  currentCellId = ""

	  http.open("POST", "/pixel/", true);
		http.setRequestHeader("Content-type", "application/json");

		http.onreadystatechange = function(response) {
			if (http.readyState === 4) {
    		if (http.status === 200) {
					console.log("pixel added!");
					socket.emit('new pixel', data);
				} else {
					console.log(response);
				}
			}
		}

		http.send(JSON.stringify(data));

	});
	
}

function fillPixel(pixelData) {
	var coords = "cell-" + pixelData.coords
	var colour = "#" + pixelData.colour
	var user = pixelData.user
	if ($("#" + coords).css('background-color') != colour && user != $('#ip').text) {
		$("#" + coords).css('background-color', colour);
	}
}

function insertSelect(id) {
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

function log(s) {
	console.log(s)
}