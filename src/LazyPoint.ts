import Point from './Point'

export default class LazyPoint extends Point {
  /**
   * Update the x and y values
   *
   * @param {Point} point
   */
  update(point: Point) {
    this.x = point.x
    this.y = point.y
  }

  /**
   * Move the point to another position using an angle and distance
   *
   * @param {number} angle The angle in radians
   * @param {number} distance How much the point should be moved
   */
  moveByAngle(angle: number, distance: number) {
    // Rotate the angle based on the browser coordinate system ([0,0] in the top left)
    const angleRotated = angle + Math.PI / 2

    ;(this.x = this.x + Math.sin(angleRotated) * distance),
      (this.y = this.y - Math.cos(angleRotated) * distance)
  }

  /**
   * Check if this point is the same as another point
   *
   * @param {Point} point
   * @returns {boolean}
   */
  equalsTo(point: Point): boolean {
    return this.x === point.x && this.y === point.y
  }

  /**
   * Get the difference for x and y axis to another point
   *
   * @param {Point} point
   * @returns {Point}
   */
  getDifferenceTo(point: Point): Point {
    return new Point(this.x - point.x, this.y - point.y)
  }

  /**
   * Calculate distance to another point
   *
   * @param {Point} point
   * @returns {number}
   */
  getDistanceTo(point: Point): number {
    const diff = this.getDifferenceTo(point)

    return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2))
  }

  /**
   * Calculate the angle to another point
   *
   * @param {Point} point
   * @returns {number}
   */
  getAngleTo(point: Point): number {
    const diff = this.getDifferenceTo(point)

    return Math.atan2(diff.y, diff.x)
  }

  /**
   * Return a simple object with x and y properties
   *
   * @returns {object}
   */
  toObject(): Point {
    return {
      x: this.x,
      y: this.y
    }
  }
}
