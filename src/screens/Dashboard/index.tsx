import React from "react";
import { HighligthCard } from "../../components/HighligthCard";
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
    HighligthCards

} from "./styles";


export function Dashboard() {
    return (
        <Container>
            <Header>
                <UserWrapper>
                    <UserInfo>

                        <Photo
                            source={{ uri: 'https://avatars.githubusercontent.com/u/47856009?v=4' }}
                        />

                        <User>
                            <UserGreeting>Olá,</UserGreeting>
                            <UserName>Richard</UserName>
                        </User>

                    </UserInfo>

                    <Icon name="power" />
                </UserWrapper>
            </Header>

            <HighligthCards>
                <HighligthCard />
                <HighligthCard />
                <HighligthCard />
            </HighligthCards>

        </Container>
    )
}