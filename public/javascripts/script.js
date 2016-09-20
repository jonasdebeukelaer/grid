'use strict';

var currentCellId = ""
var aboutVisible = false
var http = new XMLHttpRequest();

$(document).ready(function () {
	var gridSize = setGridSize()
	loadGrid(gridSize);
	colourInGrid();

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
		var newColour = $('select[name="colorpicker"]').val();
	  $("#" + clickedId).css('background-color', newColour);
	  $('select[name="colorpicker"]').simplecolorpicker('destroy');
	  $('select[name="colorpicker"]').remove()
	  $('#' + clickedId).removeClass('focusCell')
	  currentCellId = ""

	  var data = {
	  	coords: clickedId.split("-")[1],
	  	colour: newColour.replace("#", ""),
	  	user: "person"
	  }

	  console.log(data);
	  http.open("POST", "/pixel/", true);
		http.setRequestHeader("Content-type", "application/json");

		http.success = function(response) {
			console.log("pixel added!");
			console.log(response);
		}

		http.fail = function(response) {
			console.log(response);
		}

		http.send(JSON.stringify(data));

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
	var height = $(document).height()
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
	var size = parseInt(height / limit)

	for (i = 0; i < limit; i++) {
		var divRow = document.createElement("Div");
		divRow.id = "grid-row-" + i;
		divRow.className = "grid-row";
		divRow.style.width = "100%";
		divRow.style.height = size.toString() + "px";

		document.getElementById('grid').appendChild(divRow)

		for (j = 0; j < limit; j++) {
			var divElement = document.createElement("Div");
			divElement.id = "cell-" + (i * limit + j);
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

function colourInGrid() {
	var populatedCells = {};

	http.onreadystatechange = function() {
		if (http.readyState === 4) {
      if (http.status === 200) {
        console.log("success!");
				populatedCells = JSON.parse(http.responseText);
				
				console.log(populatedCells);

				var cellIds = Object.keys(populatedCells);
				console.log(cellIds);

				for (var i = 0; i < cellIds.length; i ++) {
					var cellId = cellIds[i];
					console.log(cellId + "\t" + populatedCells[cellId].colour);
					$("#" + cellId).css('background-color', populatedCells[cellId].colour);
				}
			} else {
				console.log("error!");
			}
    } else {
      console.log("waiting...");
    }
	}

	http.open("GET", "/retrievePrepopulated/", true);
	http.send();

}