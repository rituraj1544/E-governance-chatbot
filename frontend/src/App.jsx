import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserChat from "./pages/UserChat";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<UserChat />} />
      </Routes>
    </BrowserRouter>
  );
}
