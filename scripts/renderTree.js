import { parseNewickFile, getNextNode } from "./parseNewickFile.js";
import { findLeavesLeftOfRoot } from "./findLeavesLeftOfRoot.js";

export async function renderTree(newickString) {

	// parse newick string retrieved from uploaded file
	let treeData = await parseNewickFile(newickString);

	// temporary assumptions: branch lengths present, no non-leaf node labels,
	// no polytomy
	if (!treeData.hasBranchLengths || treeData.hasNonLeafNodeLabels) {
		throw "No branch lengths or non-leaf nodes are labeled";
	}

	// find svg start position for y-coordinate given 100 x 100 viewPort
	let startYPosition = (findLeavesLeftOfRoot(newickString, 1) / treeData.numLeafNodes) * 100;

	// find height (y-coordinate) of each leaf node
	let leafNodeContainerHeight = 100 / treeData.numLeafNodes;

	console.log(startYPosition);

	let x = getNextNode(newickString, 22);
	console.log(x);
	
	var tree = SVG().addTo('.svg-container');
	tree.viewbox(0, 0, 100, 100);

	
	tree.path('M 10 10 V 25').attr({'stroke-width:': 2, 'stroke': '#000'});

}
