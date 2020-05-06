import React, { useEffect, useState } from "react";
import api from "../../api";
import { Box, Heading, Text, useTheme } from "@chakra-ui/core";

const Account = ({ account, single }) => {
  const [balance, setBalance] = useState();
  useEffect(() => {
    api
      .get("/balance", {
        params: {
          account_id: account.id,
        },
      })
      .then(({ data }) => {
        setBalance(data.balance);
      });
  });
  const { colors } = useTheme();
  return (
    <Box color="white" key={account.id} p="2rem" flex="1">
      <Heading size="lg">
        {account.type === "uk_retail" ? "Personal Account" : "Joint Account"}
      </Heading>
      <Box color={colors.pink[100]} m="1rem 0 0.5rem">
        <Text>
          <strong>Account number:</strong> {account.account_number}
        </Text>
        <Text>
          <strong>Sort code:</strong> {account.sort_code}
        </Text>
        <Text>
          <strong>Current balance:</strong> £{(balance / 100).toFixed(2)}
        </Text>
      </Box>
    </Box>
  );
};

export default Account;
