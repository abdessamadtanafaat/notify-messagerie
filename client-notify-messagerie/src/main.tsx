import React from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import store from './store/store'
import { Provider } from 'react-redux'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App'


const rootElement = document.getElementById('root')
const root = createRoot(rootElement!)

root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <React.StrictMode>
        <ToastContainer position="top-center" />
          <App/>
        </React.StrictMode>
    </GoogleOAuthProvider>

  </Provider>
)
