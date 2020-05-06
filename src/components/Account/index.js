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
    <Box
      color="white"
      key={account.id}
      borderRadius="4px"
      bg={colors.pink[500]}
      boxShadow="1px 1px 5px rgba(0,0,0,0.05)"
      p="1rem"
      flex={single ? "initial" : "1"}
      margin="0 0.5rem"
      w={single ? "calc(33.333% - 1.5rem)" : "auto"}
    >
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
