import React from "react";

import {
    Container,
    Header,
    Title,
    Icon,
    Footer,
    Amount,
    LastTransection

} from './styles'

export function HighligthCard() {

    return (
        <Container>
            <Header>
                <Title>Entrada</Title>
                <Icon name="arrow-up-circle" />
            </Header>

            <Footer>
                <Amount>
                    R$ 17,4400,00
                </Amount>
                <LastTransection>
                    Utima entrada dia 13 de abril
                </LastTransection>
            </Footer>
        </Container>
    )
}