import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/Layout'
import DemoSwitcher from './components/DemoSwitcher'
import Dashboard from './pages/Dashboard'
import RepayPlus from './pages/RepayPlus'
import PurchaseHistory from './pages/PurchaseHistory'
import Storage from './pages/Storage'
import Notifications from './pages/Notifications'
import Settings from './pages/Settings'
import Onboarding, { About, LoggedOut } from './site/Onboarding'
import { AppStateProvider, ToastProvider } from './state/AppState'

export default function App() {
  return (
    <AppStateProvider>
      <ToastProvider>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/repay-plus" element={<RepayPlus />} />
            <Route path="/purchase-history" element={<PurchaseHistory />} />
            <Route path="/storage" element={<Storage />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="/get-started" element={<Onboarding />} />
          <Route path="/about" element={<About />} />
          <Route path="/logged-out" element={<LoggedOut />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
        <DemoSwitcher />
      </ToastProvider>
    </AppStateProvider>
  )
}
