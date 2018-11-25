function Cube (size, position, image, cropInfo, color) {

    var object, geometry, materials;

    init ();

    function init () {
        geometry = new THREE.BoxGeometry( size.x, size.y, size.z );
        cropTexture(geometry, side.front.face, cropInfo);

        var imageMaterial = new THREE.MeshBasicMaterial({
            map : image,
            side: THREE.DoubleSide,
        });

        materials = [];
        var sideMaterial = getMaterial();
        for (var i = 0; i < 6; i ++) {
            if (i == 4) {
                materials.push( imageMaterial );
            } else {
                materials.push(sideMaterial);
            }
        }

        object = new THREE.Mesh( geometry, materials);
        object.position.set(position.x, position.y, position.z);
    };

    function getMaterial () {
        switch (color.type) {
            case "solid":
                return getSolidColorMaterial ();
            case "rainbow":
                return getRainbowMaterial ();
            case "sample":
                return getSampleImageMaterial ();
            case "extrude":
                return getExtrudeMaterial ();
            default:
                return getSolidColorMaterial ();
        };
    };

    function getGenericMaterial (threeColor) {
        return new THREE.MeshPhongMaterial({
            color : threeColor,
            transparent : true,
            opacity : color.opacity,
            shininess: 70,
        });
    };

    function getSolidColorMaterial () {
        var solidColor = new THREE.Color( color.value );
        return getGenericMaterial (solidColor);
    };

    function getRainbowMaterial () {
        var randColor = new THREE.Color( Math.random() * 0xffffff );
        return getGenericMaterial (randColor);
    };

    function getSampleImageMaterial () {
        var img = image.image;
        var canvas = document.createElement('canvas');
        canvas.width = img.width || img.videoWidth;
        canvas.height = img.height || img.videoHeight;
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

        var pixelData = canvas.getContext('2d').getImageData(
            canvas.width * (cropInfo.offsetX + cropInfo.unitX/2),
            canvas.height * (1 - cropInfo.offsetY - cropInfo.unitY/2),
            1,
            1
        ).data;

        var sampleColor = new THREE.Color(`rgb(${pixelData[0]}, ${pixelData[1]}, ${pixelData[2]})`);
        return getGenericMaterial (sampleColor);
    };

    function getExtrudeMaterial () {
        cropTexture(
            geometry,
            side.left.face,
            new CropInfo (
                -cropInfo.unitX * size.z / size.x,
                cropInfo.unitY,
                cropInfo.offsetX + cropInfo.unitX * size.z / size.x,
                cropInfo.offsetY
            )
        );

        cropTexture(
            geometry,
            side.right.face,
            new CropInfo (
                -cropInfo.unitX * size.z / size.x,
                cropInfo.unitY,
                cropInfo.offsetX + cropInfo.unitX,
                cropInfo.offsetY
            )
        );

        cropTexture(
            geometry,
            side.bottom.face,
            new CropInfo (
                cropInfo.unitX,
                -cropInfo.unitY * size.z / size.y,
                cropInfo.offsetX,
                cropInfo.offsetY + cropInfo.unitY * size.z / size.y,
            )
        );

        cropTexture(
            geometry,
            side.top.face,
            new CropInfo (
                cropInfo.unitX,
                -cropInfo.unitY * size.z / size.y,
                cropInfo.offsetX,
                cropInfo.offsetY + cropInfo.unitY
            )
        );

        cropTexture(
            geometry,
            side.back.face,
            new CropInfo (
                -cropInfo.unitX,
                cropInfo.unitY,
                cropInfo.offsetX + cropInfo.unitX,
                cropInfo.offsetY
            )
        );

        return new THREE.MeshBasicMaterial({
            map : image,
            transparent : true,
            opacity : color.opacity
        });
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

    function resetUvs (geometry, face) {
        var faceVertexUvs = geometry.faceVertexUvs[ 0 ];
        faceVertexUvs[face[0]] = [
            new THREE.Vector2( 0, 1 ),
            new THREE.Vector2( 0, 0 ),
            new THREE.Vector2( 1, 1 )
        ];
        faceVertexUvs[face[1]] = [
            new THREE.Vector2( 0, 0 ),
            new THREE.Vector2( 1, 0 ),
            new THREE.Vector2( 1, 1 )
        ];
    };

    this.setDepthToHeight = function (Depth) {
        object.scale.z = size.y / size.z;
        object.position.z = - (size.y - size.z)/2;
    };

    this.addSecondaryImage = function (secondaryImage, secondaryCropInfo, secondarySide) {
        resetUvs(geometry, secondarySide.face);
        cropTexture(geometry, secondarySide.face, secondaryCropInfo);

        var imageMaterial = new THREE.MeshBasicMaterial({
            map : secondaryImage,
            side: THREE.DoubleSide,
        });

        materials[secondarySide.index] = imageMaterial;
    };

    this.dispose = function () {
        object.geometry.dispose();
        for (var i = 0; i < object.material.length; i++) {
            object.material[i].dispose();
        }
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
