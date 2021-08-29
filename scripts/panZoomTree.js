/**
 * ABANDONED
 */

export function panZoomTree() {
	const zoomInButton = document.querySelector(".zoom-in-button");
	const zoomOutButton = document.querySelector(".zoom-out-button");

	const svgContainer = document.querySelector(".tree-svg-container");
	const svgElement = document.querySelector(".tree-svg");

	zoomInButton.addEventListener("click", function(){zoom(svgElement, svgContainer, "in")});
	zoomOutButton.addEventListener("click", function(){zoom(svgElement, svgContainer, "out")});

	svgContainer.addEventListener("mousedown", pan);
	svgContainer.ondragstart = function() { return false };
	svgElement.ondragstart = function() { return false };

}

function pan(event) {
	const svgContainer = document.querySelector(".tree-svg-container");
	const svgElement = document.querySelector(".tree-svg");
	
	let transformMatrix = window.getComputedStyle(svgElement).transform;
	let transformMatrixArray = [];
	for (const string of transformMatrix.split(",")) {
		transformMatrixArray.push( parseFloat( string.replace(/[^\d.-]/g, '') ) );
	}

	// get inital click position
	const initialX = event.clientX;
	const initialY = event.clientY;

	svgContainer.addEventListener("mousemove", handleMouseMove);
	svgContainer.addEventListener("mouseup", handleMouseUp, {once: true});
	svgContainer.addEventListener("mouseleave", handleMouseLeave, {once: true});

	function handleMouseMove(event) {
		let xChange = event.clientX - initialX;
		let yChange = event.clientY - initialY;

		console.log("matrix before pan: ", svgElement.style.transform);
		// matrix has structure: matrix ( [scaleX], [skewY], [skewX], [scaleY], [translateX], [translateY] 
		svgElement.style.transform = `matrix(
			${transformMatrixArray[0]}, 
			0,
			0,
			${transformMatrixArray[3]},
			${transformMatrixArray[4] + xChange},
			${transformMatrixArray[5] + yChange}
		)`;

		console.log("matrix after pan: ", svgElement.style.transform);
		
	}

	function handleMouseUp(event) {
		svgContainer.removeEventListener("mousemove", handleMouseMove);
		svgContainer.removeEventListener("mouseleave", handleMouseLeave);
	}
	function handleMouseLeave(event) {
		svgContainer.removeEventListener("mousemove", handleMouseMove);
		svgContainer.removeEventListener("mouseup", handleMouseUp);
	}
}



function zoom(svgElement, svgContainer, direction) {

	// matrix has structure: matrix ( [scaleX], [skewY], [skewX], [scaleY], [translateX], [translateY] )
	let transformMatrix = window.getComputedStyle(svgElement).transform;
	let transformMatrixArray = [];
	for (const string of transformMatrix.split(",")) {
		transformMatrixArray.push( parseFloat( string.replace(/[^\d.-]/g, '') ) );
	}
	
	// find coordinates of container element and tree (svg element)
	const svgElementCoords = svgElement.getBoundingClientRect();
	const svgContainerCoords = svgContainer.getBoundingClientRect();

	const svgContainerCenter = findCenter(
		svgContainerCoords.left,
		svgContainerCoords.top,
		svgContainerCoords.right,
		svgContainerCoords.bottom
	);


	// scaleX and scaleY are always equal
	let scale;
	let scaleFactor = 1.2;
	
	let newSvgElementLeft, newSvgElementTop;
	if (direction == "in") {
		transformMatrixArray[0] === 0 ? scale = scaleFactor : scale = scaleFactor * transformMatrixArray[0];
	}
	else if (direction == "out") {
		transformMatrixArray[0] === 0 ? scale = scaleFactor : scale = (1 / scaleFactor) * transformMatrixArray[0];
	}

	
	svgElement.style.transformOrigin = ``;

	svgElement.style.transform = `matrix(
		${scale}, 
		0, 
		0, 
		${scale}, 
		${transformMatrixArray[4]}, 
		${transformMatrixArray[5]}
	)`;
}


function findCenter(x1, y1, x2, y2) {
	return {
		x: (x1 + x2) / 2,
		y: (y1 + y2) / 2
	};
}


function adjustTree(direction, svgElement) {

}
