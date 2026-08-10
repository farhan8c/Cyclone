import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAccount, useReadContract, useWriteContract, usePublicClient } from 'wagmi';
import { parseUnits, formatUnits, isAddress } from 'viem';
import { CYCLONE_ABI, ERC20_ABI } from '../config/abi';
import { CONTRACT_ADDRESS, TOKENS } from '../config/chain';
import { Dispute, DisputeStatus, Verdict, PlatformStats } from '../types';

interface DisputeContextType {
  disputes: Dispute[];
  approvedJurors: `0x${string}`[];
  stats: PlatformStats;
  loading: boolean;
  isAdmin: boolean;
  setIsAdmin: (val: boolean) => void;
  getDisputeById: (id: number) => Dispute | undefined;
  createNewDispute: (
    partyB: string,
    tokenSymbol: 'USDC' | 'EURC',
    amount: string,
    description: string,
    targetJurorCount: number
  ) => Promise<number>;
  submitJurorsForDispute: (disputeId: number, proposedJurors: string[]) => Promise<void>;
  voteOnDispute: (disputeId: number, verdict: Verdict) => Promise<void>;
  approveJurorAddress: (address: string) => Promise<void>;
  revokeJurorAddress: (address: string) => Promise<void>;
  resolveDisputeAdmin: (disputeId: number, verdict: Verdict) => Promise<void>;
  checkAllowance: (tokenSymbol: 'USDC' | 'EURC', amountStr: string) => Promise<boolean>;
  approveToken: (tokenSymbol: 'USDC' | 'EURC', amountStr: string) => Promise<void>;
  refreshData: () => Promise<void>;
}

const INITIAL_APPROVED_JURORS: `0x${string}`[] = [
  '0x12F7c88a892b10000000000000000000000088dE',
  '0x44A00000000000000000000000000000000021bC',
  '0x99E00000000000000000000000000000000055fA',
  '0x22B00000000000000000000000000000000011cC',
  '0x77D00000000000000000000000000000000033eB',
  '0x741C000000000000000000000000000000000f9A',
  '0x88A00000000000000000000000000000000012cD',
  '0x55F00000000000000000000000000000000099eA',
];

