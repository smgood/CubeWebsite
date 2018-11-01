function Swap (scrollManager, wall, secondaryImage, aspectRatioDiff, start, end) {

    var animationRequest, scrollDist, cubes, cubeSize, dimensions;
    var swapMap;

    init ();

    function init () {
        cubes = wall.getCubes();
        cubeSize = wall.getCubeSize();
        dimensions = wall.getDimensions();
        var secondaryImageInfo = new SecondaryImageInfo (aspectRatioDiff, dimensions);

        var availablePositions = [];
        for (var i = 0; i < dimensions.columns; i++) {
            for (var j = 0; j < dimensions.rows; j++) {
                availablePositions.push(new THREE.Vector2(i,j));
            }
        }

        swapMap = [];
        for (var i = 0; i < dimensions.columns; i++) {
            var column = []
            for (var j = 0; j < dimensions.rows; j++) {
                var randomCoord = Math.floor(Math.random() * availablePositions.length);
                var secondImagePos = availablePositions[randomCoord];
                availablePositions.splice(randomCoord, 1);
                cubes[i][j].addSecondaryImage(secondaryImage, secondaryImageInfo.getCropInfo(secondImagePos), side.back);

                var yRotation = Math.floor((Math.random() - 0.5) * 4) / 2;
                var xRotation = Math.floor((Math.random() - 0.5) * 2);
                if (yRotation % 1 == 0) {
                    xRotation += Math.random() < 0.5 ? -0.5 : 0.5;
                }
                var zRotation = Math.floor((Math.random() - 0.5) * 2);
                if (xRotation % 1 != 0) {
                    zRotation += Math.random() < 0.5 ? -0.5 : 0.5;
                }

                column.push({
                    destination: secondImagePos
                        .sub(new THREE.Vector2(i, j))
                        .multiply(new THREE.Vector2(cubeSize.x, cubeSize.y)),
                    scrollOffset: Math.random(),
                    zOffset: (Math.random()) * -5,
                    rotation: new THREE.Vector3(xRotation, yRotation, zRotation)
                });
            }
            swapMap.push(column);
        }
    };

    function animate () {
        if (scrollDist != scrollManager.getRelativeScrollDistance(start, end, 2)) {
            scrollDist = scrollManager.getRelativeScrollDistance (start, end, 2);
            for (var i = 0; i < dimensions.columns; i++) {
                for (var j = 0; j < dimensions.rows; j++) {
                    swapAnimation (i, j);
                }
            }
        }

        animationRequest = requestAnimationFrame( animate );
    };

    function swapAnimation (i, j) {
        var cubeInfo = swapMap[i][j];
        var animationProgress = scrollDist - cubeInfo.scrollOffset;
        if (animationProgress < 0){
            cubes[i][j].setOriginalPosition();
            cubes[i][j].setOriginalRotation();
        } else if (animationProgress < 1) {
            cubes[i][j].setPositionFromOriginal(
                new THREE.Vector3(
                    cubeInfo.destination.x * animationProgress,
                    cubeInfo.destination.y * animationProgress,
                    Math.sin(animationProgress * Math.PI) * cubeInfo.zOffset
                )
            );
            cubes[i][j].setRotation (
                cubeInfo.rotation.clone().multiplyScalar(2*Math.PI*animationProgress)
            );
        } else {
            cubes[i][j].setPositionFromOriginal(
                new THREE.Vector3(cubeInfo.destination.x, cubeInfo.destination.y, 0)
            );
            cubes[i][j].setRotation(
                new THREE.Vector3(0, Math.PI, 0)
            );
        }
    };

    this.play = function () {
        animationRequest = requestAnimationFrame( animate );
    };

    this.stop = function () {
        cancelAnimationFrame( animationRequest );
    };
};
