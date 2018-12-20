import { makeFetch } from 'supertest-fetch';
import { keystoneMongoTest, setupServer } from '@voussoir/test-utils';
import { Text, Relationship } from '@voussoir/fields';
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

test(
  'something',
  keystoneMongoTest(
    () => {
      return setupServer({
        name: Math.random().toString(36),
        createLists(keystone) {
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
    },
    async ({ server, create }) => {
      // throw server.server;
      let _fetch = makeFetch(server.server.app);
      // just so none of supertest-fetch's things get exposed
      // we only use it to get the fetch api from a express app
      let promises = [];
      let fetch = (...args) => {
        let promise = _fetch(...args).then(val => val);
        promises.push(promise);
        return promise;
      };

      const users = await Promise.all([
        create('User', { name: 'Jess' }),
        create('User', { name: 'Johanna' }),
        create('User', { name: 'Sam' }),
      ]);

      await Promise.all([
        create('Post', { author: users[0].id, title: sampleOne(alphanumGenerator) }),
        create('Post', { author: users[1].id, title: sampleOne(alphanumGenerator) }),
        create('Post', { author: users[2].id, title: sampleOne(alphanumGenerator) }),
        create('Post', { author: users[0].id, title: sampleOne(alphanumGenerator) }),
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
                  allUsers {
                    name
                  }
                }
              `}
            >
              {({ data }) => {
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
            >
              {thing => {
                createItem = thing;
                return null;
              }}
            </Mutation>
          </KeystoneProvider>
        </ApolloProvider>
      );

      let inst = renderer.create(<App />);
      await Promise.all(promises);
      promises = [];
      await wait(() => {
        expect(latestData).toBeTruthy();
      });
      expect(inst.toJSON()).toMatchInlineSnapshot(`
Array [
  "Jess",
  "Johanna",
  "Sam",
]
`);

      await createItem();
      await wait(() => {
        expect(inst.toJSON()).toBe(4);
      });
      expect(inst.toJSON()).toMatchInlineSnapshot(`
      Array [
        "Jess",
        "Johanna",
        "Sam",
      ]
      `);
    }
  )
);
