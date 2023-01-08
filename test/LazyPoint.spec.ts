import { describe, expect, it } from 'vitest'
import chai from 'chai'
import { LazyPoint } from '../src/main'

chai.should()

describe('LazyPoint', () => {
  it('Should be instantiatable with two coordinates', () => {
    const p = new LazyPoint(100, 50)

    expect(p.x).be.a('number')
    expect(p.x).toBeCloseTo(100)

    expect(p.y).be.a('number')
    expect(p.y).toBeCloseTo(50)
  })

  it('Should update coordinates correctly', () => {
    const p = new LazyPoint(10, 20)

    const pNew = new LazyPoint(500, 300)

    p.update(pNew)

    expect(p.x).toBeCloseTo(500)
    expect(p.y).toBeCloseTo(300)
  })

  it('Should move point by angle correctly', () => {
    const p = new LazyPoint(100, 100)

    // This equals to 90° in radians
    const angle = Math.PI / 2
    p.moveByAngle(angle, 100)

    expect(p.x).toBeCloseTo(100)
    expect(p.y).toBeCloseTo(200)
  })

  it('Should compare equality to another point correctly', () => {
    const p = new LazyPoint(300, 300)

    const p1 = new LazyPoint(300, 300)
    const p2 = new LazyPoint(299, 300)
    const p3 = new LazyPoint(301, 300)
    const p4 = new LazyPoint(301, 299)
    const p5 = new LazyPoint(300, 300.000000000001)

    const r1 = p.equalsTo(p1)
    const r2 = p.equalsTo(p2)
    const r3 = p.equalsTo(p3)
    const r4 = p.equalsTo(p4)
    const r5 = p.equalsTo(p5)

    expect(r1).equal(true)
    expect(r2).equal(false)
    expect(r3).equal(false)
    expect(r4).equal(false)
    expect(r5).equal(false)
  })

  it('Should calculate the difference between another point correctly', () => {
    const p1 = new LazyPoint(300, 300)
    const p2 = new LazyPoint(300, 600)

    const r = p1.getDifferenceTo(p2)

    expect(r.x).equal(0)
    expect(r.y).equal(-300)
  })

  it('Should calculate the distance to another point correctly', () => {
    const p1 = new LazyPoint(300, 300)
    const p2 = new LazyPoint(300, 600)

    const r = p1.getDistanceTo(p2)

    expect(r).equal(300)
  })

  it('Should calculate the angle to another point correctly', () => {
    const p1 = new LazyPoint(500, 500)
    const p2 = new LazyPoint(1000, 500)

    const r = p1.getAngleTo(p2)

    expect(r).equal(Math.PI)
  })

  it('Should return a coordinates object correctly', () => {
    const p = new LazyPoint(511.5932, 159.999994)

    const r = p.toObject()

    expect(r).be.a('object')
    expect(r.x).equal(511.5932)
    expect(r.y).equal(159.999994)
  })
})
