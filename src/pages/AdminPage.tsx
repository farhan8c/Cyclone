import React, { useState } from 'react';
import { useDisputes } from '../context/DisputeContext';
import { isAddress } from 'viem';
import { ShieldCheck, UserPlus, UserX, CheckCircle2, AlertTriangle, Gavel } from 'lucide-react';
import { Verdict } from '../types';

export const AdminPage: React.FC = () => {
  const {
    approvedJurors,
    approveJurorAddress,
    revokeJurorAddress,
    disputes,
    resolveDisputeAdmin,
  } = useDisputes();

  const [newJurorInput, setNewJurorInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleApproveJuror = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAddress(newJurorInput)) {
      setMessage('Error: Please enter a valid Ethereum address.');
      return;
    }
    setSubmitting(true);
    await approveJurorAddress(newJurorInput);
    setMessage(`Successfully approved ${newJurorInput} as a Juror on Arc Testnet.`);
    setNewJurorInput('');
    setSubmitting(false);
  };

  const handleRevoke = async (addressStr: string) => {
    await revokeJurorAddress(addressStr);
    setMessage(`Revoked juror credential for ${addressStr}`);
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] py-10 px-6 max-w-[1200px] mx-auto space-y-10">
      <div className="bg-white border border-[#d4c1cd]/40 rounded-2xl p-6 md:p-8 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-[#8E4585]" />
          <h1 className="text-3xl font-bold text-[#1b1c1c]">Platform Admin Console</h1>
        </div>
        <p className="text-sm text-[#50434c]">
          Manage approved juror credentials and execute administrative fallback resolutions on Arc Testnet.
        </p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-purple-50 border border-purple-200 text-purple-900 text-sm flex items-center justify-between">
          <span>{message}</span>
          <button onClick={() => setMessage(null)} className="font-bold text-xs">
            Dismiss
          </button>
        </div>
      )}

      {/* Add New Juror Form */}
      <div className="bg-white border border-[#d4c1cd]/40 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-[#1b1c1c] flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-[#8E4585]" /> Approve New Juror
        </h2>
        <form onSubmit={handleApproveJuror} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={newJurorInput}
            onChange={(e) => setNewJurorInput(e.target.value)}
            placeholder="0x..."
            className="flex-1 bg-[#fbf9f8] border border-[#d4c1cd]/60 rounded-xl px-4 py-2.5 text-xs font-mono text-[#1b1c1c] outline-none focus:border-[#8E4585]"
          />
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-white bg-[#8E4585] hover:bg-[#722d6c] transition-all shadow-sm disabled:opacity-50"
          >
            {submitting ? 'Approving...' : 'Approve Juror'}
          </button>
        </form>
      </div>

      {/* Approved Juror Pool Directory */}
      <div className="bg-white border border-[#d4c1cd]/40 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
        <div className="flex justify-between items-center border-b border-[#efeded] pb-4">
          <h2 className="text-xl font-bold text-[#1b1c1c]">Approved Juror Pool</h2>
          <span className="text-xs font-semibold px-3 py-1 bg-[#f5f3f3] text-[#8E4585] rounded-full">
            {approvedJurors.length} Approved Members
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {approvedJurors.map((juror) => (
            <div
              key={juror}
              className="p-3.5 rounded-xl border border-[#d4c1cd]/30 bg-[#fbf9f8] flex items-center justify-between font-mono text-xs"
            >
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[#1b1c1c]">{juror}</span>
              </div>
              <button
                onClick={() => handleRevoke(juror)}
                className="p-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Revoke Juror Credential"
              >
                <UserX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Admin Fallback Dispute Resolution */}
      <div className="bg-white border border-[#d4c1cd]/40 rounded-2xl p-6 md:p-8 shadow-sm space-y-4">
        <h2 className="text-xl font-bold text-[#1b1c1c] flex items-center gap-2">
          <Gavel className="w-5 h-5 text-[#8E4585]" /> Override / Admin Fallback Resolutions
        </h2>

        <div className="divide-y divide-[#efeded]">
          {disputes.map((d) => (
            <div key={d.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs font-bold text-[#8E4585]">Dispute #{d.id}</span>
                <p className="text-xs text-[#50434c] font-medium line-clamp-1">{d.description}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => resolveDisputeAdmin(d.id, Verdict.PartyAWins)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#8E4585] text-white hover:bg-[#722d6c]"
                >
                  Party A Wins
                </button>
                <button
                  onClick={() => resolveDisputeAdmin(d.id, Verdict.PartyBWins)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#996666] text-white hover:bg-[#815152]"
                >
                  Party B Wins
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