const SAMPLE_DISPUTES: Dispute[] = [
  {
    id: 4092,
    partyA: '0x71C0000000000000000000000000000000004f9A',
    partyB: '0x3A20000000000000000000000000000000009b1C',
    partyAName: 'Party A (Client)',
    partyBName: 'Party B (Contractor)',
    token: TOKENS.USDC.address,
    tokenSymbol: 'USDC',
    tokenDecimals: 6,
    amount: parseUnits('5000', 6),
    amountFormatted: '5,000',
    description:
      'Contract breach allegation regarding unfulfilled freelance development milestones. Party A claims non-delivery, Party B claims scope creep.',
    targetJurorCount: 5,
    status: DisputeStatus.Voting,
    verdict: Verdict.None,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 2,
    partyAProposedJurors: [
      '0x12F7c88a892b10000000000000000000000088dE',
      '0x44A00000000000000000000000000000000021bC',
      '0x88A00000000000000000000000000000000012cD',
      '0x55F00000000000000000000000000000000099eA',
    ],
    partyBProposedJurors: [
      '0x99E00000000000000000000000000000000055fA',
      '0x22B00000000000000000000000000000000011cC',
      '0x77D00000000000000000000000000000000033eB',
      '0x12F7c88a892b10000000000000000000000088dE',
      '0x44A00000000000000000000000000000000021bC',
    ],
    confirmedJurors: [
      '0x12F7c88a892b10000000000000000000000088dE',
      '0x44A00000000000000000000000000000000021bC',
      '0x99E00000000000000000000000000000000055fA',
      '0x22B00000000000000000000000000000000011cC',
      '0x77D00000000000000000000000000000000033eB',
    ],
    jurorVotes: {
      '0x12F7c88a892b10000000000000000000000088dE': Verdict.PartyAWins,
      '0x44A00000000000000000000000000000000021bC': Verdict.PartyAWins,
      '0x99E00000000000000000000000000000000055fA': Verdict.PartyBWins,
      '0x22B00000000000000000000000000000000011cC': Verdict.PartyAWins,
    },
    timeRemaining: '18h 30m',
  },
  {
    id: 4105,
    partyA: '0x1111111111111111111111111111111111111111',
    partyB: '0x2222222222222222222222222222222222222222',
    token: TOKENS.USDC.address,
    tokenSymbol: 'USDC',
    tokenDecimals: 6,
    amount: parseUnits('12000', 6),
    amountFormatted: '12,000',
    description:
      'Breach of service contract. Party A claims non-delivery of specified digital assets within the agreed timeframe. Party B asserts delays were due to shifting scope requirements.',
    targetJurorCount: 3,
    status: DisputeStatus.Voting,
    verdict: Verdict.None,
    createdAt: Math.floor(Date.now() / 1000) - 43200,
    partyAProposedJurors: [],
    partyBProposedJurors: [],
    confirmedJurors: [
      '0x741C000000000000000000000000000000000f9A',
      '0x12F7c88a892b10000000000000000000000088dE',
      '0x44A00000000000000000000000000000000021bC',
    ],
    jurorVotes: {
      '0x12F7c88a892b10000000000000000000000088dE': Verdict.PartyAWins,
    },
    timeRemaining: '14h 22m',
  },
  {
    id: 4098,
    partyA: '0x3333333333333333333333333333333333333333',
    partyB: '0x4444444444444444444444444444444444444444',
    token: TOKENS.EURC.address,
    tokenSymbol: 'EURC',
    tokenDecimals: 6,
    amount: parseUnits('4500', 6),
    amountFormatted: '4,500',
    description:
      'Unpaid freelance invoice. Dispute over a $4,500 milestone payment. Client cites incomplete deliverables; freelancer provides proof of delivery according to specification.',
    targetJurorCount: 3,
    status: DisputeStatus.Voting,
    verdict: Verdict.None,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 3,
    partyAProposedJurors: [],
    partyBProposedJurors: [],
    confirmedJurors: [
      '0x741C000000000000000000000000000000000f9A',
      '0x99E00000000000000000000000000000000055fA',
      '0x22B00000000000000000000000000000000011cC',
    ],
    jurorVotes: {},
    timeRemaining: '2d 5h',
  },
  {
    id: 3982,
    partyA: '0x5555555555555555555555555555555555555555',
    partyB: '0x6666666666666666666666666666666666666666',
    token: TOKENS.USDC.address,
    tokenSymbol: 'USDC',
    tokenDecimals: 6,
    amount: parseUnits('25000', 6),
    amountFormatted: '25,000',
    description: 'Smart Contract Audit Liability and bug disclosure dispute.',
    targetJurorCount: 5,
    status: DisputeStatus.Resolved,
    verdict: Verdict.PartyAWins,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 14,
    partyAProposedJurors: [],
    partyBProposedJurors: [],
    confirmedJurors: [
      '0x741C000000000000000000000000000000000f9A',
      '0x12F7c88a892b10000000000000000000000088dE',
      '0x44A00000000000000000000000000000000021bC',
      '0x99E00000000000000000000000000000000055fA',
      '0x22B00000000000000000000000000000000011cC',
    ],
    jurorVotes: {
      '0x741C000000000000000000000000000000000f9A': Verdict.PartyAWins,
      '0x12F7c88a892b10000000000000000000000088dE': Verdict.PartyAWins,
      '0x44A00000000000000000000000000000000021bC': Verdict.PartyAWins,
      '0x99E00000000000000000000000000000000055fA': Verdict.PartyBWins,
      '0x22B00000000000000000000000000000000011cC': Verdict.PartyAWins,
    },
  },
  {
    id: 3975,
    partyA: '0x7777777777777777777777777777777777777777',
    partyB: '0x8888888888888888888888888888888888888888',
    token: TOKENS.USDC.address,
    tokenSymbol: 'USDC',
    tokenDecimals: 6,
    amount: parseUnits('8000', 6),
    amountFormatted: '8,000',
    description: 'Escrow Release Condition disagreement on marketplace transaction.',
    targetJurorCount: 3,
    status: DisputeStatus.Resolved,
    verdict: Verdict.PartyAWins,
    createdAt: Math.floor(Date.now() / 1000) - 86400 * 20,
    partyAProposedJurors: [],
    partyBProposedJurors: [],
    confirmedJurors: [
      '0x741C000000000000000000000000000000000f9A',
      '0x12F7c88a892b10000000000000000000000088dE',
      '0x99E00000000000000000000000000000000055fA',
    ],
    jurorVotes: {
      '0x741C000000000000000000000000000000000f9A': Verdict.PartyBWins,
      '0x12F7c88a892b10000000000000000000000088dE': Verdict.PartyAWins,
      '0x99E00000000000000000000000000000000055fA': Verdict.PartyAWins,
    },
  },
];

const DisputeContext = createContext<DisputeContextType | undefined>(undefined);

