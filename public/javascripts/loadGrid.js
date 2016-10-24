'use strict';

$(document).ready(function () {
	var gridSize = setGridSize();
	loadGrid(gridSize);
	colourInGrid(getUserIp); //callback so http requests don't crossover
});

function setGridSize() {
	var height = $(document).height()
	$('.grid-container').css('height', height.toString())
	$('.grid-square').css('height', height.toString())
	$('.grid-square').css('width', height.toString())

	return height
}

function loadGrid(height) {
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

			document.getElementById('grid-row-' + i).appendChild(divElement)
		}
	}
}

function colourInGrid(callback) {
	var http = new XMLHttpRequest();
	var populatedCells = {};

	http.onreadystatechange = function() {
		if (http.readyState === 4) {
      		if (http.status === 200) {
				populatedCells = JSON.parse(http.responseText);
				

				var cellIds = Object.keys(populatedCells);

				for (var i = 0; i < cellIds.length; i ++) {
					var cellId = cellIds[i];
					$("#" + cellId).css('background-color', populatedCells[cellId].colour);
				}
			} else {
				console.log("error!");
			}
			callback();
    	}
	}

	http.open("GET", "/retrievePrepopulated/", true);
	http.send();

}

function getUserIp() {
	var http = new XMLHttpRequest();
	http.onreadystatechange = function() {
		if (http.readyState === 4) {
	      if (http.status === 200) {
	      	$('#ip').text(JSON.parse(http.responseText).ip);
	      }
	    }
	}

	http.open("GET", "https://api.ipify.org?format=json", true);
	http.send();
}


