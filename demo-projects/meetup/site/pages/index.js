/** @jsx jsx */
import { jsx, Global } from '@emotion/core';

import React from 'react';

import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Layout from '../components/Layout';
import Button from '../components/Button';
import styled from '@emotion/styled';

export default () => (
  <Layout>
    <Global
      styles={{
        body: { margin: 0 },
      }}
    />
    <Hero />
    <Talks />
  </Layout>
);

const NextEvent = () => (
  <div
    css={{
      maxWidth: 600,
      background: 'white',
      margin: '0 auto',
      padding: '20px',
      boxShadow: '0px 0px 16px rgba(0,0,0,0.6)',
      textAlign: 'center',
      position: 'relative',
      top: -32,
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
      Next Meetup
    </h2>
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
          return <p>Error!</p>;
        }

        const meetup = data.allMeetups[0];
        return (
          <>
            <p css={{ fontSize: '1.5em', margin: '12px 0', fontWeight: 800 }}>{meetup.name}</p>
            <Countdown day={meetup.day} />
            {meetup.day}
          </>
        );
      }}
    </Query>
  </div>
);

const Talks = () => (
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
    <Query
      query={gql`
        {
          allTalks {
            id
            name
            description
            speaker {
              name
            }
          }
        }
      `}
    >
      {({ data, loading, error }) => {
        if (loading) return <p>loading...</p>;
        if (error) {
          console.log(error);
          return <p>Error!</p>;
        }

        return (
          <div css={{ display: 'flex' }}>
            {data.allTalks.map(talk => (
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
        );
      }}
    </Query>
  </div>
);

// const Hero = () => (
//   <div css={{ backgroundColor: 'yellow', padding: '60px 0' }}>
//     <div css={{ maxWidth: 900, margin: '0 auto' }}>
//       <h1 css={{ margin: 0 }}>Welcome to SydJS</h1>
//       <p>
//         Every 3rd Wednesday of the month you'll find us talking about what we're doing and what's
//         happening around us in the world of JavaScript.
//       </p>
//     </div>
//   </div>
// );

const Hero = () => (
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
        <h1 css={{ margin: 0 }}>Introducing Keystone 5</h1>
        <p>
          Every 3rd Wednesday of the month you'll find us talking about what we're doing and what's
          happening around us in the world of JavaScript.
        </p>
        <p css={{ fontWeight: 600 }}>9th June. 33 Spots Left</p>
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

const Countdown = () => <p css={{ fontSize: '3em', margin: 0, fontWeight: 800 }}>00:00:00</p>;
