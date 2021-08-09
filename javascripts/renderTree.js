const parseNewickFile = require('./readNewick');

async function renderTree() {
	let treeData = await parseNewickFile();

	// temporary assumptions: branch lengths present, no non-leaf node labels,
	// no polytomy
	if (!treeData.hasBranchLengths || treeData.hasNonLeafNodeLabels) {
		throw "No branch lengths or non-leaf nodes are labeled";
	}

	// find svg start position for y-coordinate given 100 x 100 viewPort
	let startYPosition = (treeData.numLeavesLeftOfRoot / treeData.numLeafNodes) * 100;

	// find height (y-coordinate) of each leaf node
	let leafNodeContainerHeight = 100 / treeData.numLeafNodes;

	console.log(leafNodeContainerHeight);
}

renderTree();