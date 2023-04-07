// Imports
import { useEffect, useState } from 'react';
import { HandPalm, Play } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { differenceInSeconds } from 'date-fns';

import * as zod from 'zod';

import { 
    CountdownContainer, 
    FormContainer, 
    HomeContainer, 
    MinutesAmountInput, 
    Separator, 
    StartCountdownButton, 
    StopCountdownButton, 
    TaskInput
} from "./styles";

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

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number;
    startDate: Date;
    interruptedDate?: Date;
}

export function Home() {

    // States
    const [cycles, setCycles] = useState<Cycle[]>([]);
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    // Encontrar qual ciclo está ativo
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    // React hook form
    const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    });

    // useEffect
    useEffect(() => {

        let interval: number;

        if(activeCycle) {

            interval = setInterval(() => {

                setAmountSecondsPassed(differenceInSeconds(new Date(), activeCycle.startDate))

            }, 1000)
        }

        // Executar algo quando o useEffect for chamado novamente
        return () => {

            clearInterval(interval);
        }

    }, [activeCycle])

    function handleCreateNewCycle(data: NewCycleFormData) {

        const id = String(new Date().getDate());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        setCycles((state) => [...state, newCycle]);
        setActiveCycleId(id);
        setAmountSecondsPassed(0);

        reset();
        console.log(data);
    }

    // Interromper ciclo ativo
    function handleInterruptCycle() {

        setCycles(cycles.map((cycle) => {

            if(cycle.id === activeCycleId) {

                return { ...cycle, interruptedDate: new Date() }

            } else {
                return cycle;
            }
        }))

        setActiveCycleId(null);
    }

    const totalCycles = activeCycle ? activeCycle.minutesAmount * 60 : 0;
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

    const task = watch('task');
    const isSubmitDisabled = !task;
    
    return (
        <HomeContainer>
            <form onSubmit={handleSubmit(handleCreateNewCycle)}>
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                        id="task"
                        placeholder="Dê um nome para o seu projeto"
                        list="task-suggestions"
                        disabled={!!activeCycle}
                        {...register('task')}
                    />

                    <datalist id="task-suggestions">
                        <option value="A" />
                        <option value="B" />
                        <option value="C" />
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput 
                        type="number"
                        id="minutesAmount"
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        disabled={!!activeCycle}
                        {...register('minutesAmount', { valueAsNumber: true })}
                    />

                    <span>minutos.</span>
                </FormContainer>
            
                <CountdownContainer>
                    <span>{minutes[0]}</span>
                    <span>{minutes[1]}</span>
                    <Separator>:</Separator>
                    <span>{seconds[0]}</span>
                    <span>{seconds[1]}</span>
                </CountdownContainer>

                {activeCycle ? (

                    <StopCountdownButton 
                        type="button"
                        onClick={handleInterruptCycle}
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