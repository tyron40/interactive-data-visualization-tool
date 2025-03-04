import { gql } from 'graphql-request';

export const IMPORT_EXTERNAL_DATASET = gql`
  mutation ImportExternalDataset($id: ID!, $name: String, $description: String) {
    importExternalDataset(id: $id, name: $name, description: $description) {
      id
      name
      description
      createdAt
      updatedAt
      columns
      data
    }
  }
`;

export const SHARE_VISUALIZATION = gql`
  mutation ShareVisualization($id: ID!, $email: String!) {
    shareVisualization(id: $id, email: $email) {
      id
      sharedWith
    }
  }
`;

export const SHARE_DASHBOARD = gql`
  mutation ShareDashboard($id: ID!, $email: String!) {
    shareDashboard(id: $id, email: $email) {
      id
      sharedWith
    }
  }
`;