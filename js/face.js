var face = {
    "front" : [8, 9],
    "back" : [10, 11],
    "right": [0, 1],
    "left": [2, 3],
    "top": [4, 5],
    "bottom" : [6, 7]
};

function CropInfo (UnitX, UnitY, OffsetX, OffsetY) {
    this.unitX = UnitX;
    this.unitY = UnitY;
    this.offsetX = OffsetX;
    this.offsetY = OffsetY;
}
