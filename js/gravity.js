function Gravity (scene, wall, rows, columns) {

    var animationRequest;
    var dropTimes = [];
    var dropRotations = [];

    init ();

    function init () {
        for (var i = 0; i < columns; i++) {
            var columnTime = [];
            var columnRotation = [];
            var time = 0;
            for (var j = 0; j < rows; j++) {
                time += Math.random();
                columnTime.push(time);
                columnRotation.push(new THREE.Vector3(Math.random() - 0.5, Math.random() - 0.5, Math.random() - 0.5));
            }
            dropTimes.push(columnTime);
            dropRotations.push(columnRotation);
        }
    };

    // to do: only animate if getRelativeScrollDistance changed
    function animate () {
        var cubes = wall.getCubes();
        var scrollDist = scene.getRelativeScrollDistance ();

        for (var i = 0; i < columns; i++) {
            for (var j = 0; j < rows; j++) {
                if (dropTimes[i][j] > scrollDist) {
                    cubes [j][i].setOriginalPosition();
                    cubes [j][i].setOriginalRotation();
                } else {
                    timeSinceDrop = dropTimes[i][j] - scrollDist;
                    cubes [j][i].setPositionFromOriginal (new THREE.Vector3(0, -Math.pow(timeSinceDrop,2), 0));
                    // clean up rotation to multiply by scalar
                    cubes [j][i].setRotation( new THREE.Vector3 (
                        dropRotations[i][j].x * timeSinceDrop,
                        dropRotations[i][j].y * timeSinceDrop,
                        dropRotations[i][j].z * timeSinceDrop
                    ));
                }
            }
        }
        animationRequest = requestAnimationFrame( animate );
    }

    this.play = function () {
        animationRequest = requestAnimationFrame( animate );
    }

    this.stop = function () {
        cancelAnimationFrame( animationRequest );
    }
};
