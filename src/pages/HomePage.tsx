import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useDisputes } from '../context/DisputeContext';
import { ScalesIllustration } from '../components/ScalesIllustration';
import {
  FileText,
  Users,
  Vote,
  Wallet,
  ChevronDown,
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  UserCheck,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { stats, disputes } = useDisputes();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqItems = [
    {
      q: 'How are jurors selected?',
      a: 'Jurors must apply and be approved by platform administrators based on their expertise and neutrality. Disputing parties each submit a list of proposed jurors from this approved pool; only overlapping names become confirmed jurors.',
    },
    {
      q: "What happens if the parties can't agree on jurors?",
      a: 'If mutual agreement produces fewer confirmed jurors than required or produces zero confirmed jurors, the admin fallback function can resolve the dispute or a randomized neutral panel from the approved pool can be assigned.',
    },
    {
      q: 'How many jurors does a dispute need?',
      a: 'The party filing the dispute specifies the target juror count (typically an odd number such as 1, 3, 5, or 7) to guarantee a simple majority decision.',
    },
    {
      q: 'Do jurors get paid to vote?',
      a: 'Jurors serve without extra financial incentives or rewards tied to the vote outcome. Approval to serve as a juror is itself the credential, keeping juror decisions neutral and objective.',
    },
    {
      q: 'Where are disputed funds held?',
      a: 'Funds are locked securely in the Cycloone smart contract escrow on Arc Testnet for the entire duration of arbitration until a majority decision automatically releases them to the winning party.',
    },
  ];

  return (
    <div className="w-full bg-[#fbf9f8] text-[#1b1c1c]">
      {/* Hero Section */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="md:col-span-6 space-y-6"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#1b1c1c] leading-[1.1]">
            Disputes Resolved Fairly
          </h1>
          <p className="text-lg text-[#50434c] leading-relaxed max-w-xl">
            Parties mutually select jurors from an approved pool. A majority vote decides the outcome fairly on-chain.
          </p>
          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              to="/file-dispute"
              className="px-6 py-3.5 rounded-lg text-sm font-semibold text-white bg-[#8E4585] hover:bg-[#722d6c] transition-all hover:-translate-y-0.5 shadow-sm pulse-primary"
            >
              Start a Dispute
            </Link>
            <Link
              to="/jurors"
              className="px-6 py-3.5 rounded-lg text-sm font-semibold text-[#4A4A4A] border border-[#4A4A4A] hover:bg-[#efeded] transition-all"
            >
              Become a Juror
            </Link>
          </div>
        </motion.div>

        {/* 3D Scales Illustration */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="md:col-span-6"
        >
          <ScalesIllustration />
        </motion.div>
      </section>

      {/* Stats Bar */}
      <section className="w-full bg-[#DCA1A1]/10 py-12 border-y border-[#4A4A4A]/10">
        <div className="max-w-[1200px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-4xl md:text-5xl font-bold text-[#8E4585] mb-1">
              {stats.totalDisputes.toLocaleString()}+
            </div>
            <div className="text-xs font-semibold text-[#50434c] uppercase tracking-wider">
              Disputes Resolved
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="text-4xl md:text-5xl font-bold text-[#8E4585] mb-1">
              {stats.approvedJurorsCount}
            </div>
            <div className="text-xs font-semibold text-[#50434c] uppercase tracking-wider">
              Approved Jurors
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="text-4xl md:text-5xl font-bold text-[#8E4585] mb-1">
              {stats.totalValueArbitratedFormatted}
            </div>
            <div className="text-xs font-semibold text-[#50434c] uppercase tracking-wider">
              Total Value Arbitrated
            </div>
          </motion.div>
        </div>
      </section>

      {/* How Cycloone Works */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 md:py-28">
        <div className="text-center mb-16 space-y-3">
          <h2 className="text-3xl font-semibold text-[#1b1c1c]">How Cycloone Works</h2>
          <p className="text-base text-[#50434c] max-w-2xl mx-auto">
            A transparent, systematic approach to on-chain arbitration.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 border border-[#4A4A4A]/15 rounded-xl bg-white text-center flex flex-col items-center shadow-sm relative"
          >
            <div className="w-12 h-12 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#8E4585] mb-4">
              <FileText className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-[#1b1c1c]">File a Dispute</h3>
            <p className="text-sm text-[#50434c] leading-relaxed">
              Lock funds in escrow and submit evidence to initiate the arbitration process.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 border border-[#4A4A4A]/15 rounded-xl bg-white text-center flex flex-col items-center shadow-sm relative"
          >
            <div className="w-12 h-12 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#8E4585] mb-4">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-[#1b1c1c]">Propose Jurors</h3>
            <p className="text-sm text-[#50434c] leading-relaxed">
              Both parties select mutually agreeable jurors from the approved pool.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 border border-[#4A4A4A]/15 rounded-xl bg-white text-center flex flex-col items-center shadow-sm relative"
          >
            <div className="w-12 h-12 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#8E4585] mb-4">
              <Vote className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-[#1b1c1c]">Matched Jurors Vote</h3>
            <p className="text-sm text-[#50434c] leading-relaxed">
              The selected panel reviews evidence and casts their deciding votes.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ y: -4 }}
            className="p-6 border border-[#4A4A4A]/15 rounded-xl bg-white text-center flex flex-col items-center shadow-sm"
          >
            <div className="w-12 h-12 rounded-full bg-[#f5f3f3] flex items-center justify-center text-[#8E4585] mb-4">
              <Wallet className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-[#1b1c1c]">Funds Released</h3>
            <p className="text-sm text-[#50434c] leading-relaxed">
              Smart contracts automatically disburse funds based on the majority ruling.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Fairness Explainer / Live Case Section */}
      <section className="max-w-[1200px] mx-auto px-6 py-16 md:py-24 border-t border-[#4A4A4A]/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5 space-y-6">
            <h2 className="text-3xl font-semibold text-[#1b1c1c]">Objective Arbitration</h2>
            <p className="text-base text-[#50434c] leading-relaxed">
              Cycloone relies on a neutral environment. Jurors are meticulously admin-approved and vote without secondary financial incentives to skew their judgment.
            </p>
            <p className="text-base text-[#50434c] leading-relaxed">
              The outcome is strictly determined by a simple majority, ensuring that consensus dictates resolution.
            </p>

            <div className="pt-2">
              <Link
                to={disputes.length > 0 ? `/dispute/${disputes[0].id}` : '/file-dispute'}
                className="inline-flex items-center gap-2 text-sm font-semibold text-[#8E4585] hover:text-[#722d6c]"
              >
                {disputes.length > 0 ? `Inspect On-Chain Case #${disputes[0].id}` : 'Start First Dispute'}{' '}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="md:col-span-7">
            {disputes.length > 0 ? (
              <div className="border border-[#4A4A4A]/15 rounded-2xl bg-white p-8 shadow-md relative overflow-hidden">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <span className="inline-block px-3 py-1 bg-[#f5f3f3] text-xs font-semibold text-[#4A4A4A] rounded-md font-mono">
                      On-Chain Case #{disputes[0].id}
                    </span>
                    <h3 className="text-xl font-semibold text-[#1b1c1c] mt-2 line-clamp-1">
                      {disputes[0].description}
                    </h3>
                  </div>
                  <span className="text-sm font-medium text-[#8E4585] bg-[#ffd7f4]/40 px-3 py-1 rounded-full border border-[#8E4585]/20">
                    Escrow: {disputes[0].amountFormatted} {disputes[0].tokenSymbol}
                  </span>
                </div>

                <div className="mb-6 space-y-2">
                  <div className="flex justify-between text-xs font-semibold text-[#50434c] uppercase tracking-wider">
                    <span>Panel: {disputes[0].targetJurorCount} Jurors</span>
                    <span>
                      Confirmed Jurors: {disputes[0].confirmedJurors.length} / {disputes[0].targetJurorCount}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {Array.from({ length: Math.min(disputes[0].targetJurorCount, 7) }).map((_, idx) => (
                      <div
                        key={idx}
                        className="w-10 h-10 rounded-full bg-[#f5f3f3] border border-[#4A4A4A]/20 flex items-center justify-center text-[#996666]"
                        title={`Juror Slot #${idx + 1}`}
                      >
                        <UserCheck className="w-5 h-5 text-[#8E4585]" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#efeded]">
                  <Link
                    to={`/dispute/${disputes[0].id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8E4585] hover:text-[#722d6c]"
                  >
                    View On-Chain Arbitration Details <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="border border-[#4A4A4A]/15 rounded-2xl bg-white p-8 shadow-md relative overflow-hidden text-center space-y-4">
                <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-md border border-emerald-200">
                  Arc Testnet Smart Contract Ready
                </span>
                <h3 className="text-xl font-semibold text-[#1b1c1c]">No Disputes Filed On-Chain Yet</h3>
                <p className="text-xs text-[#50434c] max-w-md mx-auto leading-relaxed">
                  Be the first to file a dispute on Arc Testnet to escrow tokens and initiate mutual juror selection.
                </p>
                <div className="pt-2">
                  <Link
                    to="/file-dispute"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white bg-[#8E4585] hover:bg-[#722d6c] shadow-sm"
                  >
                    File a Dispute <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* About / How It Works - Detailed Plain Explanation */}
      <section id="about" className="max-w-[1200px] mx-auto px-6 py-20 border-t border-[#4A4A4A]/10 bg-white rounded-2xl my-10 shadow-sm border">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold text-[#8E4585] uppercase tracking-wider">
              About Cycloone
            </span>
            <h2 className="text-3xl font-bold text-[#1b1c1c]">Clear & Transparent Arbitration</h2>
          </div>

          <div className="space-y-4 text-base text-[#50434c] leading-relaxed">
            <p>
              Either party in a agreement or contract can file a dispute and escrow the disputed amount in secure smart contract vaults on Arc Testnet.
            </p>
            <p>
              When a dispute is initiated, both parties submit their own list of proposed jurors selected from the admin-approved juror pool. Only overlapping names that appear on both parties' lists become confirmed jurors for the panel.
            </p>
            <p>
              Confirmed jurors review the submitted evidence and cast their votes on-chain. A simple majority decides the outcome, and the smart contract automatically disburses the full escrowed amount directly to the winning party upon resolution.
            </p>
            <p>
              Jurors serve without extra financial incentives or yield-staking rewards—approval to serve as a juror is itself the credential, guaranteeing uncorrupted, neutral decision-making.
            </p>
          </div>
        </div>
      </section>

      {/* Product Roadmap */}
      <section className="max-w-[1200px] mx-auto px-6 py-20 border-t border-[#4A4A4A]/10">
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs font-semibold text-[#8E4585] uppercase tracking-wider">
            Future Vision
          </span>
          <h2 className="text-3xl font-bold text-[#1b1c1c]">Product Roadmap</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div className="p-5 border border-[#8E4585] bg-[#ffd7f4]/20 rounded-xl space-y-2">
            <span className="text-xs font-bold text-[#722d6c] uppercase tracking-wider block">
              Phase 1 · Current
            </span>
            <h3 className="text-base font-bold text-[#1b1c1c]">Testnet Launch</h3>
            <p className="text-xs text-[#50434c] leading-relaxed">
              Core contract live on Arc Testnet, mutual juror selection and matching, majority-vote resolution, escrow and automatic payout, admin fallback for stuck cases.
            </p>
          </div>

          <div className="p-5 border border-[#4A4A4A]/20 bg-white rounded-xl space-y-2 opacity-90">
            <span className="text-xs font-semibold text-[#50434c] uppercase tracking-wider block">
              Phase 2
            </span>
            <h3 className="text-base font-semibold text-[#1b1c1c]">Juror Reputation</h3>
            <p className="text-xs text-[#50434c] leading-relaxed">
              Track juror voting history and majority-alignment rate on-chain to help disputing parties choose jurors more confidently.
            </p>
          </div>

          <div className="p-5 border border-[#4A4A4A]/20 bg-white rounded-xl space-y-2 opacity-90">
            <span className="text-xs font-semibold text-[#50434c] uppercase tracking-wider block">
              Phase 3
            </span>
            <h3 className="text-base font-semibold text-[#1b1c1c]">Dispute Templates</h3>
            <p className="text-xs text-[#50434c] leading-relaxed">
              Pre-built dispute templates for common scenarios (freelance service disagreements, marketplace escrow disputes) to speed up filing.
            </p>
          </div>

          <div className="p-5 border border-[#4A4A4A]/20 bg-white rounded-xl space-y-2 opacity-90">
            <span className="text-xs font-semibold text-[#50434c] uppercase tracking-wider block">
              Phase 4
            </span>
            <h3 className="text-base font-semibold text-[#1b1c1c]">Mainnet & Expansion</h3>
            <p className="text-xs text-[#50434c] leading-relaxed">
              Mainnet deployment, expanded juror approval process, and public applications for community juror status.
            </p>
          </div>

          <div className="p-5 border border-[#4A4A4A]/20 bg-white rounded-xl space-y-2 opacity-90">
            <span className="text-xs font-semibold text-[#50434c] uppercase tracking-wider block">
              Phase 5
            </span>
            <h3 className="text-base font-semibold text-[#1b1c1c]">Appeals Mechanism</h3>
            <p className="text-xs text-[#50434c] leading-relaxed">
              An optional secondary review process with an expanded juror panel for high-value disputes.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section id="faq" className="w-full bg-[#DCA1A1]/5 py-20 border-t border-[#4A4A4A]/10">
        <div className="max-w-[800px] mx-auto px-6 space-y-10">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-[#1b1c1c]">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqItems.map((item, idx) => (
              <div
                key={idx}
                className="border border-[#4A4A4A]/20 rounded-xl bg-white overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full text-left p-6 flex justify-between items-center font-semibold text-lg text-[#1b1c1c] hover:bg-[#f5f3f3]/50 transition-colors"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-[#8E4585] transition-transform duration-200 ${
                      openFaq === idx ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === idx && (
                  <div className="p-6 pt-0 text-sm text-[#50434c] leading-relaxed border-t border-[#4A4A4A]/10 bg-[#fbf9f8]">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
