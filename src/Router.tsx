import { Routes, Route } from 'react-router-dom'
import { History } from './pages/History'
import { Home } from './pages/Home/Home'
import { DefaultLayout } from './layouts/DefaultLayout/DefaultLayout'

export function Router() {
    return (
        <Routes>
            <Route path="/" element={<DefaultLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/historico" element={<History />}/>
            </Route>
        </Routes>
    )
}