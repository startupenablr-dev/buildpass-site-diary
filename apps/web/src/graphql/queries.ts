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
