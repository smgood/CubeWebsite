function Tetris (scrollManager, wall, transition, dropDistance, start, end) {

    var animationRequest, scrollDist, cubes, dimensions;
    var map, availableColumns, instructions;
    var getTetrisDistance, tetrisAnimation;
    var maxAnimationTime;

    init ();

    function init () {
        cubes = wall.getCubes();
        dimensions = wall.getDimensions();

        if (transition == "enter") {
            getTetrisDistance = getEnterDropDistance;
            tetrisAnimation = tetrisEnterAnimation;
        } else {
            getTetrisDistance = getExitDropDistance;
            tetrisAnimation = tetrisExitAnimation;
        }

        map = initMap ();
        availableColumns = initAvailableColumns();
        instructions = [];

        simulateTetris();
    };

    function initMap() {
        var map = [];
        for (var j = 0; j < dimensions.columns; j++) {
            map.push((new Array(dimensions.rows)).fill(0));
        }
        return map;
    };

    function initAvailableColumns() {
        var columns = [];
        for (var i = 0; i < dimensions.columns; i++) {
            columns.push(i);
        }
        return columns;
    };

    function simulateTetris() {
        if (availableColumns.length) {
            var index = Math.floor(Math.random() * availableColumns.length);
            var startingX = availableColumns[index];
            var startingPosition = new THREE.Vector2(startingX, getLowestEmptySpace(startingX))

            if (startingPosition.y == -1) {
                availableColumns.splice(index, 1);
                simulateTetris();
            } else {
                map[startingPosition.x][startingPosition.y] = 1;
                addBlock(startingPosition, 1, [], [startingPosition]);
            }
        }

        maxAnimationTime = instructions[instructions.length-1].endTime;
    };

    function addBlock(blockPosition, blockCount, possibleMoves, completedMoves) {
        var {x, y} = blockPosition;
        var newPosition;
        var foundNewMove = false;

        if (y+1 < dimensions.rows && map[x][y+1] == 0 && !containsCoord(possibleMoves, x, y+1)){
            possibleMoves.push(new THREE.Vector2(x, y+1));
        }

        if (x>0 && map[x-1][y] == 0 && !containsCoord(possibleMoves, x-1, y)){
            possibleMoves.push(new THREE.Vector2(x-1, y));
        }

        if (x+1 < dimensions.columns && map[x+1][y] == 0 && !containsCoord(possibleMoves, x+1, y)){
            possibleMoves.push(new THREE.Vector2 (x+1, y));
        }

        if (y>0 && map[x][y-1] == 0) {
            foundNewMove = true;
            newPosition = new THREE.Vector2(x, y-1);
        } else {
            while (possibleMoves.length && !foundNewMove) {
                var index = Math.floor(Math.random() * possibleMoves.length);
                var move = possibleMoves[index];
                possibleMoves.splice(index, 1);
                if (getEmptySpacesBelow(move.x, move.y) < 4-blockCount) {
                    foundNewMove = true;
                    newPosition = move;
                }
            }
        }

        if (!foundNewMove) {
            addInstruction(completedMoves);
            simulateTetris();
        }

        else {
            map[newPosition.x][newPosition.y] = 1;
            blockCount++;
            completedMoves.push(newPosition);

            if (blockCount < 4) {
                addBlock(newPosition, blockCount, possibleMoves, completedMoves)
            } else {
                addInstruction(completedMoves);
                simulateTetris();
            }
        }
    };

    function addInstruction (tetrisPiece) {
        var distance = getTetrisDistance(tetrisPiece);
        var startTime = instructions.length ? (instructions[instructions.length -1].endTime) : 0;
        var endTime = startTime + distance;
        instructions.push({tetrisPiece, distance, startTime, endTime});
    }

    function getEnterDropDistance(completedMoves) {
        var minHeight = Math.min.apply(null, completedMoves.map(function(coord) {
            return coord.y;
        }))
        return dropDistance - (wall.getCubeSize().y * minHeight);
    };

    function getExitDropDistance(completedMoves) {
        var maxHeight = Math.max.apply(null, completedMoves.map(function(coord) {
            return coord.y;
        }))
        return (dropDistance - wall.getWallSize().y) + (wall.getCubeSize().y * (maxHeight+1));
    };

    function containsCoord(array, x, y) {
        for (var i = 0; i < array.length; i++) {
            if (array[i].x == x && array[i].y == y) {
                return true
            }
        }
        return false;
    };

    function getLowestEmptySpace(column) {
        for (var i = 0; i < dimensions.rows; i++) {
            if (map[column][i] == 0) {
                return i;
            }
        }
        return -1;
    };

    function getEmptySpacesBelow (x, y) {
        var count = 0;
        while ((y-1-count >= 0) && (map[x][y-1-count] == 0)) {
            count++;
        }
        return count;
    };

    function animate () {
        if (scrollDist != scrollManager.getRelativeScrollDistance(start, end, maxAnimationTime)) {
            scrollDist = scrollManager.getRelativeScrollDistance (start, end, maxAnimationTime);
            tetrisAnimation();
        }

        animationRequest = requestAnimationFrame( animate );
    };

    function tetrisEnterAnimation () {
        for (var i = 0; i < instructions.length; i++) {
            if (scrollDist > instructions[i].startTime) {
                if (scrollDist > instructions[i].endTime) {
                    setTetrisPiecePosition(instructions[i].tetrisPiece, 0);
                } else {
                    setTetrisPiecePosition(instructions[i].tetrisPiece, instructions[i].endTime - scrollDist);
                }
            } else {
                setTetrisPiecePosition(instructions[i].tetrisPiece, instructions[i].distance);
            }
        }
    };

    function tetrisExitAnimation () {
        for (var i = 0; i < instructions.length; i++) {
            if (scrollDist > instructions[i].startTime) {
                if (scrollDist > instructions[i].endTime) {
                    setTetrisPiecePosition(instructions[i].tetrisPiece, -instructions[i].distance);
                } else {
                    setTetrisPiecePosition(instructions[i].tetrisPiece, instructions[i].startTime - scrollDist);
                }
            } else {
                setTetrisPiecePosition(instructions[i].tetrisPiece, 0);
            }
        }
    };

    function setTetrisPiecePosition (tetrisPiece, offset) {
        for (var i = 0; i < tetrisPiece.length; i++) {
            cubes[tetrisPiece[i].x][tetrisPiece[i].y].setPositionFromOriginal(
                new THREE.Vector3(0, offset, 0)
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
