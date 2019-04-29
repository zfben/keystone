/** @jsx jsx */
import { jsx, Global } from '@emotion/core';
import React from 'react';
import Layout from '../components/Layout';
import styled from '@emotion/styled';

export default styled.button({
  border: '3px solid rgb(10, 0, 50)',
  background: 'none',
  borderRadius: 8,
  padding: '8px 24px',
  letterSpacing: 2,
  fontSize: '1em',
  fontWeight: 700,
  textTransform: 'uppercase',
});
