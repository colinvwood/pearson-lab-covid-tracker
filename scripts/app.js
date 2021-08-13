import { renderTree } from "./renderTree.js";

async function fetchText() {
	let response = await fetch('http://localhost:8080/tree.nwk');
	return await response.text();
}

let newickString = await fetchText();
renderTree(newickString);
