import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { isAddress } from 'viem';
import { useDisputes } from '../context/DisputeContext';
import { TOKENS } from '../config/chain';
import { Check, Info, ShieldAlert, ArrowRight, ArrowLeft, Users, User } from 'lucide-react';

export const FileDisputePage: React.FC = () => {
  const navigate = useNavigate();
  const { address } = useAccount();
  const { createNewDispute, checkAllowance, approveToken, loading } = useDisputes();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [counterparty, setCounterparty] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tokenSymbol, setTokenSymbol] = useState<'USDC' | 'EURC'>('USDC');
  const [amount, setAmount] = useState<string>('5000');
  const [targetJurorCount, setTargetJurorCount] = useState<number>(5);

  const [hasAllowance, setHasAllowance] = useState<boolean>(true);
  const [approving, setApproving] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Validate allowance when step changes to 2 or 4, or amount/token changes
  useEffect(() => {
    let active = true;
    const verifyAllowance = async () => {
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) return;
      const ok = await checkAllowance(tokenSymbol, amount);
      if (active) setHasAllowance(ok);
    };
    verifyAllowance();
    return () => {
      active = false;
    };
  }, [tokenSymbol, amount, address]);

  const handleApprove = async () => {
    setApproving(true);
    setErrorMessage(null);
    try {
      await approveToken(tokenSymbol, amount);
      setHasAllowance(true);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Token approval failed.');
    } finally {
      setApproving(false);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setErrorMessage(null);

    if (!isAddress(counterparty)) {
      setErrorMessage('Please enter a valid Ethereum counterparty wallet address (0x...).');
      setSubmitting(false);
      return;
    }

    if (!description || description.trim().length < 10) {
      setErrorMessage('Please provide a detailed dispute description (at least 10 characters).');
      setSubmitting(false);
      return;
    }

    if (targetJurorCount % 2 === 0) {
      setErrorMessage('Target juror count must be an odd number (1, 3, 5, or 7).');
      setSubmitting(false);
      return;
    }

    try {
      const newDisputeId = await createNewDispute(
        counterparty,
        tokenSymbol,
        amount,
        description,
        targetJurorCount
      );
      navigate(`/dispute/${newDisputeId}`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to file dispute.');
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: 'Details' },
    { id: 2, title: 'Escrow' },
    { id: 3, title: 'Jurors' },
    { id: 4, title: 'Review' },
  ];

  return (
    <div className="min-h-screen bg-[#fbf9f8] py-12 md:py-20 px-6 max-w-[1200px] mx-auto">
      {/* Header */}
      <div className="text-center mb-10 md:mb-14">
        <h1 className="text-3xl md:text-4xl font-bold text-[#1b1c1c] mb-2">File a Dispute</h1>
        <p className="text-base text-[#50434c] max-w-xl mx-auto">
          Initiate a formal arbitration process. Ensure all details are accurate before submission.
        </p>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Step Navigation Progress Bar */}
        <div className="mb-12 relative">
          <div className="flex justify-between items-center relative z-10">
            {steps.map((step) => {
              const isCompleted = step.id < currentStep;
              const isCurrent = step.id === currentStep;

              return (
                <div key={step.id} className="flex flex-col items-center gap-2">
                  <div
                    onClick={() => {
                      if (step.id < currentStep) setCurrentStep(step.id);
                    }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center font-medium text-sm transition-all duration-300 ${
                      isCompleted
                        ? 'bg-[#8E4585] text-white cursor-pointer'
                        : isCurrent
                        ? 'bg-[#8E4585] text-white ring-4 ring-[#8E4585]/20 font-bold shadow-md'
                        : 'bg-white border-2 border-[#d4c1cd] text-[#82737d]'
                    }`}
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : step.id}
                  </div>
                  <span
                    className={`text-xs font-semibold ${
                      isCurrent ? 'text-[#722d6c]' : 'text-[#50434c]'
                    }`}
                  >
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Background & Active Fill Lines */}
          <div className="absolute top-4 left-4 right-4 h-0.5 bg-[#d4c1cd]/30 -z-0" />
          <div
            className="absolute top-4 left-4 h-0.5 bg-[#8E4585] transition-all duration-500 -z-0"
            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
          />
        </div>

        {/* Main Card Container */}
        <div className="bg-white border border-[#d4c1cd]/30 rounded-2xl p-6 md:p-10 shadow-sm relative overflow-hidden min-h-[420px]">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* Step 1: Details */}
            {currentStep === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-[#1b1c1c]">Dispute Details</h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-[#1b1c1c] mb-2">
                      Counterparty Wallet Address
                    </label>
                    <input
                      type="text"
                      value={counterparty}
                      onChange={(e) => setCounterparty(e.target.value)}
                      placeholder="0x3A20000000000000000000000000000000009b1C"
                      className="w-full bg-[#fbf9f8] border border-[#d4c1cd]/60 rounded-xl px-4 py-3 text-sm text-[#1b1c1c] font-mono focus:border-[#8E4585] focus:ring-1 focus:ring-[#8E4585] outline-none transition-all"
                    />
                    <p className="text-xs text-[#50434c] mt-1">
                      The Ethereum/Arc wallet address of the party you are filing a dispute against.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1b1c1c] mb-2">
                      Dispute Description & Claims
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={5}
                      placeholder="Provide a detailed account of the issue, contract milestones, non-delivery claims or scope disputes..."
                      className="w-full bg-[#fbf9f8] border border-[#d4c1cd]/60 rounded-xl px-4 py-3 text-sm text-[#1b1c1c] focus:border-[#8E4585] focus:ring-1 focus:ring-[#8E4585] outline-none transition-all resize-none"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => {
                      if (!counterparty) {
                        setErrorMessage('Please enter a counterparty wallet address.');
                        return;
                      }
                      if (!description) {
                        setErrorMessage('Please enter a dispute description.');
                        return;
                      }
                      setErrorMessage(null);
                      setCurrentStep(2);
                    }}
                    className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#8E4585] hover:bg-[#722d6c] transition-all flex items-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 2: Escrow */}
            {currentStep === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-[#1b1c1c]">Escrow Amount</h2>

                <div className="bg-[#f5f3f3] p-4 rounded-xl border border-[#d4c1cd]/40 text-sm text-[#50434c] flex items-start gap-3">
                  <Info className="w-5 h-5 text-[#8E4585] shrink-0 mt-0.5" />
                  <div>
                    This amount will be locked in the Cyclone escrow smart contract on Arc Testnet until a majority verdict is reached by jurors.
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[#1b1c1c] mb-3">
                      Select Escrow Token
                    </label>
                    <div className="flex gap-4">
                      {(['USDC', 'EURC'] as const).map((sym) => (
                        <button
                          key={sym}
                          type="button"
                          onClick={() => setTokenSymbol(sym)}
                          className={`flex-1 py-3 px-6 rounded-xl border text-sm font-semibold transition-all ${
                            tokenSymbol === sym
                              ? 'border-[#8E4585] bg-[#ffd7f4]/30 text-[#722d6c] shadow-sm'
                              : 'border-[#d4c1cd]/60 bg-[#fbf9f8] text-[#1b1c1c] hover:bg-[#f5f3f3]'
                          }`}
                        >
                          {sym} ({TOKENS[sym].name})
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1b1c1c] mb-2">
                      Amount to Escrow
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="5000"
                        className="w-full bg-[#fbf9f8] border border-[#d4c1cd]/60 rounded-xl px-4 py-3 text-sm text-[#1b1c1c] font-mono focus:border-[#8E4585] outline-none transition-all pr-16"
                      />
                      <span className="absolute right-4 top-3.5 text-xs font-bold text-[#8E4585]">
                        {tokenSymbol}
                      </span>
                    </div>
                  </div>

                  {!hasAllowance && (
                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm space-y-2">
                      <p className="font-semibold flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-amber-600" /> ERC20 Approval Required
                      </p>
                      <p className="text-xs text-amber-800">
                        Before filing, you must approve the Cyclone contract to escrow {amount} {tokenSymbol} from your wallet.
                      </p>
                      <button
                        onClick={handleApprove}
                        disabled={approving}
                        className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition-all shadow-sm disabled:opacity-50"
                      >
                        {approving ? 'Approving on-chain...' : `Approve ${tokenSymbol} Spending`}
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-3 rounded-lg text-sm font-medium text-[#1b1c1c] border border-[#d4c1cd]/60 hover:bg-[#f5f3f3] transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={() => {
                      if (!amount || Number(amount) <= 0) {
                        setErrorMessage('Please enter a valid escrow amount.');
                        return;
                      }
                      setErrorMessage(null);
                      setCurrentStep(3);
                    }}
                    className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#8E4585] hover:bg-[#722d6c] transition-all flex items-center gap-2"
                  >
                    Continue <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Jurors */}
            {currentStep === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-[#1b1c1c]">Juror Panel Selection</h2>
                <p className="text-sm text-[#50434c]">
                  Select the target number of jurors for this dispute panel. Must be an odd number (1, 3, 5, or 7) to ensure a simple majority resolution without ties.
                </p>

                <div className="space-y-3">
                  {[
                    { count: 1, label: '1 Juror', desc: 'Fast track resolution for smaller disputes', icon: User },
                    { count: 3, label: '3 Jurors', desc: 'Standard panel with enhanced consensus', icon: Users },
                    { count: 5, label: '5 Jurors (Recommended)', desc: 'High-stake panel for maximum decentralization', icon: Users },
                    { count: 7, label: '7 Jurors', desc: 'Extended panel for complex multi-party claims', icon: Users },
                  ].map((item) => {
                    const IconComp = item.icon;
                    const isSelected = targetJurorCount === item.count;

                    return (
                      <div
                        key={item.count}
                        onClick={() => setTargetJurorCount(item.count)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all flex justify-between items-center ${
                          isSelected
                            ? 'border-[#8E4585] bg-[#ffd7f4]/20 shadow-sm'
                            : 'border-[#d4c1cd]/60 bg-[#fbf9f8] hover:border-[#8E4585]/50'
                        }`}
                      >
                        <div>
                          <div className="font-semibold text-sm text-[#1b1c1c]">{item.label}</div>
                          <div className="text-xs text-[#50434c]">{item.desc}</div>
                        </div>
                        <IconComp
                          className={`w-5 h-5 ${isSelected ? 'text-[#8E4585]' : 'text-[#82737d]'}`}
                        />
                      </div>
                    );
                  })}
                </div>

                <div className="mt-8 flex justify-between">
                  <button
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-3 rounded-lg text-sm font-medium text-[#1b1c1c] border border-[#d4c1cd]/60 hover:bg-[#f5f3f3] transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={() => setCurrentStep(4)}
                    className="px-6 py-3 rounded-lg text-sm font-semibold text-white bg-[#8E4585] hover:bg-[#722d6c] transition-all flex items-center gap-2"
                  >
                    Review <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 4: Review */}
            {currentStep === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-[#1b1c1c]">Review & Submit</h2>

                <div className="bg-[#fbf9f8] border border-[#d4c1cd]/60 rounded-xl p-6 space-y-4 text-sm">
                  <div className="flex justify-between items-center border-b border-[#efeded] pb-3">
                    <span className="text-[#50434c]">Counterparty Address</span>
                    <span className="font-mono font-semibold text-[#1b1c1c]">{counterparty}</span>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#efeded] pb-3">
                    <span className="text-[#50434c]">Escrow Token & Amount</span>
                    <span className="font-bold text-[#8E4585]">
                      {Number(amount).toLocaleString()} {tokenSymbol}
                    </span>
                  </div>

                  <div className="flex justify-between items-center border-b border-[#efeded] pb-3">
                    <span className="text-[#50434c]">Target Juror Panel Size</span>
                    <span className="font-semibold text-[#1b1c1c]">{targetJurorCount} Jurors</span>
                  </div>

                  <div>
                    <span className="text-[#50434c] block mb-1">Description</span>
                    <p className="text-xs text-[#1b1c1c] bg-white p-3 rounded-lg border border-[#efeded] leading-relaxed">
                      {description}
                    </p>
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-center">
                  <button
                    onClick={() => setCurrentStep(3)}
                    className="px-6 py-3 rounded-lg text-sm font-medium text-[#1b1c1c] border border-[#d4c1cd]/60 hover:bg-[#f5f3f3] transition-all flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="px-8 py-3.5 rounded-lg text-sm font-bold text-white bg-[#8E4585] hover:bg-[#722d6c] transition-all shadow-md pulse-primary disabled:opacity-50"
                  >
                    {submitting ? 'Filing on Arc Testnet...' : 'File Dispute'}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
