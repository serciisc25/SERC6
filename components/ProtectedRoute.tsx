import React, { useState } from 'react';

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const correctPassword = 'serc-admin';

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === correctPassword) {
            sessionStorage.setItem('isAdminAuthenticated', 'true');
            onLogin();
        } else {
            setError('Incorrect password');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
            <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md dark:bg-slate-800">
                <h2 className="text-2xl font-bold text-center text-brand-blue dark:text-brand-orange">Admin Login</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="password"
                               className="block text-sm font-medium text-slate-700 dark:text-gray-300">Password</label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 border border-slate-300 rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 focus:ring-brand-blue focus:border-brand-blue"
                            required
                        />
                         <p className="mt-1 text-xs text-slate-500 dark:text-gray-400">Hint: <code className="text-brand-blue dark:text-brand-orange">serc-admin</code></p>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    <button type="submit"
                            className="w-full px-4 py-2 font-semibold text-white transition-colors rounded-md bg-brand-blue hover:bg-brand-blue/90 dark:bg-brand-orange dark:text-brand-blue dark:hover:bg-brand-orange/90">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

const ProtectedRoute: React.FC<{ children: React.ReactElement }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        sessionStorage.getItem('isAdminAuthenticated') === 'true'
    );

    if (!isAuthenticated) {
        return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
    }

    return children;
};


export default ProtectedRoute;