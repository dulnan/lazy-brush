import LazyBrush from './../src/LazyBrush'
import { Point } from './../src/LazyPoint'
import { Catenary } from 'catenary-curve'

const LAZY_RADIUS = 60
const BRUSH_RADIUS = 12.5
const DAMPING = 90

const styleVariables = {
  colorPrimary: '#f2530b',
  colorBlack: '#0a0302',
  colorCatenary: '#0a0302'
}

function midPointBtw(p1: Point, p2: Point) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  }
}

interface SceneOptions {
  canvasContainer: string
  sidebar: string
  canvas: {
    interface: string
    drawing: string
    temp: string
    grid: string
  }
  slider: {
    brush: string
    lazy: string
    damping: string
  }
  button: {
    lazy: string
    clear: string
    menu: string
  }
}

export default class Scene {
  sidebar: HTMLElement
  canvasContainer: HTMLElement
  button: {
    menu: HTMLButtonElement
    lazy: HTMLButtonElement
    clear: HTMLButtonElement
  }
  slider: {
    brush: HTMLInputElement
    lazy: HTMLInputElement
    damping: HTMLInputElement
  }
  canvas: {
    interface: HTMLCanvasElement
    drawing: HTMLCanvasElement
    temp: HTMLCanvasElement
    grid: HTMLCanvasElement
  }
  context: {
    interface: CanvasRenderingContext2D
    drawing: CanvasRenderingContext2D
    temp: CanvasRenderingContext2D
    grid: CanvasRenderingContext2D
  }
  lazy: LazyBrush
  catenary: any
  points: Point[]
  mouseHasMoved: boolean
  valuesChanged: boolean
  isDrawing: boolean
  isPressing: boolean
  brushRadius: number
  chainLength: number
  damping: number
  dpi: number

  x: number
  y: number

  constructor(options: SceneOptions) {
    this.sidebar = document.getElementById(options.sidebar)!
    this.canvasContainer = document.getElementById(options.canvasContainer)!

    this.x = 0
    this.y = 0

    this.button = Object.keys(options.button).reduce((acc, b) => {
      acc[b] = document.getElementById(options.button[b])
      return acc
    }, {} as any)

    this.slider = Object.keys(options.slider).reduce((acc, s) => {
      acc[s] = document.getElementById(options.slider[s])
      return acc
    }, {} as any)

    // @ts-ignore
    this.canvas = {}
    // @ts-ignore
    this.context = {}

    Object.keys(options.canvas).forEach((c) => {
      const el = document.getElementById(options.canvas[c]) as HTMLCanvasElement
      this.canvas[c] = el
      this.context[c] = el.getContext('2d')
    })

    this.catenary = new Catenary()

    this.lazy = new LazyBrush({
      radius: LAZY_RADIUS,
      enabled: true,
      initialPoint: {
        x: window.innerWidth / 2,
        y: window.innerHeight / 2
      }
    })

    this.points = []

    this.mouseHasMoved = true
    this.valuesChanged = true
    this.isDrawing = false
    this.isPressing = false

    this.points = []

    this.brushRadius = BRUSH_RADIUS
    this.chainLength = LAZY_RADIUS
    this.damping = DAMPING

    this.dpi = 1
  }

  init() {
    // Listeners for mouse events
    this.canvas.interface.addEventListener(
      'mousedown',
      this.handlePointerDown.bind(this)
    )
    this.canvas.interface.addEventListener(
      'mouseup',
      this.handlePointerUp.bind(this)
    )
    this.canvas.interface.addEventListener('mousemove', (e) =>
      this.handlePointerMove(e.clientX, e.clientY)
    )
    this.canvas.interface.addEventListener('contextmenu', (e) =>
      this.handleContextMenu(e)
    )

    // Listeners for touch events
    this.canvas.interface.addEventListener('touchstart', (e) =>
      this.handleTouchStart(e)
    )
    this.canvas.interface.addEventListener('touchend', (e) =>
      this.handleTouchEnd(e)
    )
    this.canvas.interface.addEventListener('touchmove', (e) =>
      this.handleTouchMove(e)
    )

    // Listeners for click events on butons
    this.button.menu.addEventListener('click', (e) => this.handleButtonMenu(e))
    this.button.clear.addEventListener('click', (e) =>
      this.handleButtonClear(e)
    )
    this.button.lazy.addEventListener('click', (e) => this.handleButtonLazy(e))

    // Listeners for input events on range sliders
    this.slider.brush.addEventListener('input', (e) =>
      this.handleSliderBrush(e)
    )
    this.slider.lazy.addEventListener('input', (e) => this.handleSliderLazy(e))
    this.slider.damping.addEventListener('input', (e) =>
      this.handleSliderDamping(e)
    )

    // Set initial value for range sliders
    this.slider.brush.value = this.brushRadius.toString()
    this.slider.lazy.value = this.chainLength.toString()
    this.slider.damping.value = this.damping.toString()

    const observeCanvas = new ResizeObserver((entries, observer) =>
      this.handleCanvasResize(entries, observer)
    )
    observeCanvas.observe(this.canvasContainer)

    const observeSidebar = new ResizeObserver((entries, observer) =>
      this.handleSidebarResize(entries, observer)
    )
    observeSidebar.observe(this.sidebar)

    this.loop()

    window.setTimeout(() => {
      const initX = window.innerWidth / 2
      const initY = window.innerHeight / 2
      this.lazy.update(
        { x: initX - this.chainLength / 4, y: initY },
        { both: true }
      )
      this.lazy.update(
        { x: initX + this.chainLength / 4, y: initY },
        { both: false }
      )
      this.x = this.lazy.pointer.x
      this.y = this.lazy.pointer.y
      this.mouseHasMoved = true
      this.valuesChanged = true
      this.clearCanvas()
    }, 100)
  }

