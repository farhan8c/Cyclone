import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useDisputes } from '../context/DisputeContext';
import { DisputeStatus, Verdict } from '../types';
import { ConnectWalletButton } from '../components/ConnectButton';
import {
  Clock,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  Wallet,
} from 'lucide-react';

export const JurorDashboardPage: React.FC = () => {
  const { address } = useAccount();
  const { disputes, approvedJurors, voteOnDispute } = useDisputes();

  const currentAddress = address?.toLowerCase() || '';
  const isApprovedJuror = approvedJurors.some((j) => j.toLowerCase() === currentAddress);

  // Filter pending votes (where address is in confirmedJurors and has NOT voted yet)
  const pendingVotes = disputes.filter((d) => {
    if (!currentAddress) return false;
    const isPanel = d.confirmedJurors.some((j) => j.toLowerCase() === currentAddress);
    const hasVoted = Object.keys(d.jurorVotes || {}).some(
      (j) => j.toLowerCase() === currentAddress
    );
    return isPanel && !hasVoted && d.status === DisputeStatus.Voting;
  });

  // Filter past voting history
  const historyVotes = disputes.filter((d) => {
    if (!currentAddress) return false;
    return Object.keys(d.jurorVotes || {}).some((j) => j.toLowerCase() === currentAddress);
  });

  const [votingDisputeId, setVotingDisputeId] = useState<number | null>(null);

  const handleQuickVote = async (disputeId: number, verdict: Verdict) => {
    await voteOnDispute(disputeId, verdict);
    setVotingDisputeId(null);
  };

  if (!address) {
    return (
      <div className="min-h-screen bg-[#fbf9f8] py-16 px-6 max-w-[1200px] mx-auto">
        <div className="bg-white border border-[#d4c1cd]/40 rounded-2xl p-10 text-center shadow-sm space-y-6 max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#8E4585] mx-auto">
            <Wallet className="w-8 h-8 text-[#8E4585]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#1b1c1c]">Wallet Connection Required</h2>
            <p className="text-sm text-[#50434c] max-w-md mx-auto">
              Connect your wallet to access your Juror Dashboard, view assigned arbitration panels, and cast votes on active disputes.
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <ConnectWalletButton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf9f8] py-10 px-6 max-w-[1200px] mx-auto space-y-10">
      {/* Dashboard Top Header */}
      <div className="bg-white border border-[#d4c1cd]/40 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`w-2.5 h-2.5 rounded-full ${isApprovedJuror ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-xs font-semibold text-[#8E4585] uppercase tracking-wider">
              {isApprovedJuror ? 'Juror Credential Active' : 'Juror Credential Pending Approval'}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[#1b1c1c]">Juror Dashboard</h1>
          <p className="text-sm text-[#50434c]">
            Connected Address: <span className="font-mono font-semibold">{currentAddress}</span>
          </p>
        </div>

        {/* Stats Metrics Grid */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="p-4 rounded-xl bg-[#f5f3f3] border border-[#d4c1cd]/30 text-center min-w-[140px]">
            <span className="text-2xl font-bold text-[#8E4585] block">{pendingVotes.length}</span>
            <span className="text-xs font-semibold text-[#50434c] uppercase">Awaiting Vote</span>
          </div>
          <div className="p-4 rounded-xl bg-[#f5f3f3] border border-[#d4c1cd]/30 text-center min-w-[140px]">
            <span className="text-2xl font-bold text-[#1b1c1c] block">{historyVotes.length}</span>
            <span className="text-xs font-semibold text-[#50434c] uppercase">Voted Disputes</span>
          </div>
        </div>
      </div>

      {/* Become a Juror Application Banner if not yet approved */}
      {!isApprovedJuror && (
        <div className="bg-[#ffd7f4]/30 border border-[#8E4585]/30 rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-base font-bold text-[#722d6c] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#8E4585]" /> Juror Accreditation Program
            </h3>
            <p className="text-xs text-[#50434c]">
              Apply to join the admin-approved juror pool on Arc Testnet. Approval grants eligibility to serve on arbitration panels.
            </p>
          </div>
          <Link
            to="/admin"
            className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#8E4585] hover:bg-[#722d6c] whitespace-nowrap"
          >
            Request Juror Status
          </Link>
        </div>
      )}

      {/* Currently Awaiting Your Vote Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-[#1b1c1c] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8E4585]" /> Currently Awaiting Your Vote
          </h2>
          <span className="text-xs text-[#50434c] font-medium">
            {pendingVotes.length} disputes pending
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingVotes.map((dispute) => (
            <div
              key={dispute.id}
              className="bg-white border border-[#d4c1cd]/50 rounded-2xl p-6 shadow-sm flex flex-col justify-between gap-4 hover:border-[#8E4585]/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-xs font-mono text-[#8E4585] font-bold">
                      Dispute #{dispute.id}
                    </span>
                    <h3 className="text-base font-bold text-[#1b1c1c] mt-0.5 line-clamp-1">
                      {dispute.description}
                    </h3>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 bg-amber-100 text-amber-800 rounded-full border border-amber-300 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" /> Active Phase
                  </span>
                </div>

                <p className="text-xs text-[#50434c] line-clamp-2 leading-relaxed">
                  {dispute.description}
                </p>

                <div className="p-3 rounded-xl bg-[#fbf9f8] border border-[#efeded] text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-[#50434c]">Escrow Pool</span>
                    <span className="font-bold text-[#8E4585]">
                      {dispute.amountFormatted} {dispute.tokenSymbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#50434c]">Target Panel</span>
                    <span className="font-semibold text-[#1b1c1c]">
                      {dispute.targetJurorCount} Jurors
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex gap-2">
                <Link
                  to={`/dispute/${dispute.id}`}
                  className="flex-1 py-2.5 rounded-lg text-xs font-semibold text-[#1b1c1c] border border-[#d4c1cd] text-center hover:bg-[#f5f3f3]"
                >
                  View Details
                </Link>
                <button
                  onClick={() => setVotingDisputeId(dispute.id)}
                  className="flex-1 py-2.5 rounded-lg text-xs font-bold text-white bg-[#8E4585] hover:bg-[#722d6c] text-center shadow-sm"
                >
                  Cast Vote
                </button>
              </div>
            </div>
          ))}

          {pendingVotes.length === 0 && (
            <div className="col-span-full bg-white border border-[#d4c1cd]/30 rounded-2xl p-10 text-center text-sm text-[#50434c]">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              You have no pending votes requiring your action right now.
            </div>
          )}
        </div>
      </div>

      {/* Voting History Section */}
      <div className="space-y-4 pt-6 border-t border-[#d4c1cd]/30">
        <h2 className="text-xl font-bold text-[#1b1c1c]">Voting History</h2>

        <div className="bg-white border border-[#d4c1cd]/40 rounded-2xl overflow-hidden shadow-sm">
          <div className="divide-y divide-[#efeded]">
            {historyVotes.map((dispute) => {
              const myVote = dispute.jurorVotes[currentAddress as `0x${string}`];
              const isResolved = dispute.status === DisputeStatus.Resolved;
              const matchedOutcome =
                isResolved &&
                ((myVote === Verdict.PartyAWins && dispute.verdict === Verdict.PartyAWins) ||
                  (myVote === Verdict.PartyBWins && dispute.verdict === Verdict.PartyBWins));

              return (
                <div key={dispute.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#fbf9f8] transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-[#8E4585]">
                        Dispute #{dispute.id}
                      </span>
                      <span className="text-xs font-semibold text-[#1b1c1c]">
                        {dispute.amountFormatted} {dispute.tokenSymbol}
                      </span>
                    </div>
                    <p className="text-xs text-[#50434c] line-clamp-1">{dispute.description}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-medium">
                    <div>
                      <span className="text-[#50434c] block text-[10px]">Your Vote</span>
                      <span className="font-bold text-[#722d6c]">
                        {myVote === Verdict.PartyAWins ? 'Party A' : 'Party B'}
                      </span>
                    </div>

                    <div>
                      <span className="text-[#50434c] block text-[10px]">Outcome</span>
                      <span className="font-bold text-[#1b1c1c]">
                        {isResolved
                          ? dispute.verdict === Verdict.PartyAWins
                            ? 'Party A'
                            : 'Party B'
                          : 'In Progress'}
                      </span>
                    </div>

                    {matchedOutcome && (
                      <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full border border-emerald-300">
                        Majority Aligned
                      </span>
                    )}

                    <Link
                      to={`/dispute/${dispute.id}`}
                      className="p-2 text-[#8E4585] hover:bg-[#ffd7f4]/30 rounded-lg transition-colors"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}

            {historyVotes.length === 0 && (
              <div className="p-8 text-center text-xs text-[#50434c]">
                No voting history recorded yet for this address.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Vote Modal */}
      {votingDisputeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#d4c1cd]/40 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-[#efeded] pb-4">
              <h3 className="text-lg font-bold text-[#1b1c1c]">Cast Vote for #{votingDisputeId}</h3>
              <button
                onClick={() => setVotingDisputeId(null)}
                className="text-xl font-bold text-[#50434c]"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleQuickVote(votingDisputeId, Verdict.PartyAWins)}
                className="w-full p-4 rounded-xl border border-[#8E4585] bg-[#ffd7f4]/20 hover:bg-[#ffd7f4]/40 text-left font-bold text-sm text-[#722d6c]"
              >
                Rule in favor of Party A (Claimant)
              </button>
              <button
                onClick={() => handleQuickVote(votingDisputeId, Verdict.PartyBWins)}
                className="w-full p-4 rounded-xl border border-[#996666] bg-[#f5f3f3] hover:bg-[#efeded] text-left font-bold text-sm text-[#996666]"
              >
                Rule in favor of Party B (Respondent)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
