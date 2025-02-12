import React, { useState, useEffect } from "react";
import axios from "axios";

interface SigninPageProps {
  onSubmit: (name: string) => void;
}

const SigninPage: React.FC<SigninPageProps> = ({ onSubmit }) => {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/user/`,
          {
            name,
          }
        );
        const accessToken = response.data.access_token;
        sessionStorage.setItem("access_token", accessToken);
        console.log(accessToken);
        onSubmit(name);
      } catch (error) {
        console.error("Error submitting name:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full">
        <h2 className="text-3xl font-semibold mb-6 text-center">
          Enter your name
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border border-gray-300 p-3 w-full mb-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your name"
          />
          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded-lg w-full hover:bg-blue-700 transition-colors"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default SigninPage;
