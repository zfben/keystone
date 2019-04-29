/** @jsx jsx */
import { jsx, Global } from '@emotion/core';
import React from 'react';

export default () => (
  <header
    css={{
      backgroundColor: '#ffe100',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}
  >
    <span css={{ fontSize: '1.5em', fontWeight: 800 }}>SydJS</span>
    <div>
      <span>Log In</span>
      <span>Register</span>
    </div>
  </header>
);
