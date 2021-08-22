export function panZoomTree() {
	const zoomInButton = document.querySelector(".zoom-in-button");
	const zoomOutButton = document.querySelector(".zoom-out-button");

	const svgElement = document.querySelector(".tree-svg-container svg");

	zoomInButton.addEventListener("click", function(){zoom(svgElement, "in")});
	zoomOutButton.addEventListener("click", function(){zoom(svgElement, "out")});

	svgElement.addEventListener("mousedown", pan);
	svgElement.ondragstart = function() { return false };
	//svgElement.addEventListener("mousemove", pan);
	//svgElement.addEventListener("mouseup", endPan);
	//svgElement.addEventListener("mouseleave", endPan);

}

function pan(event) {
	console.log("mouse down!", event);
	console.log("initial x and y: ", event.clientX, event.clientY);
	
	const svgElement = document.querySelector(".tree-svg-container svg");

	// get inital click position
	const initialX = event.clientX;
	const initialY = event.clientY;

	// get svg view box coordinates and dimensions
	let viewBox = String( svgElement.getAttribute("viewBox") );
	let viewBoxX = parseInt( viewBox.split(" ")[0] );
	let viewBoxY = parseInt( viewBox.split(" ")[1] );
	let viewBoxWidth = parseInt( viewBox.split(" ")[2] );
	let viewBoxHeight = parseInt( viewBox.split(" ")[3] );

	svgElement.addEventListener("mousemove", handleMouseMove);
	svgElement.addEventListener("mouseup", handleMouseUp, {once: true});
	svgElement.addEventListener("mouseleave", handleMouseLeave, {once: true});

	function handleMouseMove(event) {
		let xChange = 3 * (event.clientX - initialX);
		let yChange = 3 * (event.clientY - initialY);

		svgElement.setAttribute(
			"viewBox",
			`${viewBoxX - xChange} ${viewBoxY - yChange} ${viewBoxWidth} ${viewBoxHeight}`
		);
	}

	function handleMouseUp(event) {
		console.log("mouse up");
		svgElement.removeEventListener("mousemove", handleMouseMove);
		svgElement.removeEventListener("mouseleave", handleMouseLeave);
	}
	function handleMouseLeave(event) {
		console.log("mouse leave");
		svgElement.removeEventListener("mousemove", handleMouseMove);
		svgElement.removeEventListener("mouseup", handleMouseUp);
	}
}



function zoom(svgElement, direction) {
	let viewBox = String( svgElement.getAttribute("viewBox") );

	if (viewBox == "null") {
		// view box defaults to svg height width
		console.log("setting viewBox intially")
		var svgWidth = parseInt( window.getComputedStyle(svgElement).width );
		var svgHeight = parseInt( window.getComputedStyle(svgElement).height );
		svgElement.setAttribute("viewBox", `0 0 ${svgWidth} ${svgHeight}`);

		viewBox = String( svgElement.getAttribute("viewBox") );
	}
	
	// get view box coordinates
	let viewBoxX = parseInt( viewBox.split(" ")[0] );
	let viewBoxY = parseInt( viewBox.split(" ")[1] );
	let viewBoxWidth = parseInt( viewBox.split(" ")[2] );
	let viewBoxHeight = parseInt( viewBox.split(" ")[3] );
	
	// calculate center point of view box
	let centerPoint = calcCenter(viewBoxX, viewBoxY, viewBoxX + viewBoxWidth, viewBoxY + viewBoxHeight);

	let scaleFactor = 1.5;
	
	if (direction == "in") {
		console.log("zooming in, center before: ", centerPoint);
		console.log("coordinates before: (x1, y1, x2, y2) ", viewBoxX, viewBoxY, viewBoxX + viewBoxWidth, viewBoxY + viewBoxHeight);

		viewBoxWidth /= scaleFactor;
		viewBoxHeight /= scaleFactor;

		viewBoxX = centerPoint[0] - (viewBoxWidth / 2);
		viewBoxY = centerPoint[1] - (viewBoxHeight / 2);

		console.log("coordinates after: (x1, y1, x2, y2) ", viewBoxX, viewBoxY, viewBoxX + viewBoxWidth, viewBoxY + viewBoxHeight);
		console.log("center after: ", calcCenter(viewBoxX, viewBoxY, viewBoxX + viewBoxWidth, viewBoxY + viewBoxHeight));

		svgElement.setAttribute(
			"viewBox", 
			`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`
		);
	}
	else if (direction == "out") {;
		console.log("zooming out, center before: ", centerPoint);
		console.log("coordinates before: (x1, y1, x2, y2) ", viewBoxX, viewBoxY, viewBoxX + viewBoxWidth, viewBoxY + viewBoxHeight);
		
		viewBoxWidth *= scaleFactor;
		viewBoxHeight *= scaleFactor;

		viewBoxX = centerPoint[0] - (viewBoxWidth / 2);
		viewBoxY = centerPoint[1] - (viewBoxHeight / 2);

		console.log("coordinates after: (x1, y1, x2, y2) ", viewBoxX, viewBoxY, viewBoxX + viewBoxWidth, viewBoxY + viewBoxHeight);
		console.log("center after: ", calcCenter(viewBoxX, viewBoxY, viewBoxX + viewBoxWidth, viewBoxY + viewBoxHeight));
		
		svgElement.setAttribute(
			"viewBox", 
			`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`
		);
	}
}

function calcCenter(x1, y1, x2, y2) {
	return [(x2 + x1) / 2, (y2 + y1) / 2];
}
