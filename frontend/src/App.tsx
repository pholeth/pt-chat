import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SigninPage from "./pages/SigninPage";
import RoomsPage from "./pages/RoomsPage";
import "./App.css";

const App: React.FC = () => {
  const [name, setName] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNameSubmit = (submittedName: string) => {
    setName(submittedName);
    navigate("/rooms");
  };

  return (
    <div className="App">
      {!name && <SigninPage onSubmit={handleNameSubmit} />}
      {name && <h1 className="text-3xl">Welcome, {name}!</h1>}
      <Routes>
        <Route path="/rooms" element={<RoomsPage />} />
        {/* ...other routes... */}
      </Routes>
    </div>
  );
};

export default App;
