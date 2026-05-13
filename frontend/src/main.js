import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import { initPushNotifications, subscribeToPush } from './config/pushNotifications.js'

const app = createApp(App)

initPushNotifications()

const token = localStorage.getItem('token')
const userRole = localStorage.getItem('userRole')

if (token && userRole === 'familia') {
  subscribeToPush().then((subscription) => {
    if (subscription) {
      console.log('Push subscription successful for family user')
    }
  })
}

app.mount('#app')
