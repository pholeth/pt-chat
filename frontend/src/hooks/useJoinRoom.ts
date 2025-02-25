import { useMutation } from "@apollo/client";
import { JoinRoomDocument } from "../generated/graphql";
import { getTokenHeader } from "../utils/getToken";

/**
 * Hook to receive the new message via the GraphQL subscription
 */
export const useJoinRoom = () => {
    const [qlJoinRoom] = useMutation(JoinRoomDocument);

    const joinRoom = async (roomId: string | undefined) => {
        if (!roomId) return false;

        const response = await qlJoinRoom({
            variables: {
                roomId,
            },
            context: {
                headers: {
                    ...getTokenHeader(),
                },
            },
            errorPolicy: 'all',
        });

        if (response?.errors) {
            return false;
        }

        const { data } = response;
        return data?.joinRoom?.success;
    }

    return [joinRoom];
}