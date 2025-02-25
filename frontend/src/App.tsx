import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import SigninPage from './pages/SigninPage';
import RoomsPage from './pages/RoomsPage';
import './App.css';
import RoomDetailPage from './pages/RoomDetailPage';
import { QueryClient, QueryClientProvider } from 'react-query';

const App: React.FC = () => {
    const navigate = useNavigate();
    const queryClient = new QueryClient();

    const handleNameSubmit = () => {
        navigate('/rooms');
    };

    return (
        <QueryClientProvider client={queryClient}>
            <div className="App">
                <Routes>
                    <Route path="/rooms" element={<RoomsPage />} />
                    <Route path="/room/:roomId" element={<RoomDetailPage />} />
                    <Route
                        path="/"
                        element={<SigninPage onSubmit={handleNameSubmit} />}
                    />
                    {/* ...other routes... */}
                </Routes>
            </div>
        </QueryClientProvider>
    );
};

export default App;
