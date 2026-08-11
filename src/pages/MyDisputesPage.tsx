import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { useDisputes } from '../context/DisputeContext';
import { DisputeStatus } from '../types';
import { ConnectWalletButton } from '../components/ConnectButton';
import {
  Gavel,
  FilePlus,
  Clock,
  CheckCircle2,
  ChevronRight,
  Search,
  Wallet,
} from 'lucide-react';

export const MyDisputesPage: React.FC = () => {
  const { address } = useAccount();
  const { disputes, loading } = useDisputes();
  const [activeTab, setActiveTab] = useState<'my' | 'all' | 'claimant' | 'respondent' | 'voting'>('my');
  const [searchQuery, setSearchQuery] = useState('');

  const currentAddress = (address || '').toLowerCase();

  const filteredDisputes = disputes.filter((d) => {
    const matchesSearch =
      d.id.toString().includes(searchQuery) ||
      d.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.partyA.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.partyB.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === 'my') {
      return d.partyA.toLowerCase() === currentAddress || d.partyB.toLowerCase() === currentAddress;
    }
    if (activeTab === 'claimant') return d.partyA.toLowerCase() === currentAddress;
    if (activeTab === 'respondent') return d.partyB.toLowerCase() === currentAddress;
    if (activeTab === 'voting') return d.status === DisputeStatus.Voting;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fbf9f8] py-10 px-6 max-w-[1200px] mx-auto space-y-8">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#1b1c1c]">Disputes Directory</h1>
          <p className="text-sm text-[#50434c]">
            Explore and monitor active and resolved disputes on Arc Testnet.
          </p>
        </div>

        <Link
          to="/file-dispute"
          className="px-5 py-2.5 rounded-lg text-sm font-semibold text-white bg-[#8E4585] hover:bg-[#722d6c] transition-all shadow-sm flex items-center gap-2 self-start md:self-auto"
        >
          <FilePlus className="w-4 h-4" /> Start a Dispute
        </Link>
      </div>

      {!address ? (
        <div className="bg-white border border-[#d4c1cd]/40 rounded-2xl p-10 text-center shadow-sm space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#8E4585] mx-auto">
            <Wallet className="w-8 h-8 text-[#8E4585]" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-[#1b1c1c]">Wallet Connection Required</h2>
            <p className="text-sm text-[#50434c] max-w-md mx-auto">
              Connect your wallet to view your active disputes, manage claims, and track arbitration progress.
            </p>
          </div>
          <div className="pt-2 flex justify-center">
            <ConnectWalletButton />
          </div>
        </div>
      ) : (
        <>
          {/* Tabs & Search Filter Bar */}
          <div className="bg-white border border-[#d4c1cd]/40 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              {[
                { key: 'my', label: 'My Disputes' },
                { key: 'all', label: 'Public Directory' },
                { key: 'claimant', label: 'As Claimant' },
                { key: 'respondent', label: 'As Respondent' },
                { key: 'voting', label: 'Voting Phase' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    activeTab === tab.key
                      ? 'bg-[#8E4585] text-white shadow-sm'
                      : 'bg-[#f5f3f3] text-[#50434c] hover:bg-[#efeded]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#82737d] absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dispute # or keywords..."
                className="w-full bg-[#fbf9f8] border border-[#d4c1cd]/60 rounded-xl pl-9 pr-4 py-2 text-xs text-[#1b1c1c] outline-none focus:border-[#8E4585]"
              />
            </div>
          </div>

          {/* Disputes Cards List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDisputes.map((dispute) => (
              <div
                key={dispute.id}
                className="bg-white border border-[#d4c1cd]/40 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#8E4585]/50 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold text-[#8E4585]">
                      Dispute #{dispute.id}
                    </span>

                    {dispute.status === DisputeStatus.Matching && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                        Matching Phase
                      </span>
                    )}
                    {dispute.status === DisputeStatus.Voting && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ffd7f4] text-[#722d6c]">
                        Voting Phase
                      </span>
                    )}
                    {dispute.status === DisputeStatus.Resolved && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        Resolved
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-[#1b1c1c] line-clamp-2 leading-snug">
                    {dispute.description}
                  </h3>

                  <div className="p-3 rounded-xl bg-[#fbf9f8] border border-[#efeded] text-xs space-y-1.5 font-mono">
                    <div className="flex justify-between">
                      <span className="text-[#50434c] font-sans">Escrow:</span>
                      <span className="font-bold text-[#8E4585]">
                        {dispute.amountFormatted} {dispute.tokenSymbol}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#50434c] font-sans">Panel Size:</span>
                      <span className="font-semibold text-[#1b1c1c]">
                        {dispute.targetJurorCount} Jurors
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-[#efeded]">
                  <span className="text-[10px] text-[#50434c]">
                    {dispute.confirmedJurors.length} / {dispute.targetJurorCount} Jurors Matched
                  </span>
                  <Link
                    to={`/dispute/${dispute.id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#8E4585] hover:text-[#722d6c]"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}

            {filteredDisputes.length === 0 && (
              <div className="col-span-full bg-white border border-[#d4c1cd]/30 rounded-2xl p-12 text-center text-sm text-[#50434c] space-y-3">
                <p className="font-medium text-[#1b1c1c]">No disputes found on-chain</p>
                <p className="text-xs text-[#50434c]">
                  There are currently no disputes matching the selected filter.
                </p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
