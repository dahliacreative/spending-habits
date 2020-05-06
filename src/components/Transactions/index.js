import React, { useState } from "react";
import api from "../../api";
import { Flex, Box, Skeleton } from "@chakra-ui/core";
import usePoll from "react-use-poll";
import Panel from "./Panel";

const groupByDate = (collection) =>
  collection.reduce((acc, curr) => {
    const date = curr.created.split("T")[0];
    const accDate = acc[date] || [];
    return {
      ...acc,
      [date]: [...accDate, curr],
    };
  }, {});

const Transactions = ({ account, startDate, endDate }) => {
  const [state, setState] = useState();

  usePoll(
    async () => {
      const {
        data: { transactions },
      } = await api.get("/transactions", {
        params: {
          account_id: account.id,
          since: startDate,
          before: endDate,
          "expand[]": "merchant",
        },
      });
      const filteredTransactions = transactions.filter(
        (t) => t.include_in_spending
      );
      const filteredRoundups = transactions.filter(
        (t) => t.scheme === "uk_retail_pot" && t.metadata.trigger === "coin_jar"
      );
      setState({
        transactions: groupByDate(filteredTransactions),
        transactionsTotal: filteredTransactions.reduce(
          (acc, curr) => acc + curr.amount,
          0
        ),
        roundups: groupByDate(filteredRoundups),
        roundupsTotal:
          filteredRoundups.reduce((acc, curr) => acc + curr.amount, 0) * -1,
      });
    },
    [account, startDate, endDate],
    {
      interval: 60000,
    }
  );

  if (!state)
    return (
      <Box>
        <Skeleton h="1rem" my="1rem" w="25%" />
        <Skeleton h="1rem" my="1rem" w="50%" />
        <Skeleton h="1rem" my="1rem" w="33%" />
        <Skeleton h="1rem" my="1rem" w="75%" />
      </Box>
    );

  return (
    <Flex>
      <Panel
        title="Transactions"
        account={account}
        transactions={state.transactions}
        mr="1.5rem"
        total={state.transactionsTotal}
      />
      <Panel
        type="round"
        title="Round-ups"
        account={account}
        transactions={state.roundups}
        total={state.roundupsTotal}
      />
    </Flex>
  );
};

export default Transactions;
