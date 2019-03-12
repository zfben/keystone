import React from 'react';
import { graphql, StaticQuery } from 'gatsby';
import { GraphQLDocs } from '@keystone-alpha/field-type-docs';

export let TheThing = () => {
  return (
    <StaticQuery
      query={graphql`
        query {
          fieldType(type: { eq: "Text" }) {
            schema
          }
        }
      `}
    >
      {data => <GraphQLDocs schema={data.fieldType.schema} />}
    </StaticQuery>
  );
};
