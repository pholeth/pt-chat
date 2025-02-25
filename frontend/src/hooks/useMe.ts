import { useQuery } from 'react-query';
import axios from 'axios';
import { getTokenHeader } from '../utils/getToken';
import { User } from '../types';

export const useMe = () => {
    return useQuery<User, Error>(['me'], async () => {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/me`, {
            headers: {
                ...getTokenHeader()
            },
        });

        return response.data;
    });
};

