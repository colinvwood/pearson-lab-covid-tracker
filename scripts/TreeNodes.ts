export class TreeNode {
	public parent: any;
	public distanceFromParent: number;

	// start and end positions in newick string, the end position should always
	// be the last number in offset number (aka distance from parent)
	public startPosition: number;
	public endPosition: number;

	constructor(parent: any, distanceFromParent: number, startPosition: number, endPosition: number) {
		this.parent = parent;
		this.distanceFromParent = distanceFromParent;
		this.startPosition = startPosition;
		this.endPosition = endPosition;
	}
}

export class LeafTreeNode extends TreeNode {
	public leafName: string;

	constructor(parent: any, distanceFromParent: number, startPosition: number, endPosition: number, leafName: string) {
		super(parent, distanceFromParent, startPosition, endPosition);
		this.leafName = leafName;
	}
}

export class InternalTreeNode extends TreeNode {
	public children: any[] = [];

	constructor(parent: any, distanceFromParent: number, startPosition: number, endPosition: number) {
		super(parent, distanceFromParent, startPosition, endPosition);
	}
}


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
