import { createYoga } from 'graphql-yoga';
import { NextRequest } from 'next/server';
import { getSchema } from './schema';

const { handleRequest } = createYoga({
  schema: getSchema(),

  // While using Next.js file convention for routing, we need to configure Yoga to use the correct endpoint
  graphqlEndpoint: '/api/graphql',

  // Yoga needs to know how to create a valid Next response
  fetchAPI: { Response },
});

export async function GET(request: NextRequest) {
  return handleRequest(request, {});
}

export async function POST(request: NextRequest) {
  return handleRequest(request, {});
}

export async function OPTIONS(request: NextRequest) {
  return handleRequest(request, {});
}
