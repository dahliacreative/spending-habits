import React, { useState } from "react";
import api from "../../api";
import { Flex } from "@chakra-ui/core";
import usePoll from "react-use-poll";
import Panel from "./Panel";
import { Skeleton, Box } from "@chakra-ui/core";

const Balance = ({ account, period }) => {
  const [state, setState] = useState();

  usePoll(
    async () => {
      const { data: balance } = await api.get("/balance", {
        params: {
          account_id: account,
        },
      });
      const {
        data: { transactions },
      } = await api.get("/transactions", {
        params: {
          account_id: account,
          since: period.startOfCurrentWeek.format(),
          before: period.endOfCurrentWeek.format(),
        },
      });
      setState({
        ...balance,
        monthlyBudget: 140000,
        spent_this_week:
          transactions
            .filter((t) => t.include_in_spending)
            .reduce((acc, curr) => {
              return acc + curr.amount;
            }, 0) * -1,
      });
    },
    [account, period],
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

  const leftThisMonth = state.balance;
  const monthPercent =
    leftThisMonth === 0 ? 0 : (leftThisMonth / state.monthlyBudget) * 100;

  const weeklyBudget =
    (state.balance + state.spent_this_week) / period.weeksLeft;
  const leftThisWeek = weeklyBudget - state.spent_this_week;
  const weekPercent =
    leftThisWeek === 0 ? 0 : (leftThisWeek / weeklyBudget) * 100;

  const spentToday = state.spend_today * -1;
  const dailyBudget = (state.balance + spentToday) / period.daysLeft;
  const leftToday = dailyBudget - spentToday;
  const todayPercent = leftToday === 0 ? 0 : (leftToday / dailyBudget) * 100;

  return (
    <Flex>
      <Panel
        title="Left this month"
        percent={monthPercent}
        left={(leftThisMonth / 100).toFixed(2)}
        total={state.monthlyBudget / 100}
        spent={((state.monthlyBudget - leftThisMonth) / 100).toFixed(2)}
        updateTotal={(monthlyBudget) =>
          setState({
            ...state,
            monthlyBudget,
          })
        }
        useInput
      />

      <Panel
        m="0 1.5rem"
        title="Left this week"
        percent={weekPercent}
        left={(leftThisWeek / 100).toFixed(2)}
        total={(weeklyBudget / 100).toFixed(2)}
        spent={(state.spent_this_week / 100).toFixed(2)}
      />

      <Panel
        title="Left today"
        percent={todayPercent}
        left={(leftToday / 100).toFixed(2)}
        total={(dailyBudget / 100).toFixed(2)}
        spent={((state.spend_today * -1) / 100).toFixed(2)}
      />
    </Flex>
  );
};

export default Balance;
