function Scroll (scene, wall, transition, dropDistance) {

    var animationRequest, scrollDist;
    var scrollAnimation;

    init ();

    function init () {
        if (transition == "enter") {
            scrollAnimation = scrollEnterAnimation;
        } else {
            scrollAnimation = scrollExitAnimation;
        }
    };

    function animate () {
        if (scrollDist != scene.getScrollDistance ()) {
            scrollDist = scene.getScrollDistance ();
            scrollAnimation();
        }

        animationRequest = requestAnimationFrame( animate );
    };

    function scrollEnterAnimation () {
        if (scrollDist < dropDistance){
            wall.getObject().position.y = scrollDist - dropDistance;
        } else {
            wall.getObject().position.y = 0;
        }
    };

    function scrollExitAnimation () {
        wall.getObject().position.y = scrollDist;
    };

    this.play = function () {
        animationRequest = requestAnimationFrame( animate );
    };

    this.stop = function () {
        cancelAnimationFrame( animationRequest );
    };
};
