import { describe, expect, it } from 'vitest'
import LazyBrush from '../src/LazyBrush'
import { LazyPoint } from '../src/LazyPoint'

describe('LazyBrush', () => {
  it('Should be instantiatable with a radius and options', () => {
    const b = new LazyBrush({ radius: 100, enabled: false })

    expect(b.pointer.x).equal(0)
    expect(b.pointer.y).equal(0)
    expect(b.brush.x).equal(0)
    expect(b.brush.y).equal(0)

    expect(b.radius).equal(100)
    expect(b.isEnabled()).equal(false)
  })

  it('Should be instantiatable without radius and options', () => {
    const b = new LazyBrush()
    expect(b.radius).equal(30)
    expect(b.isEnabled()).equal(true)
  })

  it('Should enable lazy brush', () => {
    const b = new LazyBrush({ enabled: false })
    b.enable()
    expect(b.isEnabled()).equal(true)
  })

  it('Should disable lazy brush', () => {
    const b = new LazyBrush()
    b.disable()
    expect(b.isEnabled()).equal(false)
  })

  it('Should set radius correctly', () => {
    const b = new LazyBrush()

    expect(b.radius).equal(30)
    b.setRadius(156)
    expect(b.radius).equal(156)
    expect(b.getRadius()).equal(156)
  })

  it('Should update pointer points corrently', () => {
    const b = new LazyBrush({ radius: 100 })
    b.update({ x: 500, y: 1000 })
    expect(b.pointer.x).equal(500)
    expect(b.pointer.y).equal(1000)
  })

  it('Should return a simple coordinates object for the brush', () => {
    const b = new LazyBrush({ radius: 100 })
    b.update({ x: 500, y: 1000 })
    const brush = b.getBrushCoordinates()
    expect(brush).toHaveProperty('x')
    expect(brush).toHaveProperty('y')
    expect(Object.keys(brush).length).toEqual(2)
  })

  it('Should return a simple coordinates object for the pointer', () => {
    const b = new LazyBrush({ radius: 100 })
    b.update({ x: 500, y: 1000 })
    const pointer = b.getPointerCoordinates()
    expect(pointer).toHaveProperty('x')
    expect(pointer).toHaveProperty('y')
    expect(Object.keys(pointer).length).toEqual(2)
  })

  it('Should return the brush object.', () => {
    const b = new LazyBrush({ radius: 100, initialPoint: { x: 500, y: 500 } })
    const brush = b.getBrush()
    expect(brush).toBeInstanceOf(LazyPoint)
  })

  it('Should return the pointer object.', () => {
    const b = new LazyBrush({ radius: 100, initialPoint: { x: 500, y: 500 } })
    const pointer = b.getPointer()
    expect(pointer).toBeInstanceOf(LazyPoint)
  })

  it('Should return the current angle between pointer and brush', () => {
    const b = new LazyBrush({ radius: 100, initialPoint: { x: 100, y: 100 } })
    b.update({ x: 100, y: 500 })
    expect(b.getAngle()).toBeCloseTo(1.5, 0)
  })

  it('Should return the current distance between pointer and brush', () => {
    const b = new LazyBrush({ radius: 100, initialPoint: { x: 100, y: 100 } })
    b.update({ x: 100, y: 500 })
    expect(b.getDistance()).toBeCloseTo(400, 0)
  })

  it('Should return the correct state if the brush has moved', () => {
    const b = new LazyBrush({ radius: 100, initialPoint: { x: 100, y: 100 } })
    b.update({ x: 100, y: 500 })
    expect(b.brushHasMoved()).toBe(true)
    b.update({ x: 100, y: 450 })
    expect(b.brushHasMoved()).toBe(false)
    b.update({ x: 100, y: 450 }, { both: true })
    expect(b.brushHasMoved()).toBe(true)
  })

  it('Should set state to defaults if lazy is disabled', () => {
    const b = new LazyBrush({
      radius: 100,
      initialPoint: { x: 100, y: 100 },
      enabled: false
    })
    b.update({ x: 100, y: 500 })
    expect(b.getDistance()).toBeCloseTo(0, 0)
    expect(b.getAngle()).toBeCloseTo(0, 0)
  })

  it('Should detect changes corectly', () => {
    const b = new LazyBrush({ radius: 100 })

    const hasChanged1 = b.update({ x: 10, y: 10 })
    expect(hasChanged1).equal(true)

    const hasChanged2 = b.update({ x: 10, y: 10 })
    expect(hasChanged2).equal(false)
  })

  it('Should not move brush when pointer is inside radius', () => {
    const b = new LazyBrush({ radius: 100 })

    b.update({ x: 10, y: 10 })

    expect(b.brush.x).equal(0)
    expect(b.brush.y).equal(0)
  })

  it('Should move brush when pointer is outside radius on the right', () => {
    const b = new LazyBrush({ radius: 100 })

    b.update({ x: 100, y: 0 })
    b.update({ x: 300, y: 0 })

    expect(b.brush.x).toBeCloseTo(200)
    expect(b.brush.y).toBeCloseTo(0)
  })

  it('Should move brush when pointer is outside radius on the left', () => {
    const b = new LazyBrush({ radius: 100 })

    b.update({ x: 500, y: 0 })
    expect(b.brush.x).equal(400)

    b.update({ x: 400, y: 0 })
    expect(b.brush.x).equal(400)

    b.update({ x: 300, y: 0 })
    expect(b.brush.x).equal(400)

    b.update({ x: 100, y: 0 })
    expect(b.brush.x).equal(200)
  })

  it('Should move brush when pointer is outside radius the bottom right', () => {
    const b = new LazyBrush({ radius: 100 })

    b.update({ x: 1071, y: 1071 })
    expect(b.brush.x).toBeCloseTo(1000, 0)
    expect(b.brush.y).toBeCloseTo(1000, 0)
  })

  it('Should use the provided friction value to move the brush', () => {
    const b = new LazyBrush({ radius: 100, initialPoint: { x: 300, y: 300 } })

    b.update({ x: 900, y: 900 }, { friction: 0.5 })

    expect(b.brush.x).toBeCloseTo(370.91, 0)
    expect(b.brush.y).toBeCloseTo(370.91, 0)

    b.update({ x: 900, y: 900 }, { friction: 0.5 })

    expect(b.brush.x).toBeCloseTo(432.32, 0)
    expect(b.brush.y).toBeCloseTo(432.32, 0)

    b.update({ x: 1200, y: 1200 })

    expect(b.brush.x).toBeCloseTo(1129.28, 0)
    expect(b.brush.y).toBeCloseTo(1129.28, 0)
  })
})
