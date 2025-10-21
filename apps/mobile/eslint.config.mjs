import untitled from '@untitled/eslint-config';

export default [
  ...untitled,
  {
    ignores: ['.expo', 'android/', 'dist/', 'ios/', 'src/types/__generated__/'],
  },
  {
    files: ['scripts/**/*.tsx'],
    rules: {
      'no-console': 0,
    },
  },
  {
    files: ['metro.config.js', 'tailwind.config.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 0,
    },
  },
  {
    rules: {
      '@typescript-eslint/array-type': [2, { default: 'generic' }],
      '@typescript-eslint/no-restricted-imports': [
        2,
        {
          paths: [
            {
              importNames: ['Text'],
              message:
                'Please use the corresponding UI components from `src/components/ui/text.tsx` instead.',
              name: 'react-native',
            },
            {
              importNames: ['ScrollView'],
              message:
                'Please use the corresponding UI component from `react-native-gesture-handler` instead.',
              name: 'react-native',
            },
          ],
        },
      ],
      'import-x/no-extraneous-dependencies': [
        2,
        {
          devDependencies: [
            './eslint.config.mjs',
            './scripts/**.tsx',
            './tailwind.config.js',
            './reset.d.ts',
            '**/*.test.tsx',
          ],
        },
      ],
      'react/display-name': [
        'error',
        {
          checkContextObjects: true,
          ignoreTranspilerName: true,
        },
      ],
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          project: './tsconfig.json',
        },
      },
    },
  },
];
