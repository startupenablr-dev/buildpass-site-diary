import { gql } from '@apollo/client';

export const SITE_DIARIES = gql`
  query SiteDiaries {
    siteDiaries {
      id
      title
    }
  }
`;
