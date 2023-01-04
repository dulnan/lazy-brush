interface Point {
  x: number
  y: number
}

export default class LazyPoint implements Point {
  x: number
  y: number

  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  /**
   * Update the x and y values
   */
  update(point: Point): LazyPoint {
    this.x = point.x
    this.y = point.y
    return this
  }

  /**
   * Move the point to another position using an angle and distance
   */
  moveByAngle(
    // The angle in radians
    angle: number,
    // How much the point should be moved
    distance: number
  ): LazyPoint {
    // Rotate the angle based on the browser coordinate system ([0,0] in the top left)
    const angleRotated = angle + Math.PI / 2

    this.x = this.x + Math.sin(angleRotated) * distance
    this.y = this.y - Math.cos(angleRotated) * distance
    return this
  }

  /**
   * Check if this point is the same as another point
   */
  equalsTo(point: Point): boolean {
    return this.x === point.x && this.y === point.y
  }

  /**
   * Get the difference for x and y axis to another point
   */
  getDifferenceTo(point: Point): LazyPoint {
    return new LazyPoint(this.x - point.x, this.y - point.y)
  }

  /**
   * Calculate distance to another point
   */
  getDistanceTo(point: Point): number {
    const diff = this.getDifferenceTo(point)

    return Math.sqrt(Math.pow(diff.x, 2) + Math.pow(diff.y, 2))
  }

  /**
   * Calculate the angle to another point
   */
  getAngleTo(point: Point): number {
    const diff = this.getDifferenceTo(point)

    return Math.atan2(diff.y, diff.x)
  }

  /**
   * Return a simple object with x and y properties
   */
  toObject(): Point {
    return {
      x: this.x,
      y: this.y
    }
  }
}
