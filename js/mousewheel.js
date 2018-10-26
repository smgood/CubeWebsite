function Mousewheel () {

    var scrollDist, animations, end;
    var touchSlideRequest;

    init ();

    function init () {
        scrollDist = 0;
        end = 0;

        animations = [];
    }

    function onDocumentMouseWheel( event ) {
        updateScrollDistance (event.wheelDeltaY * 0.001);
    };

    function onDocumentTouchStart( event ) {
        event.preventDefault();
        cancelAnimationFrame( touchSlideRequest );

        var touchStart = event.touches[0].clientY;
        var touchDistance = 0;

        function touchMove(event) {
            event.preventDefault();

            touchDistance = event.touches[0].clientY - touchStart;
            updateScrollDistance (touchDistance * 0.02);
            touchStart = event.touches[0].clientY;
        };

        function touchEnd(event) {
            event.preventDefault();
            touchSlideRequest = requestAnimationFrame( slide );

            window.removeEventListener('touchmove', touchMove, false);
            window.removeEventListener('touchend', touchEnd, false);
        };

        function slide () {
            touchDistance *= 0.92;
            updateScrollDistance (touchDistance * 0.02);

            if (Math.abs(touchDistance) > .1) {
                touchSlideRequest = requestAnimationFrame( slide );
            } else {
                cancelAnimationFrame( touchSlideRequest );
            }
        };

        window.addEventListener('touchmove', touchMove, false);
        window.addEventListener('touchend', touchEnd, false);
    };

    function updateScrollDistance (delta) {
        scrollDist -= delta;
        if (scrollDist < 0) {
            scrollDist = 0;
        } else if (scrollDist > end) {
            scrollDist = end;
        }

        checkAnimationsInBounds();
    };

    function checkAnimationsInBounds() {
        for (var i = 0; i < animations.length; i++) {
            if (scrollDist < animations[i].getStart() || scrollDist > animations[i].getEnd()) {
                if (animations[i].isVisible()) {
                    animations[i].hideWall()
                }
            } else {
                if (!animations[i].isVisible()) {
                    animations[i].showWall()
                }
            }
        }
    }

    function play () {
        checkAnimationsInBounds();

        window.addEventListener('mousewheel', onDocumentMouseWheel, false);
        window.addEventListener('touchstart', onDocumentTouchStart, false);
    };

    function stop () {
        for (var i = 0; i < animations.length; i++) {
            animations[i].stop();
        }

        window.removeEventListener('mousewheel', onDocumentMouseWheel, false);
        window.removeEventListener('touchstart', onDocumentTouchStart, false);
    };

    this.play = function () {
        play();
    }

    this.stop = function () {
        stop();
    }

    this.reset = function() {
        scrollDist = 0;
    };

    this.getScrollDistance = function() {
        return scrollDist;
    };

    this.getRelativeScrollDistance = function(start, end, maxAnimationValue) {
        var relativeScrollDistance = ((scrollDist - start) / (end - start)) * maxAnimationValue;
        if (relativeScrollDistance < 0) {
            return 0;
        } else if (relativeScrollDistance > maxAnimationValue) {
            return maxAnimationValue;
        } else {
            return relativeScrollDistance;
        }
    };

    this.addAnimation = function (animation) {
        animations.push(animation);
        if (end < animation.getEnd()) {
            end = animation.getEnd();
        }
    };
}
