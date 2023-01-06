<template>
  <div class="relative z-10 w-full h-canvas md:h-screen" ref="container">
    <canvas
      class="canvas z-40"
      ref="canvasInterface"
      @mousedown.prevent="onMouseDown"
      @mouseup.prevent="onPointerUp"
      @mousemove.prevent="onMouseMove"
      @touchstart.prevent="onTouchStart"
      @touchmove.prevent="onTouchMove"
      @touchend.prevent="onTouchEnd"
    ></canvas>
    <canvas class="canvas z-30" ref="canvasTemp"></canvas>
    <canvas class="canvas z-20" ref="canvasDrawing"></canvas>
    <canvas class="canvas z-10" ref="canvasGrid"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import LazyBrush from '../../src/LazyBrush'
import { Point } from '../../src/LazyPoint'
import { Catenary } from 'catenary-curve'

const styleVariables = {
  colorPrimary: '#f2530b',
  colorBlack: '#0a0302',
  colorCatenary: '#0a0302'
}

const props = defineProps({
  brushRadius: {
    type: Number,
    default: 12.5
  },
  lazyRadius: {
    type: Number,
    default: 60
  },
  damping: {
    type: Number,
    default: 90
  },
  dpi: {
    type: Number,
    default: 1
  },
  clear: {
    type: Number,
    default: 0
  },
  enabled: {
    type: Boolean,
    default: false
  }
})

const width = ref(1280)
const height = ref(768)
const dpi = ref(1)

watch(
  () => [height.value, width.value, props.clear],
  () => {
    onDimensionsChange()
    clearCanvas()
    drawGrid()
    drawInterface()
  }
)

watch(
  () => props.enabled,
  (isEnabled: boolean) => {
    if (isEnabled) {
      lazy.enable()
    } else {
      lazy.disable()
    }
  }
)

watch(
  () => props.lazyRadius,
  (radius) => {
    lazy.setRadius(radius)
  }
)

const isDrawing = ref(false)
const isPressing = ref(false)
const points: Point[] = []
const x = ref(width.value / 2)
const y = ref(height.value / 2)

const valuesChanged = ref(false)

const container = ref(null as HTMLDivElement)
const canvasInterface = ref(null as HTMLCanvasElement)
const canvasDrawing = ref(null as HTMLCanvasElement)
const canvasTemp = ref(null as HTMLCanvasElement)
const canvasGrid = ref(null as HTMLCanvasElement)

const lazy = new LazyBrush({
  enabled: true,
  radius: props.lazyRadius,
  initialPoint: {
    x: x.value,
    y: y.value
  }
})

const catenary = new Catenary()

function onMouseDown() {
  isPressing.value = true
}

function onPointerUp() {
  isDrawing.value = false
  isPressing.value = false
  points.length = 0

  const dpi = width.value > 1024 ? 1 : window.devicePixelRatio
  const w = canvasTemp.value.width / dpi
  const h = canvasTemp.value.height / dpi

  canvasDrawing.value.getContext('2d').drawImage(canvasTemp.value, 0, 0, w, h)
  canvasTemp.value.getContext('2d').clearRect(0, 0, w, h)

  // const rect = container.value.getBoundingClientRect()
  // x.value = e.clientX - rect.left
  // y.value = e.clientY - rect.top
  // lazy.update({ x: x.value, y: y.value }, { both: true })
}

function handlePointerMove(newX: number, newY: number) {
  const rect = container.value.getBoundingClientRect()
  x.value = newX - rect.left
  y.value = newY - rect.top
}

function onMouseMove(e: MouseEvent) {
  handlePointerMove(e.clientX, e.clientY)
}

function onTouchStart(e: TouchEvent) {
  handlePointerMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
  lazy.update({ x: x.value, y: y.value }, { both: true })
  // x.value = e.changedTouches[0].clientX
  // y.value = e.changedTouches[0].clientY
  isPressing.value = true
}

function onTouchMove(e: TouchEvent) {
  handlePointerMove(e.changedTouches[0].clientX, e.changedTouches[0].clientY)
}

function onTouchEnd() {
  onPointerUp()
  const brush = lazy.getBrushCoordinates()
  lazy.update({ x: brush.x, y: brush.y }, { both: true })
}

