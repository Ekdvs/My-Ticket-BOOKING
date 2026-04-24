
import { Outlet } from 'react-router-dom'
import './App.css'
import { Toaster } from 'react-hot-toast'

function App() {


  return (
    <div className="w-full min-h-screen bg-primary flex flex-col">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1f2937", // dark gray
            color: "#fff",
            border: "1px solid #FFD700",
          },
          success: {
            style: {
              background: "#16a34a",
            },
          },
          error: {
            style: {
              background: "#dc2626",
            },
          },
        }}
      />


      <div className="flex-1 " >
        <Outlet />
      </div>


    </div>
  )
}

export default App
