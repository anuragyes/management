import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  CreditCard,
  Shield,
  CheckCircle,
  User,
  Award,
  Receipt,
  ArrowLeft,
  Lock,
  Users,
  Trophy,
  Calendar,
  MapPin,
  Check
} from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

import { useTheme } from '../../Context/TheamContext';
import { RazorpayApiInstance, RazorpayApiInstanceVerify } from '../../ApiInstance/Allapis';


const RegistrationPaymentPage = () => {

  const { user, theme } = useTheme();   // user Details  information 

  // console.log("this is user Details " , user._id);
  const { state } = useLocation();
  const navigate = useNavigate();

  // Check if state exists
  useEffect(() => {
    if (!state) {
      toast.error("Invalid access. Please select an event first.");
      navigate('/events');
    }
  }, [state, navigate]);

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600">Invalid Access</h2>
          <p className="mt-2 text-gray-600">Please select an event to register.</p>
          <button
            onClick={() => navigate('/events')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Events
          </button>
        </div>
      </div>
    );
  }

  console.log("Event Data:", state);

  const {
    eventId,
    registrationFee,
    category,
    sportName,
    eventType,
    eventTitle,
    mode,
    venue,
    eventDate,
    maxParticipants,
    coordinator,
    _id
  } = state;

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    collegeId: '',
    year: '',
    department: '',
    category: category || '',
    sportName: sportName || '',
    eventType: eventType || 'Solo',
    teamName: '',
    teamMembers: [{ name: '', email: '', phone: '' }]
  });

  const [loading, setLoading] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [errors, setErrors] = useState({});
  const [showTeamFields, setShowTeamFields] = useState(eventType === 'Team' || eventType === 'Group');



  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => {
        console.error('Failed to load Razorpay SDK');
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };






  // Process payment
  const handlePayment = async () => {

    try {
      setProcessingPayment(true);

      // Load Razorpay script
      const razorpayLoaded = await loadRazorpayScript();
      if (!razorpayLoaded) {
        toast.error('Payment system failed to load. Please try again.');
        return;
      }

      // Convert amount to paise (₹100 = 10000 paise)
      const amountInPaise = Math.round(Number(registrationFee || 0) * 100);

      // Create order on backend
      const orderResponse = await axios.post(
        RazorpayApiInstance(user._id),
        {
          amount: amountInPaise,
          currency: "INR",
          receipt: `receipt_${Date.now()}_${eventId || _id}`,
          eventId: eventId || _id,
          eventName: eventTitle || "Event",
          registrationData: formData,
        }
      );


      const orderData = orderResponse.data;

      if (!orderData.success) {
        throw new Error(orderData.message || 'Failed to create order');
      }

      // Razorpay options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_YOUR_KEY_ID",

        amount: orderData.order.amount,
        currency: 'INR',
        name: 'Campus Events Hub',
        description: `Registration for ${eventTitle || 'Event'}`,
        order_id: orderData.order.id,

        prefill: {
          name: formData.fullName,
          email: formData.email,
          contact: formData.phone
        },

        notes: {
          eventId: eventId || _id,
          collegeId: formData.collegeId,
          department: formData.department,
          category: formData.category,
          sportName: formData.sportName,
          eventType: formData.eventType
        },

        theme: {
          color: '#3B82F6'
        },

        handler: async function (response) {
          try {
            setProcessingPayment(true);

            // Verify payment with backend
            const verifyResponse = await axios.post(RazorpayApiInstanceVerify(user.id), {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              registrationData: formData,
              eventId: eventId || _id,
              eventTitle: eventTitle,
              amount: amountInPaise
            });

            if (verifyResponse.data.success) {
              setPaymentSuccess(true);
              setOrderId(response.razorpay_order_id);
              toast.success('Registration Successful! Payment confirmed 🎉');

              // Store registration details
              localStorage.setItem('lastRegistration', JSON.stringify({
                ...formData,
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                eventId: eventId || _id,
                eventTitle: eventTitle,
                amount: registrationFee,
                timestamp: new Date().toISOString()
              }));
            } else {
              toast.error('Payment verification failed. Please contact support.');
            }
          } catch (err) {
            console.error('Verification error:', err);
            toast.error('Payment verification error');
          } finally {
            setProcessingPayment(false);
          }
        },

        modal: {
          ondismiss: function () {
            setProcessingPayment(false);
            toast.info('Payment cancelled');
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment error:', error);

      if (error.response) {
        toast.error(error.response.data.message || 'Payment failed');
      } else {
        toast.error(error.message || 'Payment failed');
      }

      setProcessingPayment(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount || 0);
  };

  // Handle back
  const handleBack = () => {
    navigate(-1);
  };

  // If payment success
  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Registration Successful! 🎉
            </h2>

            <p className="text-gray-600 mb-6">
              Thank you for registering for {eventTitle}.
              Your payment has been confirmed and registration is complete.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <div className="text-sm text-gray-500 mb-2">Order ID</div>
              <div className="font-mono text-lg text-gray-900">{orderId}</div>
            </div>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate('/orgniser/history')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
              >
                View My Registrations
              </button>
              <button
                onClick={() => navigate('/events')}
                className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-300"
              >
                Back to Events
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBack}
                  className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Event Registration
                  </h1>
                  <p className="mt-1 text-gray-600">
                    Complete your registration and make payment
                  </p>
                </div>
              </div>

              <div className="px-4 py-2 rounded-lg bg-blue-50 text-blue-700">
                <div className="font-semibold">{eventTitle}</div>
                <div className="text-sm">Fee: {formatCurrency(registrationFee)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">



          {/* Right Column - Payment Summary */}
          <div>
            {/* Order Summary */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                  <Receipt className="w-5 h-5 mr-3" />
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Registration Fee</span>
                    <span className="font-semibold">{formatCurrency(registrationFee)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Processing Fee</span>
                    <span className="font-semibold">₹0.00</span>
                  </div>
                  <div className="border-t pt-4">
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total Amount</span>
                      <span className="font-bold text-blue-600">{formatCurrency(registrationFee)}</span>
                    </div>
                  </div>
                </div>

                {/* Payment Security */}
                <div className="p-4 rounded-lg bg-gray-50 mb-6">
                  <div className="flex items-center mb-2">
                    <Shield className="w-5 h-5 text-green-500 mr-2" />
                    <span className="font-semibold">Secure Payment</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Your payment is secured with 256-bit SSL encryption
                  </p>
                </div>

                {/* Submit Button */}
                <button
                  onClick={handlePayment}
                  disabled={processingPayment}
                  className={`w-full py-4 px-6 rounded-xl font-semibold flex items-center justify-center ${processingPayment
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                    } text-white transition-all duration-300 shadow-lg hover:shadow-xl`}
                >
                  {processingPayment ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5 mr-3" />
                      Pay {formatCurrency(registrationFee)}
                    </>
                  )}
                </button>

                <p className="text-xs text-center mt-4 text-gray-500">
                  By completing payment, you agree to our Terms & Conditions
                </p>
              </div>
            </div>


          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPaymentPage;