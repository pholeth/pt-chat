import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
};

export type CreateMessageType = {
  __typename?: 'CreateMessageType';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  room: RoomType;
};

export type MessageType = {
  __typename?: 'MessageType';
  content: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  sender: UserType;
};

export type Mutation = {
  __typename?: 'Mutation';
  createMessage: CreateMessageType;
  joinRoom: OperationType;
  leaveRoom: OperationType;
};


export type MutationCreateMessageArgs = {
  content: Scalars['String']['input'];
  roomId: Scalars['ID']['input'];
};


export type MutationJoinRoomArgs = {
  roomId: Scalars['ID']['input'];
};


export type MutationLeaveRoomArgs = {
  roomId: Scalars['ID']['input'];
};

export type OperationType = {
  __typename?: 'OperationType';
  success: Scalars['Boolean']['output'];
};

export type Query = {
  __typename?: 'Query';
  getMessagesByRoom: Array<MessageType>;
  getRoomUsers: Array<UserType>;
};


export type QueryGetMessagesByRoomArgs = {
  roomId: Scalars['ID']['input'];
};


export type QueryGetRoomUsersArgs = {
  roomId: Scalars['ID']['input'];
};

export type RoomType = {
  __typename?: 'RoomType';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  messageCreated: MessageType;
  userEvent: UserEventType;
};


export type SubscriptionMessageCreatedArgs = {
  roomId: Scalars['String']['input'];
};


export type SubscriptionUserEventArgs = {
  roomId: Scalars['String']['input'];
};

export enum UserAction {
  Join = 'JOIN',
  Leave = 'LEAVE'
}

export type UserEventType = {
  __typename?: 'UserEventType';
  user: UserType;
  userAction: UserAction;
};

