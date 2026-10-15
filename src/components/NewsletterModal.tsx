import React, { useState } from 'react';
import { X, Sparkles, Check, Mail } from 'lucide-react';

interface NewsletterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewsletterModal: React.FC<NewsletterModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('weekly');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setEmail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-lg bg-stone-50 dark:bg-[#121316] border border-stone-300 dark:border-neutral-800 rounded-xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md text-stone-400 hover:text-stone-700 dark:hover:text-stone-200"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-6">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950/50 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-600 dark:text-emerald-400">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="font-editorial text-2xl font-bold text-stone-900 dark:text-stone-100 mb-2">
              Dispatch Transmission Confirmed
            </h3>
            <p className="text-sm text-stone-600 dark:text-neutral-400 font-editorial mb-6 max-w-xs mx-auto">
              You are now enrolled to receive our long-form essays, level breakdowns, and soundtrack analysis directly to <span className="font-mono text-xs font-semibold">{email}</span>.
            </p>
            <button
              onClick={handleReset}
              className="px-6 py-2 text-xs font-semibold bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 rounded-md hover:bg-stone-800 transition-colors"
            >
              Return to Journal
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Polychron Dispatch</span>
            </div>

            <h3 className="font-editorial text-2xl sm:text-3xl font-medium text-stone-900 dark:text-stone-100 mb-3">
              Thoughtful Gaming Criticism, Delivered Weekly
            </h3>

            <p className="text-sm text-stone-600 dark:text-neutral-400 font-editorial leading-relaxed mb-6">
              No sponsored fluff, embargo hype cycles, or affiliate links. Just rigorous essays exploring level geometry, acoustic architecture, and game theory every Sunday morning.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="newsletter-email" className="block text-xs font-medium text-stone-700 dark:text-neutral-300 mb-1.5">
                  Your Primary Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="critic@journal.org"
                    className="w-full pl-10 pr-3 py-2 text-sm bg-white dark:bg-[#18191d] border border-stone-300 dark:border-neutral-700 rounded-md focus:outline-none focus:border-amber-500 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 dark:text-neutral-300 mb-2">
                  Delivery Cadence
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFrequency('weekly')}
                    className={`py-2 px-3 text-xs font-medium rounded-md border text-center transition-colors ${
                      frequency === 'weekly'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-semibold'
                        : 'border-stone-200 dark:border-neutral-800 text-stone-600 dark:text-neutral-400 hover:border-stone-400'
                    }`}
                  >
                    Sunday Dispatch (Weekly)
                  </button>
                  <button
                    type="button"
                    onClick={() => setFrequency('monthly')}
                    className={`py-2 px-3 text-xs font-medium rounded-md border text-center transition-colors ${
                      frequency === 'monthly'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 font-semibold'
                        : 'border-stone-200 dark:border-neutral-800 text-stone-600 dark:text-neutral-400 hover:border-stone-400'
                    }`}
                  >
                    Curated Retrospective (Monthly)
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-xs font-semibold text-white bg-stone-900 dark:bg-stone-100 dark:text-stone-950 rounded-md hover:bg-stone-800 transition-colors shadow-sm"
                >
                  Join 28,400+ Fellow Readers
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
