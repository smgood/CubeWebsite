function SecondaryImageInfo (aspectRatioDiff, dimensions) {

    var columns = dimensions.columns;
    var rows = dimensions.rows;

    var cropFunction;
    if(aspectRatioDiff > 1) {
        cropFunction =  getCropInfoWide;
    } else {
        cropFunction = getCropInfoTall;
    }

    function getCropInfoWide (secondImagePos) {
        return new CropInfo (
            1/(columns * aspectRatioDiff),
            1/rows,
            (aspectRatioDiff - 1) / 2 + secondImagePos.x/(columns * aspectRatioDiff),
            secondImagePos.y/rows
        );
    };

    function getCropInfoTall (secondImagePos) {
        return new CropInfo (
            1/columns,
            aspectRatioDiff/rows,
            secondImagePos.x/columns,
            (1/aspectRatioDiff - 1) / 2 + (aspectRatioDiff*secondImagePos.y)/rows
        );
    };

    this.getCropInfo = function (secondImagePos) {
        return cropFunction(secondImagePos);
    }
};
