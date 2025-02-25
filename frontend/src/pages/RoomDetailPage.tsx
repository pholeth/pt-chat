import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    CreateMessageDocument,
    MessageType,
    UserAction,
} from '../generated/graphql';
import { useMutation } from '@apollo/client';
import { useRoom } from '../hooks/useRoom';
import { format } from 'date-fns';
import { useRoomMessages } from '../hooks/useRoomMessages';
import { getTokenHeader } from '../utils/getToken';
import { useReceiveMessage } from '../hooks/useReceiveMessage';
import { TIME_FORMAT } from '../config';
import { useRoomUsers } from '../hooks/useRoomUsers';
import { useLeaveRoom } from '../hooks/useLeaveRoom';
import { useUserEvent } from '../hooks/useUserEvent';
import Toast from '../components/Toast';
import { useMe } from '../hooks/useMe';

const RoomDetailPage: React.FC = () => {
    const navigate = useNavigate();

    const { roomId } = useParams<{ roomId: string }>();
    const { data: room } = useRoom(roomId);
    const { data: user } = useMe();
    const { messages, loading, error, addMessage } = useRoomMessages(roomId);
    const { joinedUsers, refetch: refetchRoomUsers } = useRoomUsers(roomId);
    const [leaveRoom] = useLeaveRoom();
    const [createMessage] = useMutation(CreateMessageDocument);
    const { receivedMessage } = useReceiveMessage(roomId);
    const { userEvent } = useUserEvent(roomId);

    const [ownMessage, setOwnMessage] = useState('');
    const [toast, setToast] = useState<string | null>(null);

    useEffect(() => {
        if (receivedMessage) {
            addMessage(receivedMessage);
        }
    }, [receivedMessage, addMessage]);

    useEffect(() => {
        if (!userEvent) return;

        if (userEvent?.userAction === UserAction.Join) {
            setToast(`${userEvent.username} just joined the room`);
        } else {
            setToast(`${userEvent.username} just left the room`);
        }

        refetchRoomUsers(undefined);
    }, [userEvent, refetchRoomUsers]);

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
        const value = e.target?.value;

        if (value) {
            setOwnMessage(value);
        }
    };

    const handleSend = async () => {
        await createMessage({
            variables: {
                roomId,
                content: ownMessage,
            },
            context: {
                headers: {
                    ...getTokenHeader(),
                },
            },
            errorPolicy: 'all',
        });

        setOwnMessage('');
    };

    const handleClickLeaveRoom = async () => {
        if (await leaveRoom(roomId)) {
            navigate('/rooms');
        }
    };

    const chatClassNames = useMemo(() => {
        const classNames: string[] = [];
        let isStart = true;

        messages.forEach((_, index) => {
            if (index === 0) {
                classNames[0] = 'chat chat-start';
                return;
            }

            const needSwap =
                messages[index].sender.id !== messages[index - 1].sender.id;

            isStart = needSwap ? !isStart : isStart;
            classNames[index] = [
                'chat',
                isStart ? 'chat-start' : 'chat-end',
            ].join(' ');
        });

        return classNames;
    }, [messages]);

    return (
        <div className="flex flex-col items-flex-start justify-space-between min-h-screen p-4 bg-gray-100 w-full max-w-full">
            <div className="flex flex-row flex-nowrap items-center mb-4">
                <h1 className="flex-grow">{room?.name}</h1>
                <button
                    className="btn btn-md btn-secondary"
                    onClick={handleClickLeaveRoom}
                >
                    Leave room
                </button>
            </div>
            <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">Joined Users:</h2>
                <div className="flex flex-wrap gap-2">
                    {joinedUsers.length > 0 ? (
                        joinedUsers.map((user) => (
                            <span
                                key={user.id}
                                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                            >
                                {user.name}
                            </span>
                        ))
                    ) : (
                        <p>No users joined yet.</p>
                    )}
                </div>
            </div>
            <div className="bg-white p-2 rounded-md shadow-2xl w-full">
                <div className="mb-6">
                    {loading && <p>Loading</p>}
                    {error && <p>Error: {error?.message}</p>}

                    {!error &&
                        !loading &&
                        messages.map((message: MessageType, index: number) => (
                            <div
                                className={chatClassNames[index]}
                                key={`message-${index}`}
                            >
                                <div className="chat-header">
                                    {message.sender.name}&nbsp;
                                    <time className="text-xs opacity-50">
                                        {format(message.createdAt, TIME_FORMAT)}
                                    </time>
                                </div>
                                <div className={`chat-bubble`}>
                                    {message.content}
                                </div>
                            </div>
                        ))}
                </div>
            </div>
            <div className="text-blue-800 rounded-full text-lg mt-3 font-medium">
                Hello <b>{user?.name}</b>,
            </div>
            <textarea
                className="textarea textarea-bordered textarea-primary mt-4 mb-4"
                placeholder="What you want to say?"
                value={ownMessage}
                onChange={handleTextChange}
            ></textarea>
            <button className="btn btn-primary" onClick={handleSend}>
                Send
            </button>
            {toast && <Toast message={toast} onClose={() => setToast(null)} />}
        </div>
    );
};

export default RoomDetailPage;
