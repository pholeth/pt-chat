import React, { useState, useEffect, SyntheticEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Room } from '../types';
import { useMe } from '../hooks/useMe';
import { getTokenHeader } from '../utils/getToken';
import { useJoinRoom } from '../hooks/useJoinRoom';

const RoomsPage: React.FC = () => {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState<Room[]>([]);
    const { data: user } = useMe();
    const [newRoomName, setNewRoomName] = useState('');
    const [joinRoom] = useJoinRoom();

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/room/list`,
                    {
                        headers: {
                            ...getTokenHeader(),
                        },
                    },
                );
                setRooms(response.data.rooms);
            } catch (error) {
                console.error('Error fetching rooms:', error);
            }
        };

        fetchRooms();
    }, []);

    const handleAddRoom = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newRoomName.trim()) {
            try {
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/room/`,
                    {
                        name: newRoomName,
                    },
                    {
                        headers: {
                            ...getTokenHeader(),
                        },
                    },
                );

                const newRoom: Room = { ...response.data };

                setRooms([...rooms, newRoom]);
                setNewRoomName('');
            } catch (error) {
                console.error('Error adding room:', error);
            }
        }
    };

    const handleJoinRoom = async (e: SyntheticEvent, roomId: string) => {
        e.preventDefault();

        if (await joinRoom(roomId)) {
            navigate(`/room/${roomId}`);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
                <h2 className="text-2xl font-semibold mb-6 text-center">
                    Hello {user?.name},
                </h2>

                <h1 className="text-3xl font-semibold mb-6 text-center">
                    Select Your Room
                </h1>

                <ul className="mb-6">
                    {rooms.map(({ id, name }) => (
                        <li
                            key={id}
                            onClick={(e) => handleJoinRoom(e, String(id))}
                            className="p-4 rounded-md transition-all duration-300 cursor-pointer
                       bg-white hover:bg-primary-content"
                        >
                            <Link
                                to={`/room/${id}`}
                                className="text-blue-600 hover:underline"
                            >
                                {name}
                            </Link>
                        </li>
                    ))}
                </ul>

                <form onSubmit={handleAddRoom}>
                    <input
                        type="text"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Create new room"
                    />
                    <button type="submit" className="btn btn-primary w-full">
                        Create and Join
                    </button>
                </form>
            </div>
        </div>
    );
};

export default RoomsPage;
