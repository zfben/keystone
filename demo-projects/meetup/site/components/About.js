/** @jsx jsx */
import { jsx, Global } from '@emotion/core';
import React from 'react';

export default () => (
  <>
    <h2
      css={{
        fontSize: '0.9em',
        textTransform: 'uppercase',
        letterSpacing: 3,
        fontWeight: 800,
      }}
    >
      About SydJS
    </h2>
    <p>
      Every 3rd Wednesday of the month you'll find us talking about what we're doing and what's
      happening around us in the world of JavaScript.
    </p>
  </>
);
