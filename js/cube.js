function Cube (size, position, image, cropInfo) {

    var object;

    init ();

    function init () {
        var geometry = new THREE.BoxGeometry( size.x, size.y, size.z );
        cropTexture(geometry, face.front, cropInfo);

        image.minFilter = THREE.LinearFilter;
        var imageMaterial = new THREE.MeshBasicMaterial({
            map : image
        });

        var colorMaterial = new THREE.MeshBasicMaterial({
            color : '#'+(Math.random()*0xFFFFFF<<0).toString(16),
            transparent : true,
            opacity : 0.5
        });

        var materials = [];
        for ( var i = 0; i < 6; i ++ ) {
            if (i == 4) {
                materials.push( imageMaterial );
            } else {
                materials.push(colorMaterial);
            }
        }

        object = new THREE.Mesh( geometry, new THREE.MeshFaceMaterial(materials));
        object.position.set(position.x, position.y, position.z);
    };

    function cropTexture (geometry, face, cropInfo) {
        var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
        changeUvs (faceVertexUvs[face[0]], cropInfo);
        changeUvs (faceVertexUvs[face[1]], cropInfo);
    };

    function changeUvs(uvs, cropInfo) {
        for (var j = 0; j < uvs.length; j++ ){
            var uv = uvs[ j ];
            uv.x = ( uv.x * cropInfo.unitX ) + cropInfo.offsetX;
            uv.y = ( uv.y * cropInfo.unitY ) + cropInfo.offsetY;
        }
    };

    this.appendTo = function (parent) {
        parent.add( object );
    };

    this.setOriginalPosition = function () {
        object.position.set(position.x, position.y, position.z);
    };

    this.setPositionFromOriginal = function (offset) {
        object.position.set(
            position.x + offset.x,
            position.y + offset.y,
            position.z + offset.z
        );
    };

    this.setOriginalRotation = function () {
        object.rotation.set(0, 0, 0);
    };

    this.setRotation = function (rotation) {
        object.rotation.set(rotation.x, rotation.y, rotation.z);
    };

    this.getObject = function () {
        return object;
    };
};
