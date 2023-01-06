import './styles/main.css'

import { ViteSSG } from 'vite-ssg/single-page'
import App from './App.vue'

export const createApp = ViteSSG(App)
