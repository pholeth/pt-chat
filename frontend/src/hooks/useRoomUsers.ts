import { getTokenHeader } from '../utils/getToken';
import { GetRoomUsersDocument, UserType } from '../generated/graphql';
import { ApolloError, ApolloQueryResult, OperationVariables, useQuery } from '@apollo/client';
import { useMemo } from 'react';

type RoomUsersQuery = {
    loading: boolean;
    joinedUsers: UserType[];
    error?: ApolloError;
    refetch: (variables: Partial<OperationVariables> | undefined) => Promise<ApolloQueryResult<unknown>>
};

/**
 * Hook to retrieve the room's joined users using GraphQL
 *
 * @param roomId
 * @returns
 *  - joinedUsers, the list of UserType
 *  - loading, is loading
 *  - error, error in loading
 */
export const useRoomUsers = (roomId: string | undefined): RoomUsersQuery => {
    const { data, loading, error, refetch } = useQuery(GetRoomUsersDocument, {
        variables: { roomId },
        context: {
            headers: {
                ...getTokenHeader(),
            },
        },
    });

    const joinedUsers = useMemo(() => {
        if (error || loading) return [];

        return data.getRoomUsers;

    }, [data, loading, error])

    return { joinedUsers, loading, error, refetch }
};
