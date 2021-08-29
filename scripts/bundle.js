class TreeNode {
    parent;
    distanceFromParent;
    startPosition;
    endPosition;
    constructor(parent, distanceFromParent, startPosition, endPosition){
        this.parent = parent;
        this.distanceFromParent = distanceFromParent;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
    }
}
class LeafTreeNode extends TreeNode {
    leafName;
    constructor(parent1, distanceFromParent1, startPosition1, endPosition1, leafName){
        super(parent1, distanceFromParent1, startPosition1, endPosition1);
        this.leafName = leafName;
    }
}
class InternalTreeNode extends TreeNode {
    children = [];
    constructor(parent2, distanceFromParent2, startPosition2, endPosition2){
        super(parent2, distanceFromParent2, startPosition2, endPosition2);
    }
}
function isInternalTreeNode(treeNode) {
    if (treeNode.constructor.name == 'InternalTreeNode') {
        return true;
    }
    return false;
}
function isLeafTreeNode(treeNode) {
    if (treeNode.constructor.name == 'LeafTreeNode') {
        return true;
    }
    return false;
}
function parseNewickString(newickString) {
    newickString = newickString.split('\n').join('');
    newickString = newickString.split('\r').join('');
    newickString = newickString.split(' ').join('');
    let branchLengthPattern = /\):[.0-9]/;
    let hasBranchLengths = branchLengthPattern.test(newickString);
    let nonLeafNodeLabelPattern = /\)[A-Z]/;
    let hasNonLeafNodeLabels = nonLeafNodeLabelPattern.test(newickString);
    let leafNodePattern = /[\(,][a-zA-Z0-9:.\-_'*]+(?=[\),])/g;
    let numLeafNodes = (newickString.match(leafNodePattern) || []).length;
    let rootNode = new InternalTreeNode(null, 0, 0, newickString.length - 1);
    getChildNodes(rootNode, newickString, 0, 1);
    return rootNode;
}
function getChildNodes(currentNode, newickString, position, recursionLevel) {
    if (newickString.charAt(position) != '(') {
        throw "Not at the beginning of an internal node";
    }
    let children = [];
    if (newickString.charAt(position) == '(') {
        position++;
        while(true){
            if (newickString.charAt(position) == '(') {
                let internalNodeObject = parseThroughInternalNode(newickString, position, currentNode);
                children.push(internalNodeObject);
                position = internalNodeObject.endPosition + 1;
            } else {
                let leafNodeObject = parseThroughLeafNode(newickString, position, currentNode);
                children.push(leafNodeObject);
                position = leafNodeObject.endPosition + 1;
            }
            if (newickString.charAt(position) == ',') {
                position++;
                continue;
            } else {
                break;
            }
        }
        currentNode.children = children;
        for (const childNode of children){
            if (isInternalTreeNode(childNode)) {
                getChildNodes(childNode, newickString, childNode.startPosition, recursionLevel + 1);
            }
        }
    }
}
function parseThroughInternalNode(newickString, position, parentNode) {
    if (newickString.charAt(position) != '(') {
        throw "Not at internal node";
    }
    let startPosition3 = position;
    let numOpeningParens = 0, numClosingParens = 0;
    while(numOpeningParens != numClosingParens || numOpeningParens == 0){
        if (newickString.charAt(position) == '(') {
            numOpeningParens++;
        }
        if (newickString.charAt(position) == ')') {
            numClosingParens++;
        }
        position++;
    }
    let distanceFromParentString = '';
    if (newickString.charAt(position) == ':') {
        position++;
        while("(),".indexOf(newickString.charAt(position)) == -1){
            distanceFromParentString += newickString.charAt(position);
            position++;
        }
    } else {
        throw "Expecting newick distance";
    }
    let endPosition3 = position - 1;
    let distanceFromParent3 = parseFloat(distanceFromParentString);
    return new InternalTreeNode(parentNode, distanceFromParent3, startPosition3, endPosition3);
}
function parseThroughLeafNode(newickString, position, parentNode) {
    if ("():,;".indexOf(newickString.charAt(position)) != -1) {
        throw "Not at leaf node";
    }
    let startPosition3 = position;
    let leafName1 = '';
    while("(),:".indexOf(newickString.charAt(position)) == -1){
        leafName1 += newickString.charAt(position);
        position++;
    }
    let distanceFromParentString = '';
    if (newickString.charAt(position) == ':') {
        position++;
        while("(),".indexOf(newickString.charAt(position)) == -1){
            distanceFromParentString += newickString.charAt(position);
            position++;
        }
    } else {
        throw "Expecting newick distance";
    }
    let endPosition3 = position - 1;
    let distanceFromParent3 = parseFloat(distanceFromParentString);
    return new LeafTreeNode(parentNode, distanceFromParent3, startPosition3, endPosition3, leafName1);
}
function countLeafChildrenOfNode(treeNode) {
    let numLeafChildren = 0;
    if (isLeafTreeNode(treeNode)) {
        numLeafChildren = 1;
    } else if (isInternalTreeNode(treeNode)) {
        for (const child of treeNode.children){
            numLeafChildren += countLeafChildrenOfNode(child);
        }
    }
    return numLeafChildren;
}
function findMaxDepthOfTree(treeNode) {
    if (isLeafTreeNode(treeNode)) {
        return treeNode.distanceFromParent;
    }
    let childrenDepths = [];
    for (const child of treeNode.children){
        childrenDepths.push(findMaxDepthOfTree(child) + treeNode.distanceFromParent);
    }
    let maxDepth = Math.max(...childrenDepths);
    return maxDepth;
}
function drawLine(svgElement, x1, y1, x2, y2, strokeColor, strokeWidth) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("stroke", strokeColor);
    line.setAttribute("strokeWidth", strokeWidth);
    svgElement.appendChild(line);
}
function drawCircle(svgElement, radius, x, y, strokeColor) {
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("r", radius);
    circle.setAttribute("cx", x);
    circle.setAttribute("cy", y);
    circle.setAttribute("stroke", strokeColor);
    svgElement.appendChild(circle);
}
function drawText(svgElement, x, y, dx, dy, innerText) {
    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.innerHTML = innerText;
    text.setAttribute("x", x);
    text.setAttribute("y", y);
    text.setAttribute("dx", dx);
    text.setAttribute("dy", dy);
    svgElement.appendChild(text);
}
function renderTree1(newickString) {
    let rootNode = parseNewickString(newickString);
    let numLeavesInTree = countLeafChildrenOfNode(rootNode);
    let svgElement = document.querySelector(".tree-svg");
    let svgElementStyle = window.getComputedStyle(svgElement);
    let svgElementWidth = parseFloat(svgElementStyle.width);
    let svgElementHeight = parseFloat(svgElementStyle.height);
    console.log("inside render tree, width, height: ", svgElementWidth, svgElementHeight);
    let xPadding = 1.05;
    let heightOfLeafNode = svgElementHeight / (xPadding * numLeavesInTree);
    let maxDepthOfTree = findMaxDepthOfTree(rootNode);
    let lengthOfTreeUnit = (svgElementWidth - 300) / maxDepthOfTree;
    let numLeavesAboveRoot;
    if (rootNode.children.length == 2 && isLeafTreeNode(rootNode.children[0])) {
        numLeavesAboveRoot = 1;
    } else if (rootNode.children.length > 2) {
        numLeavesAboveRoot = numLeavesInTree / 2;
    } else {
        numLeavesAboveRoot = countLeafChildrenOfNode(rootNode.children[0]);
    }
    let yPadding = 0.01;
    let rootYCoordinate = xPadding * numLeavesAboveRoot * heightOfLeafNode;
    let rootXCoordinate = yPadding * svgElementWidth;
    drawChildren(rootNode, {
        xPos: rootXCoordinate,
        yPos: rootYCoordinate
    }, heightOfLeafNode, lengthOfTreeUnit, svgElement);
    console.log("max depth: ", maxDepthOfTree, " num leaves: ", numLeavesInTree);
    console.log("num leaves above root ", numLeavesAboveRoot);
    console.log("height of one tree leaf: ", heightOfLeafNode);
    console.log("length of one tree unit: ", lengthOfTreeUnit);
    console.log("rootXPos: ", rootXCoordinate, " rootyPos: ", rootYCoordinate);
    console.log(rootNode);
}
function drawChildren(currentNode, currentPosition, heightOfLeafNode, lengthOfTreeUnit, svgElement) {
    let svgElementWidth = parseFloat(window.getComputedStyle(svgElement).width);
    let circleRadius = 0.1;
    drawCircle(svgElement, circleRadius, currentPosition.xPos, currentPosition.yPos, "black");
    if (isLeafTreeNode(currentNode)) {
        drawText(svgElement, currentPosition.xPos, currentPosition.yPos, `${0.005 * svgElementWidth}`, 0, currentNode.leafName);
    } else {
        let childrenOfCurrentNode = countLeafChildrenOfNode(currentNode);
        let subtreeOffset = currentPosition.yPos - 0.5 * childrenOfCurrentNode * heightOfLeafNode;
        for (const child of currentNode.children){
            let childLeavesOfChild = countLeafChildrenOfNode(child);
            let childYPosition = subtreeOffset + 0.5 * childLeavesOfChild * heightOfLeafNode;
            let childXPosition = currentPosition.xPos + child.distanceFromParent * lengthOfTreeUnit;
            drawLine(svgElement, currentPosition.xPos, currentPosition.yPos, currentPosition.xPos, childYPosition, "black", "0.2");
            drawLine(svgElement, currentPosition.xPos, childYPosition, childXPosition, childYPosition, "black", "0.2");
            drawChildren(child, {
                xPos: childXPosition,
                yPos: childYPosition
            }, heightOfLeafNode, lengthOfTreeUnit, svgElement);
            subtreeOffset += childLeavesOfChild * heightOfLeafNode;
        }
    }
}
export { renderTree1 as renderTree };
