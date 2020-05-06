import React from "react";
import styled from "@emotion/styled";
import { Button, Heading } from "@chakra-ui/core";
import { v1 as uuid } from "uuid";

const url = (id) =>
  `https://auth.monzo.com/?client_id=${process.env.REACT_CLIENT_ID}&redirect_uri=http://localhost:3000/authenticate&response_type=code&state=${id}`;

const Wrapper = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Login = () => {
  const id = uuid();
  localStorage.setItem("stateId", id);
  return (
    <Wrapper>
      <Heading>Spending Habits</Heading>
      <Button
        variantColor="pink"
        onClick={() => (window.location.href = url(id))}
        m={"2rem 0"}
      >
        Authorize access to Monzo
      </Button>
    </Wrapper>
  );
};

export default Login;
