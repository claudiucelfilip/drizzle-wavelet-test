import React from "react";
import { drizzleConnect } from "@drizzle/react-plugin";

const Container: React.FC<any> = props => {
  console.log(props);
  return <div>Storage</div>;
};

const mapStateToProps = (state: any) => ({ state });

export default drizzleConnect(Container, mapStateToProps);
