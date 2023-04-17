import styled from "styled-components";

export const HomeContainer = styled.main`

    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    form {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 3.5rem;
    }
`

export const BaseCountdownButton = styled.button`

    width: 100%;
    border: 0;
    padding: 1rem;
    border-radius: 8px;
    opacity: 0.9;

    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;

    font-weight: bold;
    cursor: pointer;

    transition: .2s;

    color: ${props => props.theme['white']};

    &:disabled {
        cursor: not-allowed;
        opacity: 0.7;
    }
`

export const StartCountdownButton = styled(BaseCountdownButton)`

    background-color: ${props => props.theme['blue-500']};
    color: ${props => props.theme['white']};

    &:not(:disabled):hover {
        background-color: ${props => props.theme['blue-700']};
    }
`

export const StopCountdownButton = styled(BaseCountdownButton)`

    background-color: ${props => props.theme['red-500']};

    &:not(:disabled):hover {
        background-color: ${props => props.theme['red-700']};
    }
`