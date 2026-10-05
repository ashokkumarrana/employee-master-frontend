import { useState } from "react";
import { ThemeProvider } from "@mui/material/styles";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./apps/layout/MainLayout";
import Login from "./apps/pages/auth/login";
import theme from "./theme/theme";

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token")
  );

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login onLogin={setToken} />} />
          <Route path="/*" element={token ? <MainLayout onLogout={() => setToken(null)} /> : <Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;