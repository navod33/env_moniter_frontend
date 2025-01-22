
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Dashboard from './pages/dashboard';
import { ApolloClient, InMemoryCache, ApolloProvider, gql, useQuery, useMutation } from '@apollo/client';
import { createHttpLink } from '@apollo/client';

function App() {
  return (
    <Dashboard />
  );
}

export default App;
