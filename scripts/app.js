import { renderTree } from "./bundle.js";
import { makeTreePanZoomable } from "./makeTreePanZoomable.js";

async function fetchText() {
	let response = await fetch('http://localhost:8080/tree.nwk');
	return await response.text();
}

let newickString = await fetchText();
renderTree(newickString);

makeTreePanZoomable();