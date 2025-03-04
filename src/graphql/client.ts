import { GraphQLClient } from 'graphql-request';

// Create a GraphQL client instance
const endpoint = import.meta.env.VITE_GRAPHQL_ENDPOINT || 'https://api.example.com/graphql';

export const graphQLClient = new GraphQLClient(endpoint, {
  headers: {
    authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});

// Update the authorization header when the token changes
export const updateGraphQLAuthToken = (token: string | null) => {
  if (token) {
    graphQLClient.setHeader('authorization', `Bearer ${token}`);
  } else {
    graphQLClient.setHeader('authorization', '');
  }
};