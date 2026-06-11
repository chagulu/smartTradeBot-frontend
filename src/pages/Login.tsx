import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { useAppContext } from '../context/AppContext';
import toast from 'react-hot-toast';
import { Loader } from '../components/ui/Loader';
import { TrendingUp } from 'lucide-react';

export const Login = () => {
    const callbackParams = new URLSearchParams(window.location.search);
    const [requestToken, setRequestToken] = useState(() => callbackParams.get('request_token') || '');
    const [userIdInput, setUserIdInput] = useState(() => callbackParams.get('user_id') || '');
    const [loading, setLoading] = useState(false);
    const { setLoggedIn, setUserId } = useAppContext();
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await authService.login({ request_token: requestToken, user_id: userIdInput });
            setUserId(res.user_id);
            setLoggedIn(true);
            toast.success('Login successful');
            navigate('/');
        } catch {
            toast.error('Login Failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleZerodhaLogin = () => {
        toast('Opening Zerodha login');
        window.location.href = 'http://localhost:5001/auth/login';
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="flex justify-center mb-4 text-blue-600">
                    <TrendingUp size={48} />
                </div>
                <h2 className="text-3xl font-bold tracking-tight text-gray-900">SmartTradeBot</h2>
                <p className="mt-2 text-sm text-gray-600">Sign in to access your dashboard</p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-100">
                    <div className="mb-6">
                        <button
                            onClick={handleZerodhaLogin}
                            className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors"
                        >
                            Login with Zerodha
                        </button>
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-500">Or enter details manually</span>
                        </div>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                                User ID
                            </label>
                            <div className="mt-1">
                                <input
                                    id="userId" name="userId" type="text" required
                                    value={userIdInput} onChange={(e) => setUserIdInput(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                    placeholder="UPP323"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="requestToken" className="block text-sm font-medium text-gray-700">
                                Request Token
                            </label>
                            <div className="mt-1">
                                <input
                                    id="requestToken" name="requestToken" type="text" required
                                    value={requestToken} onChange={(e) => setRequestToken(e.target.value)}
                                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all"
                                    placeholder="Paste your request token here"
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400 transition-colors"
                            >
                                {loading ? <Loader className="text-white" /> : 'Sign in'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};
