import React, { useState } from 'react';
import { useAccount, useConnect, useDisconnect, useChainId, useSwitchChain } from 'wagmi';
import { Wallet, LogOut, CheckCircle2, ChevronDown } from 'lucide-react';
import { arcTestnet } from '../config/chain';

export const ConnectWalletButton: React.FC = () => {
  const { address, isConnected } = useAccount();
  const { connectors, connect } = useConnect();
  const { disconnect } = useDisconnect();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();
  const [showModal, setShowModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const isWrongNetwork = isConnected && chainId !== arcTestnet.id;

  const truncateAddress = (addr: string) =>
    `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;

  if (isConnected && address) {
    return (
      <div className="relative">
        {isWrongNetwork ? (
          <button
            onClick={() => switchChain?.({ chainId: arcTestnet.id })}
            className="px-3.5 py-1.5 rounded-lg text-sm font-medium bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200 transition-colors flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            Switch to Arc Testnet
          </button>
        ) : (
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium bg-[#f5f3f3] text-[#1b1c1c] border border-[#d4c1cd]/40 hover:border-[#8E4585] transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono">{truncateAddress(address)}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[#50434c]" />
          </button>
        )}

        {showDropdown && (
          <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-[#d4c1cd]/40 shadow-lg z-50 py-2">
            <div className="px-4 py-2 border-b border-[#efeded]">
              <p className="text-xs text-[#50434c]">Connected Wallet</p>
              <p className="text-sm font-mono text-[#1b1c1c] truncate">{address}</p>
            </div>
            <div className="px-4 py-2 border-b border-[#efeded] flex items-center justify-between text-xs text-[#50434c]">
              <span>Network</span>
              <span className="font-semibold text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> Arc Testnet
              </span>
            </div>
            <button
              onClick={() => {
                disconnect();
                setShowDropdown(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 rounded-lg text-sm font-medium text-[#1b1c1c] border border-[#4A4A4A] hover:bg-[#f5f3f3] transition-all flex items-center gap-2"
      >
        <Wallet className="w-4 h-4 text-[#8E4585]" />
        Connect Wallet
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#d4c1cd]/40 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6 border-b border-[#efeded] pb-4">
              <div>
                <h3 className="text-lg font-semibold text-[#1b1c1c]">Connect Wallet</h3>
                <p className="text-xs text-[#50434c]">Select a wallet to interact with Arc Testnet</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#50434c] hover:text-[#1b1c1c] text-xl font-medium"
              >
                &times;
              </button>
            </div>

            <div className="space-y-3">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => {
                    connect({ connector, chainId: arcTestnet.id });
                    setShowModal(false);
                  }}
                  className="w-full p-4 rounded-xl border border-[#d4c1cd]/40 hover:border-[#8E4585] hover:bg-[#fbf9f8] flex items-center justify-between transition-all text-left"
                >
                  <span className="font-medium text-[#1b1c1c]">{connector.name}</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-[#f5f3f3] text-[#50434c]">
                    Arc Testnet
                  </span>
                </button>
              ))}
            </div>

            <p className="text-xs text-center text-[#50434c] mt-6">
              By connecting a wallet, you agree to Cycloone's Terms of Arbitration on Arc Testnet.
            </p>
          </div>
        </div>
      )}
    </>
  );
};
