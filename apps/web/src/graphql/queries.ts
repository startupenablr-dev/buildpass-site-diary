import { gql } from '@apollo/client';

export const SITE_DIARIES = gql`
  query SiteDiaries {
    siteDiaries {
      id
      title
      date
      createdBy
      content
      weather {
        temperature
        description
      }
      attendees
      attachments
    }
  }
`;

export const SITE_DIARY = gql`
  query SiteDiary($id: String!) {
    siteDiary(id: $id) {
      id
      title
      date
      createdBy
      content
      weather {
        temperature
        description
      }
      attendees
      attachments
    }
  }
`;

export const CREATE_SITE_DIARY = gql`
  mutation CreateSiteDiary($input: SiteDiaryInput!) {
    createSiteDiary(input: $input) {
      id
      title
      date
      createdBy
      content
      weather {
        temperature
        description
      }
      attendees
      attachments
    }
  }
`;

export const UPDATE_SITE_DIARY = gql`
  mutation UpdateSiteDiary($id: String!, $input: SiteDiaryInput!) {
    updateSiteDiary(id: $id, input: $input) {
      id
      title
      date
      createdBy
      content
      weather {
        temperature
        description
      }
      attendees
      attachments
    }
  }
`;

export const DELETE_SITE_DIARY = gql`
  mutation DeleteSiteDiary($id: String!) {
    deleteSiteDiary(id: $id)
  }
`;
