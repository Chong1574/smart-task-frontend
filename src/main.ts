import { createApp } from 'vue'
import { createPinia } from 'pinia' // Importar Pinia
import './style.css'
import App from './App.vue'

const app = createApp(App)
const pinia = createPinia() // Crear la instancia

app.use(pinia) // ¡IMPORTANTE! Instalar Pinia antes de montar la app
app.mount('#app')