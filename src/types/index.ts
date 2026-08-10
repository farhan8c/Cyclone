export enum DisputeStatus {
  Matching = 0,
  Voting = 1,
  Resolved = 2,
  AdminFallback = 3,
}

export enum Verdict {
  None = 0,
  PartyAWins = 1,
  PartyBWins = 2,
}

export interface Dispute {
  id: number;
  partyA: `0x${string}`;
  partyB: `0x${string}`;
  partyAName?: string;
  partyBName?: string;
  token: `0x${string}`;
  tokenSymbol: 'USDC' | 'EURC';
  tokenDecimals: number;
  amount: bigint; // raw uint256
  amountFormatted: string;
  description: string;
  targetJurorCount: number;
  status: DisputeStatus;
  verdict: Verdict;
  createdAt: number; // timestamp in seconds
  partyAProposedJurors: `0x${string}`[];
  partyBProposedJurors: `0x${string}`[];
  confirmedJurors: `0x${string}`[];
  jurorVotes: Record<`0x${string}`, Verdict>; // jurorAddress -> Verdict
  timeRemaining?: string;
}

export interface PlatformStats {
  totalDisputes: number;
  approvedJurorsCount: number;
  totalValueArbitratedFormatted: string; // e.g. "$85M+" or "85,000,000 USDC"
  totalValueArbitratedRaw: bigint;
}

export interface JurorInfo {
  address: `0x${string}`;
  name?: string;
  isApproved: boolean;
  disputesVotedOn: number;
  awaitingVoteCount: number;
}
