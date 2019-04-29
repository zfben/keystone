/** @jsx jsx */
import { jsx, Global } from '@emotion/core';

import React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Layout from '../components/Layout';
import About from '../components/About';
import Button from '../components/Button';
import styled from '@emotion/styled';

export default () => (
  <Query
    query={gql`
      {
        allMeetups {
          id
          name
          day
          description
          talks {
            name
            speaker {
              name
            }
          }
        }
      }
    `}
  >
    {({ data, loading, error }) => {
      if (loading) return <p>loading...</p>;
      if (error) {
        console.log(error);
        return <p>Error!, {error}</p>;
      }

      console.log(data);
      const meetup = data.allMeetups[0];
      return (
        <Layout>
          <Global
            styles={{
              body: { margin: 0 },
            }}
          />
          <Hero data={meetup} />
          <Talks data={meetup.talks} />
          <About />
        </Layout>
      );
    }}
  </Query>
);

const Hero = ({ data }) => (
  <>
    <div css={{ backgroundColor: '#ffe100', padding: '80px 0' }}>
      <div css={{ maxWidth: 800, margin: '0 auto' }}>
        <p
          css={{
            margin: 0,
            fontSize: '0.9em',
            textTransform: 'uppercase',
            letterSpacing: 3,
            fontWeight: 800,
          }}
        >
          Next Meetup
        </p>
        <h1 css={{ margin: 0 }}>{data.name}</h1>
        <p css={{ fontWeight: 500 }}>{data.description}</p>
        <p css={{ fontWeight: 600 }}>9th June. 33 Spots Left</p>
        <p>Atlassian. Level 6, 341 George St</p>
        <Button>RSVP</Button>
      </div>
    </div>

    <div
      css={{
        maxWidth: 300,
        background: 'white',
        margin: '0 auto',
        padding: '20px',
        boxShadow: '0px 0px 8px rgba(0,0,0,0.4)',
        textAlign: 'center',
        position: 'relative',
        top: -56,
        borderRadius: 16,
      }}
    >
      <h2
        css={{
          margin: 0,
          fontSize: '0.9em',
          textTransform: 'uppercase',
          letterSpacing: 3,
          fontWeight: 800,
        }}
      >
        Not long now!
      </h2>
      <Countdown />
    </div>
  </>
);

const Talks = ({ data }) => {
  return data.length ? (
    <div>
      <h2
        css={{
          fontSize: '0.9em',
          textTransform: 'uppercase',
          letterSpacing: 3,
          fontWeight: 800,
        }}
      >
        TALKS
      </h2>

      <div css={{ display: 'flex' }}>
        {data.map(talk => (
          <div
            css={{
              padding: '16px 24px',
              boxShadow: '0px 0px 16px rgba(0,0,0,0.2)',
              marginRight: 16,
              borderRadius: 8,
            }}
          >
            <p css={{ fontSize: '1.5em', margin: '12px 0', fontWeight: 800 }}>{talk.name}</p>
            <p>{talk.description}</p>
            {talk.speaker.name}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <span>No talks :(</span>
  );
};

const Countdown = () => <p css={{ fontSize: '3em', margin: 0, fontWeight: 800 }}>00:00:00</p>;
