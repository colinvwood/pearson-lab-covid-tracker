import { TreeNode, InternalTreeNode, LeafTreeNode } from "./TreeNodes.ts";

export function parseNewickFile(newickString: string): InternalTreeNode {
	try {

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
	catch (error) {
		console.log('Error reading newick file.');
	}
}


/**
 * @param newickString - full newick string
 * @param position - current character position in string, must be at a '('
 */
function getChildNodes(currentNode: InternalTreeNode, newickString: string, position: number, recursionLevel: number): void {
	console.log("entering getChildNodes(), recursion level: ", recursionLevel);
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
			if (childNode.constructor.name == "InternalTreeNode") {
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