import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Course, Order } from '@/types';
import { useLanguage } from '@/i18n/LanguageContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { StorageService } from '@/services/storageService';
import {
  X,
  CreditCard,
  ShieldCheck,
  Tag,
  CheckCircle2,
  Lock,
  ArrowRight,
  Zap,
} from 'lucide-react';

interface CheckoutModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (course: Course) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  course,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { t, l } = useLanguage();
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();

  const [couponCode, setCouponCode] = useState('PRO50');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<'Razorpay' | 'Stripe' | 'UPI'>('Razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.trim().toUpperCase() === 'PRO50') {
      const discount = Math.round(course.price * 0.5);
      setDiscountAmount(discount);
      setCouponApplied(true);
      setErrorMessage('');
    } else {
      setErrorMessage('Invalid coupon code. Try PRO50 for 50% discount.');
    }
  };

  const finalAmount = Math.max(0, course.price - discountAmount);

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    setErrorMessage('');

    try {
      // 1. Create order on the server
      const orderRes = await fetch('/api/checkout/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          couponCode: couponApplied ? couponCode : undefined,
        }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      if (orderData.status === 'PAID') {
        // Free course or 100% discount
        triggerSuccess();
        return;
      }

      // 2. Load Razorpay SDK and open checkout
      const loadScript = () => new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });

      const isLoaded = await loadScript();
      if (!isLoaded) {
        throw new Error('Razorpay SDK failed to load');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, // Use real public key
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Learning Hub',
        description: `Enrollment: ${course.title.en}`,
        order_id: orderData.gatewayOrderId,
        handler: async function (response: any) {
          try {
            // 3. Verify payment securely on the server
            const verifyRes = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: orderData.orderId,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                status: 'SUCCESS'
              }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok) {
              setErrorMessage(verifyData.error || 'Payment verification failed');
              setIsProcessing(false);
              return;
            }

            triggerSuccess();
          } catch (err: any) {
            setErrorMessage(err.message || 'Verification failed');
            setIsProcessing(false);
          }
        },
        prefill: {
          name: user?.name || 'Student',
          email: user?.email || '',
        },
        theme: {
          color: '#0ea5e9'
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        setErrorMessage(response.error.description);
        setIsProcessing(false);
      });
      rzp.open();

    } catch (error: any) {
      setErrorMessage(error.message || 'Transaction failed');
      setIsProcessing(false);
    }
  };

  const triggerSuccess = () => {
    setIsProcessing(false);
    
    // Refresh to get new enrollment data from server
    router.refresh();
    
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {
      // Safe fallback
    }
    
    onSuccess(course);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl border border-white/15 bg-[#0e1424] shadow-2xl overflow-hidden text-slate-100 dark:bg-[#0e1424] dark:border-white/15 light:bg-white light:border-slate-300 light:text-slate-900">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 dark:border-white/10 light:border-slate-200">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400" />
            <h3 className="text-base font-bold text-white dark:text-white light:text-slate-900">
              {t('checkout.title')}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Course Summary Card */}
          <div className="flex items-center gap-4 p-3.5 rounded-xl bg-slate-900/80 border border-white/10 dark:bg-slate-900/80 light:bg-slate-50 light:border-slate-200">
            <img
              src={course.thumbnail}
              alt={course.title.en}
              className="w-16 h-16 rounded-lg object-cover border border-white/10"
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                {course.category}
              </span>
              <h4 className="text-xs font-bold text-white dark:text-white light:text-slate-900 truncate">
                {l(course.title)}
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Lifetime Access • Certificate Included
              </p>
            </div>
          </div>

          {/* Coupon Code Input */}
          <form onSubmit={handleApplyCoupon} className="space-y-1.5">
            <label className="text-xs text-slate-400">{t('checkout.coupon')}</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code (e.g. PRO50)"
                  className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-900 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-400 uppercase font-mono font-bold dark:bg-slate-900 light:bg-slate-50 light:border-slate-300 light:text-slate-900"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white transition-colors"
              >
                {t('checkout.apply')}
              </button>
            </div>
            {couponApplied && (
              <p className="text-[11px] text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Coupon PRO50 applied! 50% discount active.</span>
              </p>
            )}
            {errorMessage && <p className="text-[11px] text-rose-400">{errorMessage}</p>}
          </form>

          {/* Payment Gateway Selector */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400">Select Payment Provider</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {(['Razorpay', 'Stripe', 'UPI'] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`p-3 rounded-xl border text-center font-semibold transition-all ${
                    paymentMethod === method
                      ? 'border-sky-400 bg-sky-500/10 text-sky-400'
                      : 'border-white/10 bg-slate-900/60 text-slate-400 hover:text-white dark:bg-slate-900/60 light:bg-slate-50 light:border-slate-200 light:text-slate-700'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Order Totals Calculation */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 space-y-2 text-xs dark:bg-slate-950/60 light:bg-slate-100 light:border-slate-200">
            <div className="flex justify-between text-slate-400">
              <span>Standard Price:</span>
              <span className="font-mono">₹{course.price.toLocaleString()}</span>
            </div>
            {couponApplied && (
              <div className="flex justify-between text-emerald-400">
                <span>Coupon Discount (50%):</span>
                <span className="font-mono">- ₹{discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-sm text-white dark:text-white light:text-slate-900">
              <span>{t('checkout.total')}:</span>
              <span className="text-lg font-mono text-emerald-400">
                ₹{finalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="p-5 border-t border-white/10 bg-slate-900/50 flex flex-col gap-3 dark:bg-slate-900/50 light:bg-slate-50">
          <button
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="w-full py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-sky-400 via-teal-300 to-emerald-400 hover:opacity-95 shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
          >
            {isProcessing ? (
              <span>Securing Transaction...</span>
            ) : (
              <>
                <Zap className="w-4 h-4 fill-slate-950" />
                <span>{t('checkout.payNow')}</span>
              </>
            )}
          </button>

          <p className="text-[11px] text-center text-slate-500 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('checkout.secure')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};
