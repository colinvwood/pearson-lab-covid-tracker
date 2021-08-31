export function makeTreePanZoomable() {
	const tree = document.querySelector('.tree-svg');
	const treeContainer = document.querySelector('.tree-svg-container');

	// library dependency included via CDN
	const panzoom = Panzoom(tree, {maxScale: 100});
	panzoom.pan(10, 10);
	panzoom.zoom(1, {animate: true});

	const zoomInButton = document.querySelector('.zoom-in-button');
	const zoomOutButton = document.querySelector('.zoom-out-button');
	zoomInButton.addEventListener('click', panzoom.zoomIn);
	zoomOutButton.addEventListener('click', panzoom.zoomOut);

	treeContainer.addEventListener('wheel', panzoom.zoomWithWheel);
}
