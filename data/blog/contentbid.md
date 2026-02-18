---
title: 'ContentBid: A Smart Contract Marketplace for Content Creators'
date: '2022-06-01'
tags: [blockchain, solidity, smart-contracts, web3]
draft: false
summary: 'An overview of ContentBid — a content marketplace where I designed and implemented the Solidity smart contracts that governed bidding, ownership, and payouts.'
authors:
  - default
---

## What is ContentBid?

ContentBid is a marketplace that connects content creators with buyers through a transparent, on-chain bidding system. Instead of relying on a centralised platform to arbitrate deals, the core business logic lives in smart contracts on the Ethereum blockchain — meaning creators and buyers interact directly, with the contract acting as the neutral third party.

I worked on this project as a part-time Software Developer at AIV Group between 2019 and 2022.

## My role

My main contribution was designing and implementing the Solidity smart contracts that powered the marketplace:

- **Listing contract** — allowed creators to publish content items with a reserve price and auction duration.
- **Bidding contract** — handled bid placement, outbid refunds, and bid escrow so funds were held securely until auction close.
- **Settlement contract** — released payment to the seller and transferred ownership to the highest bidder at the end of an auction.

## Key challenges

**Reentrancy and fund safety.** Any contract that holds Ether is a target. I followed the checks-effects-interactions pattern throughout and used a pull-payment approach for refunds to avoid reentrancy attack vectors.

**Gas optimisation.** Auction contracts can become expensive if bidders frequently get outbid (each refund is a transaction). Switching to a withdrawal pattern — where outbid funds accumulate in a balance the user pulls manually — cut per-interaction gas costs noticeably.

**Testing on-chain logic.** Smart contract bugs are permanent. I wrote unit tests covering normal auction flows, edge cases (same-price bids, auctions with no bids), and attempted exploits before any deployment to testnet.

## Takeaway

ContentBid was my first real exposure to smart contract development. Solidity forces you to think about state machine design very carefully — every state transition is irreversible and costs real money. That discipline has made me more careful about side-effects in all the backend code I've written since.
