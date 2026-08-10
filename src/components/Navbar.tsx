import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { ConnectWalletButton } from './ConnectButton';
import { Menu, X, Gavel, Users, FilePlus, ShieldCheck } from 'lucide-react';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-[#fbf9f8] w-full border-b border-[#d4c1cd]/20 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-[1200px] mx-auto px-6 py-3.5 flex justify-between items-center">
        {/* Brand Logo */}
        <Link to="/">
          <Logo size={32} />
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/my-disputes"
            className={`text-sm font-medium transition-colors ${
              isActive('/my-disputes')
                ? 'text-[#722d6c] font-bold border-b-2 border-[#722d6c] pb-0.5'
                : 'text-[#50434c] hover:text-[#722d6c]'
            }`}
          >
            Disputes
          </Link>
          <Link
            to="/jurors"
            className={`text-sm font-medium transition-colors ${
              isActive('/jurors')
                ? 'text-[#722d6c] font-bold border-b-2 border-[#722d6c] pb-0.5'
                : 'text-[#50434c] hover:text-[#722d6c]'
            }`}
          >
            Jurors
          </Link>
          <a
            href="/#about"
            className="text-sm font-medium text-[#50434c] hover:text-[#722d6c] transition-colors"
          >
            Resources
          </a>
          <Link
            to="/admin"
            className={`text-sm font-medium transition-colors ${
              isActive('/admin')
                ? 'text-[#722d6c] font-bold border-b-2 border-[#722d6c] pb-0.5'
                : 'text-[#50434c] hover:text-[#722d6c]'
            }`}
          >
            Admin
          </Link>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/jurors"
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#4A4A4A] border border-[#4A4A4A] hover:bg-[#f5f3f3] transition-all"
          >
            Become a Juror
          </Link>
          <Link
            to="/file-dispute"
            className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-[#8E4585] hover:bg-[#722d6c] shadow-sm transition-all hover:-translate-y-0.5"
          >
            Start a Dispute
          </Link>
          <ConnectWalletButton />
        </div>

        {/* Mobile Hamburger Toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <ConnectWalletButton />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-[#4A4A4A] hover:text-[#722d6c]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#d4c1cd]/20 bg-[#fbf9f8] px-6 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <Link
            to="/my-disputes"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-medium text-[#1b1c1c] hover:text-[#722d6c]"
          >
            <Gavel className="w-4 h-4 text-[#8E4585]" /> Disputes
          </Link>
          <Link
            to="/jurors"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-medium text-[#1b1c1c] hover:text-[#722d6c]"
          >
            <Users className="w-4 h-4 text-[#8E4585]" /> Jurors
          </Link>
          <Link
            to="/file-dispute"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-medium text-[#8E4585] font-semibold"
          >
            <FilePlus className="w-4 h-4 text-[#8E4585]" /> File a Dispute
          </Link>
          <Link
            to="/admin"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-sm font-medium text-[#1b1c1c] hover:text-[#722d6c]"
          >
            <ShieldCheck className="w-4 h-4 text-[#8E4585]" /> Admin Pool
          </Link>
        </div>
      )}
    </nav>
  );
};
