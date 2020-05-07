import React from "react";
import { Box, Heading, useTheme, Flex, Text, Image } from "@chakra-ui/core";
import moment from "moment";

const Panel = ({ title, account, transactions, type, total, ...props }) => {
  const { colors } = useTheme();
  const totalFigure =
    type === "spend"
      ? ((total / 100) * -1).toFixed(2)
      : (total / 100).toFixed(2);
  const displayTotal =
    totalFigure < 0 ? `- £${totalFigure}` : `£${totalFigure}`;
  return (
    <Box
      d="flex"
      flex="1"
      flexDirection="column"
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

      <Box maxH="25rem" overflow="auto" flex="1">
        {!Object.entries(transactions).length && (
          <Box p="1rem">
            <Text as="i" color={colors.gray[400]}>
              No {type === "spend" ? "transactions" : "round-ups"} to display
            </Text>
          </Box>
        )}
        {Object.entries(transactions)
          .sort(([a], [b]) => (a > b ? -1 : a < b ? 1 : 0))
          .map(([date, transactions]) => {
            const dailyTotal = (
              (transactions.reduce((acc, curr) => acc + curr.amount, 0) / 100) *
              -1
            ).toFixed(2);
            return (
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
                    {dailyTotal > 0 ? (
                      <> £{dailyTotal}</>
                    ) : (
                      <>Cr £{dailyTotal * -1}</>
                    )}
                  </Text>
                </Flex>
                {transactions
                  .sort((a, b) =>
                    a.created > b.created ? -1 : a.created < b.created ? 1 : 0
                  )
                  .map((t) => {
                    const amount = ((t.amount / 100) * -1).toFixed(2);
                    if (amount === "0.00") {
                      console.log(t);
                    }
                    const transactionType = t.include_in_spending
                      ? "spend"
                      : t.scheme === "uk_retail_pot" &&
                        t.metadata.trigger === "coin_jar"
                      ? "round"
                      : "transactions";
                    return (
                      <Flex
                        lineHeight="1.2"
                        key={`transactions-${t.id}`}
                        alignItems="center"
                        borderBottom="1px"
                        borderColor={colors.gray[200]}
                        p="0.5rem 1rem"
                      >
                        {transactionType === "spend" && t.merchant && (
                          <Image src={t.merchant.logo} size="2rem" mr="1rem" />
                        )}
                        <Box>
                          {transactionType === "spend" && t.merchant && (
                            <Text fontSize="sm" color={colors.gray[600]}>
                              {t.merchant.name}
                            </Text>
                          )}
                          {transactionType === "transactions" && (
                            <Text fontSize="sm" color={colors.gray[600]}>
                              {t.counterparty.name}
                            </Text>
                          )}
                          {transactionType === "round" && (
                            <Text fontSize="sm" color={colors.gray[600]}>
                              Round-up
                            </Text>
                          )}
                          <Text fontSize="xs" color={colors.gray[400]}>
                            {moment(t.created).format("HH:mm")}
                          </Text>
                        </Box>

                        {transactionType === "spend" && (
                          <Box ml="auto" alignSelf="flex-end">
                            <Text fontSize="xs" color={colors.gray[400]}>
                              {t.notes ? t.notes : "-"}
                            </Text>
                          </Box>
                        )}
                        <Box
                          ml={transactionType === "spend" ? "2rem" : "auto"}
                          textAlign="right"
                          w={transactionType === "spend" ? "3rem" : "auto"}
                        >
                          {transactionType === "round" ? (
                            <Text
                              fontSize="sm"
                              as="b"
                              color={colors.green[500]}
                            >
                              + £{amount}
                            </Text>
                          ) : (
                            <Text
                              fontSize="sm"
                              as="b"
                              color={
                                amount < 0
                                  ? colors.green[500]
                                  : colors.gray[600]
                              }
                            >
                              {amount < 0 ? (
                                <>+ £{amount * -1}</>
                              ) : (
                                <>£{amount}</>
                              )}
                            </Text>
                          )}
                          {transactionType === "transactions" && (
                            <Text fontSize="xs" color={colors.gray[400]}>
                              {t.description}
                            </Text>
                          )}
                          {transactionType === "spend" && (
                            <Text fontSize="xs" color={colors.gray[400]}>
                              {account.owners.find(
                                (o) => o.user_id === t.user_id
                              ) &&
                                account.owners.find(
                                  (o) => o.user_id === t.user_id
                                ).preferred_first_name}
                            </Text>
                          )}
                        </Box>
                      </Flex>
                    );
                  })}
              </Box>
            );
          })}
      </Box>
      <Flex p="1rem" justifyContent="flex-end" bg={colors.gray[100]}>
        <Text mr="0.5rem">
          {type === "spend" && "Total spend"}
          {type === "round" && "Total round-ups"}
          {type === "transactions" && "Counterparty balance"}
          {type === "all" && "Total expenditure"} for this period:
        </Text>
        <Text as="b">{displayTotal}</Text>
      </Flex>
    </Box>
  );
};

export default Panel;
