// Imports
import { createContext, useContext, useEffect, useState } from 'react';
import { HandPalm, Play } from 'phosphor-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInSeconds } from 'date-fns';

import * as zod from 'zod';

import {
    HomeContainer, 
    StartCountdownButton, 
    StopCountdownButton
} from "./styles";

import { NewCycleForm } from './components/NewCycleForm/NewCycleForm';
import { Countdown } from './components/Countdown/Countdown';
import { CyclesContext } from '../../contexts/CyclesContext';

// Schema
const newCycleFormValidationSchema = zod.object({
    task: zod.string().min(1, 'Informe a tarefa'),
    minutesAmount: zod
        .number()
        .min(5, 'O ciclo precisa ser de no mínimo 5 minutos')
        .max(60, 'O ciclo precisa ser de no máximo 60 minutos')
})

// Tipagens
type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

export function Home() {

    const { createNewCycle, interruptCurrentCycle, activeCycle } = useContext(CyclesContext)

    // React hook form
    const newCycleForm = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    const { handleSubmit, watch, reset } = newCycleForm;

    function handleCreateNewCycle(data: NewCycleFormData) {
        createNewCycle(data);
        reset();
    }

    const task = watch('task');
    const isSubmitDisabled = !task;
    
    // Prop driling -> Muitas propriedades apenas para que ocorra a comunicação entre componentes
    // Context API - Permite compartilhar informações entre vários componentes ao mesmo tempo
    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>

                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                <Countdown />

                {activeCycle ? (

                    <StopCountdownButton 
                        type="button"
                        onClick={interruptCurrentCycle}
                    >
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>

                ) : (

                    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>
    )
}