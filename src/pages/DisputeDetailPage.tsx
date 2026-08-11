import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useDisputes } from '../context/DisputeContext';
import { DisputeStatus, Verdict } from '../types';
import { ConnectWalletButton } from '../components/ConnectButton';
import {
  Gavel,
  CheckCircle2,
  Users,
  ShieldCheck,
  ArrowLeft,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Wallet,
  ShieldAlert,
} from 'lucide-react';

export const DisputeDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const disputeId = Number(id || '1');
  const { address } = useAccount();

  const {
    getDisputeById,
    approvedJurors,
    submitJurorsForDispute,
    voteOnDispute,
    resolveDisputeAdmin,
    isAdmin,
  } = useDisputes();

  const dispute = getDisputeById(disputeId);

  const [showProposeModal, setShowProposeModal] = useState<boolean>(false);
  const [selectedJurorsForProposal, setSelectedJurorsForProposal] = useState<string[]>([]);
  const [submittingProposal, setSubmittingProposal] = useState<boolean>(false);

  const [showVoteModal, setShowVoteModal] = useState<boolean>(false);
  const [castingVote, setCastingVote] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  if (!dispute) {
    return (
      <div className="min-h-screen bg-[#fbf9f8] px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-[#1b1c1c] mb-2">Dispute #{disputeId} Not Found</h2>
        <p className="text-sm text-[#50434c] mb-6">
          The requested dispute does not exist on-chain or has not been synced yet.
        </p>
        <Link
          to="/my-disputes"
          className="px-4 py-2 rounded-lg bg-[#8E4585] text-white text-sm font-semibold"
        >
          Return to Disputes
        </Link>
      </div>
    );
  }

  // Tally live votes
  const votes = dispute.jurorVotes || {};
  const partyAVotesCount = Object.values(votes).filter((v) => v === Verdict.PartyAWins).length;
  const partyBVotesCount = Object.values(votes).filter((v) => v === Verdict.PartyBWins).length;
  const totalVotesCast = partyAVotesCount + partyBVotesCount;
  const majorityThreshold = Math.floor(dispute.targetJurorCount / 2) + 1;

  // Check if connected address is a confirmed juror
  const userAddress = address?.toLowerCase() || '';
  const isConfirmedJuror = dispute.confirmedJurors.some(
    (j) => j.toLowerCase() === userAddress
  );
  const hasVoted = Object.keys(votes).some((j) => j.toLowerCase() === userAddress);

  // Status Badge Formatting
  const getStatusBadge = () => {
    switch (dispute.status) {
      case DisputeStatus.Matching:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            Matching Phase
          </span>
        );
      case DisputeStatus.Voting:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#ffd7f4] text-[#722d6c] border border-[#8E4585]/30">
            Voting Phase
          </span>
        );
      case DisputeStatus.Resolved:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            Resolved
          </span>
        );
      case DisputeStatus.AdminFallback:
        return (
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            Admin Fallback
          </span>
        );
    }
  };

  const handleToggleJurorSelection = (jurorAddr: string) => {
    if (selectedJurorsForProposal.includes(jurorAddr)) {
      setSelectedJurorsForProposal(selectedJurorsForProposal.filter((j) => j !== jurorAddr));
    } else {
      setSelectedJurorsForProposal([...selectedJurorsForProposal, jurorAddr]);
    }
  };

  const handleSaveProposedJurors = async () => {
    setActionError(null);
    if (!address) {
      setActionError('Wallet not connected. Please connect wallet first.');
      return;
    }
    setSubmittingProposal(true);
    try {
      await submitJurorsForDispute(dispute.id, selectedJurorsForProposal);
      setShowProposeModal(false);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to submit proposed jurors.');
    } finally {
      setSubmittingProposal(false);
    }
  };

  const handleCastVoteAction = async (verdict: Verdict) => {
    setActionError(null);
    if (!address) {
      setActionError('Wallet not connected. Please connect wallet first.');
      return;
    }
    setCastingVote(true);
    try {
      await voteOnDispute(dispute.id, verdict);
      setShowVoteModal(false);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to cast vote.');
    } finally {
      setCastingVote(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbf9f8] py-10 px-6 max-w-[1200px] mx-auto space-y-8">
      {/* Top Back Nav */}
      <div>
        <Link
          to="/my-disputes"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8E4585] hover:text-[#722d6c] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Disputes List
        </Link>
      </div>

      {actionError && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{actionError}</span>
          </div>
          <button onClick={() => setActionError(null)} className="font-bold text-xs text-rose-900">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Dispute Header Banner */}
      <div className="bg-white border border-[#d4c1cd]/40 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#efeded] pb-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl md:text-3xl font-bold text-[#1b1c1c]">
                Dispute #{dispute.id}
              </h1>
              {getStatusBadge()}
            </div>
            <p className="text-sm text-[#50434c] font-medium max-w-2xl">{dispute.description}</p>
          </div>

          <div className="bg-[#f5f3f3] p-4 rounded-xl border border-[#d4c1cd]/30 text-right shrink-0">
            <span className="text-xs text-[#50434c] uppercase font-semibold tracking-wider block">
              Escrowed Amount
            </span>
            <span className="text-2xl font-extrabold text-[#8E4585]">
              {dispute.amountFormatted} {dispute.tokenSymbol}
            </span>
          </div>
        </div>

        {/* Parties Address Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 rounded-xl bg-[#fbf9f8] border border-[#d4c1cd]/40">
            <span className="text-xs font-bold text-[#8E4585] uppercase tracking-wider block mb-1">
              Party A (Claimant)
            </span>
            <div className="flex items-center justify-between font-mono text-xs text-[#1b1c1c]">
              <span>{dispute.partyA}</span>
              <a
                href={`https://testnet.arcscan.app/address/${dispute.partyA}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#8E4585] hover:underline flex items-center gap-1"
              >
                Explorer <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#fbf9f8] border border-[#d4c1cd]/40">
            <span className="text-xs font-bold text-[#996666] uppercase tracking-wider block mb-1">
              Party B (Respondent)
            </span>
            <div className="flex items-center justify-between font-mono text-xs text-[#1b1c1c]">
              <span>{dispute.partyB}</span>
              <a
                href={`https://testnet.arcscan.app/address/${dispute.partyB}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#8E4585] hover:underline flex items-center gap-1"
              >
                Explorer <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Resolution Banner if Resolved */}
      {dispute.status === DisputeStatus.Resolved && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-emerald-900 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Dispute Resolved On-Chain</h3>
              <p className="text-xs text-emerald-800">
                Winning Party:{' '}
                <span className="font-bold">
                  {dispute.verdict === Verdict.PartyAWins ? 'Party A (Claimant)' : 'Party B (Respondent)'}
                </span>{' '}
                — Escrowed {dispute.amountFormatted} {dispute.tokenSymbol} disbursed automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Live Voting Section */}
      <div className="bg-white border border-[#d4c1cd]/40 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-[#efeded] pb-4">
          <div className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-[#8E4585]" />
            <h2 className="text-xl font-bold text-[#1b1c1c]">Live Voting Tally</h2>
          </div>
          <span className="text-xs font-medium text-[#50434c]">
            Target Panel: <strong className="text-[#1b1c1c]">{dispute.targetJurorCount} Jurors</strong>{' '}
            (Majority needed: {majorityThreshold})
          </span>
        </div>

        {/* Voting Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
            <span className="text-[#8E4585]">Party A: {partyAVotesCount} Votes</span>
            <span className="text-[#996666]">Party B: {partyBVotesCount} Votes</span>
          </div>

          <div className="w-full h-4 bg-[#f5f3f3] rounded-full overflow-hidden flex border border-[#d4c1cd]/30">
            <div
              className="h-full bg-[#8E4585] transition-all duration-500"
              style={{ width: `${(partyAVotesCount / dispute.targetJurorCount) * 100}%` }}
              title={`Party A Votes: ${partyAVotesCount}`}
            />
            <div
              className="h-full bg-[#996666] transition-all duration-500"
              style={{ width: `${(partyBVotesCount / dispute.targetJurorCount) * 100}%` }}
              title={`Party B Votes: ${partyBVotesCount}`}
            />
          </div>

          <div className="flex justify-between text-xs text-[#50434c]">
            <span>{totalVotesCast} of {dispute.targetJurorCount} votes cast</span>
          </div>
        </div>

        {/* Cast Vote Action Button */}
        {dispute.status === DisputeStatus.Voting && (
          <div className="pt-2 flex flex-wrap gap-4 items-center justify-between bg-[#ffd7f4]/20 p-4 rounded-xl border border-[#8E4585]/20">
            <div className="flex items-center gap-2 text-sm text-[#722d6c] font-medium">
              <Sparkles className="w-4 h-4 text-[#8E4585]" />
              {!address
                ? 'Connect wallet to cast a vote.'
                : isConfirmedJuror
                ? hasVoted
                  ? 'You have already submitted your vote on this dispute.'
                  : 'You are a confirmed juror on this dispute panel!'
                : 'Your connected wallet is not a confirmed juror on this panel.'}
            </div>

            {!address ? (
              <ConnectWalletButton />
            ) : (
              <button
                onClick={() => setShowVoteModal(true)}
                disabled={!isConfirmedJuror || hasVoted}
                className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#8E4585] hover:bg-[#722d6c] transition-all shadow-sm disabled:opacity-50"
              >
                {hasVoted ? 'Vote Submitted' : 'Cast Your Vote'}
              </button>
            )}
          </div>
        )}

        {/* Confirmed Jurors List */}
        <div>
          <h3 className="text-sm font-bold text-[#1b1c1c] mb-3 uppercase tracking-wider">
            Confirmed Panel Jurors ({dispute.confirmedJurors.length} / {dispute.targetJurorCount})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {dispute.confirmedJurors.map((juror, idx) => {
              const jurorVote = votes[juror];

              return (
                <div
                  key={juror}
                  className="p-3.5 rounded-xl border border-[#d4c1cd]/40 bg-[#fbf9f8] flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#f5f3f3] text-[#8E4585] flex items-center justify-center font-bold text-xs">
                      #{idx + 1}
                    </div>
                    <div>
                      <span className="font-mono text-xs font-bold text-[#1b1c1c] block">
                        {juror.substring(0, 6)}...{juror.substring(juror.length - 4)}
                      </span>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Matched Panelist
                      </span>
                    </div>
                  </div>

                  <div>
                    {jurorVote === Verdict.PartyAWins && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#ffd7f4] text-[#722d6c]">
                        Voted Party A
                      </span>
                    )}
                    {jurorVote === Verdict.PartyBWins && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#f5f3f3] text-[#996666]">
                        Voted Party B
                      </span>
                    )}
                    {!jurorVote && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#efeded] text-[#50434c]">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {dispute.confirmedJurors.length === 0 && (
              <div className="col-span-full p-6 text-center text-xs text-[#50434c] bg-[#f5f3f3] rounded-xl">
                No overlapping jurors matched yet. Both parties need to propose their juror lists below.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Juror Matching Phase Section */}
      <div className="bg-white border border-[#d4c1cd]/40 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex justify-between items-center border-b border-[#efeded] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#1b1c1c]">Juror Matching Overlap</h2>
            <p className="text-xs text-[#50434c]">
              Overlapping jurors submitted by both parties are automatically confirmed for the panel.
            </p>
          </div>

          {!address ? (
            <ConnectWalletButton />
          ) : (
            <button
              onClick={() => {
                setSelectedJurorsForProposal(approvedJurors.slice(0, 4));
                setShowProposeModal(true);
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-[#8E4585] border border-[#8E4585] hover:bg-[#ffd7f4]/30 transition-all"
            >
              Propose Juror List
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Party A Proposed List */}
          <div className="p-4 rounded-xl border border-[#d4c1cd]/40 bg-[#fbf9f8] space-y-3">
            <h3 className="text-xs font-bold text-[#8E4585] uppercase tracking-wider">
              Party A's Proposed Jurors ({dispute.partyAProposedJurors.length})
            </h3>
            <div className="space-y-2">
              {dispute.partyAProposedJurors.map((j) => (
                <div key={j} className="text-xs font-mono bg-white p-2.5 rounded-lg border border-[#efeded]">
                  {j}
                </div>
              ))}
              {dispute.partyAProposedJurors.length === 0 && (
                <p className="text-xs text-[#50434c] italic">No list proposed yet by Party A.</p>
              )}
            </div>
          </div>

          {/* Party B Proposed List */}
          <div className="p-4 rounded-xl border border-[#d4c1cd]/40 bg-[#fbf9f8] space-y-3">
            <h3 className="text-xs font-bold text-[#996666] uppercase tracking-wider">
              Party B's Proposed Jurors ({dispute.partyBProposedJurors.length})
            </h3>
            <div className="space-y-2">
              {dispute.partyBProposedJurors.map((j) => (
                <div key={j} className="text-xs font-mono bg-white p-2.5 rounded-lg border border-[#efeded]">
                  {j}
                </div>
              ))}
              {dispute.partyBProposedJurors.length === 0 && (
                <p className="text-xs text-[#50434c] italic">No list proposed yet by Party B.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Fallback Controls */}
      {isAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 space-y-3 text-amber-900">
          <h3 className="text-sm font-bold flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-700" /> Admin Dispute Fallback Controls
          </h3>
          <p className="text-xs text-amber-800">
            If parties fail to agree on jurors or if deadline expires, platform admins can resolve the dispute on-chain.
          </p>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => resolveDisputeAdmin(dispute.id, Verdict.PartyAWins)}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-[#8E4585] text-white hover:bg-[#722d6c]"
            >
              Resolve: Party A Wins
            </button>
            <button
              onClick={() => resolveDisputeAdmin(dispute.id, Verdict.PartyBWins)}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-[#996666] text-white hover:bg-[#815152]"
            >
              Resolve: Party B Wins
            </button>
          </div>
        </div>
      )}

      {/* Propose Jurors Modal */}
      {showProposeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-[#d4c1cd]/40 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-[#efeded] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1b1c1c]">Propose Jurors List</h3>
                <p className="text-xs text-[#50434c]">
                  Select jurors from the approved pool to submit for Dispute #{dispute.id}
                </p>
              </div>
              <button
                onClick={() => setShowProposeModal(false)}
                className="text-xl font-bold text-[#50434c] hover:text-[#1b1c1c]"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {approvedJurors.map((juror) => {
                const isSelected = selectedJurorsForProposal.includes(juror);
                return (
                  <div
                    key={juror}
                    onClick={() => handleToggleJurorSelection(juror)}
                    className={`p-3 rounded-xl border text-xs font-mono cursor-pointer flex justify-between items-center transition-all ${
                      isSelected
                        ? 'border-[#8E4585] bg-[#ffd7f4]/20 font-bold'
                        : 'border-[#d4c1cd]/40 hover:bg-[#f5f3f3]'
                    }`}
                  >
                    <span>{juror}</span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-[#8E4585]" />}
                  </div>
                );
              })}

              {approvedJurors.length === 0 && (
                <div className="text-center py-4 text-xs text-[#50434c]">
                  No approved jurors available in pool yet.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-[#efeded]">
              <button
                onClick={() => setShowProposeModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-medium border border-[#d4c1cd]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProposedJurors}
                disabled={submittingProposal}
                className="px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#8E4585] hover:bg-[#722d6c]"
              >
                {submittingProposal ? 'Submitting...' : 'Submit Juror List'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cast Vote Modal */}
      {showVoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#d4c1cd]/40 shadow-xl space-y-6">
            <div className="flex justify-between items-center border-b border-[#efeded] pb-4">
              <div>
                <h3 className="text-lg font-bold text-[#1b1c1c]">Cast Juror Vote</h3>
                <p className="text-xs text-[#50434c]">Dispute #{dispute.id} Decision</p>
              </div>
              <button
                onClick={() => setShowVoteModal(false)}
                className="text-xl font-bold text-[#50434c] hover:text-[#1b1c1c]"
              >
                &times;
              </button>
            </div>

            <p className="text-xs text-[#50434c] leading-relaxed">
              As a confirmed juror, review the claims carefully. Your vote is final and submitted on-chain to Arc Testnet.
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleCastVoteAction(Verdict.PartyAWins)}
                disabled={castingVote}
                className="w-full p-4 rounded-xl border border-[#8E4585] bg-[#ffd7f4]/20 hover:bg-[#ffd7f4]/40 text-left font-bold text-sm text-[#722d6c] transition-all flex justify-between items-center"
              >
                <span>Vote: Party A (Claimant)</span>
                <ChevronRight className="w-4 h-4 text-[#8E4585]" />
              </button>

              <button
                onClick={() => handleCastVoteAction(Verdict.PartyBWins)}
                disabled={castingVote}
                className="w-full p-4 rounded-xl border border-[#996666] bg-[#f5f3f3] hover:bg-[#efeded] text-left font-bold text-sm text-[#996666] transition-all flex justify-between items-center"
              >
                <span>Vote: Party B (Respondent)</span>
                <ChevronRight className="w-4 h-4 text-[#996666]" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
