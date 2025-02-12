import React, { useState, useEffect } from "react";
import axios from "axios";

const RoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<string[]>([]);
  const [newRoomName, setNewRoomName] = useState("");

  useEffect(() => {
    const fetchRooms = async () => {
      const token = sessionStorage.getItem("access_token");

      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/room/list`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRooms(response.data.rooms);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      }
    };

    fetchRooms();
  }, []);

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim()) {
      const token = sessionStorage.getItem("access_token");
      try {
        await axios.post(
          `${import.meta.env.VITE_API_URL}/room/`,
          {
            name: newRoomName,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setRooms([...rooms, newRoomName]);
        setNewRoomName("");
      } catch (error) {
        console.error("Error adding room:", error);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full">
        <h1 className="text-3xl font-semibold mb-6 text-center">Rooms</h1>
        <ul className="mb-6">
          {rooms.map((room, index) => (
            <li key={index} className="border-b border-gray-300 py-2">
              {room}
            </li>
          ))}
        </ul>
        <form onSubmit={handleAddRoom}>
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="New room name"
          />
          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition-colors"
          >
            Add Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default RoomsPage;