export type UserType = {
  __typename?: 'UserType';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type CreateMessageMutationVariables = Exact<{
  roomId: Scalars['ID']['input'];
  content: Scalars['String']['input'];
}>;


export type CreateMessageMutation = { __typename?: 'Mutation', createMessage: { __typename?: 'CreateMessageType', id: number, content: string, createdAt: any, room: { __typename?: 'RoomType', id: number } } };

export type JoinRoomMutationVariables = Exact<{
  roomId: Scalars['ID']['input'];
}>;


export type JoinRoomMutation = { __typename?: 'Mutation', joinRoom: { __typename?: 'OperationType', success: boolean } };

export type LeaveRoomMutationVariables = Exact<{
  roomId: Scalars['ID']['input'];
}>;


export type LeaveRoomMutation = { __typename?: 'Mutation', leaveRoom: { __typename?: 'OperationType', success: boolean } };

export type GetMessagesByRoomQueryVariables = Exact<{
  roomId: Scalars['ID']['input'];
}>;


export type GetMessagesByRoomQuery = { __typename?: 'Query', getMessagesByRoom: Array<{ __typename?: 'MessageType', id: number, content: string, createdAt: any, sender: { __typename?: 'UserType', id: number, name: string } }> };

export type GetRoomUsersQueryVariables = Exact<{
  roomId: Scalars['ID']['input'];
}>;


export type GetRoomUsersQuery = { __typename?: 'Query', getRoomUsers: Array<{ __typename?: 'UserType', id: number, name: string }> };

export type MessageCreatedSubscriptionVariables = Exact<{
  roomId: Scalars['String']['input'];
}>;


export type MessageCreatedSubscription = { __typename?: 'Subscription', messageCreated: { __typename?: 'MessageType', id: number, content: string, createdAt: any, sender: { __typename?: 'UserType', id: number, name: string } } };

export type UserEventSubscriptionVariables = Exact<{
  roomId: Scalars['String']['input'];
}>;


export type UserEventSubscription = { __typename?: 'Subscription', userEvent: { __typename?: 'UserEventType', userAction: UserAction, user: { __typename?: 'UserType', id: number, name: string } } };


export const CreateMessageDocument = gql`
    mutation CreateMessage($roomId: ID!, $content: String!) {
  createMessage(roomId: $roomId, content: $content) {
    id
    content
    room {
      id
    }
    createdAt
  }
}
    `;
export type CreateMessageMutationFn = Apollo.MutationFunction<CreateMessageMutation, CreateMessageMutationVariables>;

/**
 * __useCreateMessageMutation__
 *
 * To run a mutation, you first call `useCreateMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createMessageMutation, { data, loading, error }] = useCreateMessageMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *      content: // value for 'content'
 *   },
 * });
 */
export function useCreateMessageMutation(baseOptions?: Apollo.MutationHookOptions<CreateMessageMutation, CreateMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateMessageMutation, CreateMessageMutationVariables>(CreateMessageDocument, options);
      }
export type CreateMessageMutationHookResult = ReturnType<typeof useCreateMessageMutation>;
export type CreateMessageMutationResult = Apollo.MutationResult<CreateMessageMutation>;
export type CreateMessageMutationOptions = Apollo.BaseMutationOptions<CreateMessageMutation, CreateMessageMutationVariables>;
export const JoinRoomDocument = gql`
    mutation JoinRoom($roomId: ID!) {
  joinRoom(roomId: $roomId) {
    success
  }
}
    `;
export type JoinRoomMutationFn = Apollo.MutationFunction<JoinRoomMutation, JoinRoomMutationVariables>;

/**
 * __useJoinRoomMutation__
 *
 * To run a mutation, you first call `useJoinRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useJoinRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [joinRoomMutation, { data, loading, error }] = useJoinRoomMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useJoinRoomMutation(baseOptions?: Apollo.MutationHookOptions<JoinRoomMutation, JoinRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<JoinRoomMutation, JoinRoomMutationVariables>(JoinRoomDocument, options);
      }
export type JoinRoomMutationHookResult = ReturnType<typeof useJoinRoomMutation>;
export type JoinRoomMutationResult = Apollo.MutationResult<JoinRoomMutation>;
export type JoinRoomMutationOptions = Apollo.BaseMutationOptions<JoinRoomMutation, JoinRoomMutationVariables>;
export const LeaveRoomDocument = gql`
    mutation LeaveRoom($roomId: ID!) {
  leaveRoom(roomId: $roomId) {
    success
  }
}
    `;
export type LeaveRoomMutationFn = Apollo.MutationFunction<LeaveRoomMutation, LeaveRoomMutationVariables>;

/**
 * __useLeaveRoomMutation__
 *
 * To run a mutation, you first call `useLeaveRoomMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLeaveRoomMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [leaveRoomMutation, { data, loading, error }] = useLeaveRoomMutation({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useLeaveRoomMutation(baseOptions?: Apollo.MutationHookOptions<LeaveRoomMutation, LeaveRoomMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LeaveRoomMutation, LeaveRoomMutationVariables>(LeaveRoomDocument, options);
      }
export type LeaveRoomMutationHookResult = ReturnType<typeof useLeaveRoomMutation>;
export type LeaveRoomMutationResult = Apollo.MutationResult<LeaveRoomMutation>;
export type LeaveRoomMutationOptions = Apollo.BaseMutationOptions<LeaveRoomMutation, LeaveRoomMutationVariables>;
export const GetMessagesByRoomDocument = gql`
    query GetMessagesByRoom($roomId: ID!) {
  getMessagesByRoom(roomId: $roomId) {
    id
    content
    sender {
      id
      name
    }
    createdAt
  }
}
    `;

/**
 * __useGetMessagesByRoomQuery__
 *
 * To run a query within a React component, call `useGetMessagesByRoomQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessagesByRoomQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessagesByRoomQuery({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useGetMessagesByRoomQuery(baseOptions: Apollo.QueryHookOptions<GetMessagesByRoomQuery, GetMessagesByRoomQueryVariables> & ({ variables: GetMessagesByRoomQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMessagesByRoomQuery, GetMessagesByRoomQueryVariables>(GetMessagesByRoomDocument, options);
      }
export function useGetMessagesByRoomLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMessagesByRoomQuery, GetMessagesByRoomQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMessagesByRoomQuery, GetMessagesByRoomQueryVariables>(GetMessagesByRoomDocument, options);
        }
export function useGetMessagesByRoomSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMessagesByRoomQuery, GetMessagesByRoomQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMessagesByRoomQuery, GetMessagesByRoomQueryVariables>(GetMessagesByRoomDocument, options);
        }
export type GetMessagesByRoomQueryHookResult = ReturnType<typeof useGetMessagesByRoomQuery>;
export type GetMessagesByRoomLazyQueryHookResult = ReturnType<typeof useGetMessagesByRoomLazyQuery>;
export type GetMessagesByRoomSuspenseQueryHookResult = ReturnType<typeof useGetMessagesByRoomSuspenseQuery>;
export type GetMessagesByRoomQueryResult = Apollo.QueryResult<GetMessagesByRoomQuery, GetMessagesByRoomQueryVariables>;
export const GetRoomUsersDocument = gql`
    query GetRoomUsers($roomId: ID!) {
  getRoomUsers(roomId: $roomId) {
    id
    name
  }
}
    `;

/**
 * __useGetRoomUsersQuery__
 *
 * To run a query within a React component, call `useGetRoomUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetRoomUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetRoomUsersQuery({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useGetRoomUsersQuery(baseOptions: Apollo.QueryHookOptions<GetRoomUsersQuery, GetRoomUsersQueryVariables> & ({ variables: GetRoomUsersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetRoomUsersQuery, GetRoomUsersQueryVariables>(GetRoomUsersDocument, options);
      }
export function useGetRoomUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetRoomUsersQuery, GetRoomUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetRoomUsersQuery, GetRoomUsersQueryVariables>(GetRoomUsersDocument, options);
        }
export function useGetRoomUsersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetRoomUsersQuery, GetRoomUsersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetRoomUsersQuery, GetRoomUsersQueryVariables>(GetRoomUsersDocument, options);
        }
export type GetRoomUsersQueryHookResult = ReturnType<typeof useGetRoomUsersQuery>;
export type GetRoomUsersLazyQueryHookResult = ReturnType<typeof useGetRoomUsersLazyQuery>;
export type GetRoomUsersSuspenseQueryHookResult = ReturnType<typeof useGetRoomUsersSuspenseQuery>;
export type GetRoomUsersQueryResult = Apollo.QueryResult<GetRoomUsersQuery, GetRoomUsersQueryVariables>;
export const MessageCreatedDocument = gql`
    subscription MessageCreated($roomId: String!) {
  messageCreated(roomId: $roomId) {
    id
    content
    sender {
      id
      name
    }
    createdAt
  }
}
    `;

/**
 * __useMessageCreatedSubscription__
 *
 * To run a query within a React component, call `useMessageCreatedSubscription` and pass it any options that fit your needs.
 * When your component renders, `useMessageCreatedSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMessageCreatedSubscription({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useMessageCreatedSubscription(baseOptions: Apollo.SubscriptionHookOptions<MessageCreatedSubscription, MessageCreatedSubscriptionVariables> & ({ variables: MessageCreatedSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<MessageCreatedSubscription, MessageCreatedSubscriptionVariables>(MessageCreatedDocument, options);
      }
export type MessageCreatedSubscriptionHookResult = ReturnType<typeof useMessageCreatedSubscription>;
export type MessageCreatedSubscriptionResult = Apollo.SubscriptionResult<MessageCreatedSubscription>;
export const UserEventDocument = gql`
    subscription UserEvent($roomId: String!) {
  userEvent(roomId: $roomId) {
    userAction
    user {
      id
      name
    }
  }
}
    `;

/**
 * __useUserEventSubscription__
 *
 * To run a query within a React component, call `useUserEventSubscription` and pass it any options that fit your needs.
 * When your component renders, `useUserEventSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserEventSubscription({
 *   variables: {
 *      roomId: // value for 'roomId'
 *   },
 * });
 */
export function useUserEventSubscription(baseOptions: Apollo.SubscriptionHookOptions<UserEventSubscription, UserEventSubscriptionVariables> & ({ variables: UserEventSubscriptionVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<UserEventSubscription, UserEventSubscriptionVariables>(UserEventDocument, options);
      }
export type UserEventSubscriptionHookResult = ReturnType<typeof useUserEventSubscription>;
export type UserEventSubscriptionResult = Apollo.SubscriptionResult<UserEventSubscription>;