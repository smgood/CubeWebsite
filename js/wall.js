function Wall (image, size, dimensions) {

    $this = this;
    var group;
    var cubes = [];
    var rows, columns;

    init();

    function init () {
        rows = dimensions.rows;
        columns = dimensions.columns;

        group = new THREE.Group();

        var cubeSize = new THREE.Vector3(
            size.width/columns,
            size.height/rows,
            size.depth
        );

        // make cubes organized first by column
        for (var i = 0; i < rows; i++) {

            var row = [];

            for (var j = 0; j < columns; j++) {

                var cubePosition = new THREE.Vector3(
                    cubeSize.x * (j - columns/2 + 0.5),
                    cubeSize.y * (i - rows/2 + 0.5),
                    0
                );

                cropInfo = new CropInfo (
                    1/columns,
                    1/rows,
                    j/columns,
                    i/rows
                );
                var cube = new Cube (cubeSize, cubePosition, image, cropInfo);
                row.push(cube);
                group.add(cube.getObject());
            }

            cubes.push(row);

        }

    };

    this.getDimensions = function () {
        return dimensions;
    };

    this.getSize = function () {
        return size;
    };

    this.getCubes = function () {
        return cubes;
    };

    this.getObject = function () {
        return group;
    };
};
