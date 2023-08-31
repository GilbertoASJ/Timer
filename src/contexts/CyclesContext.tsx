import { ReactNode, createContext, useState, useReducer, useEffect } from "react";
import { Cycle, cyclesReducer } from '../reducers/cycles/reducer'
import { addNewCycleAction, interruptCycleAction, markCurrentCycleAsFinishedAction } from '../reducers/cycles/actions'

interface CreateCycleData {
    task: string;
    minutesAmount: number;
}

interface CyclesContextType {
    cycles: Cycle[];
    activeCycle: Cycle | undefined;
    activeCycleId: string | null;
    amountSecondsPassed: number;
    interruptCurrentCycle: () => void;
    markCurrentCycleAsFinished: () => void;
    setSecondsPassed: (seconds: number) => void;
    createNewCycle: (data: CreateCycleData) => void;
}

interface CyclesContextProviderProps {
    children: ReactNode
}

export const CyclesContext = createContext({} as CyclesContextType)

export function CyclesContextProvider({ children }: CyclesContextProviderProps) {

    const [cyclesState, dispatch] = useReducer(
        cyclesReducer, 
        {
            cycles: [],
            activeCycleId: null
        },
        (initialState) => {
            const storedStateAsJSON = localStorage.getItem('@timer:cycles-state-1.0.0')

            if(storedStateAsJSON) {
                return JSON.parse(storedStateAsJSON)
            }

            return initialState;
        }
    );

    const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

    useEffect(() => {

        const stateJSON = JSON.stringify(cyclesState);

        localStorage.setItem('@timer:cycles-state-1.0.0', stateJSON)

    }, [cyclesState])

    const { cycles, activeCycleId } = cyclesState;
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

    function setSecondsPassed(seconds: number) {    
        setAmountSecondsPassed(seconds)
    }

    function markCurrentCycleAsFinished() {

        dispatch(markCurrentCycleAsFinishedAction())
    }

    function createNewCycle(data: CreateCycleData) {

        const id = String(Date.now());

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date()
        }

        dispatch(addNewCycleAction(newCycle))

        setAmountSecondsPassed(0);
    }

    // Interromper ciclo ativo
    function interruptCurrentCycle() {

        dispatch(interruptCycleAction())
    }

    return (
        <CyclesContext.Provider
            value={{
                cycles,
                activeCycle, 
                activeCycleId, 
                markCurrentCycleAsFinished, 
                amountSecondsPassed,
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle
            }}
        >
            {children}
        </CyclesContext.Provider>
    )
}