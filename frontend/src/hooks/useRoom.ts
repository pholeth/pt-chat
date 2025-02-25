import axios from "axios";
import { useQuery } from "react-query";
import { getTokenHeader } from "../utils/getToken";

type RoomResponse = {
    id: string;
    name: string;
};

/**
 * Hook to retrieve the room info from API
 *
 * @param roomId, the room ID
 * @returns the React query
 */
export const useRoom = (roomId: string | undefined) =>
    useQuery<RoomResponse>({
        queryKey: `room-${roomId}`,
        queryFn: async () => {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/room/${roomId}`,
                {
                    headers: {
                        ...getTokenHeader(),
                    },
                }
            );

            return response.data;
        },
        enabled: !!roomId,
    });
