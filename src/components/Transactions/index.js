import React, { useState } from "react";
import api from "../../api";
import { Flex } from "@chakra-ui/core";
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
      setState({
        transactions: groupByDate(
          transactions.filter((t) => t.include_in_spending)
        ),
        roundups: groupByDate(
          transactions.filter((t) => !t.include_in_spending)
        ),
      });
    },
    [account, period],
    {
      interval: 60000,
    }
  );

  if (!state) return null;

  return (
    <Flex>
      <Panel
        title="Transactions"
        account={account}
        transactions={state.transactions}
        mr="1.5rem"
      />
      <Panel
        type="round"
        title="Round-ups"
        account={account}
        transactions={state.roundups}
      />
    </Flex>
  );
};

export default Transactions;
