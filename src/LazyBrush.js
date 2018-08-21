import LazyPoint from './LazyPoint'

const RADIUS_DEFAULT = 30

class LazyBrush {
  /**
   * constructor
   *
   * @param {number} radius The radius of the lazy area
   * @param {boolean} {enabled}
   */
  constructor (radius, { enabled = true } = {}) {
    this.mouse = new LazyPoint(0, 0)
    this.brush = new LazyPoint(0, 0)

    this.radius = radius || RADIUS_DEFAULT

    this.isDisabled = !enabled
  }

  enable () {
    this.isDisabled = false
  }

  disable () {
    this.isDisabled = true
  }

  /**
   * Update the radius
   *
   * @param {number} radius
   */
  setRadius (radius) {
    this.radius = radius
  }

  /**
   * Updates the mouse point and calculates the new brush point.
   *
   * @param {Point} newMousePoint
   */
  update (newMousePoint, cb) {
    if (this.mouse.equalsTo(newMousePoint) || this.brush.equalsTo(newMousePoint)) {
      cb.call(null, false)
      return
    }

    this.mouse.update(newMousePoint)

    if (this.isDisabled) {
      this.brush.update(newMousePoint)
    } else {
      const distance = this.mouse.getDistanceTo(this.brush)

      if (distance > this.radius) {
        const angle = this.mouse.getAngleTo(this.brush)
        this.brush.moveByAngle(angle, distance - this.radius)
      }
    }

    cb.call(null, true)
  }
}

export default LazyBrush
