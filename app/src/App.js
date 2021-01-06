import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import AllProjects from "./AllProjects";
import Project from "./Project";
import { QueryClient, QueryClientProvider } from "react-query";
import { GraphQLClient } from "graphql-request";

const queryClient = new QueryClient();
const graphQLClient = new GraphQLClient(`https://graphql.fauna.com/graphql`, {
  headers: {
    authorization: "Bearer  <fauna_secret>",
  },
});

export const GraphqlClientContext = React.createContext();

function Main() {
  return (
    <Router>
      <Switch>
      <Route path="/projects/:id">
          <Project />
        </Route>
        <Route path="/projects">
          <AllProjects />
        </Route>
      </Switch>
    </Router>
  );
}

function App() {
  return (
    <GraphqlClientContext.Provider value={graphQLClient}>
      <QueryClientProvider client={queryClient}>
        <Main />
      </QueryClientProvider>
    </GraphqlClientContext.Provider>
  );
}

export default App;
