import { Global } from '@emotion/core';
import Header from '../components/Header';

export default ({ children }) => (
  <div>
    <Header />
    <Global
      styles={{
        body: {
          fontFamily: 'avenir, sans-serif',
          color: 'rgb(10, 0, 50)',
        },

        h1: {
          fontWeight: 900,
          textTransform: 'uppercase',
          fontSize: '3em',
        },
      }}
    />
    {children}
  </div>
);
