import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { useAuth } from "./context/auth";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Estadisticas from "./pages/Estadisticas";
import Leaderboard from "./pages/Leaderboard";
import Perfil from "./pages/Perfil";
import InstallPWA from "./components/InstallPWA";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <InstallPWA />

        <Routes>
          <Route path="/" element={<Login />} />

          <Route
            path="/home"
            element={
              <Protected>
                <Home />
              </Protected>
            }
          />

          <Route
            path="/estadisticas"
            element={
              <Protected>
                <Estadisticas />
              </Protected>
            }
          />

          <Route
            path="/leaderboard"
            element={
              <Protected>
                <Leaderboard />
              </Protected>
            }
          />

          <Route
            path="/perfil"
            element={
              <Protected>
                <Perfil />
              </Protected>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

function Protected({ children }) {
  const { user } = useAuth();

  return user ? children : <Navigate to="/" replace />;
}

export default App;