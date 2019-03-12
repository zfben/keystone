// // @flow

// import React, { useContext, useState, useMemo } from 'react';
// import { Input } from '@arch-ui/input';

// let PathContext = React.createContext({ path: '${path}', setPath: () => {} });

// export let PathProvider = ({ children }) => {
//   let [path, setPath] = useState('${path}');

//   return (
//     <PathContext.Provider value={useMemo(() => ({ path, setPath }), [path, setPath])}>
//       {children}
//     </PathContext.Provider>
//   );
// };

// export let PathInput = () => {
//   let { path, setPath } = useContext(PathContext);

//   return (
//     <Input
//       value={path}
//       onChange={event => {
//         setPath(event.target.value);
//       }}
//     />
//   );
// };

// export let Filters = ({}) => {
//   let { path } = useContext(PathContext);
//   return <pre />;
// };

import { DocExplorer } from 'graphiql/dist/components/DocExplorer';
import { buildSchema } from 'graphql';
import React, { useMemo } from 'react';

export let GraphQLDocs = ({ schema }) => {
  return <DocExplorer schema={useMemo(() => buildSchema(schema), [schema])} />;
};