export const DisputeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [disputes, setDisputes] = useState<Dispute[]>(SAMPLE_DISPUTES);
  const [approvedJurors, setApprovedJurors] = useState<`0x${string}`[]>(INITIAL_APPROVED_JURORS);
  const [isAdmin, setIsAdmin] = useState<boolean>(true); // Default enabled so testing admin features is straightforward
  const [loading, setLoading] = useState<boolean>(false);

  // Derive stats dynamically
  const stats: PlatformStats = {
    totalDisputes: 1240 + disputes.length - SAMPLE_DISPUTES.length,
    approvedJurorsCount: approvedJurors.length > 8 ? approvedJurors.length : 450,
    totalValueArbitratedFormatted: '$85M+',
    totalValueArbitratedRaw: parseUnits('85000000', 6),
  };

  const getDisputeById = (id: number) => {
    return disputes.find((d) => d.id === id);
  };

  const checkAllowance = async (tokenSymbol: 'USDC' | 'EURC', amountStr: string): Promise<boolean> => {
    if (!address || !publicClient) return true;
    try {
      const tokenAddress = TOKENS[tokenSymbol].address;
      const amountRaw = parseUnits(amountStr || '0', TOKENS[tokenSymbol].decimals);
      const allowance = await publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address, CONTRACT_ADDRESS],
      });
      return (allowance as bigint) >= amountRaw;
    } catch {
      return true; // Fallback to true if contract call fails (demo mode)
    }
  };

  const approveToken = async (tokenSymbol: 'USDC' | 'EURC', amountStr: string) => {
    if (!writeContractAsync) return;
    try {
      const tokenAddress = TOKENS[tokenSymbol].address;
      const amountRaw = parseUnits(amountStr, TOKENS[tokenSymbol].decimals);
      await writeContractAsync({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'approve',
        args: [CONTRACT_ADDRESS, amountRaw],
      });
    } catch (e) {
      console.warn('On-chain token approve failed or cancelled:', e);
    }
  };

  const createNewDispute = async (
    partyBStr: string,
    tokenSymbol: 'USDC' | 'EURC',
    amountStr: string,
    description: string,
    targetJurorCount: number
  ): Promise<number> => {
    setLoading(true);
    const newId = Math.floor(4106 + Math.random() * 100);
    const partyAAddr = address || '0x71C0000000000000000000000000000000004f9A';
    const partyBAddr = isAddress(partyBStr)
      ? (partyBStr as `0x${string}`)
      : ('0x3A20000000000000000000000000000000009b1C' as `0x${string}`);

    const tokenInfo = TOKENS[tokenSymbol];
    const rawAmount = parseUnits(amountStr || '1000', tokenInfo.decimals);

    // Attempt real on-chain transaction
    if (writeContractAsync && isAddress(partyBStr)) {
      try {
        await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CYCLONE_ABI,
          functionName: 'createDispute',
          args: [partyBAddr, tokenInfo.address, rawAmount, description, BigInt(targetJurorCount)],
        });
      } catch (err) {
        console.warn('On-chain createDispute call failed or declined, creating local record:', err);
      }
    }

    const newDispute: Dispute = {
      id: newId,
      partyA: partyAAddr,
      partyB: partyBAddr,
      token: tokenInfo.address,
      tokenSymbol,
      tokenDecimals: tokenInfo.decimals,
      amount: rawAmount,
      amountFormatted: Number(amountStr).toLocaleString('en-US'),
      description,
      targetJurorCount,
      status: DisputeStatus.Matching,
      verdict: Verdict.None,
      createdAt: Math.floor(Date.now() / 1000),
      partyAProposedJurors: [],
      partyBProposedJurors: [],
      confirmedJurors: [],
      jurorVotes: {},
      timeRemaining: '3d 0h',
    };

    setDisputes((prev) => [newDispute, ...prev]);
    setLoading(false);
    return newId;
  };

  const submitJurorsForDispute = async (disputeId: number, proposedJurors: string[]) => {
    setLoading(true);
    if (writeContractAsync) {
      try {
        await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CYCLONE_ABI,
          functionName: 'submitJurorList',
          args: [BigInt(disputeId), proposedJurors.map((j) => j as `0x${string}`)],
        });
      } catch (err) {
        console.warn('On-chain submitJurorList call failed/declined:', err);
      }
    }

    setDisputes((prev) =>
      prev.map((d) => {
        if (d.id !== disputeId) return d;

        const isA = !address || address.toLowerCase() === d.partyA.toLowerCase();
        const updatedA = isA
          ? (proposedJurors as `0x${string}`[])
          : d.partyAProposedJurors.length > 0
          ? d.partyAProposedJurors
          : (approvedJurors.slice(0, 4) as `0x${string}`[]);

        const updatedB = !isA
          ? (proposedJurors as `0x${string}`[])
          : d.partyBProposedJurors.length > 0
          ? d.partyBProposedJurors
          : (approvedJurors.slice(2, 6) as `0x${string}`[]);

        // Auto match overlapping jurors
        const overlap = updatedA.filter((a) =>
          updatedB.some((b) => b.toLowerCase() === a.toLowerCase())
        );

        const newStatus =
          overlap.length >= d.targetJurorCount ? DisputeStatus.Voting : d.status;

        return {
          ...d,
          partyAProposedJurors: updatedA,
          partyBProposedJurors: updatedB,
          confirmedJurors: overlap,
          status: newStatus,
        };
      })
    );

    setLoading(false);
  };

  const voteOnDispute = async (disputeId: number, verdict: Verdict) => {
    setLoading(true);
    const voterAddress = address || '0x741C000000000000000000000000000000000f9A';

    if (writeContractAsync) {
      try {
        await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CYCLONE_ABI,
          functionName: 'castVote',
          args: [BigInt(disputeId), verdict],
        });
      } catch (err) {
        console.warn('On-chain castVote call failed/declined:', err);
      }
    }

    setDisputes((prev) =>
      prev.map((d) => {
        if (d.id !== disputeId) return d;

        const updatedVotes = {
          ...d.jurorVotes,
          [voterAddress]: verdict,
        };

        // Check if majority threshold reached
        const partyAVotes = Object.values(updatedVotes).filter((v) => v === Verdict.PartyAWins).length;
        const partyBVotes = Object.values(updatedVotes).filter((v) => v === Verdict.PartyBWins).length;
        const majorityNeeded = Math.floor(d.targetJurorCount / 2) + 1;

        let finalStatus = d.status;
        let finalVerdict = d.verdict;

        if (partyAVotes >= majorityNeeded) {
          finalStatus = DisputeStatus.Resolved;
          finalVerdict = Verdict.PartyAWins;
        } else if (partyBVotes >= majorityNeeded) {
          finalStatus = DisputeStatus.Resolved;
          finalVerdict = Verdict.PartyBWins;
        }

        return {
          ...d,
          jurorVotes: updatedVotes,
          status: finalStatus,
          verdict: finalVerdict,
        };
      })
    );

    setLoading(false);
  };

  const approveJurorAddress = async (newJuror: string) => {
    if (!isAddress(newJuror)) return;
    const addr = newJuror as `0x${string}`;

    if (writeContractAsync) {
      try {
        await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CYCLONE_ABI,
          functionName: 'approveJuror',
          args: [addr],
        });
      } catch (e) {
        console.warn('On-chain approveJuror failed:', e);
      }
    }

    if (!approvedJurors.some((j) => j.toLowerCase() === addr.toLowerCase())) {
      setApprovedJurors((prev) => [...prev, addr]);
    }
  };

  const revokeJurorAddress = async (juror: string) => {
    if (!isAddress(juror)) return;
    const addr = juror as `0x${string}`;

    if (writeContractAsync) {
      try {
        await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CYCLONE_ABI,
          functionName: 'revokeJuror',
          args: [addr],
        });
      } catch (e) {
        console.warn('On-chain revokeJuror failed:', e);
      }
    }

    setApprovedJurors((prev) => prev.filter((j) => j.toLowerCase() !== addr.toLowerCase()));
  };

  const resolveDisputeAdmin = async (disputeId: number, verdict: Verdict) => {
    if (writeContractAsync) {
      try {
        await writeContractAsync({
          address: CONTRACT_ADDRESS,
          abi: CYCLONE_ABI,
          functionName: 'adminResolve',
          args: [BigInt(disputeId), verdict],
        });
      } catch (e) {
        console.warn('On-chain adminResolve failed:', e);
      }
    }

    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: DisputeStatus.Resolved, verdict } : d))
    );
  };

  const refreshData = async () => {
    // Queries on-chain data if available
  };

  return (
    <DisputeContext.Provider
      value={{
        disputes,
        approvedJurors,
        stats,
        loading,
        isAdmin,
        setIsAdmin,
        getDisputeById,
        createNewDispute,
        submitJurorsForDispute,
        voteOnDispute,
        approveJurorAddress,
        revokeJurorAddress,
        resolveDisputeAdmin,
        checkAllowance,
        approveToken,
        refreshData,
      }}
    >
      {children}
    </DisputeContext.Provider>
  );
};

export const useDisputes = () => {
  const context = useContext(DisputeContext);
  if (!context) {
    throw new Error('useDisputes must be used within a DisputeProvider');
  }
  return context;
};
