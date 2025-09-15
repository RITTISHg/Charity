import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home.jsx';
import { GiveAway } from './pages/give-away.jsx';
import { LogIn } from './pages/login.jsx';
import { LogOut } from './pages/logout.jsx';
import { SignUp } from './pages/sign-up.jsx';
import { AdminDashboard } from './pages/admin-dashboard.jsx';
import { CharityLogin } from './pages/charity-login.jsx';
import { CharityDashboard } from './pages/charity-dashboard.jsx';
import { Cta } from "./components/Cta/Cta.jsx";
import { GiveAwayNavHeader } from "./components/GiveAwayNavHeader/GiveAwayNavHeader.jsx";

export default function App() {
    return (
        <Router>
            {/* Navigation Header */}


            {/* Define Routes */}
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/give-away' element={<GiveAway />} />
                <Route path='/login' element={<LogIn />} />
                <Route path='/logout' element={<LogOut />} />
                <Route path='/sign-up' element={<SignUp />} />
                <Route path='/Cta' element={<Cta />} />
                <Route path='/admin-dashboard' element={<AdminDashboard />} />
                <Route path='/charity-login' element={<CharityLogin />} />
                <Route path='/charity-dashboard' element={<CharityDashboard />} />
            </Routes>
        </Router>
    );
}