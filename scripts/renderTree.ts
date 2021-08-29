import { 
	parseNewickString, 
	countLeafChildrenOfNode,  
	findMaxDepthOfTree,
}
from "./parseNewickString.ts";

import {
	InternalTreeNode,
	LeafTreeNode,
	isLeafTreeNode
}
from "./TreeNodes.ts";

import {
	drawLine,
	drawCircle,
	drawText
}
from "./svgUtils.js";


/**
 * 
 * @param newickString 
 */
export function renderTree(newickString: string): void {

	//  parse newick string into tree data structure
	let rootNode = parseNewickString(newickString);

	// find number of leaf nodes in tree, and thus height of svg viewport given padding inside each leaf
	let numLeavesInTree: number = countLeafChildrenOfNode(rootNode);

	// get height and width of svg area for viewbox
	let svgElement = document.querySelector(".tree-svg");
	let svgElementStyle = window.getComputedStyle(svgElement as Element);
	let svgElementWidth = parseFloat(svgElementStyle.width);
	let svgElementHeight = parseFloat(svgElementStyle.height);
	console.log("inside render tree, width, height: ", svgElementWidth, svgElementHeight);

	// calculate height of single leaf node given padding
	let xPadding: number = 1.05;
	let heightOfLeafNode: number = svgElementHeight / ( xPadding * numLeavesInTree ); 

	// find depth of the tree, and thus width of svg viewport given padding
	let maxDepthOfTree: number = findMaxDepthOfTree(rootNode);
	let lengthOfTreeUnit: number = (svgElementWidth - 300) / maxDepthOfTree;

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

	// set coordinates of root node, from which to begin drawing
	let yPadding: number = 0.01;
	let rootYCoordinate: number = xPadding * numLeavesAboveRoot * heightOfLeafNode;
	let rootXCoordinate: number = yPadding * svgElementWidth;

	// draw tree
	drawChildren(rootNode, 
		{xPos: rootXCoordinate, yPos: rootYCoordinate},
		heightOfLeafNode,
		lengthOfTreeUnit,
		svgElement
	);

	console.log("max depth: ", maxDepthOfTree, " num leaves: ", numLeavesInTree);
	console.log("num leaves above root ", numLeavesAboveRoot);
	console.log("height of one tree leaf: ", heightOfLeafNode);
	console.log("length of one tree unit: ", lengthOfTreeUnit);
	console.log("rootXPos: ", rootXCoordinate, " rootyPos: ", rootYCoordinate);
	console.log(rootNode);

}


interface svgPosition {
	xPos: number;
	yPos: number;
}

/**
 * Recursively draw all nodes in the tree
 * 
 * @param currentNode - node at current recursion level
 * @param currentPosition - x and y positions of current node
 * @param drawObject - reference to the SVG.js draw object
 * @param heightOfLeafNode 
 * @param lengthOfTreeUnit 
 */
function drawChildren(
	currentNode: InternalTreeNode | LeafTreeNode, 
	currentPosition: svgPosition, 
	heightOfLeafNode: number,
	lengthOfTreeUnit: number,
	svgElement: any
): void {

	// used for dynamic circle and line sizes
	let svgElementWidth: number = parseFloat( window.getComputedStyle(svgElement as Element).width);

	// draw node circle
	let circleRadius: number = 0.1;
	drawCircle(
		svgElement,
		circleRadius,
		currentPosition.xPos,
		currentPosition.yPos,
		"black"
	);

	if (isLeafTreeNode(currentNode)) {
		// draw leaf node name, dont recurse
		drawText(
			svgElement,
			currentPosition.xPos,
			currentPosition.yPos,
			`${0.005 * svgElementWidth}`,
			0,
			(currentNode as LeafTreeNode).leafName
		);
	}
	else {
		// count children nodes at current node
		let childrenOfCurrentNode: number = countLeafChildrenOfNode(currentNode);

		// initially at the top of the subtree
		let subtreeOffset: number = currentPosition.yPos - (0.5 * childrenOfCurrentNode * heightOfLeafNode);

		

		for (const child of (currentNode as InternalTreeNode).children) {
			let childLeavesOfChild: number = countLeafChildrenOfNode(child);
			let childYPosition: number = subtreeOffset + (0.5 * childLeavesOfChild * heightOfLeafNode);
			let childXPosition: number = currentPosition.xPos + (child.distanceFromParent * lengthOfTreeUnit);

			// draw to Y-position vertically
			drawLine(
				svgElement,
				currentPosition.xPos,
				currentPosition.yPos,
				currentPosition.xPos,
				childYPosition,
				"black",
				"0.2"
			);

			// draw to X-position horizontally
			drawLine(
				svgElement,
				currentPosition.xPos,
				childYPosition,
				childXPosition,
				childYPosition,
				"black",
				"0.2"
			);

			// recurse
			drawChildren(child, {xPos: childXPosition, yPos: childYPosition}, heightOfLeafNode, lengthOfTreeUnit, svgElement);

			// update offset
			subtreeOffset += (childLeavesOfChild * heightOfLeafNode);
		}
	}
}
