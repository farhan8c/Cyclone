import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAccount, usePublicClient, useWriteContract } from 'wagmi';
import { parseUnits, formatUnits, isAddress } from 'viem';
import { CYCLONE_ABI, ERC20_ABI } from '../config/abi';
import { CONTRACT_ADDRESS, TOKENS, ADMIN_ADDRESS } from '../config/chain';
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

const DisputeContext = createContext<DisputeContextType | undefined>(undefined);

export const DisputeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();

  const [disputes, setDisputes] = useState<Dispute[]>([]);
  const [approvedJurors, setApprovedJurors] = useState<`0x${string}`[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [stats, setStats] = useState<PlatformStats>({
    totalDisputes: 0,
    approvedJurorsCount: 0,
    totalValueArbitratedFormatted: '$0',
    totalValueArbitratedRaw: 0n,
  });

  const isAdmin = !!address && address.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
  const setIsAdmin = () => {}; // Derived from connected wallet

  const getDisputeById = (id: number) => {
    return disputes.find((d) => d.id === id);
  };

  const refreshData = useCallback(async () => {
    if (!publicClient) return;
    try {
      setLoading(true);

      // 1. Fetch Platform Stats
      try {
        const statsRes = (await publicClient.readContract({
          address: CONTRACT_ADDRESS,
          abi: CYCLONE_ABI,
          functionName: 'getPlatformStats',
        })) as [bigint, bigint, bigint];

        const totalDisputes = Number(statsRes[0] || 0n);
        const approvedJurorsCount = Number(statsRes[1] || 0n);
        const rawValue = statsRes[2] || 0n;
        const valFormatted = '$' + Number(formatUnits(rawValue, 6)).toLocaleString('en-US');

        setStats({
          totalDisputes,
          approvedJurorsCount,
          totalValueArbitratedFormatted: valFormatted,
          totalValueArbitratedRaw: rawValue,
        });

        // 2. Fetch Approved Jurors
        try {
          const jurorsRes = (await publicClient.readContract({
            address: CONTRACT_ADDRESS,
            abi: CYCLONE_ABI,
            functionName: 'getApprovedJurors',
          })) as `0x${string}`[];
          setApprovedJurors(jurorsRes || []);
        } catch (e) {
          console.warn('Failed to fetch approved jurors:', e);
        }

        // 3. Fetch Disputes
        const loadedDisputes: Dispute[] = [];
        // Loop over dispute IDs (trying 1 to totalDisputes, and 0 if totalDisputes is 0 or 1-indexed)
        const maxIdToTry = Math.max(totalDisputes, 20);
        for (let i = 1; i <= maxIdToTry; i++) {
          try {
            const info = (await publicClient.readContract({
              address: CONTRACT_ADDRESS,
              abi: CYCLONE_ABI,
              functionName: 'getDisputeInfo',
              args: [BigInt(i)],
            })) as [string, string, string, bigint, string, bigint, number, number, bigint];

            const [
              partyA,
              partyB,
              token,
              amount,
              description,
              targetJurorCount,
              status,
              verdict,
              createdAt,
            ] = info;

            if (!partyA || partyA === '0x0000000000000000000000000000000000000000') {
              continue;
            }

            // Get confirmed jurors & party lists
            let confirmedJurors: `0x${string}`[] = [];
            let partyAProposed: `0x${string}`[] = [];
            let partyBProposed: `0x${string}`[] = [];

            try {
              confirmedJurors = (await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: CYCLONE_ABI,
                functionName: 'getConfirmedJurors',
                args: [BigInt(i)],
              })) as `0x${string}`[];
            } catch {}

            try {
              partyAProposed = (await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: CYCLONE_ABI,
                functionName: 'getPartyJurorList',
                args: [BigInt(i), true],
              })) as `0x${string}`[];
            } catch {}

            try {
              partyBProposed = (await publicClient.readContract({
                address: CONTRACT_ADDRESS,
                abi: CYCLONE_ABI,
                functionName: 'getPartyJurorList',
                args: [BigInt(i), false],
              })) as `0x${string}`[];
            } catch {}

            // Determine token symbol
            let tokenSymbol: 'USDC' | 'EURC' = 'USDC';
            if (token.toLowerCase() === TOKENS.EURC.address.toLowerCase()) {
              tokenSymbol = 'EURC';
            }

            const amountFormatted = Number(formatUnits(amount, 6)).toLocaleString('en-US');

            loadedDisputes.push({
              id: i,
              partyA: partyA as `0x${string}`,
              partyB: partyB as `0x${string}`,
              token: token as `0x${string}`,
              tokenSymbol,
              tokenDecimals: 6,
              amount,
              amountFormatted,
              description,
              targetJurorCount: Number(targetJurorCount),
              status: status as DisputeStatus,
              verdict: verdict as Verdict,
              createdAt: Number(createdAt),
              partyAProposedJurors: partyAProposed,
              partyBProposedJurors: partyBProposed,
              confirmedJurors,
              jurorVotes: {},
            });
          } catch {
            // Dispute ID i doesn't exist on contract yet
            break;
          }
        }

        setDisputes(loadedDisputes);
      } catch (err) {
        console.warn('On-chain platform stats read error:', err);
      }
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    refreshData();
  }, [refreshData, address]);

  const checkAllowance = async (tokenSymbol: 'USDC' | 'EURC', amountStr: string): Promise<boolean> => {
    if (!address || !publicClient) return false;
    try {
      const tokenAddress = TOKENS[tokenSymbol].address;
      const amountRaw = parseUnits(amountStr || '0', TOKENS[tokenSymbol].decimals);
      const allowance = (await publicClient.readContract({
        address: tokenAddress,
        abi: ERC20_ABI,
        functionName: 'allowance',
        args: [address, CONTRACT_ADDRESS],
      })) as bigint;
      return allowance >= amountRaw;
    } catch {
      return false;
    }
  };

  const approveToken = async (tokenSymbol: 'USDC' | 'EURC', amountStr: string) => {
    if (!writeContractAsync) return;
    const tokenAddress = TOKENS[tokenSymbol].address;
    const amountRaw = parseUnits(amountStr, TOKENS[tokenSymbol].decimals);
    await writeContractAsync({
      address: tokenAddress,
      abi: ERC20_ABI,
      functionName: 'approve',
      args: [CONTRACT_ADDRESS, amountRaw],
    });
  };

  const createNewDispute = async (
    partyBStr: string,
    tokenSymbol: 'USDC' | 'EURC',
    amountStr: string,
    description: string,
    targetJurorCount: number
  ): Promise<number> => {
    if (!writeContractAsync) throw new Error('Wallet not connected');
    setLoading(true);

    const tokenInfo = TOKENS[tokenSymbol];
    const rawAmount = parseUnits(amountStr || '0', tokenInfo.decimals);
    const partyBAddr = partyBStr as `0x${string}`;

    const tx = await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CYCLONE_ABI,
      functionName: 'createDispute',
      args: [partyBAddr, tokenInfo.address, rawAmount, description, BigInt(targetJurorCount)],
    });

    await refreshData();
    setLoading(false);
    return disputes.length + 1;
  };

  const submitJurorsForDispute = async (disputeId: number, proposedJurors: string[]) => {
    if (!writeContractAsync) throw new Error('Wallet not connected');
    setLoading(true);

    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CYCLONE_ABI,
      functionName: 'submitJurorList',
      args: [BigInt(disputeId), proposedJurors.map((j) => j as `0x${string}`)],
    });

    await refreshData();
    setLoading(false);
  };

  const voteOnDispute = async (disputeId: number, verdict: Verdict) => {
    if (!writeContractAsync) throw new Error('Wallet not connected');
    setLoading(true);

    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CYCLONE_ABI,
      functionName: 'castVote',
      args: [BigInt(disputeId), verdict],
    });

    await refreshData();
    setLoading(false);
  };

  const approveJurorAddress = async (newJuror: string) => {
    if (!writeContractAsync || !isAddress(newJuror)) return;
    setLoading(true);

    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CYCLONE_ABI,
      functionName: 'approveJuror',
      args: [newJuror as `0x${string}`],
    });

    await refreshData();
    setLoading(false);
  };

  const revokeJurorAddress = async (juror: string) => {
    if (!writeContractAsync || !isAddress(juror)) return;
    setLoading(true);

    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CYCLONE_ABI,
      functionName: 'revokeJuror',
      args: [juror as `0x${string}`],
    });

    await refreshData();
    setLoading(false);
  };

  const resolveDisputeAdmin = async (disputeId: number, verdict: Verdict) => {
    if (!writeContractAsync) throw new Error('Wallet not connected');
    setLoading(true);

    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: CYCLONE_ABI,
      functionName: 'adminResolve',
      args: [BigInt(disputeId), verdict],
    });

    await refreshData();
    setLoading(false);
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
