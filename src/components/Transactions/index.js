import React, { useState } from "react";
import api from "../../api";
import { Flex, useTheme, Heading } from "@chakra-ui/core";
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

const Transactions = ({ account, period }) => {
  const [state, setState] = useState();
  const { colors } = useTheme();

  usePoll(
    async () => {
      const {
        data: { transactions },
      } = await api.get("/transactions", {
        params: {
          account_id: account.id,
          since: period.startOfPeriod.format(),
          before: period.endOfPeriod.format(),
          "expand[]": "merchant",
        },
      });
      const filteredTransactions = transactions.filter(
        (t) => t.include_in_spending
      );
      const filteredRoundups = transactions.filter(
        (t) => t.scheme === "uk_retail_pot"
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
    [account, period],
    {
      interval: 60000,
    }
  );

  if (!state) return null;

  return (
    <>
      <Heading
        fontWeight="normal"
        size="xl"
        m="2rem 0 1rem"
        color={colors.pink[500]}
      >
        Insights
      </Heading>
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
    </>
  );
};

export default Transactions;
