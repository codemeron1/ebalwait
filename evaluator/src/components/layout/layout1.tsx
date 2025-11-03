import { useState, useEffect, useRef } from 'react';
import { Home, ClipboardCheck, Award, LogOut, ShieldUser } from 'lucide-react';
import { Outlet, useNavigate } from 'react-router-dom';
import { ModeToggle } from '../mode-toggle';

import { useAuthenticatedUser } from '../../context/AuthenticatedUserContext';

const Layout1 = () => {
    const [activeMenu, setActiveMenu] = useState('home');
    const [pageTitle, setPageTitle] = useState('Home');
    const [pageSubTitle, setPageSubTitle] = useState('Welcome to the dashboard');
    const roles = useRef(['Team Manager', 'Lead Programmer', 'API Tester', 'Documentation Specialist', 'API Programmer']);

    const navigate = useNavigate();
    const user = useAuthenticatedUser();

    useEffect(() => {
        // const isAuthenticated = localStorage.getItem('authToken');
        // if (!isAuthenticated) {
        //     localStorage.removeItem('authToken');
        //     localStorage.removeItem('userData');
        //     navigate('/', { replace: true });
        //     return;
        // }
        switch (activeMenu) {
            case 'home':
                navigate('/home');
                setPageTitle('Home');
                setPageSubTitle('Welcome to the dashboard');
                break;
            case 'evaluate':
                setPageTitle('Evaluate Team Members');
                setPageSubTitle('Rate your team members for this week');
                navigate('/rate');
                break;
            case 'grade':
                setPageTitle('My Grades');
                setPageSubTitle("Here's your evaluation results. Keep growing!");
                navigate('/results');
                break;
            case 'logout':
                const really = confirm("Are you sure you want to logout?");
                if (really) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userData');
                    navigate('/', { replace: true });
                } else {
                    setActiveMenu('home');
                }
                break;
        }
    }, [activeMenu]);

    const menuItems = [
        { id: 'home', icon: Home, label: 'Home' },
        { id: 'evaluate', icon: ClipboardCheck, label: 'Evaluate' },
        { id: 'grade', icon: Award, label: 'My Grade' },
        { id: 'logout', icon: LogOut, label: 'Logout' },
    ];

    return (
        <div className="h-screen flex items-start md:items-center bg-background relative overflow-hidden">
            {/* Main Content Area */}
            <div id="main-content" className="flex-1 flex items-start md:items-center 
                justify-center p-0 md:px-8 md:pb-8 min-h-0 h-[88vh]">
                <div className="w-full md:max-w-5xl h-full bg-background">
                    {/* Content Card */}
                    <div className="h-full bg-background backdrop-blur-sm rounded-none md:rounded-md 
                            shadow-md border overflow-hidden transition-all duration-300
                            hover:shadow-3xl flex flex-col">

                        {/* Card Content */}
                        <div className="flex-1 p-0 overflow-y-auto min-h-0">
                            <div className="prose prose-slate max-w-none h-full">
                                <div className="relative h-full flex flex-col">
                                    {/* Linux Window Container */}
                                    <div className="flex-1 bg-slate-50 rounded-none md:rounded-lg md:shadow-2xl 
                                        border border-slate-300 overflow-hidden flex flex-col">
                                        {/* Window Title Bar */}
                                        <div className="bg-linear-to-r from-slate-700 to-slate-800 px-4 py-2 flex items-center justify-between 
                                            border-b border-slate-600 text-slate-200 dark:from-slate-900 dark:to-slate-950
                                            dark:border-slate-800 dark:text-slate-300">

                                            {/* Window Controls */}
                                            <div className="flex items-center gap-2">
                                                <div className="w-3 h-3 bg-red-500 rounded-full hover:bg-red-400 cursor-pointer transition-colors shadow-sm"></div>
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full hover:bg-yellow-400 cursor-pointer transition-colors shadow-sm"></div>
                                                <div className="w-3 h-3 bg-green-500 rounded-full hover:bg-green-400 cursor-pointer transition-colors shadow-sm"></div>
                                            </div>

                                            {/* Window Title */}
                                            <div className="flex items-center gap-2 text-white text-sm font-medium">
                                                <div className="w-4 h-4 bg-blue-500 rounded-sm flex items-center justify-center">
                                                    <span className="text-white text-xs font-bold">T</span>
                                                </div>
                                                <span className="text-slate-400 text-sm font-mono">team@ebalwait:~$</span>
                                            </div>

                                            {/* Menu Button */}
                                            <div className="flex items-center gap-1">
                                                <ModeToggle />
                                            </div>
                                        </div>

                                        {/* Window Content */}
                                        <div className="relative flex-1 flex flex-col bg-background">
                                            {/* Application Header */}
                                            <header className="bg-slate-100 border-b border-slate-200 px-6 py-4 
                                                dark:bg-slate-900  dark:border-slate-800">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm 
                                                        bg-linear-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700">
                                                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                                        </svg>
                                                    </div>

                                                    <div>
                                                        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">
                                                            {pageTitle}
                                                        </h2>
                                                        <p className="text-sm text-slate-600 dark:text-slate-400">
                                                            {pageSubTitle}
                                                        </p>
                                                    </div>

                                                </div>
                                            </header>

                                            {/* Main Content Area */}
                                            <main className="relative bg-background overflow-y-auto max-h-[70vh]
                                                         
                                                        [&::-webkit-scrollbar]:w-2 
                                                        [&::-webkit-scrollbar-track]:bg-muted 
                                                        [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 
                                                        [&::-webkit-scrollbar-thumb]:rounded-full 
                                                        hover:[&::-webkit-scrollbar-thumb]:bg-muted-foreground/40">
                                                <Outlet />
                                            </main>


                                            {/* Status Bar */}
                                            <div className=" fixed bottom-0 left-0 right-0 bg-slate-200 border-t border-slate-300 
                                                px-4 py-2 flex items-center justify-between text-xs text-slate-600
                                                dark:bg-slate-900 dark:border-slate-700 dark:text-slate-400">
                                                <div className="flex items-center gap-4">
                                                    <span className="hidden md:flex items-center gap-1">
                                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                        Logged in
                                                    </span>

                                                    <span className="flex items-center gap-1">
                                                        <ShieldUser size={18} />
                                                        <span className='px-2'>{`${user?.first_name || 'Juan'} ${user?.last_name || 'Dela Cruz'}`}</span> |
                                                        <span className='px-2'>{roles.current[Number(user?.role) - 1 || 0] || 'Team Member'}</span>
                                                    </span>
                                                </div>

                                                <div className="flex items-center pr-2">
                                                    <span>{new Date().toLocaleTimeString()}</span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Dock Navigation - Desktop (Right Side) */}
            <div className="hidden md:block fixed right-8 top-1/2 -translate-y-1/2 z-20">
                <div className="bg-backgroun/90 backdrop-blur-lg rounded-2xl shadow-2xl p-4 border border-white/50">
                    <nav className="flex flex-col gap-3">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeMenu === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveMenu(item.id)}
                                    className={`group cursor-pointer relative w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive
                                        ? 'bg-linear-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110 shadow-blue-500/25'
                                        : 'text-slate-600 hover:bg-linear-to-br hover:from-slate-100 hover:to-slate-200 hover:scale-105 hover:shadow-md'
                                        }`}
                                    aria-label={item.label}
                                >
                                    <Icon className="w-6 h-6" />

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-blue-500 to-purple-600 rounded-full"></div>
                                    )}

                                    {/* Tooltip */}
                                    <span className="absolute right-full mr-4 px-4 py-2 bg-linear-to-r from-slate-800 to-slate-700 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap shadow-lg">
                                        {item.label}
                                        <div className="absolute left-full top-1/2 -translate-y-1/2 border-4 border-transparent border-l-slate-800"></div>
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>

            {/* Dock Navigation - Mobile (Bottom) */}
            <div className="md:hidden fixed bottom-2 left-1/2 -translate-x-1/2 z-30">
                <div className="bg-background/95 backdrop-blur-lg rounded-2xl shadow-2xl p-1 border border-white/50">
                    <nav className="flex flex-row gap-2">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeMenu === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveMenu(item.id)}
                                    className={`group relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isActive
                                        ? 'bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg scale-110 shadow-blue-500/25'
                                        : 'text-slate-600 hover:bg-gradient-to-br hover:from-slate-100 hover:to-slate-200 hover:scale-105 hover:shadow-md'
                                        }`}
                                    aria-label={item.label}
                                >
                                    <Icon className="w-5 h-5" />

                                    {/* Active Indicator */}
                                    {isActive && (
                                        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                                    )}

                                    {/* Tooltip */}
                                    <span className="absolute bottom-full mb-2 px-3 py-1.5 bg-gradient-to-r from-slate-800 to-slate-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 whitespace-nowrap shadow-lg">
                                        {item.label}
                                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                                    </span>
                                </button>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
};


export default Layout1;