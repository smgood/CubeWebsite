function Mousewheel () {
    var touchSlideRequest
    var scrollDist = 0;

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
            updateScrollDistance (touchDistance);
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
            updateScrollDistance (touchDistance);

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
        }
    };

    this.play = function() {
        window.addEventListener('mousewheel', onDocumentMouseWheel, false);
        window.addEventListener('touchstart', onDocumentTouchStart, false);
    };

    this.stop = function() {
        window.removeEventListener('mousewheel', onDocumentMouseWheel, false);
        window.removeEventListener('touchstart', onDocumentTouchStart, false);
    };

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
}
