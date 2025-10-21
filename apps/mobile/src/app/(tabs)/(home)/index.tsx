import { Text } from '@/components/ui/text.tsx';
import {
  SiteDiariesQuery,
  SiteDiariesQueryVariables,
} from '@/types/__generated__/graphql';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react/compiled';
import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

const SITE_DIARIES = gql`
  query SiteDiaries {
    siteDiaries {
      id
      title
    }
  }
`;

const IndexScreen: React.FC = () => {
  const { data, loading } = useQuery<
    SiteDiariesQuery,
    SiteDiariesQueryVariables
  >(SITE_DIARIES);

  return (
    <ScrollView
      automaticallyAdjustsScrollIndicatorInsets={true}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View className="flex-1 items-center justify-center gap-4 p-1">
        <Text className="text-center italic">Hello, coder</Text>
        <Text className="bold text-center">
          {loading ? 'Loading...' : data?.siteDiaries?.length}
        </Text>
      </View>
    </ScrollView>
  );
};

IndexScreen.displayName = 'IndexScreen';

export default IndexScreen;
