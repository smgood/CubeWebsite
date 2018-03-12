function Scroll (scene, wall) {

    var animationRequest;

    function animate () {
        wall.group.position.y = scene.getRelativeScrollDistance ();
        animationRequest = requestAnimationFrame( animate );
    }

    this.play = function () {
        animationRequest = requestAnimationFrame( animate );
    }

    this.stop = function () {
        cancelAnimationFrame( animationRequest );
    }
};
