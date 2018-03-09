function Wall (zPos, width, height, depth, columns, rows, image) {

    // clean up code
    // add to github
    // create cube class
        // support video, or image
        // support each part of whole or separate
    // create animations
        // gravity, explode, pinpression, slideshow, scroll camera
        // make each a separate action class with play and pause functions
        // functions on 0 to 100 scale (like lerp)
        // each animation will inherit from parent generic animation class
    // in index should be able to just pick image url, rows, columns, and animation and it should work out of the box
    // support multiple pages/animations (with scroll offset for 2nd and 3rd pages)
    // add support for images of different aspect ratios (not just 1:1)
    // option to set cube opacity and color (hex value, random, or match texture color)
    // support having cubes of different sizes in wall
    // add demo where user can alter number of columns,rows,image,color,animation
    // support full screen

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
