import React, { useState } from "react";
import NameModal from "./components/NameModal";
import "./App.css";

const App: React.FC = () => {
  const [name, setName] = useState<string | null>(null);

  const handleNameSubmit = (submittedName: string) => {
    setName(submittedName);
  };

  return (
    <div className="App">
      {!name && <NameModal onSubmit={handleNameSubmit} />}
      {name && <h1 className="text-3xl">Welcome, {name}!</h1>}
    </div>
  );
};

export default App;
