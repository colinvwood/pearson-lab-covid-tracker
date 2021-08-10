export function findLeavesLeftOfRoot(newickString) {

	let numLeavesLeftOfRoot;

	let openeningParenCounter = 0, closingParenCounter = 0;
	let leftSubStr = '';
	for (let i=1; i<newickString.length; i++) {
		if (i == 1 && newickString.charAt(i) != '(') {
			numLeavesLeftOfRoot = 1;
			break;
		}
		if (openeningParenCounter > 1 && openeningParenCounter == closingParenCounter) {
			break;
		}
		if (newickString.charAt(i) == '(') {
			openeningParenCounter++;
		} 
		else if (newickString.charAt(i) == ')') {
			closingParenCounter++;
		}

		leftSubStr += newickString.charAt(i);
	}

	if (numLeavesLeftOfRoot != 1) {
		let leafNodePattern = /[\(,][a-zA-Z0-9:.\-_'*]+(?=[\),])/g;
		numLeavesLeftOfRoot = (leftSubStr.match(leafNodePattern) || []).length;
	}

	return numLeavesLeftOfRoot;
}