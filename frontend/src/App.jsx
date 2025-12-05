import { Routes, Route } from 'react-router-dom'
import UserChat from './pages/UserChat'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<UserChat />} />
    </Routes>
  )
}
