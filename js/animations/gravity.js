function Gravity (scene, wall, transition, dropDistance) {

    // add set duration input
    var animationRequest, scrollDist, cubes, dimensions;
    var dropInfo = [];
    var cubeHeight, cubeAnimation;

    init ();

    function init () {
        cubes = wall.getCubes();
        dimensions = wall.getDimensions();
        cubeHeight = wall.getCubeSize().y;

        var addCubeInfo;
        if (transition == "enter") {
            addCubeInfo = addCubeEnterInfo;
            cubeAnimation = cubeEnterAnimation;
        } else {
            addCubeInfo = addCubeExitInfo;
            cubeAnimation = cubeExitAnimation;
        }

        // get shortest and longest times
        // convert times to (time - shortest) * speed / (longest - shortest)
        for (var i = 0; i < dimensions.columns; i++) {
            var column = [];
            var startTime = 0;
            for (var j = 0; j < dimensions.rows; j++) {
                startTime = addCubeInfo (startTime, column, j);
            }
            dropInfo.push(column);
        }
    };

    function animate () {
        if (scrollDist != scene.getScrollDistance ()) {
            scrollDist = scene.getScrollDistance ();

            for (var i = 0; i < dimensions.columns; i++) {
                for (var j = 0; j < dimensions.rows; j++) {
                    cubeAnimation (i, j);
                }
            }
        }

        animationRequest = requestAnimationFrame( animate );
    };

    function addCubeEnterInfo (startTime, column, j) {
        startTime += (Math.random() + 0.5) * cubeHeight;
        var startHeight = dropDistance - (cubeHeight * j);
        var endTime = startTime + Math.sqrt(startHeight);
        var rotation = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
        column.push({startHeight, startTime, endTime, rotation});
        return startTime;
    }

    function addCubeExitInfo (startTime, column) {
        startTime += Math.random();
        var rotation = new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5);
        column.push({startTime, rotation});
        return startTime;
    }

    function cubeEnterAnimation (x, y) {
        var cubeInfo = dropInfo[x][y];
        if (cubeInfo.startTime > scrollDist) {
            cubes [x][y].setPositionFromOriginal (new THREE.Vector3(0, cubeInfo.startHeight, 0));
            cubes [x][y].setOriginalRotation();
        } else {
            if (cubeInfo.endTime > scrollDist) {
                cubes [x][y].setPositionFromOriginal (new THREE.Vector3(0,(cubeInfo.startHeight - Math.pow(scrollDist - cubeInfo.startTime, 2)), 0));
                cubes [x][y].setRotation(cubeInfo.rotation.clone().multiplyScalar(cubeInfo.endTime - scrollDist));
            } else {
                cubes [x][y].setOriginalPosition();
                cubes [x][y].setOriginalRotation();
            }
        }
    }

    function cubeExitAnimation (x, y) {
        var cubeInfo = dropInfo[x][y];
        if (cubeInfo.startTime > scrollDist) {
            cubes [x][y].setOriginalPosition();
            cubes [x][y].setOriginalRotation();
        } else {
            timeSinceDrop = cubeInfo.startTime - scrollDist;
            cubes [x][y].setPositionFromOriginal (new THREE.Vector3(0, -Math.pow(timeSinceDrop,2), 0));
            cubes [x][y].setRotation(cubeInfo.rotation.clone().multiplyScalar(timeSinceDrop));
        }
    }

    this.play = function () {
        animationRequest = requestAnimationFrame( animate );
    };

    this.stop = function () {
        cancelAnimationFrame( animationRequest );
    };

    this.dispose = function () {

    };
};
