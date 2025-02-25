import { useMutation } from "@apollo/client";
import { getTokenHeader } from "../utils/getToken";
import { LeaveRoomDocument } from "../generated/graphql";

/**
 * Hook to receive the new message via the GraphQL subscription
 */
export const useLeaveRoom = () => {
    const [qlLeaveRoom] = useMutation(LeaveRoomDocument);

    const leaveRoom = async (roomId: string | undefined) => {
        if (!roomId) return false;

        const response = await qlLeaveRoom({
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
        return data?.leaveRoom?.success;
    }

    return [leaveRoom];
}