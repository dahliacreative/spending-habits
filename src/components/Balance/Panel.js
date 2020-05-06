import React from "react";
import {
  Box,
  Heading,
  Text,
  Input,
  CircularProgress,
  useTheme,
} from "@chakra-ui/core";

const Panel = ({
  title,
  percent,
  left,
  total,
  spent,
  useInput,
  updateTotal,
  ...props
}) => {
  const { colors } = useTheme();
  return (
    <Box
      p="1rem"
      d="flex"
      flex="1"
      flexDirection="column"
      minH="15rem"
      borderWidth="1px"
      borderRadius="4px"
      boxShadow="1px 1px 5px rgba(0,0,0,0.05)"
      {...props}
    >
      <Heading
        size="lg"
        borderBottom="1px"
        borderColor={colors.gray[200]}
        pb="1rem"
        mb="1.5rem"
        color={colors.blue[900]}
      >
        {title}
      </Heading>
      <Box flexGrow="1" d="flex" alignItems="center" justifyContent="center">
        <Box textAlign="center">
          <CircularProgress
            size="10rem"
            value={percent}
            color="pink"
          ></CircularProgress>
          <Heading
            mt="1.5rem"
            size="lg"
            d="flex"
            alignItems="center"
            color={colors.blue[800]}
          >
            £{left} / £
            {useInput ? (
              <Input
                w="10rem"
                ml="0.5rem"
                value={total}
                onChange={({ target }) =>
                  updateTotal(parseInt(target.value * 100))
                }
              />
            ) : (
              total
            )}
          </Heading>
          <Text color={colors.gray[500]} mt="0.5rem">
            Total spent: £{spent}
          </Text>
        </Box>
      </Box>
    </Box>
  );
};

export default Panel;
