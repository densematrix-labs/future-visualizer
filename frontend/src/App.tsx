import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import PricingPage from './pages/PricingPage'
import PaymentSuccessPage from './pages/PaymentSuccessPage'
import { useDeviceId } from './hooks/useDeviceId'

function App() {
  const { i18n } = useTranslation()
  
  // Initialize device ID
  useDeviceId()
  
  // Set document language
  useEffect(() => {
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/payment/success" element={<PaymentSuccessPage />} />
        </Routes>
      </main>
    </>
  )
}

export default App
