import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Load Stripe outside the component for better performance
const stripePromise = loadStripe('pk_test_51QEukkLBvhDT0PxxvAhPvkdUr3qJB8EE2JKBJvHnooYtysH018lh8I89iAYcUgdC3RCY5L6wPGjAGTGjBBFDAffc00RGdRDs5d');

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    },
    hidePostalCode: true
};

const CheckoutForm = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [paymentStatus, setPaymentStatus] = useState('Fill in details');
    const [isProcessing, setIsProcessing] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!stripe || !elements) {
            setPaymentStatus('Stripe has not loaded.');
            return;
        }

        const cardElement = elements.getElement(CardElement);
        if (!cardElement || !cardElement._complete) {
            setPaymentStatus('Please complete the card details.');
            return;
        }

        if (!amount || amount <= 0) {
            setPaymentStatus('Invalid amount.');
            return;
        }

        setIsProcessing(true);

        try {
            // Request Payment Intent from Backend
            const response = await fetch('http://localhost:3000/pay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ amount }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Payment initiation failed');
            }

            const { clientSecret } = data;

            // Confirm Payment
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement,
                    billing_details: {
                        name: 'Test User', // Replace with actual user details
                        email: 'cureconnect0@gmail.com', // Updated email
                    },
                },
            });

            if (error) {
                setPaymentStatus(`Payment failed: ${error.message}`);
            } else if (paymentIntent.status === 'succeeded') {
                setPaymentStatus(`Payment successful! Amount paid: ₹${amount}. Check your email (cureconnect0@gmail.com) for details.`);
            }
        } catch (err) {
            setPaymentStatus(`Error: ${err.message}`);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl p-6 mt-6 border border-gray-100 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Complete Payment</h2>
                <div className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                    ₹{amount}
                </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="rounded-xl border border-gray-200 p-4 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-200">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Information</label>
                    <CardElement options={CARD_ELEMENT_OPTIONS} />
                </div>
                
                <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
                    <div className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p>This is a test payment. Use card number <span className="font-mono font-medium">4242 4242 4242 4242</span> with any future date and CVC.</p>
                    </div>
                </div>
                
                <button 
                    type="submit" 
                    disabled={!stripe || isProcessing} 
                    className={`w-full py-3 px-6 rounded-xl font-medium text-white flex items-center justify-center ${
                        isProcessing 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg hover:shadow-indigo-100/50'
                    } transition-all duration-300`}
                >
                    {isProcessing ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Processing...
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                            </svg>
                            Pay ₹{amount}
                        </>
                    )}
                </button>
            </form>
            
            {paymentStatus && paymentStatus !== 'Fill in details' && (
                <div className={`mt-4 p-4 rounded-xl text-sm font-medium ${
                    paymentStatus.includes('successful') 
                        ? 'bg-green-50 text-green-700' 
                        : paymentStatus.includes('failed') || paymentStatus.includes('Error')
                            ? 'bg-red-50 text-red-700'
                            : 'bg-blue-50 text-blue-700'
                }`}>
                    {paymentStatus}
                </div>
            )}
        </div>
    );
};

const Payment = ({ amount }) => (
    <Elements stripe={stripePromise}>
        <CheckoutForm amount={amount} />
    </Elements>
);

export default Payment;