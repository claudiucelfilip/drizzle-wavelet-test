import React from "react";
import { DrizzleProvider } from "@drizzle/react-plugin";
import { LoadingContainer } from "@drizzle/react-components";
import Container from "./Container";
import drizzleOptions from "./drizzleOptions";
import MyComponent from "./MyComponent";

const App: React.FC = () => {
  return (
    <DrizzleProvider options={drizzleOptions}>
      <LoadingContainer>
        <MyComponent />
      </LoadingContainer>
    </DrizzleProvider>
  );
};

export default App;
