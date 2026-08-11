# Cycloone

On-chain dispute arbitration for Arc Testnet. Two parties escrow a disputed amount, mutually agree on jurors, and let a majority vote settle it — no single authority deciding outcomes.

## The Problem

Most on-chain disputes have no fair resolution path. Either one party has to trust the other completely, or a centralized admin ends up as judge, jury, and executioner. Cycloone splits the difference: jurors are chosen jointly by both sides, and a simple majority decides who's right.

## How It Works

1. Party A opens a dispute against Party B, escrowing the disputed amount in USDC or EURC.
2. Both parties submit their own list of proposed jurors, pulled from an admin-approved pool.
3. Only jurors that appear on **both** lists get confirmed — this is the "mutual selection" part.
4. Confirmed jurors vote for Party A or Party B. Simple majority wins.
5. The moment a majority is reached, the escrowed funds release automatically to the winner.

If the two lists don't overlap enough to reach the agreed juror count, the dispute stays open for a resubmission, or — if it's genuinely stuck — the admin can step in as a last resort.

## Deployment

| | |
|---|---|
| Network | Arc Testnet |
| Chain ID | `5042002` |
| Contract Address | `0x89e73e6d885eeFA1a99bEBA1feF983BcAFe11Ce3` |
| Explorer | [testnet.arcscan.app](https://testnet.arcscan.app) |
| Currency | USDC / EURC |

## Built By

Farhan
