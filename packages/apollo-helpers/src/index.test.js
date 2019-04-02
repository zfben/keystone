import { makeFetch } from 'supertest-fetch';
import { multiAdapterRunners, setupServer } from '@keystone-alpha/test-utils';
import { Text, Relationship } from '@keystone-alpha/fields';
import gql from 'graphql-tag';
import React from 'react';
import renderer from 'react-test-renderer';
import { HttpLink } from 'apollo-link-http';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloProvider } from 'react-apollo';
import wait from 'wait-for-expect';
import { Query, KeystoneProvider, Mutation } from './index';
import { gen, sampleOne } from 'testcheck';

const alphanumGenerator = gen.alphaNumString.notEmpty();

jest.setTimeout(10000);

multiAdapterRunners();

function setupKeystone(adapterName) {
  return setupServer({
    adapterName,
    name: Math.random().toString(36),
    createLists: keystone => {
      keystone.createList('Post', {
        fields: {
          title: { type: Text },
          author: { type: Relationship, ref: 'User' },
        },
      });

      keystone.createList('User', {
        fields: {
          name: { type: Text },
          feed: { type: Relationship, ref: 'Post', many: true },
        },
      });
    },
  });
}

test(
  'something',
  multiAdapterRunners()[0].runner(setupKeystone, async ({ server, create }) => {
    // throw server.server;
    let _fetch = makeFetch(server.server.app);
    // just so none of supertest-fetch's things get exposed
    // we only use it to get the fetch api from a express app
    let fetch = (...args) => _fetch(...args).then(val => val);

    const users = await Promise.all([
      create('User', { name: 'Jess' }),
      create('User', { name: 'Johanna' }),
      create('User', { name: 'Sam' }),
    ]);
    const client = new ApolloClient({
      link: new HttpLink({ uri: '/admin/api', fetch }),
      cache: new InMemoryCache(),
    });
    let latestData;
    let createItem;
    const App = () => (
      <ApolloProvider client={client}>
        <KeystoneProvider>
          <Query
            query={gql`
              query Users {
                allUsers(orderBy: "name_DESC") {
                  name
                }
              }
            `}
          >
            {({ data }) => {
              console.log('query render');
              console.log(data);
              latestData = data;
              return (
                <React.Fragment>{data ? data.allUsers.map(x => x.name) : null}</React.Fragment>
              );
            }}
          </Query>
          <Mutation
            mutation={gql`
              mutation {
                createUser(data: { name: "Some Person" }) {
                  id
                  name
                }
              }
            `}
            invalidateTypes="User"
          >
            {thing => {
              createItem = thing;
              return thing.loading ? 'loading' : 'not loading';
            }}
          </Mutation>
        </KeystoneProvider>
      </ApolloProvider>
    );

    let inst = renderer.create(<App />);
    await wait(() => {
      expect(latestData).toBeTruthy();
    });
    expect(inst.toJSON()).toMatchInlineSnapshot(`
Array [
  "Sam",
  "Johanna",
  "Jess",
]
`);

    let res = await createItem({});

    console.log(res);
    await wait(() => {
      expect(inst.toJSON()).toHaveLength(4);
    });
    expect(inst.toJSON()).toMatchInlineSnapshot(`
      Array [
        "Jess",
        "Johanna",
        "Sam",
      ]
      `);
  })
);
