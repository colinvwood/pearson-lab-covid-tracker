const fs = require('fs');
const findLeavesLeftOfRoot = require('./findLeavesLeftOfRoot');

function readNewickFile(fileName) {
	return new Promise(function (resolve, reject) {
		fs.readFile(fileName, 'utf-8', function(err, data) {
			if (err) {
				reject(err);
			} 
			else {
				resolve(data);
			}
		});
	});
}

async function parseNewickFile() {
	try {
		let newickString = await readNewickFile('./../all.nwk');

		// remove newline characters and spaces if present
		newickString = newickString.split('\n').join('');
		newickString = newickString.split('\r').join('');
		newickString = newickString.split(' ').join('');

		// determine whether branch lengths are present
		let branchLengthPattern = /\):[.0-9]/;
		let hasBranchLengths = branchLengthPattern.test(newickString);

		// determine whether non-leaf nodes are labeled
		let nonLeafNodeLabelPattern = /\)[A-Z]/;
		let hasNonLeafNodeLabels = nonLeafNodeLabelPattern.test(newickString);

		// determine number of leaf nodes
		let leafNodePattern = /[\(,][a-zA-Z0-9:.\-_'*]+(?=[\),])/g;
		let numLeafNodes = (newickString.match(leafNodePattern) || []).length;

		// find leaf nodes on left (above) of root
		let numLeavesLeftOfRoot = findLeavesLeftOfRoot(newickString);

		// returns as resolved promise
		return {
			newickString: newickString,
			hasBranchLengths: hasBranchLengths,
			hasNonLeafNodeLabels: hasNonLeafNodeLabels,
			numLeafNodes: numLeafNodes,
			numLeavesLeftOfRoot: numLeavesLeftOfRoot,
		}
		
	}
	catch (error) {
		console.log('Error reading newick file.');
	}
	

}

module.exports = parseNewickFile;


