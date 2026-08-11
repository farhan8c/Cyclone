import React from 'react';
import { Code, MessageSquare } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#303030] text-white w-full px-6 py-12 flex flex-col items-center gap-6 mt-auto border-t border-[#82737d]/20">
      <div className="flex flex-col items-center gap-4">
        {/* Prominent Built by Farhan with subtle plum-purple glow/shine hover effect */}
        <span className="text-2xl md:text-3xl font-semibold tracking-tight text-[#fbf9f8] cursor-default farhan-glow">
          Built by Farhan
        </span>

        <div className="flex gap-4">
          <a
            href="https://testnet.arcscan.app"
            target="_blank"
            rel="noreferrer"
            className="text-[#e4e2e2] hover:text-[#ffabf0] transition-all opacity-80 hover:opacity-100 flex items-center justify-center w-9 h-9 rounded-full border border-white/20 hover:border-[#ffabf0]"
            title="ArcScan Contract Explorer"
          >
            <Code className="w-4 h-4" />
          </a>
          <a
            href="#faq"
            className="text-[#e4e2e2] hover:text-[#ffabf0] transition-all opacity-80 hover:opacity-100 flex items-center justify-center w-9 h-9 rounded-full border border-white/20 hover:border-[#ffabf0]"
            title="Community Forum & Support"
          >
            <MessageSquare className="w-4 h-4" />
          </a>
        </div>
      </div>

      <div className="flex gap-6 text-sm text-[#e4e2e2]/80">
        <a href="#terms" className="hover:text-[#ffabf0] transition-all">
          Terms
        </a>
        <span>·</span>
        <a href="#privacy" className="hover:text-[#ffabf0] transition-all">
          Privacy
        </a>
      </div>

      <div className="flex flex-col items-center gap-2 mt-2">
        {/* Network Badge Pill */}
        <span className="inline-flex items-center px-3 py-1 rounded-full border border-white/20 bg-black/30 text-[#e4e2e2] text-xs font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-400 mr-2 animate-pulse" />
          Arc Testnet
        </span>

        {/* Small muted disclaimer */}
        <p className="text-xs text-[#e4e2e2]/60 max-w-md text-center">
          Cycloone is an independent project built on Arc Testnet.
        </p>
      </div>
    </footer>
  );
};
