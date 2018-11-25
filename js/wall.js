function Wall (image, wallSize, dimensions, color) {

    $this = this;
    var group, cubeSize, rows, columns;
    var cubes = [];

    init();

    function init () {
        rows = dimensions.rows;
        columns = dimensions.columns;

        group = new THREE.Group();
        group.position.z = -wallSize.z/2;

        cubeSize = new THREE.Vector3(
            wallSize.x/columns,
            wallSize.y/rows,
            wallSize.z
        );

        for (var i = 0; i < columns; i++) {

            var column = [];

            for (var j = 0; j < rows; j++) {

                var cubePosition = new THREE.Vector3(
                    cubeSize.x * (i - columns/2 + 0.5),
                    cubeSize.y * (j - rows/2 + 0.5),
                    0
                );

                var cropInfo = new CropInfo (
                    1/columns,
                    1/rows,
                    i/columns,
                    j/rows
                );
                var cube = new Cube (cubeSize, cubePosition, image, cropInfo, color);
                column.push(cube);
                group.add(cube.getObject());
            }

            cubes.push(column);

        }

    };

    this.dispose = function () {
        for (var i = 0; i < columns; i++) {
            for (var j = 0; j < rows; j++) {
                group.remove(cubes[i][j].getObject())
                cubes[i][j].dispose();
                delete cubes[i][j];
            }
        }
    };

    this.getDimensions = function () {
        return dimensions;
    };

    this.getWallSize = function () {
        return wallSize;
    };

    this.getCubeSize = function () {
        return cubeSize;
    };

    this.getCubes = function () {
        return cubes;
    };

    this.getObject = function () {
        return group;
    };
};
