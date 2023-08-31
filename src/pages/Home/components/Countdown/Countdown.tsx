import { useContext, useEffect, useState } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from '../../../../contexts/CyclesContext';


export function Countdown() {

    const {
        activeCycle, 
        activeCycleId, 
        markCurrentCycleAsFinished, 
        amountSecondsPassed,
        setSecondsPassed
    } = useContext(CyclesContext);
    const totalCycles = activeCycle ? activeCycle.minutesAmount * 60 : 0;

    // useEffect para reduzir o countdown
    useEffect(() => {

        let interval: number;

        if(activeCycle) {

            interval = setInterval(() => {

                const secondsDifference = differenceInSeconds(new Date(), new Date(activeCycle.startDate));

                if(secondsDifference >= totalCycles) {

                    markCurrentCycleAsFinished();

                    setSecondsPassed(totalCycles);
                    clearInterval(interval);
                } else {

                    setSecondsPassed(secondsDifference);
                }

            }, 1000)
        }

        return () => {

            clearInterval(interval);
        }

    }, [activeCycle, totalCycles, activeCycleId, markCurrentCycleAsFinished, setSecondsPassed])

    const currentSeconds = activeCycle ? totalCycles - amountSecondsPassed : 0;

    // Minutos e segundos atualizados
    const currentMinutes = Math.floor(currentSeconds / 60);
    const secondsAmount = currentSeconds % 60;

    const minutes = String(currentMinutes).padStart(2, '0');
    const seconds = String(secondsAmount).padStart(2, '0');

    useEffect(() => {

        if(activeCycle) {
            document.title = `Timer - ${minutes}:${seconds}`;
        }

    }, [minutes, seconds, activeCycle])

    return(
        <CountdownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountdownContainer>
    )
}