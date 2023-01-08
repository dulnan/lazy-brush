# lazy-brush - smooth drawing with a mouse, finger or any pointing device

[![lazy-brush banner](public/og.png?raw=true "Lazy Brush in action")](https://lazybrush.dulnan.net)

**[Demo](https://lazybrush.dulnan.net)** - **[NPM](https://npmjs.com/package/lazy-brush)** - **[CodePen Examples](https://codepen.io/collection/wayKwv)**

__The demo app also uses
[catenary-curve](https://github.com/dulnan/catenary-curve) to draw the little
"rope" between mouse and brush.__

This library provides the math required to implement a "lazy brush".
It takes a radius and the {x,y} coordinates of a mouse/pointer and calculates
the position of the brush.

The brush will only move when the pointer is outside the "lazy area" of the
brush. With this technique it's possible to freely draw smooth lines and curves
with just a mouse or finger.

## How it works

When the position of the pointer is updated, the distance to the brush is
calculated. If this distance is larger than the defined radius, the brush will
be moved by `distance - radius` pixels in the direction where the pointer is.

## Usage

lazy-brush is on npm so you can install it with your favorite package manager.

```bash
npm install --save lazy-brush
```

lazy-brush can be easily added in any canvas drawing scenario. It acts like a
"proxy" between user input and drawing.

It exports a `LazyBrush` class. Create a single instance of the class:

```javascript
const lazy = new LazyBrush({
  radius: 30,
  enabled: true,
  initialPoint: { x: 0, y: 0 }
})
```

You can now use the `update()` method whenever the position of the mouse (or
touch) changes:

```javascript
// Move mouse 20 pixels to the right.
lazy.update({ x: 20, y: 0 })
// Brush is not moved, because 20 is less than the radius (30).
console.log(lazy.getBrushCoordinates()) // { x: 0, y: 0 }

// Move mouse 40 pixels to the right.
lazy.update({ x: 40, y: 0 })
// Brush is now moved by 10 pixels because 40 (mouse X) - 30 (radius) = 10.
console.log(lazy.getBrushCoordinates()) // { x: 10, y: 0 }
```

The function returns a boolean to indicate whether any of the values (brush or
pointer) have changed. This can be used to prevent unneccessary canvas
redrawing.

If you need to know if the position of the brush was changed, you can get that
boolean via `LazyBrush.brushHasMoved()`. Use this information to decide if you
need to redraw the brush on the canvas.

To get the current brush coordinates, use `LazyBrush.getBrushCoordinates()`.
For the pointer coordinates use `LazyBrush.getPointerCoordinates()`. This will
return a `Point` object with x and y properties.

The functions `getBrush()` and `getPointer()` will return a `LazyPoint`, which
has some additional functions like `getDistanceTo`, `getAngleTo` or `equalsTo`.

### With Friction

You can also pass a friction value (number between 0 and 1) when calling `update()`:

```javascript
lazy.update({ x: 40, y: 0 }, { friction: 0.5 })
```

This will reduce the speed at which the brush moves towards the pointer. A
value of 0 means "no friction", which is the same as not passing a value. 1
means "inifinte friction", the brush won't move at all.

You can define a constant value or make it dynamic, for example using a pressur
value from a touch event.

### Updating both values

You can also update the pointer and the brush coordinates at the same time:

```javascript
lazy.update({ x: 40, y: 0 }, { both: true })
```

This can be used when supporting touch events: On touch start you would update
both the pointer and the brush so that the pointer can be "moved" away from the
brush until the lazy radius is reached. This is how it's implemented in the
demo page.

## Examples

Check out the [basic example](examples/basic.html) for a simple starting point
on how to use this library.
