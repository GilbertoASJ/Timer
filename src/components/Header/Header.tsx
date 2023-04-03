import { NavLink } from "react-router-dom";
import { HeaderContainer } from "./styles";
import { HourglassHigh, Timer, Scroll } from 'phosphor-react';

export function Header() {
    return (
        <HeaderContainer>
            <span>
                <HourglassHigh size={32} />
            </span>
            <nav>
                <NavLink to="/" title="Timer">
                    <Timer size={24} />
                </NavLink>
                <NavLink to="/historico" title="Histórico">
                    <Scroll size={24} />
                </NavLink>
            </nav>
        </HeaderContainer>
    )
}