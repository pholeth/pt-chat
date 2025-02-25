import { useSubscription } from "@apollo/client";
import { UserAction, UserEventDocument, UserEventSubscription } from "../generated/graphql";
import { useEffect, useState } from "react";

type UserEvent = {
    userAction: UserAction;
    username: string;
}

/**
 * Hook to receive the user events (join, leave) via the GraphQL subscription
 */
export const useUserEvent = (roomId: string | undefined) => {
    const [userEvent, setUserEvent] = useState<UserEvent>();
    const { data, error, loading } =
        useSubscription<UserEventSubscription>(UserEventDocument, {
            variables: {
                roomId: String(roomId),
            },
        });

    useEffect(() => {
        if (data?.userEvent) {
            setUserEvent({ userAction: data.userEvent.userAction, username: data.userEvent.user.name });
        }
    }, [data]);

    return { userEvent, loading, error }
}