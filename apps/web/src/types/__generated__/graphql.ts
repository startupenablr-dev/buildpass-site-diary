export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
  [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
  T extends { [key: string]: unknown },
  K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
  | T
  | {
      [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never;
    };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
};

export type AiBeautifyResult = {
  __typename: 'AIBeautifyResult';
  beautifiedText: Scalars['String']['output'];
  enhanced: Scalars['Boolean']['output'];
  originalText: Scalars['String']['output'];
};

export type AiSummaryResult = {
  __typename: 'AISummaryResult';
  diariesCount: Scalars['Int']['output'];
  endDate: Scalars['String']['output'];
  startDate: Scalars['String']['output'];
  summary: Scalars['String']['output'];
};

export type Mutation = {
  __typename: 'Mutation';
  /** Enhance user-entered text using AI to make it more professional */
  beautifyTextMutation: AiBeautifyResult;
  createSiteDiary: SiteDiary;
  deleteSiteDiary: Scalars['Boolean']['output'];
  /** Summarize site diaries within a date range using AI */
  summarizeSiteDiaries: AiSummaryResult;
  updateSiteDiary: Maybe<SiteDiary>;
};

export type MutationBeautifyTextMutationArgs = {
  text: Scalars['String']['input'];
};

export type MutationCreateSiteDiaryArgs = {
  input: SiteDiaryInput;
};

export type MutationDeleteSiteDiaryArgs = {
  id: Scalars['String']['input'];
};

export type MutationSummarizeSiteDiariesArgs = {
  endDate: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  startDate: Scalars['String']['input'];
};

export type MutationUpdateSiteDiaryArgs = {
  id: Scalars['String']['input'];
  input: SiteDiaryInput;
};

export type Query = {
  __typename: 'Query';
  siteDiaries: Array<SiteDiary>;
  /** Get site diaries within a date range */
  siteDiariesByDateRange: Array<SiteDiary>;
  siteDiary: Maybe<SiteDiary>;
};

export type QuerySiteDiariesByDateRangeArgs = {
  endDate: Scalars['String']['input'];
  startDate: Scalars['String']['input'];
};

export type QuerySiteDiaryArgs = {
  id: Scalars['String']['input'];
};

export type SiteDiary = {
  __typename: 'SiteDiary';
  attachments: Maybe<Array<Scalars['String']['output']>>;
  attendees: Maybe<Array<Scalars['String']['output']>>;
  content: Maybe<Scalars['String']['output']>;
  createdBy: Scalars['String']['output'];
  date: Scalars['String']['output'];
  id: Scalars['String']['output'];
  title: Scalars['String']['output'];
  weather: Maybe<Weather>;
};

export type SiteDiaryInput = {
  attachments?: InputMaybe<Array<Scalars['String']['input']>>;
  attendees?: InputMaybe<Array<Scalars['String']['input']>>;
  content?: InputMaybe<Scalars['String']['input']>;
  createdBy: Scalars['String']['input'];
  date: Scalars['String']['input'];
  id?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
  weather?: InputMaybe<WeatherInput>;
};

export type Weather = {
  __typename: 'Weather';
  description: Scalars['String']['output'];
  temperature: Scalars['Int']['output'];
};

export type WeatherInput = {
  description: Scalars['String']['input'];
  temperature: Scalars['Int']['input'];
};

export type SummarizeDiariesMutationVariables = Exact<{
  startDate: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;

export type SummarizeDiariesMutation = {
  summarizeSiteDiaries: {
    __typename: 'AISummaryResult';
    summary: string;
    diariesCount: number;
    startDate: string;
    endDate: string;
  };
};

export type CreateSiteDiaryMutationVariables = Exact<{
  input: SiteDiaryInput;
}>;

export type CreateSiteDiaryMutation = {
  createSiteDiary: {
    __typename: 'SiteDiary';
    id: string;
    title: string;
    date: string;
    createdBy: string;
    content: string | null;
    attendees: Array<string> | null;
    attachments: Array<string> | null;
    weather: {
      __typename: 'Weather';
      temperature: number;
      description: string;
    } | null;
  };
};

export type SiteDiariesQueryVariables = Exact<{ [key: string]: never }>;

export type SiteDiariesQuery = {
  siteDiaries: Array<{
    __typename: 'SiteDiary';
    id: string;
    title: string;
    date: string;
    createdBy: string;
    content: string | null;
    attendees: Array<string> | null;
    attachments: Array<string> | null;
    weather: {
      __typename: 'Weather';
      temperature: number;
      description: string;
    } | null;
  }>;
};

export type SiteDiaryQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type SiteDiaryQuery = {
  siteDiary: {
    __typename: 'SiteDiary';
    id: string;
    title: string;
    date: string;
    createdBy: string;
    content: string | null;
    attendees: Array<string> | null;
    attachments: Array<string> | null;
    weather: {
      __typename: 'Weather';
      temperature: number;
      description: string;
    } | null;
  } | null;
};

export type UpdateSiteDiaryMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: SiteDiaryInput;
}>;

export type UpdateSiteDiaryMutation = {
  updateSiteDiary: {
    __typename: 'SiteDiary';
    id: string;
    title: string;
    date: string;
    createdBy: string;
    content: string | null;
    attendees: Array<string> | null;
    attachments: Array<string> | null;
    weather: {
      __typename: 'Weather';
      temperature: number;
      description: string;
    } | null;
  } | null;
};

export type DeleteSiteDiaryMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;

export type DeleteSiteDiaryMutation = { deleteSiteDiary: boolean };
