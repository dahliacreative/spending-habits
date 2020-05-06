import React from "react";
import { Box, Heading, useTheme, Flex, Text, Image } from "@chakra-ui/core";
import moment from "moment";

const Panel = ({
  title,
  account,
  transactions,
  type = "transaction",
  total,
  ...props
}) => {
  const { colors } = useTheme();
  return (
    <Box
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
        p="1rem"
        color={colors.blue[900]}
      >
        {title}
      </Heading>

      <Box maxH="25rem" overflow="auto">
        {Object.entries(transactions)
          .sort(([a], [b]) => (a > b ? -1 : a < b ? 1 : 0))
          .map(([date, transactions]) => (
            <Box key={`transactions-${date}`}>
              <Flex
                alignItems="center"
                borderBottom="1px"
                borderColor={colors.gray[200]}
                bg={colors.gray[100]}
                p="0.25rem 1rem 0.3rem"
              >
                <Heading size="sm" color={colors.blue[800]}>
                  {moment(date).format("Do MMMM")}
                </Heading>
                <Text as="b" fontSize="sm" color={colors.pink[500]} ml="auto">
                  £
                  {(
                    (transactions.reduce((acc, curr) => acc + curr.amount, 0) /
                      100) *
                    -1
                  ).toFixed(2)}
                </Text>
              </Flex>
              {transactions
                .sort((a, b) =>
                  a.created > b.created ? -1 : a.created < b.created ? 1 : 0
                )
                .map((t) => (
                  <Flex
                    lineHeight="1.2"
                    key={`transactions-${t.id}`}
                    alignItems="center"
                    borderBottom="1px"
                    borderColor={colors.gray[200]}
                    p="0.5rem 1rem"
                  >
                    {type === "transaction" && (
                      <Image src={t.merchant.logo} size="2rem" mr="1rem" />
                    )}
                    <Box>
                      {type === "transaction" && (
                        <Text fontSize="sm" color={colors.gray[600]}>
                          {t.merchant.name}
                        </Text>
                      )}
                      <Text fontSize="xs" color={colors.gray[400]}>
                        {moment(t.created).format("HH:mm")}
                      </Text>
                    </Box>

                    {type === "transaction" && (
                      <Box ml="auto" alignSelf="flex-end">
                        <Text fontSize="xs" color={colors.gray[400]}>
                          {t.notes ? t.notes : "-"}
                        </Text>
                      </Box>
                    )}
                    <Box
                      ml={type === "transaction" ? "2rem" : "auto"}
                      textAlign="right"
                      w="3rem"
                    >
                      <Text fontSize="sm" as="b" color={colors.gray[600]}>
                        £{((t.amount / 100) * -1).toFixed(2)}
                      </Text>
                      {type === "transaction" && (
                        <Text fontSize="xs" color={colors.gray[400]}>
                          {account.owners.find(
                            (o) => o.user_id === t.user_id
                          ) &&
                            account.owners.find((o) => o.user_id === t.user_id)
                              .preferred_first_name}
                        </Text>
                      )}
                    </Box>
                  </Flex>
                ))}
            </Box>
          ))}
      </Box>

      <Flex p="1rem" justifyContent="flex-end" bg={colors.gray[100]}>
        <Text mr="0.5rem">
          {type === "transaction" ? "Total expenditure" : "Total round-ups"} for
          this period:
        </Text>
        <Text as="b">
          £
          {type === "transaction"
            ? ((total / 100) * -1).toFixed(2)
            : (total / 100).toFixed(2)}
        </Text>
      </Flex>
    </Box>
  );
};

export default Panel;
