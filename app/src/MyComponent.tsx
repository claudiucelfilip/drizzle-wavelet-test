import React from "react";
import {
  AccountData,
  ContractData,
  ContractForm
} from "@drizzle/react-components";

const MyComponent = () => {
  return (
    <div>
      <h2>Balance of first account</h2>
      <AccountData accountIndex={1} units="perls" precision={3} />

      <h2>Contract variable</h2>
      <ContractData contract="2ef49b793f0f7de817d2a80e43ceaf1a781f265ad77d3f7a02b8a0e20706ca2a" method="get_data" />

      <h2>Set new value</h2>
      <ContractForm
        contract="2ef49b793f0f7de817d2a80e43ceaf1a781f265ad77d3f7a02b8a0e20706ca2a"
        method="set_data"
        labels={["new value"]}
      />
    </div>
  );
};

export default MyComponent;
