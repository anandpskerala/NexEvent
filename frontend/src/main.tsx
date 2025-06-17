import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { Provider } from 'react-redux'
import store from './store/index.ts'
import { Toaster } from 'sonner';
import { setupAxiosInterceptors } from './utils/axiosInstance.ts'

setupAxiosInterceptors(store.dispatch)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      {/* <APIProvider apiKey={config.map.apiKey}> */}
      <App />
      <Toaster
        richColors={true}
        position='top-right'
        expand={true}
        visibleToasts={5}
        closeButton={true}
        toastOptions={{
          style: {
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(148, 163, 184, 0.2)',
            borderRadius: '12px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.05)',
          },
          className: 'beautiful-toast',
        }}
      />
      {/* </APIProvider> */}
    </Provider>
  </StrictMode>,
)
