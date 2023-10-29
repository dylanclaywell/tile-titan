import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/MainView.vue'
import Toolbar from '../views/ToolbarView.vue'
import File from '../views/FileView.vue'
import Layer from '../views/LayerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      components: {
        Main,
        Toolbar,
        File,
        Layer
      }
    }
  ]
})

export default router
