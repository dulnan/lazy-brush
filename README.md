# LazyBrush - smooth drawing with a pointer or any pointing device

This library provides the math needed to implement a so called "lazy brush". It takes a radius and the {x,y} coordinates of a mouse/pointer and calculates the position of the brush.
The brush will only move when the pointer is outside of the "lazy area" of the brush. With this technique it's possible to freely draw smooth lines and curves with just a pointer or finger.

# How it works
Everytime the position of the pointer is updated, the distance to the brush is calculated.
If this distance is greater than the defined radius, it will move the brush by `distance - radius` pixels in the direction where the pointer is.

# Usage
LazyBrush can be easily added in any canvas drawing scenario. It acts as a "proxy" between user input and drawing.

```javascript
const lazy = new LazyBrush({ radius: 30, enabled: true }) // default

lazy.update({ x: 50, y: 0 })
console.log(lazy.getBrush()) // { x: 0, y: 0 }

lazy.update({ x: 200, y: 50 })
console.log(lazy.getBrush()) // { x: 100, y: 0 }
```

Use the `LazyBrush.update()` function to update the pointer position. The function returns a boolean to indicate whether any of the values (brush or pointer) have changed.
This can be used to prevent unneccessary canvas redrawing.

To get the coordinates for the brush, use `LazyBrush.getBrush()` or `LazyBrush.getPointer()`. This will return an object with x and y properties. Directly accessing `pointer` or `brush` 

## Performance
For performance reasons it's best to decouple calculations and canvas rendering from pointermove events: Store the pointer coordinates in a variable in this event.
Using an animation loop (typically requestAnimationFrame), call the Lazybrush.update() function on every frame. Because the 
