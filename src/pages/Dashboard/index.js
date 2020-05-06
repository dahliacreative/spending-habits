import React, { useState, useEffect } from "react";
import api from "../../api";
import Header from "../../components/Header";
import Balance from "../../components/Balance";
import Transactions from "../../components/Transactions";
import Account from "../../components/Account";
import { Box, Flex, Link, useTheme, Heading, Button } from "@chakra-ui/core";
import qs from "query-string";
import usePeriod from "./usePeriod";

const Dashboard = ({ history, location }) => {
  const [state, setState] = useState();
  const [error, setError] = useState();
  const { colors } = useTheme();
  const period = usePeriod();

  const makeCall = () => {
    api
      .get("/accounts")
      .then(({ data }) => {
        setState({
          accounts: data.accounts,
          user: data.accounts[0].owners[0],
        });
        setError(false);
      })
      .catch(() => {
        setError(true);
      });
  };

  useEffect(makeCall, []);

  const query = qs.parse(location.search);

  if (error) {
    return (
      <Flex
        flexDirection="column"
        minH="100vh"
        alignItems="center"
        justifyContent="center"
      >
        <Box textAlign="center">
          <Heading size="lg">Please allow access via the Monzo app</Heading>
          <Button variantColor="pink" onClick={makeCall} m="2rem 0">
            Try again
          </Button>
        </Box>
      </Flex>
    );
  }

  if (!state) return null;

  const activeAccount = query.account
    ? state.accounts.find((a) => a.id === query.account)
    : null;

  return (
    <Flex flexDirection="column" minH="100vh" pt="4rem">
      <Header user={state.user} />
      <Flex flex="1">
        <Box
          w="15rem"
          boxShadow="0 0 3px rgba(0,0,0,0.25)"
          position="fixed"
          top="4rem"
          bottom="0"
        >
          <Heading
            p="1rem"
            size="md"
            borderBottom="1px"
            borderColor={colors.gray[200]}
            mb="1rem"
          >
            You Accounts
          </Heading>
          {state.accounts.map((a) => (
            <Box key={`nav-${a.id}`}>
              <Link
                p="0.25rem 1rem"
                d="block"
                key={a.id}
                onClick={() => history.push({ search: `?account=${a.id}` })}
                color={
                  activeAccount && activeAccount.id === a.id
                    ? colors.pink[500]
                    : colors.gray[500]
                }
              >
                {a.type === "uk_retail" ? "Personal Account" : "Joint Account"}
              </Link>
            </Box>
          ))}
        </Box>
        <Box flex="1" pl="15rem">
          <Flex bg={colors.pink[500]}>
            {activeAccount ? (
              <Account account={activeAccount} single />
            ) : (
              <>
                {state.accounts.map((a) => (
                  <Account key={a.id} account={a} />
                ))}
              </>
            )}
          </Flex>
          {activeAccount && (
            <Box p="2rem">
              <Balance account={activeAccount.id} period={period} />

              <Transactions account={activeAccount} period={period} />
            </Box>
          )}
        </Box>
      </Flex>
    </Flex>
  );
};

export default Dashboard;
