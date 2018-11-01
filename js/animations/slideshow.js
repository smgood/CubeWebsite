function Slideshow (scrollManager, wall, secondaryImage, aspectRatioDiff, start, end) {

    var animationRequest, scrollDist, cubes, dimensions;
    var slideshowMap, maxAnimationTime;

    init ();

    function init () {
        cubes = wall.getCubes();
        dimensions = wall.getDimensions();
        maxAnimationTime = dimensions.rows > dimensions.columns
            ? dimensions.rows + 1
            : dimensions.columns + 1;
        var secondaryImageInfo = new SecondaryImageInfo (aspectRatioDiff, dimensions);

        slideshowMap = [];
        for (var i = 0; i < dimensions.columns; i++) {
            var column = []
            for (var j = 0; j < dimensions.rows; j++) {
                cubes[i][j].addSecondaryImage(secondaryImage, secondaryImageInfo.getCropInfo(new THREE.Vector2(i,j)), side.left);
                column.push(Math.abs(i-(dimensions.rows-j-1)));
                // other direction
                // column.push(Math.abs(i-j));
            }
            slideshowMap.push(column);
        }
    };

    function animate () {
        if (scrollDist != scrollManager.getRelativeScrollDistance(start, end, maxAnimationTime)) {
            scrollDist = scrollManager.getRelativeScrollDistance (start, end, maxAnimationTime);
            for (var i = 0; i < dimensions.columns; i++) {
                for (var j = 0; j < dimensions.rows; j++) {
                    slideshowAnimation (i, j);
                }
            }
        }

        animationRequest = requestAnimationFrame( animate );
    };

    function slideshowAnimation (i, j) {
        var animationProgress = (scrollDist - slideshowMap[i][j])/2;
        if (animationProgress < 0){
            cubes[i][j].setOriginalRotation();
        } else if (animationProgress < 1) {
            cubes[i][j].setRotation (new THREE.Vector3(0, animationProgress * Math.PI/2, 0));
        } else {
            cubes[i][j].setRotation(new THREE.Vector3(0, Math.PI/2, 0));
        }
    };

    this.play = function () {
        animationRequest = requestAnimationFrame( animate );
    };

    this.stop = function () {
        cancelAnimationFrame( animationRequest );
    };
};
