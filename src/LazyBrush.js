import LazyPoint from './LazyPoint'

import { RADIUS_DEFAULT } from './settings'

class LazyBrush {
  /**
   * constructor
   *
   * @param {number} radius The radius of the lazy area
   * @param {boolean} {enabled}
   */
  constructor ({ radius = RADIUS_DEFAULT, enabled = true } = {}) {
    this.mouse = new LazyPoint(0, 0)
    this.brush = new LazyPoint(0, 0)

    this.radius = radius
    this.isEnabled = enabled
  }

  /**
   * Enable lazy brush calculations.
   *
   */
  enable () {
    this.isEnabled = true
  }

  /**
   * Disable lazy brush calculations.
   *
   */
  disable () {
    this.isEnabled = false
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
   * @returns {boolean} Whether any of the two points changed
   */
  update (newMousePoint) {
    if (this.mouse.equalsTo(newMousePoint) || this.brush.equalsTo(newMousePoint)) {
      return false
    }

    this.mouse.update(newMousePoint)

    if (this.isEnabled) {
      const distance = this.mouse.getDistanceTo(this.brush)

      if (distance > this.radius) {
        const angle = this.mouse.getAngleTo(this.brush)
        this.brush.moveByAngle(angle, distance - this.radius)
      }
    } else {
      this.brush.update(newMousePoint)
    }

    return true
  }
}

export default LazyBrush
