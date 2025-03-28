import React, { useState } from 'react';
import Payment from './Pay';

const Paymentbutton = () => {
    const [showPayment, setShowPayment] = useState(false);

    const handleClick = () => {
        alert('Proceeding with payment of ₹200');
        setShowPayment(true);
    };

    return (
        <div>
            <button
                type="button"
                onClick={handleClick}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-medium shadow-lg hover:shadow-indigo-100/50 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 flex items-center justify-center"
            >
                <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                </span>
                Confirm and Pay ₹200
            </button>

            {showPayment && <Payment amount={200} onSuccess={() => console.log("OK")} />}
        </div>
    );
};

export default Paymentbutton;