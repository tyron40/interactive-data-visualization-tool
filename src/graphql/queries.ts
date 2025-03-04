import { gql } from 'graphql-request';

export const GET_EXTERNAL_DATASETS = gql`
  query GetExternalDatasets($limit: Int, $offset: Int) {
    datasets(limit: $limit, offset: $offset) {
      id
      name
      description
      createdAt
      updatedAt
      columns
      rowCount
    }
  }
`;

export const GET_EXTERNAL_DATASET = gql`
  query GetExternalDataset($id: ID!) {
    dataset(id: $id) {
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

export const SEARCH_EXTERNAL_DATASETS = gql`
  query SearchExternalDatasets($query: String!, $limit: Int) {
    searchDatasets(query: $query, limit: $limit) {
      id
      name
      description
      createdAt
      updatedAt
      columns
      rowCount
    }
  }
`;

export const GET_VISUALIZATION_TEMPLATES = gql`
  query GetVisualizationTemplates($type: String) {
    visualizationTemplates(type: $type) {
      id
      name
      description
      type
      config
      previewImage
    }
  }
`;