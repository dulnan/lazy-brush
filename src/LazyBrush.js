import LazyPoint from './LazyPoint'
import { RADIUS_DEFAULT } from './settings'

class LazyBrush {
  /**
   * constructor
   *
   * @param {object} settings
   * @param {number} settings.radius The radius for the lazy area
   * @param {boolean} settings.enabled
   */
  constructor ({ radius = RADIUS_DEFAULT, enabled = true } = {}) {
    this.radius = radius
    this.isEnabled = enabled

    this.pointer = new LazyPoint(0, 0)
    this.brush = new LazyPoint(0, 0)

    this.angle = 0
    this.distance = 0
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
   * Return the current radius
   *
   * @returns {number}
   */
  getRadius () {
    return this.radius
  }

  /**
   * Return the brush coordinates as a simple object
   *
   * @returns {object}
   */
  getBrushCoordinates () {
    return this.brush.toObject()
  }

  /**
   * Return the pointer coordinates as a simple object
   *
   * @returns {object}
   */
  getPointerCoordinates () {
    return this.pointer.toObject()
  }

  /**
   * Return the brush as a LazyPoint
   *
   * @returns {LazyPoint}
   */
  getBrush () {
    return new LazyPoint(this.brush)
  }

  /**
   * Return the pointer as a LazyPoint
   *
   * @returns {LazyPoint}
   */
  getPointer () {
    return new LazyPoin(this.pointer)
  }

  /**
   * Return the angle between pointer and brush
   *
   * @returns {number} Angle in radians
   */
  getAngle () {
    return this.angle
  }

  /**
   * Return the distance between pointer and brush
   *
   * @returns {number} Distance in pixels
   */
  getDistance () {
    return this.distance
  }

  /**
   * Updates the pointer point and calculates the new brush point.
   *
   * @param {Point} newPointerPoint
   * @returns {boolean} Whether any of the two points changed
   */
  update (newPointerPoint) {
    if (this.pointer.equalsTo(newPointerPoint)) {
      return false
    }

    this.pointer.update(newPointerPoint)

    if (this.isEnabled) {
      this.distance = this.pointer.getDistanceTo(this.brush)
      this.angle = this.pointer.getAngleTo(this.brush)

      if (this.distance > this.radius) {
        this.brush.moveByAngle(this.angle, this.distance - this.radius)
      }
    } else {
      this.distance = 0
      this.angle = 0
      this.brush.update(newPointerPoint)
    }

    return true
  }
}

export default LazyBrush
