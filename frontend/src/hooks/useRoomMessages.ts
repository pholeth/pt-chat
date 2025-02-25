import { getTokenHeader } from '../utils/getToken';
import { GetMessagesByRoomDocument, MessageType } from '../generated/graphql';
import { ApolloError, useQuery } from '@apollo/client';
import { useCallback, useEffect, useState } from 'react';

type RoomMessagesQuery = {
    loading: boolean;
    error: ApolloError | undefined;
    messages: MessageType[];
    addMessage: (message: MessageType) => void;
};

/**
 * Hook to retrieve the room's messages using GraphQL
 *
 * @param roomId
 * @returns
 *  - messages, the list of message
 *  - loading, is loading
 *  - error, error in loading
 */
export const useRoomMessages = (roomId: string | undefined): RoomMessagesQuery => {
    const [messages, setMessages] = useState<MessageType[]>([]);
    const { data, loading, error } = useQuery(GetMessagesByRoomDocument, {
        variables: { roomId },
        context: {
            headers: {
                ...getTokenHeader(),
            },
        },
    });

    useEffect(() => {
        if (!loading && !error && data) {
            setMessages(data.getMessagesByRoom);
        }
    }, [data, loading, error]);

    const addMessage = useCallback((message: MessageType) => {
        setMessages((prev) => [...prev, message]);
    }, []);

    return { messages, loading, error, addMessage }
};