function drawGrid() {
  const ctx = canvasGrid.value.getContext('2d')
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  ctx.beginPath()
  ctx.setLineDash([5, 1])
  ctx.setLineDash([])
  // ctx.strokeStyle = styleVariables.colorInterfaceGrid
  ctx.strokeStyle = 'rgba(0,0,0,0.05)'
  ctx.lineWidth = 1

  const gridSize = 24

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

function drawInterface() {
  const ctx = canvasInterface.value.getContext('2d')
  const brush = lazy.getBrushCoordinates()
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)

  // Draw brush point
  ctx.beginPath()
  ctx.fillStyle = styleVariables.colorPrimary
  ctx.arc(brush.x, brush.y, props.brushRadius, 0, Math.PI * 2, true)
  ctx.fill()

  // Draw mouse point
  ctx.beginPath()
  ctx.fillStyle = styleVariables.colorBlack
  ctx.arc(x.value, y.value, 4, 0, Math.PI * 2, true)
  ctx.fill()

  //Draw catharina
  if (lazy.isEnabled()) {
    ctx.beginPath()
    ctx.lineWidth = 1.5
    ctx.lineCap = 'round'

    const pullOffset = Math.max(lazy.distance - lazy.radius, -0.1)

    const stretchFactor = pullOffset / lazy.radius + 1
    ctx.setLineDash([5 * stretchFactor, 5 * stretchFactor])
    ctx.strokeStyle =
      pullOffset > -0.1 ? styleVariables.colorCatenary : 'rgba(0,0,0,0.3)'
    catenary.drawToCanvas(
      ctx,
      brush,
      { x: x.value, y: y.value },
      props.lazyRadius
    )
    ctx.stroke()
  }

  // Draw mouse point
  ctx.beginPath()
  ctx.fillStyle = '#222222'
  ctx.arc(brush.x, brush.y, 2, 0, Math.PI * 2, true)
  ctx.fill()
}

function setCanvasSize(
  canvas: HTMLCanvasElement,
  w: number,
  h: number,
  maxDpi: number
) {
  const targetDpi = Math.min(props.dpi, maxDpi)
  canvas.width = w * targetDpi
  canvas.height = h * targetDpi
  canvas.style.width = width.toString()
  canvas.style.height = height.toString()
  canvas.getContext('2d').scale(targetDpi, targetDpi)
}

function onDimensionsChange() {
  setCanvasSize(canvasGrid.value, width.value, height.value, 4)
  setCanvasSize(canvasDrawing.value, width.value, height.value, 1)
  setCanvasSize(canvasTemp.value, width.value, height.value, 1)
  setCanvasSize(canvasInterface.value, width.value, height.value, 2)

  drawGrid()
  // this.loop({ once: true })
}

let raf: any = null

function loop() {
  drawInterface()
  updateLazyBrush()
  raf = requestAnimationFrame(loop)
}

function midPointBtw(p1: Point, p2: Point) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  }
}

function updateLazyBrush() {
  const hasChanged = lazy.update(
    { x: x.value, y: y.value },
    { damping: isDrawing.value ? props.damping / 100 : 1 }
  )
  const isDisabled = !lazy.isEnabled()
  const hasMoved = lazy.brushHasMoved()

  if (!hasMoved) {
    // return
  }

  const ctx = canvasTemp.value.getContext('2d')
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.strokeStyle = styleVariables.colorPrimary

  if (
    (isPressing.value && !isDrawing.value) ||
    (isDisabled && isPressing.value)
  ) {
    isDrawing.value = true
    points.push(lazy.getBrushCoordinates())
  }

  if (isDrawing.value) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    ctx.lineWidth = props.brushRadius * 2
    points.push(lazy.getBrushCoordinates())

    let p1 = points[0]
    let p2 = points[1]

    ctx.moveTo(p2.x, p2.y)
    ctx.beginPath()

    for (let i = 1, len = points.length; i < len; i++) {
      // we pick the point between pi+1 & pi+2 as the
      // end point and p1 as our control point
      const midPoint = midPointBtw(p1, p2)
      ctx.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y)
      p1 = points[i]
      p2 = points[i + 1]
    }
    // Draw last line as a straight line while
    // we wait for the next point to be able to calculate
    // the bezier control point
    ctx.lineTo(p1.x, p1.y)
    ctx.stroke()
  }
}

function clearCanvas() {
  valuesChanged.value = true
  canvasDrawing.value
    .getContext('2d')
    .clearRect(0, 0, canvasDrawing.value.width, canvasDrawing.value.height)
  canvasTemp.value
    .getContext('2d')
    .clearRect(0, 0, canvasTemp.value.width, canvasTemp.value.height)
}

let resizeTimeout: any = null

function setSizes() {
  width.value = container.value.clientWidth
  height.value = container.value.clientHeight
  dpi.value =
    width.value > 1024
      ? Math.min(window.devicePixelRatio, 4)
      : window.devicePixelRatio
}

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
})

onMounted(() => {
  setSizes()
  const observeCanvas = new ResizeObserver((entries, observer) => {
    clearTimeout(resizeTimeout)
    resizeTimeout = setTimeout(() => {
      setSizes()
    }, 500)
  })
  observeCanvas.observe(container.value)
  onDimensionsChange()
  drawGrid()
  drawInterface()
  loop()
})
</script>