  handleTouchStart(e) {
    this.x = e.changedTouches[0].clientX
    this.y = e.changedTouches[0].clientY
    this.handlePointerDown(e)

    this.mouseHasMoved = true
  }

  handleTouchMove(e) {
    e.preventDefault()
    this.handlePointerMove(
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY
    )
  }

  handleTouchEnd(e) {
    this.handlePointerUp(e)
    const brush = this.lazy.getBrushCoordinates()
    this.lazy.update({ x: brush.x, y: brush.y }, { both: true })
    this.mouseHasMoved = true
  }

  handleContextMenu(e) {
    e.preventDefault()
    if (e.button === 2) {
      this.clearCanvas()
    }
  }

  handleButtonMenu(e) {
    e.preventDefault()
    document.body.classList.toggle('menu-visible')
  }

  handleButtonClear(e) {
    e.preventDefault()
    this.clearCanvas()
  }

  handleButtonLazy(e) {
    e.preventDefault()
    this.valuesChanged = true
    this.button.lazy.classList.toggle('disabled')

    if (this.lazy.isEnabled()) {
      this.button.lazy.innerHTML = 'Off'
      this.lazy.disable()
    } else {
      this.button.lazy.innerHTML = 'On'
      this.lazy.enable()
    }
  }

  handleSidebarResize(entries, observer) {
    for (const entry of entries) {
      const { left, top, width, height } = entry.contentRect
      this.loop({ once: true })
    }
  }

  handleCanvasResize(entries, observer) {
    this.dpi = window.devicePixelRatio

    for (const entry of entries) {
      const { width, height } = entry.contentRect
      this.setCanvasSize(this.canvas.interface, width, height, 1.25)
      this.setCanvasSize(this.canvas.drawing, width, height, 1)
      this.setCanvasSize(this.canvas.temp, width, height, 1)
      this.setCanvasSize(this.canvas.grid, width, height, 2)

      this.drawGrid(this.context.grid)
      this.loop({ once: true })
    }
  }

  handleSliderBrush(e) {
    const val = parseInt(e.target.value)
    this.valuesChanged = true
    this.brushRadius = val
  }

  handleSliderDamping(e) {
    const val = parseInt(e.target.value)
    this.valuesChanged = true
    this.damping = val
  }

  handleSliderLazy(e) {
    this.valuesChanged = true
    const val = parseInt(e.target.value)
    this.chainLength = val
    this.lazy.setRadius(val)
  }

  setCanvasSize(canvas, width, height, maxDpi = 4) {
    let dpi = this.dpi

    // reduce canvas size for hidpi desktop screens
    if (window.innerWidth > 1024) {
      dpi = Math.min(this.dpi, maxDpi)
    }

    canvas.width = width * dpi
    canvas.height = height * dpi
    canvas.style.width = width
    canvas.style.height = height
    canvas.getContext('2d').scale(dpi, dpi)
  }

  handlePointerDown(e) {
    e.preventDefault()
    this.isPressing = true
  }

  handlePointerUp(e) {
    e.preventDefault()
    this.isDrawing = false
    this.isPressing = false
    this.points.length = 0

    const dpi = window.innerWidth > 1024 ? 1 : window.devicePixelRatio
    const width = this.canvas.temp.width / dpi
    const height = this.canvas.temp.height / dpi

    this.context.drawing.drawImage(this.canvas.temp, 0, 0, width, height)
    this.context.temp.clearRect(0, 0, width, height)
  }

