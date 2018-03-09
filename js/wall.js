function Wall (zPos, width, height, depth, columns, rows, image) {
    
    // make group private + get object function
    $this = this;
    this.group;
    var cubes = [];

    init();

    function init () {

        $this.group = new THREE.Group();

        var cubeSize = new THREE.Vector3(
            width/columns,
            height/rows,
            depth
        );

        // make cubes organized first by column
        for (var i = 0; i < rows; i++) {

            var row = [];

            for (var j = 0; j < columns; j++) {

                var cubePosition = new THREE.Vector3(
                    cubeSize.x * (j - columns/2 + 0.5),
                    cubeSize.y * (i - rows/2 + 0.5),
                    zPos
                );

                offSetInfo = new OffSetInfo (
                    1/columns,
                    1/rows,
                    j/columns,
                    i/rows
                );
                var cube = new Cube (cubeSize, cubePosition, image, offSetInfo);
                row.push(cube);
                $this.group.add(cube.getObject());
            }

            cubes.push(row);

        }

    };

    this.getCubes = function () {
        return cubes;
    }
};
