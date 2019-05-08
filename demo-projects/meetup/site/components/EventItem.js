import React from 'react';
import gql from 'graphql-tag';
import { Mutation, Query } from 'react-apollo';
import { useQuery, useMutation } from 'react-apollo-hooks';
import { useAuth } from '../lib/authetication';

const ADD_RSVP = gql`
  mutation AddRsvp($event: ID!, $user: ID!, $status: RsvpStatusType!) {
    createRsvp(
      data: {
        event: { connect: { id: $event }}
        user: { connect: { id: $user }}
        status: $status
      }
    ) {
      id
      event {
      	id
    	} 
      status
    }
  }
`;

const UPDATE_RSVP = gql`
  mutation UpdateRSVP($rsvp:ID!, $status: RsvpStatusType!) {
    updateRsvp(
      id: $rsvp
      data: {
        status: $status
      }
    ) {
      id
      event {
        id
      } 
      status
    }
  }
`;

const GET_EVENT_RSVPS = gql`
  query GetEventRsvps($event: ID!, $user: ID!) {
    allRsvps(
      where: { 
        event: { id: $event },
        user: { id: $user }
      }
    ) {
      id
    }
  }
`;

const Rsvp = ({ id }) => {
  const { user } = useAuth();
  const { data, loading, error } = useQuery(GET_EVENT_RSVPS, { variables: { event: id, user: user.id }});
  const createRsvp = useMutation(ADD_RSVP, { refetchQueries: () => [{ query: GET_EVENT_RSVPS, variables: { event: id, user: user.id }}]});
  const updateRsvp = useMutation(UPDATE_RSVP);

  if(loading) { return <p>loading...</p>; }
  if (error) {
    console.log(error);
    return <p>Error!</p>;
  }

  const handleClick = (status) => {
    if(data.allRsvps[0]) {
      updateRsvp({ variables: { rsvp: data.allRsvps[0].id, status }});
    } else {
      createRsvp({ variables: { event: id, user: user.id, status }});
    }
  }
   
  return (
      <div>
        <h3>RSVP?</h3>
        <a onClick={() => handleClick('yes')}>Yes </a>
        <a onClick={() => handleClick('no')}>No</a>
      </div>
  );
}

const EventItem = ({ id, name, startDate, talks }) => {
  const { isAuthenticated } = useAuth();

  return (
    <li>
      <h2>{name}</h2>                
      <p>{startDate}</p>
      { isAuthenticated ? <Rsvp id={id} /> : <p>please login to RSVP</p> }
      <h2>Talks</h2>
      {talks.map(talk => (
        <div key={talk.id}>
          <h3>{talk.name}</h3>
          <h3>Speakers</h3>
          {talk.speakers.map(speaker => (
            <p key={speaker.id}>{speaker.name}</p>
          ))}
        </div>
      ))}              
    </li>
  );
}

export default EventItem;