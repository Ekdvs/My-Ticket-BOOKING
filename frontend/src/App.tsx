
import { Outlet } from 'react-router-dom'
import './App.css'
import { Toaster } from 'react-hot-toast'

function App() {

const toastBaseStyle = {
  borderRadius: "12px",
  fontSize: "14px",
  padding: "14px 16px",
  maxWidth: "360px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
  fontFamily: "inherit",
};
  return (
    <div className="w-full min-h-screen bg-primary flex flex-col">
              <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerStyle={{ top: 24, right: 24 }}
          toastOptions={{
            duration: 4000,
            style: toastBaseStyle,

            success: {
              duration: 4000,
              style: {
                ...toastBaseStyle,
                background: "#f0fdf4",
                color: "#166534",
                border: "1px solid #86efac",
              },
              iconTheme: {
                primary: "#16a34a",
                secondary: "#ffffff",
              },
            },

            error: {
              duration: 6000, // longer — users need time to read errors
              style: {
                ...toastBaseStyle,
                background: "#fef2f2",
                color: "#991b1b",
                border: "1px solid #fca5a5",
              },
              iconTheme: {
                primary: "#dc2626",
                secondary: "#ffffff",
              },
            },

            loading: {
              style: {
                ...toastBaseStyle,
                background: "#f9fafb",
                color: "#374151",
                border: "1px solid #e5e7eb",
              },
              iconTheme: {
                primary: "#6b7280",
                secondary: "#e5e7eb",
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
