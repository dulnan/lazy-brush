# Lazy Brush

This library provides the math needed to implement a so called "lazy brush".
It takes a radius and the [x,y] coordinates of a mouse/pointer and calculates the position of the brush, based on whether the mouse is inside or outside the radius.
With this it's possible to freely draw smooth lines and curves with just a mouse or any pointing device.

It works by calculating the distance between brush and mouse and if this distance is greater than the radius, it will move the brush by x pixels in the direction where the mouse is.

# Usage

LazyBrush can be easily added in any canvas drawing scenario. It acts like a "proxy" between user input and drawing.

```javascript
const lazy = new LazyBrush({ radius: 100 })

lazy.update({ x: 50, y: 0 })
console.log(lazy.brush) // { x: 0, y: 0 }

lazy.update({ x: 200, y: 50 })
console.log(lazy.brush) // { x: 100, y: 0 }
```

Use the update() function to update the mouse position. The function also returns a boolean to indicate whether any of the values (brush or mouse) have changed, to be used to prevent unneccessary canvas redraws.
LazyBrush.brush will then contain the coordinates of the brush.