  handlePointerMove(x: number, y: number) {
    this.x = x
    this.y = y
  }

  clearCanvas() {
    this.valuesChanged = true
    this.context.drawing.clearRect(
      0,
      0,
      this.canvas.drawing.width,
      this.canvas.drawing.height
    )
    this.context.temp.clearRect(
      0,
      0,
      this.canvas.temp.width,
      this.canvas.temp.height
    )
  }

  loop({ once = false } = {}) {
    const pointer = this.lazy.getPointerCoordinates()
    const brush = this.lazy.getBrushCoordinates()

    this.drawInterface(this.context.interface, this.lazy.getBrushCoordinates())
    this.updateLazyBrush()
    this.mouseHasMoved = false
    this.valuesChanged = false

    if (!once) {
      window.requestAnimationFrame(() => {
        this.loop()
      })
    }
  }

  updateLazyBrush() {
    const hasChanged = this.lazy.update(
      { x: this.x, y: this.y },
      { damping: this.damping / 100 }
    )
    const isDisabled = !this.lazy.isEnabled()
    const hasMoved = this.lazy.brushHasMoved()

    if (!hasMoved) {
      // return
    }

    this.context.temp.lineJoin = 'round'
    this.context.temp.lineCap = 'round'
    this.context.temp.strokeStyle = styleVariables.colorPrimary

    if (
      (this.isPressing && !this.isDrawing) ||
      (isDisabled && this.isPressing)
    ) {
      this.isDrawing = true
      this.points.push(this.lazy.getBrushCoordinates())
    }

    if (this.isDrawing) {
      this.context.temp.clearRect(
        0,
        0,
        this.context.temp.canvas.width,
        this.context.temp.canvas.height
      )
      this.context.temp.lineWidth = this.brushRadius * 2
      this.points.push(this.lazy.getBrushCoordinates())

      var p1 = this.points[0]
      var p2 = this.points[1]

      this.context.temp.moveTo(p2.x, p2.y)
      this.context.temp.beginPath()

      for (var i = 1, len = this.points.length; i < len; i++) {
        // we pick the point between pi+1 & pi+2 as the
        // end point and p1 as our control point
        var midPoint = midPointBtw(p1, p2)
        this.context.temp.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y)
        p1 = this.points[i]
        p2 = this.points[i + 1]
      }
      // Draw last line as a straight line while
      // we wait for the next point to be able to calculate
      // the bezier control point
      this.context.temp.lineTo(p1.x, p1.y)
      this.context.temp.stroke()
    }

    this.mouseHasMoved = true
  }

  drawGrid(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    ctx.beginPath()
    ctx.setLineDash([5, 1])
    ctx.setLineDash([])
    // ctx.strokeStyle = styleVariables.colorInterfaceGrid
    ctx.strokeStyle = 'rgba(150,150,150,0.17)'
    ctx.lineWidth = 0.5

    const gridSize = 25

    let countX = 0
    while (countX < ctx.canvas.width) {
      countX += gridSize
      ctx.moveTo(countX, 0)
      ctx.lineTo(countX, ctx.canvas.height)
    }
    ctx.stroke()

    let countY = 0
    while (countY < ctx.canvas.height) {
      countY += gridSize
      ctx.moveTo(0, countY)
      ctx.lineTo(ctx.canvas.width, countY)
    }
    ctx.stroke()
  }

  drawInterface(ctx: CanvasRenderingContext2D, brush: Point) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    // Draw brush point
    ctx.beginPath()
    ctx.fillStyle = styleVariables.colorPrimary
    ctx.arc(brush.x, brush.y, this.brushRadius, 0, Math.PI * 2, true)
    ctx.fill()

    // Draw mouse point
    ctx.beginPath()
    ctx.fillStyle = styleVariables.colorBlack
    ctx.arc(this.x, this.y, 4, 0, Math.PI * 2, true)
    ctx.fill()

    //Draw catharina
    if (this.lazy.isEnabled()) {
      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.lineCap = 'round'
      ctx.setLineDash([2, 4])
      ctx.strokeStyle = styleVariables.colorCatenary
      this.catenary.drawToCanvas(
        this.context.interface,
        brush,
        { x: this.x, y: this.y },
        this.chainLength
      )
      ctx.stroke()
    }

    // Draw mouse point
    ctx.beginPath()
    ctx.fillStyle = '#222222'
    ctx.arc(brush.x, brush.y, 2, 0, Math.PI * 2, true)
    ctx.fill()
  }
}
