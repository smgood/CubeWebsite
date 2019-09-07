# Cubism
- Cubism is an easy to use, open source javascript library. Use it to create full-screen, 3D scrolling websites, composed entirely of cubes!
- Demo 1: http://smgoodrich.com/cubes
- Demo 2: http://smgoodrich.com/cubes/sample.html

# To Do
## Required Features:
1. animations: none, pinpression (moves in z axis)
2. Support full screen
    - Figure out optimal amount of rows and columns based on window size, dimensions parameters, & image aspect ratio
    - dispose and recreate scene on resize (in manager)
3. support all browsers and mobile (make play button for videos)
4. improve dispose functionality to remove all memory leaks
5. Keep code clean & readable
6. Add layers to support multiple animations at once

## Potential Features:
1. scroll bar and navigation dots
2. support having cubes of different sizes in wall
3. Allow one big image or each cube a separate image/video
4. raycasting cube plays video / supports link
5. animations: explode, pinpression (rotates to mouse, mouse is repulsive magnet), zipper
6. create loading gif

## Bugs
1. Video doesn't load sometimes
2. Buffer when animation first displayed
