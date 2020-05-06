import React from "react";
import { Box, useTheme, Flex, Text, Avatar } from "@chakra-ui/core";

const Header = ({ user }) => {
  const theme = useTheme();

  return (
    <Box bg={theme.colors.blue[900]} p="1rem" color="white">
      <Flex alignItems="center">
        <Text fontSize="xl">Spending Habits</Text>
        <Box ml="auto" d="flex" alignItems="center">
          <Avatar size="sm" mr="0.5rem" />
          Welcome back, {user.preferred_first_name}
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
