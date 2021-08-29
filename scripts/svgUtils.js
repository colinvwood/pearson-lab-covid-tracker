export function drawLine(svgElement, x1, y1, x2, y2, strokeColor, strokeWidth) {
	// must use svg namespace URI
	const line = document.createElementNS("http://www.w3.org/2000/svg", "line");

	line.setAttribute("x1", x1);
	line.setAttribute("y1", y1);
	line.setAttribute("x2", x2);
	line.setAttribute("y2", y2);
	line.setAttribute("stroke", strokeColor);
	line.setAttribute("strokeWidth", strokeWidth);

	svgElement.appendChild(line);
}

export function drawCircle(svgElement, radius, x, y, strokeColor) {
	// must use svg namespace URI
	const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");

	circle.setAttribute("r", radius);
	circle.setAttribute("cx", x);
	circle.setAttribute("cy", y);
	circle.setAttribute("stroke", strokeColor);

	svgElement.appendChild(circle);
}

export function drawText(svgElement, x, y, dx, dy, innerText) {
	// must use svg namespace URI
	const text = document.createElementNS("http://www.w3.org/2000/svg", "text");

	text.innerHTML = innerText;
	text.setAttribute("x", x);
	text.setAttribute("y", y);
	text.setAttribute("dx", dx);
	text.setAttribute("dy", dy);

	svgElement.appendChild(text);
}