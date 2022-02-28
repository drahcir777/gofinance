import React, { useState, useEffect, useCallback } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "styled-components";
import { useFocusEffect } from "@react-navigation/native";
import { HighligthCard } from "../../components/HighligthCard";
import {
  TransactionCard,
  TransactionCardProps,
} from "../../components/TransactionCard";

import {
  Container,
  Header,
  UserWrapper,
  UserInfo,
  User,
  Photo,
  UserGreeting,
  UserName,
  Icon,
  HighligthCards,
  Transactions,
  Title,
  TransactionList,
  LogoutButton,
  LoadContainer,
} from "./styles";
import { useAuth } from "../../hooks/auth";

export interface DataListProps extends TransactionCardProps {
  id: string;
}

interface HigthLigthProps {
  amount: string;
  lastTransaction: string;
}

interface HigthLigthData {
  entries: HigthLigthProps;
  expensive: HigthLigthProps;
  total: HigthLigthProps;
}

function getLastTransactionDate(
  collection: DataListProps[],
  type: "positive" | "negative"
) {
  const collectionFilttered = collection.filter(
    (transaction) => transaction.type === type
  );

  if (collectionFilttered.length === 0) return 0;

  const lastTransaction = new Date(
    Math.max.apply(
      Math,
      collectionFilttered.map((transaction) =>
        new Date(transaction.date).getTime()
      )
    )
  );

  return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString(
    "pt-Br",
    {
      month: "long",
    }
  )}`;
}

export function Dashboard() {
  const [isLoding, setIsLoading] = useState(true);
  const [transactions, setTranstions] = useState<DataListProps[]>([]);
  const [higthLigthData, setHigthLigthData] = useState<HigthLigthData>(
    {} as HigthLigthData
  );

  const { signOut, user } = useAuth();

  const theme = useTheme();

  const dataKey = `@gofinance:transactions_user:${user.id}`;

  async function loadTransations() {
    const response = await AsyncStorage.getItem(dataKey);

    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionsFormatted: DataListProps[] = transactions.map(
      (item: DataListProps) => {
        if (item.type === "positive") {
          entriesTotal += Number(item.amount);
        } else {
          expensiveTotal += Number(item.amount);
        }

        const amount = Number(item.amount).toLocaleString("pt-Br", {
          style: "currency",
          currency: "BRL",
        });

        const date = Intl.DateTimeFormat("pt-Br", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }).format(new Date(item.date));

        return {
          id: item.id,
          name: item.name,
          amount,
          type: item.type,
          category: item.category,
          date,
        };
      }
    );

    setTranstions(transactionsFormatted);

    const lastTransactionEntries = getLastTransactionDate(
      transactions,
      "positive"
    );

    const lastTransactionExpensives = getLastTransactionDate(
      transactions,
      "negative"
    );

    const totalInterval =
      lastTransactionEntries === 0
        ? "Não há transações"
        : `01 a ${lastTransactionEntries}`;

    const total = entriesTotal - expensiveTotal;

    setHigthLigthData({
      entries: {
        amount: entriesTotal.toLocaleString("pt-Br", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction:
          lastTransactionEntries === 0
            ? "Não há transações"
            : `Última entrada dia ${lastTransactionEntries}`,
      },
      expensive: {
        amount: expensiveTotal.toLocaleString("pt-Br", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction:
          lastTransactionExpensives === 0
            ? "Não há transações"
            : `Última saida dia ${lastTransactionEntries}`,
      },
      total: {
        amount: total.toLocaleString("pt-Br", {
          style: "currency",
          currency: "BRL",
        }),
        lastTransaction: totalInterval,
      },
    });

    setIsLoading(false);
  }

  useFocusEffect(
    useCallback(() => {
      loadTransations();
    }, [])
  );

  return (
    <Container>
      {isLoding ? (
        <LoadContainer>
          <ActivityIndicator color={theme.colors.primary} size="large" />
        </LoadContainer>
      ) : (
        <>
          <Header>
            <UserWrapper>
              <UserInfo>
                <Photo
                  source={{
                    uri: user?.photo,
                  }}
                />

                <User>
                  <UserGreeting>Olá,</UserGreeting>
                  <UserName>{user?.name}</UserName>
                </User>
              </UserInfo>

              <LogoutButton onPress={signOut}>
                <Icon name="power" />
              </LogoutButton>
            </UserWrapper>
          </Header>

          <HighligthCards>
            <HighligthCard
              type="up"
              title="Entradas"
              amount={higthLigthData.entries?.amount}
              lastTransaction={higthLigthData.entries.lastTransaction}
            />

            <HighligthCard
              type="down"
              title="Saidas"
              amount={higthLigthData.expensive?.amount}
              lastTransaction={higthLigthData.expensive.lastTransaction}
            />

            <HighligthCard
              type="total"
              title="Total"
              amount={higthLigthData.total?.amount}
              lastTransaction={higthLigthData.total.lastTransaction}
            />
          </HighligthCards>

          <Transactions>
            <Title>Listagem</Title>

            <TransactionList
              data={transactions}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => <TransactionCard data={item} />}
            />
          </Transactions>
        </>
      )}
    </Container>
  );
}
