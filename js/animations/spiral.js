function Spiral (scrollManager, wall, secondaryImage, aspectRatioDiff, start, end) {

    var animationRequest, scrollDist, cubes, dimensions;
    var spiralMap, secondaryImageInfo;
    var startTime, endTime, rotationTime;

    init ();

    function init () {
        cubes = wall.getCubes();
        dimensions = wall.getDimensions();
        startTime = 0;

        rotationTime = dimensions.rows / 2;
        secondaryImageInfo = new SecondaryImageInfo (aspectRatioDiff, dimensions);
        spiralMap = makeEmptyArray(dimensions.columns, dimensions.rows);

        addSpiralLevel(0);
        endTime = startTime + rotationTime - 1;
    };

    function addSpiralLevel(offset) {
        // no more rows and columns
        if (offset * 2 >= dimensions.columns || offset * 2 >= dimensions.rows){
            return;

        // one row or column
        } else if (offset * 2 == dimensions.columns-1 || offset * 2 == dimensions.rows-1) {
            if (offset * 2 == dimensions.rows-1){
                for (var i = offset; i < dimensions.columns - offset; i++) {
                    addCube(new THREE.Vector2(i, offset), side.left);
                }
            } else {
                for (var i = offset; i < dimensions.rows - offset; i++) {
                    addCube(new THREE.Vector2(offset, dimensions.rows - i - 1), side.top);
                }
            }
            return;

        // multiple rows or columns left
        } else {
            // add first row
            for (var i = offset; i < dimensions.columns - offset; i++) {
                addCube(new THREE.Vector2(i, dimensions.rows - offset - 1), side.left);
            }

            // add last column
            for (var i = offset + 1; i < dimensions.rows - offset; i++) {
                addCube(new THREE.Vector2(dimensions.columns - offset - 1, dimensions.rows - i - 1), side.top);
            }

            // add last row
            for (var i = offset + 1; i < dimensions.columns - offset; i++) {
                addCube(new THREE.Vector2(dimensions.columns - i - 1, offset), side.right);
            }

            // add first column
            for (var i = offset + 1; i < dimensions.rows - offset - 1; i++) {
                addCube(new THREE.Vector2(offset, i), side.bottom);
            }

            addSpiralLevel (offset + 1);
        }
    };

    function addCube (coordinate, direction) {
        if (direction.index == side.top.index || direction.index == side.bottom.index) {
            cubes[coordinate.x][coordinate.y].setDepthToHeight();
        }

        cubes[coordinate.x][coordinate.y].addSecondaryImage(secondaryImage, secondaryImageInfo.getCropInfo(coordinate), direction);
        spiralMap[coordinate.x][coordinate.y] = {timeOffset: startTime, direction: direction};
        startTime++;
    }

    function makeEmptyArray(a,b) {
         var arr = new Array(a)
         for(var i = 0; i<a; i++){
             arr[i] = new Array(b);
         }
         return arr;
    }

    function animate () {
        if (scrollDist != scrollManager.getRelativeScrollDistance(start, end, endTime)) {
            scrollDist = scrollManager.getRelativeScrollDistance (start, end, endTime);
            for (var i = 0; i < dimensions.columns; i++) {
                for (var j = 0; j < dimensions.rows; j++) {
                    spiralAnimation (i, j);
                }
            }
        }

        animationRequest = requestAnimationFrame( animate );
    };

    function spiralAnimation (i, j) {
        var animationProgress = (scrollDist - spiralMap[i][j].timeOffset)/rotationTime;
        if (animationProgress < 0){
            cubes[i][j].setOriginalRotation();
        } else if (animationProgress < 1) {
            rotateBasedOnSide(cubes[i][j], spiralMap[i][j].direction, animationProgress);
        } else {
            rotateBasedOnSide(cubes[i][j], spiralMap[i][j].direction, 1);
        }
    };

    function rotateBasedOnSide (cube, direction, animationProgress) {
        switch (direction.index) {
            case side.left.index:
                cube.setRotation (new THREE.Vector3(0, animationProgress * Math.PI/2, 0));
                break;
            case side.right.index:
                cube.setRotation (new THREE.Vector3(0, animationProgress * -Math.PI/2, 0));
                break;
            case side.top.index:
                cube.setRotation (new THREE.Vector3(animationProgress * Math.PI/2, 0, 0));
                break;
            case side.bottom.index:
                cube.setRotation (new THREE.Vector3(animationProgress * -Math.PI/2, 0, 0));
                break;
            default:
                cube.setRotation (new THREE.Vector3(0, animationProgress * Math.PI/2, 0));
                break;
        }
    };

    this.play = function () {
        animationRequest = requestAnimationFrame( animate );
    };

    this.stop = function () {
        cancelAnimationFrame( animationRequest );
    };
};
