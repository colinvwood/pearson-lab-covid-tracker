import { InternalTreeNode, LeafTreeNode } from "./TreeNodes.ts";

export function parseNewickString(newickString: string): InternalTreeNode {

	// remove newline characters and spaces if present
	newickString = newickString.split('\n').join('');
	newickString = newickString.split('\r').join('');
	newickString = newickString.split(' ').join('');

	// determine whether branch lengths are present
	let branchLengthPattern = /\):[.0-9]/;
	let hasBranchLengths: boolean = branchLengthPattern.test(newickString);

	// determine whether non-leaf nodes are labeled
	let nonLeafNodeLabelPattern = /\)[A-Z]/;
	let hasNonLeafNodeLabels: boolean = nonLeafNodeLabelPattern.test(newickString);

	// determine number of leaf nodes
	let leafNodePattern = /[\(,][a-zA-Z0-9:.\-_'*]+(?=[\),])/g;
	let numLeafNodes: number = (newickString.match(leafNodePattern) || []).length;

	// root node has no parent
	let rootNode: InternalTreeNode = new InternalTreeNode(null, 0, 0, newickString.length - 1);

	getChildNodes(rootNode, newickString, 0, 1);

	return rootNode;
}
/*
let myRootNode = parseNewickString("((A:1,(B:2,F:7):1):3,(C:3,(E:0,F:0):7):5);");
console.log(myRootNode);
*/

/**
 * @param newickString - full newick string
 * @param position - current character position in string, must be at a '('
 */
function getChildNodes(currentNode: InternalTreeNode, newickString: string, position: number, recursionLevel: number): void {
	//console.log("entering getChildNodes(), recursion level: ", recursionLevel);
	//console.log("current node", currentNode);
	if (newickString.charAt(position) != '(') {
		throw "Not at the beginning of an internal node";
	}

	let children: any[] = [];
	if (newickString.charAt(position) == '(') {
		// find all children at current level
		position++;
		while (true) {
			if (newickString.charAt(position) == '(') {
				let internalNodeObject = parseThroughInternalNode(newickString, position, currentNode);
				children.push(internalNodeObject);
				position = internalNodeObject.endPosition + 1;
			}
			else {
				let leafNodeObject = parseThroughLeafNode(newickString, position, currentNode);
				children.push(leafNodeObject);
				position = leafNodeObject.endPosition + 1;
			}

			if (newickString.charAt(position) == ',') {
				position++;
				continue;
			} 
			else {
				break;
			}
		}
		
		currentNode.children = children;

		// recurse for each non-leaf child
		for (const childNode of children) {
			if (isInternalTreeNode(childNode)) {
				getChildNodes(childNode, newickString, childNode.startPosition, recursionLevel + 1);
			}
		}
	}
}
/*
let tempNode = new InternalTreeNode(null, 0, 0, 99);
getChildNodes(tempNode, "((A:1,(B:2,F:7):1):3,(C:3,(E:0,F:0):7):5);", 0, 1);
*/

/**
 * @param newickString - full newick string
 * @param position - integer position in newick string, must be at a '('
 * @returns { InternalTreeNode }
 */
function parseThroughInternalNode(newickString: string, position: number, parentNode: InternalTreeNode): InternalTreeNode {
	if (newickString.charAt(position) != '(') {
		throw "Not at internal node";
	}

	let startPosition:number = position;
	let numOpeningParens = 0, numClosingParens = 0;
	while (numOpeningParens != numClosingParens || numOpeningParens == 0) {
		if (newickString.charAt(position) == '(') {
			numOpeningParens++;
		}
		if (newickString.charAt(position) == ')') {
			numClosingParens++;
		}
		position++;
	}

	let distanceFromParentString: string = ''
	if (newickString.charAt(position) == ':') {
		position++;
		while ("(),".indexOf(newickString.charAt(position)) == -1) {
			distanceFromParentString += newickString.charAt(position);
			position++;
		}
	}
	else {
		throw "Expecting newick distance";
	}

	let endPosition: number = position - 1;
	let distanceFromParent: number = parseFloat(distanceFromParentString);
	return new InternalTreeNode(parentNode, distanceFromParent, startPosition, endPosition);
}

/**
 * 
 * @param newickString - full newick string
 * @param position - integer position in newick string, must be at first character 
 * of leaf node
 * @returns { LeafTreeNode }
 */
function parseThroughLeafNode(newickString: string, position: number, parentNode: InternalTreeNode): LeafTreeNode {
	if ("():,;".indexOf(newickString.charAt(position)) != -1) {
		throw "Not at leaf node";
	}

	let startPosition: number = position;
	let leafName:string = ''
	while ("(),:".indexOf(newickString.charAt(position)) == -1) {
		leafName += newickString.charAt(position);
		position++;
	}

	let distanceFromParentString: string = '';
	if (newickString.charAt(position) == ':') {
		position++;
		while ("(),".indexOf(newickString.charAt(position)) == -1) {
			distanceFromParentString += newickString.charAt(position);
			position++;
		}
	}
	else {
		throw "Expecting newick distance";
	}

	let endPosition: number = position - 1;
	let distanceFromParent: number = parseFloat(distanceFromParentString);
	return new LeafTreeNode(parentNode, distanceFromParent, startPosition, endPosition, leafName);
}
/*
let tempNode = new InternalTreeNode(null, 0, 0, 99);
let myNode = parseThroughLeafNode("((A:1,(B:2,F:7):1):3);", 7, tempNode);
console.log(myNode.startPosition, myNode.endPosition, myNode.distanceFromParent, myNode.leafName);
*/


/**
 * Tests whether tree node object is an internal node
 * @param treeNode 
 * @returns - boolean indicating whether the tree node object is of type InternalTreeNode
 */
export function isInternalTreeNode(treeNode: any): boolean {
	if (treeNode.constructor.name == 'InternalTreeNode') {
		return true;
	}
	return false;
}

/**
 * Tests whether tree node object is a leaf node
 * @param treeNode 
 * @returns - boolean indicating whether the tree node object is of type LeafTreeNode
 */
export function isLeafTreeNode(treeNode: any): boolean {
	if (treeNode.constructor.name == 'LeafTreeNode') {
		return true;
	}
	return false;
}


export function countLeafChildrenOfNode(treeNode: InternalTreeNode | LeafTreeNode): number {
	let numLeafChildren: number = 0;

	if ( isLeafTreeNode(treeNode) ) {
		numLeafChildren = 1;
	}
	else if ( isInternalTreeNode(treeNode) ) {
		for (const child of (treeNode as InternalTreeNode).children) {
			numLeafChildren += countLeafChildrenOfNode(child);
		}
	}
	return numLeafChildren;
}
/*
let myRootNode = parseNewickString("((A:1,(B:2,(X:3,F:7):4):1):3,(C:3,(E:0,F:0):7):5);");
console.log(countLeafChildrenOfNode(myRootNode));
*/


/**
 * 
 * @param treeNode - current tree node in recursion
 * @returns - maximum depth of tree
 */
export function findMaxDepthOfTree(treeNode: InternalTreeNode | LeafTreeNode): number {
	if (isLeafTreeNode(treeNode)) {
		// dont recurse
		return treeNode.distanceFromParent;
	}
	// otherwise get depth of each subtree
	let childrenDepths: number[] = [];
	for (const child of (treeNode as InternalTreeNode).children) {
		childrenDepths.push(findMaxDepthOfTree(child) + treeNode.distanceFromParent);
	}

	let maxDepth: number = Math.max(...childrenDepths);
	return maxDepth;
}
/*
let myRootNode = parseNewickString("((A:1,(B:2,(X:3,F:7):4):1):3,(C:11,(E:0,F:0):7):5);");
console.log(findMaxDepthOfTree(myRootNode));
*/


export interface svgPosition {
	xPos: number;
	yPos: number;
}

export function drawChildren(
	currentNode: InternalTreeNode | LeafTreeNode, 
	currentPosition: svgPosition, 
	drawObject: any,
	heightOfLeafNode: number,
	lengthOfTreeUnit: number
): void {
	//console.log("entering drawChildren(), currentNode: ", currentNode);
	// draw node circle
	let circleDiameter: number = 10;
	let circle = drawObject.circle(circleDiameter).attr({
		cx: currentPosition.xPos,
		cy: currentPosition.yPos
	});

	if (isLeafTreeNode(currentNode)) {
		//console.log("leaf detected");
		// draw leaf node name, dont recurse
		let text = drawObject.text((currentNode as LeafTreeNode).leafName).attr({
			x: currentPosition.xPos + 10,
			y: currentPosition.yPos + 5
		});
	}
	else {
		//console.log("internal node detected");
		// count children nodes at current node
		let childrenOfCurrentNode: number = countLeafChildrenOfNode(currentNode);

		// initially at the top of the subtree
		let subtreeOffset: number = currentPosition.yPos - (0.5 * childrenOfCurrentNode * heightOfLeafNode);

		for (const child of (currentNode as InternalTreeNode).children) {
			let childLeavesOfChild: number = countLeafChildrenOfNode(child);
			let childYPosition: number = subtreeOffset + (0.5 * childLeavesOfChild * heightOfLeafNode);
			let childXPosition: number = currentPosition.xPos + (child.distanceFromParent * lengthOfTreeUnit);
			//console.log("current xpos: ", currentPosition.xPos, " current ypos: ", currentPosition.yPos);
			//console.log("child xpos: ", childXPosition, " child ypos: ", childYPosition);

			// draw to Y-position vertically
			let yLine = drawObject.line(
				currentPosition.xPos, 
				currentPosition.yPos,
				currentPosition.xPos,
				childYPosition
			).attr({stroke: "black", strokeWidth: 3});

			// draw to X-position horizontally
			let xLine = drawObject.line(
				currentPosition.xPos, 
				childYPosition,
				childXPosition,
				childYPosition
			).attr({stroke: "black", strokeWidth: 1});

			// recurse
			drawChildren(child, {xPos: childXPosition, yPos: childYPosition}, drawObject, heightOfLeafNode, lengthOfTreeUnit);

			// update offset
			subtreeOffset += (childLeavesOfChild * heightOfLeafNode);
		}
	}
}