var side = {
    right: {index: 0, face: [0, 1]},
    left: {index: 1, face: [2, 3]},
    top: {index: 2, face: [4, 5]},
    bottom : {index: 3, face: [6, 7]},
    front : {index: 4, face: [8, 9]},
    back : {index: 5, face: [10, 11]}
};

function CropInfo (UnitX, UnitY, OffsetX, OffsetY) {
    this.unitX = UnitX;
    this.unitY = UnitY;
    this.offsetX = OffsetX;
    this.offsetY = OffsetY;
}
