// Import classes
import Scene from './Scene'
import './styles/index.scss'

// Init app
document.addEventListener('DOMContentLoaded', () => {
  const scene = new Scene({
    canvasContainer: 'canvas_container',
    sidebar: 'sidebar',
    canvas: {
      interface: 'canvas_interface',
      drawing: 'canvas_drawing',
      temp: 'canvas_temp',
      grid: 'canvas_grid'
    },
    slider: {
      brush: 'slider_brush',
      lazy: 'slider_lazy'
    },
    button: {
      lazy: 'button_lazy',
      clear: 'button_clear',
      menu: 'button_menu'
    }
  })

  scene.init()
})
