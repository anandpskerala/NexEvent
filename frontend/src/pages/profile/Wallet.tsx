import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Wallet } from '../../interfaces/entities/Wallet';
import axiosInstance from '../../utils/axiosInstance';
import { LazyLoadingScreen } from '../../components/partials/LazyLoadingScreen';
import { NavBar } from '../../components/partials/NavBar';
import { Link } from 'react-router-dom';
import { UserSidebar } from '../../components/partials/UserSidebar';
import { ArrowDown, ArrowUp, Calendar, DollarSign, Music, Settings, Users } from 'lucide-react';
import { formatDate } from '../../utils/stringUtils';
import { Footer } from '../../components/partials/Footer';

const Wallet = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [loading, setLoading] = useState<boolean>(true);
    const [wallet, setWallet] = useState<Wallet | null>(null);

    const formatAmount = (amount: number, type: string) => {
        const sign = type === 'DEBIT' ? '-' : '+';
        return `${sign} ₹ ${amount.toFixed(2)}`;
    };

    const getAmountColor = (type: string) => {
        switch (type) {
            case 'DEBIT': return 'text-red-500';
            case 'CREDIT': return 'text-green-500';
            case 'REFUND': return 'text-blue-500';
            default: return 'text-gray-900';
        }
    };

    const getTransactionIcon = (description: string) => {
        if (description.toLowerCase().includes('concert') || description.toLowerCase().includes('swift')) {
            return <Music className="w-6 h-6 text-pink-500" />;
        }
        if (description.toLowerCase().includes('lakers') || description.toLowerCase().includes('celtics')) {
            return <Users className="w-6 h-6 text-orange-500" />;
        }
        if (description.toLowerCase().includes('tech') || description.toLowerCase().includes('summit')) {
            return <Settings className="w-6 h-6 text-blue-500" />;
        }
        return <DollarSign className="w-6 h-6 text-green-500" />;
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'Concert': return 'bg-pink-100 text-pink-800';
            case 'Sports': return 'bg-orange-100 text-orange-800';
            case 'Conference': return 'bg-blue-100 text-blue-800';
            case 'Income': return 'bg-green-100 text-green-800';
            case 'Refund': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getTransactionCategory = (description: string) => {
        if (description.toLowerCase().includes('concert')) return 'Concert';
        if (description.toLowerCase().includes('lakers') || description.toLowerCase().includes('celtics')) return 'Sports';
        if (description.toLowerCase().includes('tech')) return 'Conference';
        if (description.toLowerCase().includes('salary')) return 'Income';
        if (description.toLowerCase().includes('refund')) return 'Refund';
        return 'General';
    };

    useEffect(() => {
        const fetchWallet = async (userId: string) => {
            setLoading(true);
            try {
                const res = await axiosInstance.get(`/payment/wallet/${userId}`);
                if (res.data) {
                    setWallet(res.data.wallet);
                }
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchWallet(user?.id as string);
    }, [user?.id]);

    if (loading) return <LazyLoadingScreen />;

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <NavBar isLogged={user?.isVerified} name={user?.firstName} user={user} />
            <div className="flex justify-center items-center min-h-screen p-4 mt-15">
                <div className="flex w-full gap-2 md:gap-5 overflow-hidden p-0 md:px-10 md:py-6">
                    <UserSidebar user={user} section='wallet' />
                    <div className="flex-1 flex-col bg-white py-10 px-6 md:px-20 rounded-2xl shadow-lg border border-gray-200">
                        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                            <div className="flex items-center">
                                <Link to="/" className="text-blue-500 hover:text-blue-600 transition-colors text-sm md:text-md font-medium">
                                    Home
                                </Link>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mx-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                <span className="text-gray-700 text-sm md:text-md font-medium">Wallet</span>
                            </div>
                        </div>

                        <div className="p-6 flex w-full flex-col items-center">
                            <div className="max-w-md w-md bg-gradient-to-r from-blue-600 to-blue-800 rounded-2xl p-6 text-white relative overflow-hidden">
                                <div className="absolute top-4 right-4">
                                    <div className="bg-white bg-opacity-20 rounded px-2 py-1 text-xs text-black font-medium">
                                        VISA
                                    </div>
                                </div>

                                <div className="absolute top-4 left-4">
                                    <div className="w-8 h-6 bg-yellow-400 rounded"></div>
                                </div>

                                <div className="mt-8">
                                    <div className="text-sm opacity-90 mb-1">**** **** **** 4589</div>
                                </div>

                                <div className="mt-6">
                                    <div className="text-sm opacity-90 mb-1">Available Balance</div>
                                    <div className="text-3xl font-bold">₹{wallet?.balance.toLocaleString()}</div>
                                </div>

                                <div className="flex justify-between items-end mt-6">
                                    <div>
                                        <div className="text-xs opacity-75 mb-1">CARD HOLDER</div>
                                        <div className="text-sm font-medium">{user?.firstName} {user?.lastName}</div>
                                    </div>
                                    <div>
                                        <div className="text-xs opacity-75 mb-1">EXPIRES</div>
                                        <div className="text-sm font-medium">05/28</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-6 w-md">
                                <button className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors">
                                    <ArrowDown className="w-4 h-4" />
                                    Send Payment
                                </button>
                                <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors">
                                    <ArrowUp className="w-4 h-4" />
                                    Request Money
                                </button>
                            </div>
                        </div>

                        <div className="px-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                                <button className="text-blue-600 text-sm font-medium hover:text-blue-700">
                                    View All →
                                </button>
                            </div>

                            <div className="space-y-4">
                                {wallet?.transactions.map((transaction) => {
                                    const category = getTransactionCategory(transaction.description || '');
                                    return (
                                        <div key={transaction.id} className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                                    {getTransactionIcon(transaction.description || '')}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-gray-900">
                                                        {transaction.description || 'Transaction'}
                                                    </div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(category)}`}>
                                                            {category}
                                                        </span>
                                                        <span className="text-xs text-gray-500 flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(transaction.date.toString())}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`font-semibold ${getAmountColor(transaction.type)}`}>
                                                {formatAmount(transaction.amount, transaction.type)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="h-8"></div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    )
}

export default Wallet;