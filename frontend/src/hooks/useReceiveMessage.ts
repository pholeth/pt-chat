import { useSubscription } from "@apollo/client";
import { MessageCreatedDocument, MessageCreatedSubscription, MessageType } from "../generated/graphql";
import { useEffect, useState } from "react";

/**
 * Hook to receive the new message via the GraphQL subscription
 */
export const useReceiveMessage = (roomId: string | undefined) => {
    const [receivedMessage, setReceivedMessage] = useState<MessageType>();
    const { data, error, loading } =
        useSubscription<MessageCreatedSubscription>(MessageCreatedDocument, {
            variables: {
                roomId: String(roomId),
            },
        });

    useEffect(() => {
        if (data?.messageCreated) {
            setReceivedMessage(data.messageCreated);
        }
    }, [data]);

    return { receivedMessage, loading, error }
}