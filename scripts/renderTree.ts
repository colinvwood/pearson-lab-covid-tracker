import { 
	parseNewickString, 
	countLeafChildrenOfNode,  
	isLeafTreeNode,
	findMaxDepthOfTree,
	svgPosition,
	drawChildren
} from "./parseNewickString.ts";

// skypack CDNs (see www.skypack.dev)
import * as svg from "https://cdn.skypack.dev/@svgdotjs/svg.js";

/**
 * 
 * @param newickString 
 */
export function renderTree(newickString: string): void {

	//  parse newick string into tree data structure
	let rootNode = parseNewickString(newickString);

	// find number of leaf nodes in tree, and thus height of svg viewport given padding inside each leaf
	let numLeavesInTree: number = countLeafChildrenOfNode(rootNode);
	let heightOfLeafNode: number = 50;
	let svgViewPortHeight: number = heightOfLeafNode * numLeavesInTree + (2 * heightOfLeafNode); 

	// find depth of the tree, and thus width of svg viewport given padding
	let maxDepthOfTree: number = findMaxDepthOfTree(rootNode);
	let lengthOfTreeUnit: number = 1;
	let svgViewPortWidth: number = (maxDepthOfTree * lengthOfTreeUnit) + 350;

	// find y-coordinate of root to begin drawing, the (x,y) origin in the svg plane is top-left corner
	let numLeavesAboveRoot: number;
	if ( rootNode.children.length == 2 && isLeafTreeNode(rootNode.children[0]) ) {
		numLeavesAboveRoot = 1;
	}
	else if (rootNode.children.length > 2) {
		// polytomy; root positioning ambiguous
		numLeavesAboveRoot = numLeavesInTree / 2;
	}
	else {
		numLeavesAboveRoot = countLeafChildrenOfNode(rootNode.children[0]);
	}

	let rootYCoordinate: number = numLeavesAboveRoot * heightOfLeafNode;
	let rootXCoordinate: number = 25;

	/**
	 * The TREE LAYOUT is now such that:
	 * 	- each leaf node is approx. 50 svg units (px) vertically apart 
	 * 	- 1 unit of tree distance is equal to 1 svg unit
	 * 	- there are 25 units worth of padding to left and right of the tree, and
	 * 	  200 units left in which to put the names of leaf nodes (25 | tree | leaf names(200) | 25)
	 */
	
	// create svg element
	let draw = svg.SVG()
		.addTo('.tree-svg-container');
		//.size(svgViewPortWidth, svgViewPortHeight)

	// draw tree
	drawChildren(rootNode, 
		{xPos: rootXCoordinate, yPos: rootYCoordinate},
		draw,
		heightOfLeafNode,
		lengthOfTreeUnit
	);

	console.log("max depth: ", maxDepthOfTree, " num leaves: ", numLeavesInTree);
	console.log("height of tree: ", svgViewPortHeight, " width: ", svgViewPortWidth);
	console.log("num leaves above root ", numLeavesAboveRoot);
	console.log("rootXPos: ", rootXCoordinate, " rootyPos: ", rootYCoordinate);
	console.log(rootNode);

}
