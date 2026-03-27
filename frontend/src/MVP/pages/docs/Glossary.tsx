/**
 * Ujamaa DeFi Platform - Comprehensive Glossary
 * Complete terminology guide for users, investors, and stakeholders
 * 
 * @version 2.0.0-mvp
 * @description Alphabetical glossary of all terms related to DeFi, blockchain, 
 *              tokenization, African finance, and the Ujamaa platform
 */

import React, { useState, useMemo } from 'react';
import Navigation from '../../components/Navigation';

interface GlossaryTerm {
  term: string;
  pronunciation?: string;
  partOfSpeech: string;
  definition: string;
  category: Category;
  relatedTerms?: string[];
  example?: string;
  platformContext?: string;
}

type Category = 
  | 'DeFi Basics'
  | 'Blockchain'
  | 'Tokenization'
  | 'Investment'
  | 'Compliance'
  | 'African Finance'
  | 'Ujamaa Platform'
  | 'Banking'
  | 'Legal';

const GLOSSARY_DATA: GlossaryTerm[] = [
  // ============================================================================
  // A
  // ============================================================================
  {
    term: 'Accredited Investor',
    partOfSpeech: 'noun',
    definition: 'An individual or entity that meets specific financial criteria set by regulators, allowing them to invest in certain private or restricted investment opportunities. Criteria typically include minimum income, net worth, or professional qualifications.',
    category: 'Investment',
    relatedTerms: ['Retail Investor', 'Institutional Investor', 'KYC/AML'],
    example: 'In many jurisdictions, accredited investors must have an annual income exceeding $200,000 or a net worth of over $1 million.',
    platformContext: 'Ujamaa requires institutional investors to meet accreditation requirements before accessing certain pool offerings.',
  },
  {
    term: 'APY (Annual Percentage Yield)',
    pronunciation: 'A-P-Y',
    partOfSpeech: 'noun',
    definition: 'The real rate of return earned on an investment, taking into account the effect of compounding interest. APY is typically higher than APR because it includes compound interest.',
    category: 'Investment',
    relatedTerms: ['APR', 'Yield', 'Compound Interest'],
    example: 'An investment with a 10% APY will grow €10,000 to €11,000 in one year.',
    platformContext: 'Ujamaa pools target APYs ranging from 8% to 15% depending on the asset class and risk level.',
  },
  {
    term: 'APR (Annual Percentage Rate)',
    pronunciation: 'A-P-R',
    partOfSpeech: 'noun',
    definition: 'The annual rate charged for borrowing or earned through an investment, without taking compounding into account. APR represents the simple interest rate over a year.',
    category: 'Investment',
    relatedTerms: ['APY', 'Interest Rate', 'Yield'],
    example: 'A loan with 12% APR means you pay 1% interest per month on the principal.',
  },
  {
    term: 'Asset Backing',
    partOfSpeech: 'noun',
    definition: 'The collateral or underlying assets that support the value of a financial instrument, token, or currency. Asset-backed instruments derive their value from real-world assets.',
    category: 'Tokenization',
    relatedTerms: ['Collateral', 'RWA', 'Tokenization'],
    platformContext: 'Ujamaa tokens are backed by real-world African industrial and agricultural assets.',
  },
  {
    term: 'Asset Class',
    partOfSpeech: 'noun',
    definition: 'A group of securities that exhibit similar characteristics, behave similarly in the marketplace, and are subject to the same laws and regulations. Common asset classes include equities, fixed income, real estate, and commodities.',
    category: 'Investment',
    relatedTerms: ['Diversification', 'Portfolio', 'Risk Management'],
    platformContext: 'Ujamaa offers exposure to multiple asset classes: agriculture, industry, trade finance, renewable energy, and real estate.',
  },
  {
    term: 'Industrial Operator',
    partOfSpeech: 'noun',
    definition: 'An industrial company that seeks financing through asset tokenization. Industrial operators tokenize their assets (invoices, inventory, production) to access capital from investors.',
    category: 'Ujamaa Platform',
    relatedTerms: ['Borrower', 'Manufacturer', 'Producer'],
    platformContext: 'Industrial Operators on Ujamaa are African industrial companies seeking financing through tokenized pools.',
  },
  {
    term: 'African Continental Free Trade Area (AfCFTA)',
    pronunciation: 'Af-C-F-T-A',
    partOfSpeech: 'proper noun',
    definition: 'A continental free trade area governing trade within Africa. It is the world\'s largest free trade area by number of countries, aiming to create a single market for goods and services.',
    category: 'African Finance',
    relatedTerms: ['Regional Integration', 'Trade Finance', 'Economic Development'],
  },
  // ============================================================================
  // B
  // ============================================================================
  {
    term: 'Blockchain',
    partOfSpeech: 'noun',
    definition: 'A distributed, decentralized ledger technology that records transactions across multiple computers in a way that ensures security, transparency, and immutability. Each block contains a cryptographic hash of the previous block.',
    category: 'Blockchain',
    relatedTerms: ['Distributed Ledger', 'Smart Contract', 'Consensus'],
    example: 'Bitcoin was the first major application of blockchain technology.',
    platformContext: 'Ujamaa operates on the Polygon blockchain for fast, low-cost transactions.',
  },
  {
    term: 'Block Explorer',
    partOfSpeech: 'noun',
    definition: 'A web-based tool that allows users to search, view, and analyze transactions, blocks, and addresses on a blockchain. It provides transparency into blockchain activity.',
    category: 'Blockchain',
    relatedTerms: ['Transaction Hash', 'Address', 'Blockchain'],
    platformContext: 'Ujamaa uses Polygon Amoy Block Explorer (amoy.polygonscan.com) for testnet transaction verification.',
  },
  {
    term: 'Bridge (Cross-Chain Bridge)',
    partOfSpeech: 'noun',
    definition: 'A protocol or mechanism that enables the transfer of assets or data between different blockchain networks. Bridges allow interoperability between otherwise isolated blockchains.',
    category: 'Blockchain',
    relatedTerms: ['Interoperability', 'Wrapped Token', 'Multi-chain'],
  },
  {
    term: 'Bank Escrow',
    partOfSpeech: 'noun',
    definition: 'A financial arrangement where a third-party bank holds and regulates payment of funds or assets for the primary parties involved in a transaction. The escrow agent releases funds only when predetermined conditions are met.',
    category: 'Banking',
    relatedTerms: ['Escrow Agent', 'Custody', 'Security'],
    platformContext: 'Ujamaa partners with regulated banks (e.g., BIIC (Banque Internationale pour l'Industrie et le Commerce), MCB) to hold investor funds in escrow accounts.',
  },
  {
    term: 'Base Rate',
    partOfSpeech: 'noun',
    definition: 'A benchmark interest rate used as a reference for pricing loans and financial products. Often set by central banks or derived from market rates like EURIBOR or LIBOR.',
    category: 'Banking',
    relatedTerms: ['EURIBOR', 'Interest Rate', 'Benchmark'],
  },
  // ============================================================================
  // C
  // ============================================================================
  {
    term: 'Collateral',
    partOfSpeech: 'noun',
    definition: 'An asset or property that a borrower offers to a lender as security for a loan. If the borrower defaults, the lender can seize the collateral to recover losses.',
    category: 'Investment',
    relatedTerms: ['Security', 'Asset Backing', 'Default'],
    platformContext: 'Ujamaa pools are collateralized by real industrial and agricultural assets from African companies.',
  },
  {
    term: 'Compliance',
    partOfSpeech: 'noun',
    definition: 'The act of adhering to laws, regulations, guidelines, and specifications relevant to a business or industry. In finance, compliance includes KYC, AML, and sanctions screening.',
    category: 'Compliance',
    relatedTerms: ['KYC', 'AML', 'Sanctions', 'Regulation'],
    platformContext: 'Ujamaa maintains strict compliance with international sanctions and African regulatory requirements.',
  },
  {
    term: 'Consensus Mechanism',
    partOfSpeech: 'noun',
    definition: 'A protocol that ensures all nodes (computers) in a blockchain network agree on the validity of transactions and the state of the ledger. Common mechanisms include Proof of Work (PoW) and Proof of Stake (PoS).',
    category: 'Blockchain',
    relatedTerms: ['Proof of Stake', 'Proof of Work', 'Validator'],
    platformContext: 'Polygon uses a Proof of Stake consensus mechanism for transaction validation.',
  },
  {
    term: 'Cross-Border Payment',
    partOfSpeech: 'noun',
    definition: 'A financial transaction where the payer and recipient are located in different countries. These payments often involve currency conversion and international banking networks.',
    category: 'Banking',
    relatedTerms: ['FX', 'SWIFT', 'Remittance'],
    platformContext: 'Ujamaa facilitates cross-border investments between international investors and African assets.',
  },
  {
    term: 'Custody',
    partOfSpeech: 'noun',
    definition: 'The safekeeping and protection of financial assets or instruments on behalf of clients. Custodial services ensure assets are securely held and properly administered.',
    category: 'Banking',
    relatedTerms: ['Escrow', 'Wallet', 'Security'],
  },
  // ============================================================================
  // D
  // ============================================================================
  {
    term: 'DeFi (Decentralized Finance)',
    pronunciation: 'Dee-Fye',
    partOfSpeech: 'noun',
    definition: 'A financial system built on blockchain technology that operates without traditional intermediaries like banks. DeFi uses smart contracts to enable lending, borrowing, trading, and other financial services in a decentralized manner.',
    category: 'DeFi Basics',
    relatedTerms: ['Smart Contract', 'Blockchain', 'Liquidity Pool'],
    example: 'DeFi protocols allow users to earn interest on crypto holdings without a bank.',
    platformContext: 'Ujamaa brings DeFi principles to real-world African asset financing.',
  },
  {
    term: 'Decentralization',
    partOfSpeech: 'noun',
    definition: 'The distribution of power, control, or decision-making away from a central authority. In blockchain, decentralization means no single entity controls the network.',
    category: 'Blockchain',
    relatedTerms: ['Centralization', 'Governance', 'DAO'],
  },
  {
    term: 'Default',
    partOfSpeech: 'noun',
    definition: 'The failure of a borrower to repay a loan or meet the terms of a credit agreement. Default can lead to legal action, asset seizure, or loss of collateral.',
    category: 'Investment',
    relatedTerms: ['Default Risk', 'Non-Performing Loan', 'Collateral'],
    platformContext: 'Ujamaa pools include default risk mitigation through asset collateralization and insurance.',
  },
  {
    term: 'Default Risk',
    partOfSpeech: 'noun',
    definition: 'The probability that a borrower will fail to make required payments on a debt obligation. Higher default risk typically results in higher interest rates to compensate lenders.',
    category: 'Investment',
    relatedTerms: ['Credit Risk', 'Risk Assessment', 'Default'],
  },
  {
    term: 'Distributed Ledger',
    partOfSpeech: 'noun',
    definition: 'A database that is spread across multiple nodes or locations, with each participant having a copy of the ledger. Blockchain is a type of distributed ledger.',
    category: 'Blockchain',
    relatedTerms: ['Blockchain', 'Consensus', 'Node'],
  },
  {
    term: 'Diversification',
    partOfSpeech: 'noun',
    definition: 'An investment strategy that spreads investments across various asset classes, industries, or geographies to reduce risk. The goal is to minimize the impact of any single investment\'s poor performance.',
    category: 'Investment',
    relatedTerms: ['Portfolio', 'Risk Management', 'Asset Allocation'],
    platformContext: 'Ujamaa enables diversification across five pool families and multiple African countries.',
  },
  {
    term: 'Due Diligence',
    partOfSpeech: 'noun',
    definition: 'A comprehensive investigation or audit of a potential investment or business opportunity to confirm facts, assess risks, and verify information before making a decision.',
    category: 'Investment',
    relatedTerms: ['Risk Assessment', 'KYC', 'Compliance'],
    platformContext: 'Ujamaa conducts thorough due diligence on all Industrial Operators and their collateral.',
  },
  // ============================================================================
  // E
  // ============================================================================
  {
    term: 'Escrow',
    partOfSpeech: 'noun',
    definition: 'A legal arrangement where a third party temporarily holds money or assets during a transaction until predetermined conditions are fulfilled. Escrow protects both buyer and seller.',
    category: 'Banking',
    relatedTerms: ['Bank Escrow', 'Custody', 'Smart Contract'],
    platformContext: 'Ujamaa uses regulated bank escrow accounts to secure investor funds.',
  },
  {
    term: 'EURIBOR (Euro Interbank Offered Rate)',
    pronunciation: 'You-Ribor',
    partOfSpeech: 'noun',
    definition: 'A benchmark rate at which European banks lend funds to one another. EURIBOR is used as a reference rate for various financial products, including loans and mortgages.',
    category: 'Banking',
    relatedTerms: ['Base Rate', 'Interest Rate', 'Benchmark'],
  },
  {
    term: 'Equity',
    partOfSpeech: 'noun',
    definition: 'Ownership interest in a company or asset, represented by shares. Equity holders have a claim on assets and earnings, and may receive dividends.',
    category: 'Investment',
    relatedTerms: ['Shares', 'Ownership', 'Dividend'],
  },
  {
    term: 'Emerging Markets',
    partOfSpeech: 'noun',
    definition: 'Economies of developing nations that are becoming more engaged with global markets. These markets offer high growth potential but also carry higher risks.',
    category: 'African Finance',
    relatedTerms: ['Developing Economy', 'Frontier Markets', 'Africa'],
  },
  // ============================================================================
  // F
  // ============================================================================
  {
    term: 'Fiat Currency',
    partOfSpeech: 'noun',
    definition: 'Government-issued currency that is not backed by a physical commodity like gold, but by the trust and credit of the issuing government. Examples include USD, EUR, and GBP.',
    category: 'DeFi Basics',
    relatedTerms: ['Stablecoin', 'Cryptocurrency', 'FX'],
    example: 'The Euro (EUR) and US Dollar (USD) are fiat currencies.',
  },
  {
    term: 'Fixed Income',
    partOfSpeech: 'noun',
    definition: 'Investment securities that pay regular, fixed interest payments until maturity, when the principal is returned. Examples include bonds and certificates of deposit.',
    category: 'Investment',
    relatedTerms: ['Bond', 'Interest', 'Maturity'],
    platformContext: 'Ujamaa pools offer fixed-income-like returns through structured financing agreements.',
  },
  {
    term: 'Financing',
    partOfSpeech: 'noun',
    definition: 'The provision of funds or capital to support a business, project, or purchase. Financing can come from debt (loans) or equity (ownership shares).',
    category: 'Investment',
    relatedTerms: ['Debt', 'Equity', 'Capital'],
  },
  {
    term: 'Financial Inclusion',
    partOfSpeech: 'noun',
    definition: 'The effort to make financial services accessible and affordable to all individuals and businesses, especially those traditionally excluded from the formal financial system.',
    category: 'African Finance',
    relatedTerms: ['Unbanked', 'Microfinance', 'Development'],
  },
  {
    term: 'FX (Foreign Exchange)',
    pronunciation: 'F-X',
    partOfSpeech: 'noun',
    definition: 'The global marketplace for exchanging one currency for another. FX transactions determine exchange rates between currencies.',
    category: 'Banking',
    relatedTerms: ['Exchange Rate', 'Currency Conversion', 'Cross-Border'],
    platformContext: 'Ujamaa charges a 2% FX fee for currency conversions between EUR and local African currencies.',
  },
  // ============================================================================
  // G
  // ============================================================================
  {
    term: 'Gas Fee',
    partOfSpeech: 'noun',
    definition: 'A transaction fee paid to network validators for processing transactions on a blockchain. Gas fees compensate for the computational energy required to validate transactions.',
    category: 'Blockchain',
    relatedTerms: ['Transaction Fee', 'Validator', 'Network'],
    platformContext: 'Polygon\'s low gas fees make Ujamaa transactions cost-effective for investors.',
  },
  {
    term: 'GDIZ (Benin) (Guarantee for Development through Industrial Zones)',
    pronunciation: 'G-Diz',
    partOfSpeech: 'proper noun',
    definition: 'A certification or guarantee program that validates industrial projects in Africa, providing additional security and credibility for investors.',
    category: 'African Finance',
    relatedTerms: ['Guarantee', 'Industrial Zone', 'Certification'],
    platformContext: 'Ujamaa partners with GDIZ (Benin) to certify Industrial Operators and reduce investment risk.',
  },
  {
    term: 'Governance',
    partOfSpeech: 'noun',
    definition: 'The system of rules, practices, and processes by which an organization or protocol is directed and controlled. In DeFi, governance often involves token holders voting on proposals.',
    category: 'DeFi Basics',
    relatedTerms: ['DAO', 'Voting', 'Proposal'],
  },
  // ============================================================================
  // H
  // ============================================================================
  {
    term: 'Hurdle Rate',
    partOfSpeech: 'noun',
    definition: 'The minimum rate of return that an investment must achieve before performance fees are charged. It serves as a benchmark to ensure investors receive a baseline return.',
    category: 'Investment',
    relatedTerms: ['Performance Fee', 'Management Fee', 'Return'],
    platformContext: 'Ujamaa applies a 5% hurdle rate before charging performance fees on pool yields.',
  },
  {
    term: 'Hedging',
    partOfSpeech: 'verb/noun',
    definition: 'An investment strategy used to offset potential losses by taking an opposite position in a related asset. Hedging reduces risk exposure.',
    category: 'Investment',
    relatedTerms: ['Risk Management', 'Derivative', 'Insurance'],
  },
  // ============================================================================
  // I
  // ============================================================================
  {
    term: 'Institutional Investor',
    partOfSpeech: 'noun',
    definition: 'An organization that invests large sums of money on behalf of clients or members. Examples include pension funds, insurance companies, hedge funds, and endowments.',
    category: 'Investment',
    relatedTerms: ['Accredited Investor', 'Retail Investor', 'High Net Worth'],
    platformContext: 'Ujamaa institutional investors can invest €100,000 or more with dedicated support.',
  },
  {
    term: 'Interest Rate',
    partOfSpeech: 'noun',
    definition: 'The percentage of a loan or investment that is charged as interest over a specific period, typically expressed as an annual rate (APR or APY).',
    category: 'Investment',
    relatedTerms: ['APR', 'APY', 'Yield'],
  },
  {
    term: 'Interoperability',
    partOfSpeech: 'noun',
    definition: 'The ability of different blockchain networks or systems to communicate, share data, and transact with each other seamlessly.',
    category: 'Blockchain',
    relatedTerms: ['Bridge', 'Cross-Chain', 'Multi-chain'],
  },
  {
    term: 'Investment Memorandum',
    partOfSpeech: 'noun',
    definition: 'A formal document that provides detailed information about an investment opportunity, including risks, terms, financial projections, and legal disclosures.',
    category: 'Legal',
    relatedTerms: ['Prospectus', 'Term Sheet', 'Disclosure'],
    platformContext: 'Ujamaa provides comprehensive Investment Memorandums for each pool offering.',
  },
  {
    term: 'Investor',
    partOfSpeech: 'noun',
    definition: 'An individual or entity that allocates capital with the expectation of generating a return or profit. Investors can be retail (individual) or institutional (organizations).',
    category: 'Investment',
    relatedTerms: ['Retail Investor', 'Institutional Investor', 'Stakeholder'],
  },
  // ============================================================================
  // J
  // ============================================================================
  {
    term: 'Jurisdiction',
    partOfSpeech: 'noun',
    definition: 'A geographic region or legal territory where specific laws and regulations apply. Financial services must comply with the jurisdictional requirements of each region they operate in.',
    category: 'Compliance',
    relatedTerms: ['Compliance', 'Regulation', 'Sanctions'],
    platformContext: 'Ujamaa blocks certain jurisdictions due to international sanctions and compliance requirements.',
  },
  {
    term: 'Jurisdiction Check',
    partOfSpeech: 'noun',
    definition: 'A compliance procedure that verifies whether an investor\'s country of residence is permitted to access a financial service or investment product.',
    category: 'Compliance',
    relatedTerms: ['KYC', 'Sanctions', 'Compliance'],
    platformContext: 'Ujamaa automatically checks investor jurisdictions against blocked and allowed country lists.',
  },
  // ============================================================================
  // K
  // ============================================================================
  {
    term: 'KYC (Know Your Customer)',
    pronunciation: 'K-Y-C',
    partOfSpeech: 'noun',
    definition: 'A mandatory verification process used by financial institutions to confirm the identity of clients. KYC helps prevent fraud, money laundering, and terrorist financing.',
    category: 'Compliance',
    relatedTerms: ['AML', 'Due Diligence', 'Identity Verification'],
    platformContext: 'All Ujamaa investors must complete KYC verification before investing.',
  },
  {
    term: 'KYB (Know Your Business)',
    pronunciation: 'K-Y-B',
    partOfSpeech: 'noun',
    definition: 'A verification process similar to KYC but for business entities. KYB confirms the legitimacy of a company, its ownership structure, and beneficial owners.',
    category: 'Compliance',
    relatedTerms: ['KYC', 'Due Diligence', 'Corporate Verification'],
    platformContext: 'Institutional investors and Industrial Operators on Ujamaa must complete KYB verification.',
  },
  {
    term: 'KYC/AML',
    pronunciation: 'K-Y-C-A-M-L',
    partOfSpeech: 'noun',
    definition: 'Combined compliance procedures encompassing Know Your Customer (KYC) and Anti-Money Laundering (AML) regulations. These are mandatory for financial institutions globally.',
    category: 'Compliance',
    relatedTerms: ['Compliance', 'Sanctions', 'Regulation'],
  },
  // ============================================================================
  // L
  // ============================================================================
  {
    term: 'Liquidity',
    partOfSpeech: 'noun',
    definition: 'The ease with which an asset can be converted into cash without significantly affecting its price. Highly liquid assets can be quickly bought or sold.',
    category: 'Investment',
    relatedTerms: ['Liquidity Pool', 'Market Depth', 'Trading Volume'],
  },
  {
    term: 'Liquidity Pool',
    partOfSpeech: 'noun',
    definition: 'A pool of funds locked in a smart contract that facilitates trading, lending, or other financial activities in DeFi. Liquidity providers earn fees from pool usage.',
    category: 'DeFi Basics',
    relatedTerms: ['DeFi', 'Automated Market Maker', 'Yield Farming'],
    platformContext: 'Ujamaa pools aggregate investor capital to finance African industrial assets.',
  },
  {
    term: 'Lock-up Period',
    partOfSpeech: 'noun',
    definition: 'A predetermined time during which investors cannot withdraw or sell their investment. Lock-up periods provide stability for long-term investments.',
    category: 'Investment',
    relatedTerms: ['Vesting', 'Maturity', 'Redemption'],
    platformContext: 'Ujamaa pools have lock-up periods ranging from 90 days to 3 years depending on the asset class.',
  },
  {
    term: 'Ledger',
    partOfSpeech: 'noun',
    definition: 'A record-keeping system that tracks financial transactions. In blockchain, the ledger is distributed across all network participants.',
    category: 'Blockchain',
    relatedTerms: ['Distributed Ledger', 'Transaction', 'Block'],
  },
  {
    term: 'Leverage',
    partOfSpeech: 'noun',
    definition: 'The use of borrowed capital to increase the potential return of an investment. Leverage amplifies both gains and losses.',
    category: 'Investment',
    relatedTerms: ['Debt', 'Margin', 'Risk'],
  },
  // ============================================================================
  // M
  // ============================================================================
  {
    term: 'Management Fee',
    partOfSpeech: 'noun',
    definition: 'A fee charged by investment managers for managing an investment fund or portfolio. Typically calculated as a percentage of assets under management (AUM).',
    category: 'Investment',
    relatedTerms: ['Performance Fee', 'Expense Ratio', 'AUM'],
    platformContext: 'Ujamaa charges a 2% annual management fee on pool investments.',
  },
  {
    term: 'Maturity',
    partOfSpeech: 'noun',
    definition: 'The date on which a financial instrument (like a bond or loan) becomes due and the principal must be repaid to investors.',
    category: 'Investment',
    relatedTerms: ['Term', 'Redemption', 'Fixed Income'],
  },
  {
    term: 'Market Capitalization',
    partOfSpeech: 'noun',
    definition: 'The total value of a cryptocurrency or company, calculated by multiplying the current price by the total number of tokens or shares outstanding.',
    category: 'Investment',
    relatedTerms: ['Token', 'Valuation', 'Market Cap'],
  },
  {
    term: 'Metamask',
    partOfSpeech: 'proper noun',
    definition: 'A popular cryptocurrency wallet and browser extension that allows users to interact with Ethereum and EVM-compatible blockchains like Polygon.',
    category: 'Blockchain',
    relatedTerms: ['Wallet', 'Private Key', 'Web3'],
  },
  {
    term: 'Multi-chain',
    partOfSpeech: 'adjective',
    definition: 'Referring to systems, protocols, or applications that operate across multiple blockchain networks simultaneously.',
    category: 'Blockchain',
    relatedTerms: ['Interoperability', 'Bridge', 'Cross-Chain'],
  },
  // ============================================================================
  // N
  // ============================================================================
  {
    term: 'NAV (Net Asset Value)',
    pronunciation: 'N-A-V',
    partOfSpeech: 'noun',
    definition: 'The per-share value of a fund, calculated by dividing the total value of all assets in the fund by the number of shares outstanding. NAV is used to price fund shares.',
    category: 'Investment',
    relatedTerms: ['Valuation', 'Fund', 'Share Price'],
    platformContext: 'Ujamaa calculates NAV daily for each pool to determine share prices for investments and redemptions.',
  },
  {
    term: 'Node',
    partOfSpeech: 'noun',
    definition: 'A computer or device that participates in a blockchain network by maintaining a copy of the ledger and validating transactions.',
    category: 'Blockchain',
    relatedTerms: ['Validator', 'Full Node', 'Network'],
  },
  {
    term: 'Non-Performing Loan (NPL)',
    partOfSpeech: 'noun',
    definition: 'A loan where the borrower has failed to make scheduled payments for a specified period, typically 90 days or more. NPLs are considered distressed assets.',
    category: 'Investment',
    relatedTerms: ['Default', 'Default Risk', 'Distressed Asset'],
  },
  // ============================================================================
  // O
  // ============================================================================
  {
    term: 'Onboarding',
    partOfSpeech: 'noun',
    definition: 'The process of integrating new users into a platform or service. In finance, onboarding includes identity verification, compliance checks, and account setup.',
    category: 'Ujamaa Platform',
    relatedTerms: ['KYC', 'KYB', 'Registration'],
    platformContext: 'Ujamaa\'s onboarding flow includes personal information, document upload, and compliance verification.',
  },
  {
    term: 'Originator',
    partOfSpeech: 'noun',
    definition: 'See Industrial Operator. The industrial company that tokenizes assets to access financing from investors.',
    category: 'Ujamaa Platform',
    relatedTerms: ['Industrial Operator', 'Borrower', 'Manufacturer'],
  },
  // ============================================================================
  // P
  // ============================================================================
  {
    term: 'Pool',
    partOfSpeech: 'noun',
    definition: 'A collective investment vehicle where multiple investors contribute funds that are managed together for a specific purpose or investment strategy.',
    category: 'Ujamaa Platform',
    relatedTerms: ['Liquidity Pool', 'Investment Fund', 'Asset Class'],
    platformContext: 'Ujamaa offers five pool families: Industry, Agriculture, Trade Finance, Renewable Energy, and Real Estate.',
  },
  {
    term: 'Pool Family',
    partOfSpeech: 'noun',
    definition: 'A category or classification of investment pools that share similar characteristics, such as asset type, risk profile, or investment strategy.',
    category: 'Ujamaa Platform',
    relatedTerms: ['Pool', 'Asset Class', 'Diversification'],
    platformContext: 'Ujamaa\'s five pool families allow investors to diversify across different African economic sectors.',
  },
  {
    term: 'Performance Fee',
    partOfSpeech: 'noun',
    definition: 'A fee charged by investment managers based on the fund\'s performance, typically calculated as a percentage of returns above a specified benchmark or hurdle rate.',
    category: 'Investment',
    relatedTerms: ['Management Fee', 'Hurdle Rate', 'Incentive Fee'],
    platformContext: 'Ujamaa charges a 20% performance fee on yields exceeding the 5% hurdle rate.',
  },
  {
    term: 'Polygon',
    partOfSpeech: 'proper noun',
    definition: 'A Layer 2 scaling solution for Ethereum that provides faster and cheaper transactions while maintaining compatibility with Ethereum\'s ecosystem.',
    category: 'Blockchain',
    relatedTerms: ['Layer 2', 'Ethereum', 'Scaling'],
    platformContext: 'Ujamaa is deployed on Polygon for low-cost, fast transactions.',
  },
  {
    term: 'Private Key',
    partOfSpeech: 'noun',
    definition: 'A secret cryptographic key that allows users to access and control their cryptocurrency holdings. Private keys must be kept secure and never shared.',
    category: 'Blockchain',
    relatedTerms: ['Public Key', 'Wallet', 'Signature'],
  },
  {
    term: 'Proof of Stake (PoS)',
    partOfSpeech: 'noun',
    definition: 'A blockchain consensus mechanism where validators are chosen to create new blocks based on the number of tokens they hold and are willing to "stake" as collateral.',
    category: 'Blockchain',
    relatedTerms: ['Consensus', 'Validator', 'Staking'],
    platformContext: 'Polygon uses Proof of Stake, which is more energy-efficient than Proof of Work.',
  },
  {
    term: 'Prospectus',
    partOfSpeech: 'noun',
    definition: 'A formal legal document that provides details about an investment offering, including risks, financial information, and terms. Required for public securities offerings.',
    category: 'Legal',
    relatedTerms: ['Investment Memorandum', 'Disclosure', 'Regulation'],
  },
  // ============================================================================
  // R
  // ============================================================================
  {
    term: 'RWA (Real-World Asset)',
    pronunciation: 'R-W-A',
    partOfSpeech: 'noun',
    definition: 'Tangible or physical assets that exist outside of blockchain, such as real estate, commodities, art, or financial instruments. RWAs can be tokenized for on-chain trading.',
    category: 'Tokenization',
    relatedTerms: ['Tokenization', 'Asset Backing', 'Collateral'],
    platformContext: 'Ujamaa tokenizes African industrial and agricultural assets as RWAs.',
  },
  {
    term: 'Redemption',
    partOfSpeech: 'noun',
    definition: 'The process of withdrawing an investment by selling shares or tokens back to the fund or pool in exchange for the underlying value.',
    category: 'Investment',
    relatedTerms: ['Withdrawal', 'Liquidity', 'NAV'],
    platformContext: 'Ujamaa investors can redeem pool shares after the lock-up period ends.',
  },
  {
    term: 'Regulator',
    partOfSpeech: 'noun',
    definition: 'A government agency or authority responsible for overseeing and enforcing laws and regulations in a specific industry, such as financial services.',
    category: 'Compliance',
    relatedTerms: ['Compliance', 'Regulation', 'Oversight'],
    platformContext: 'Ujamaa provides regulators with read-only access to monitor platform activity.',
  },
  {
    term: 'Regulation',
    partOfSpeech: 'noun',
    definition: 'Rules and laws established by government authorities to govern business practices and protect consumers. Financial regulations ensure market integrity and investor protection.',
    category: 'Compliance',
    relatedTerms: ['Compliance', 'KYC', 'AML'],
  },
  {
    term: 'Retail Investor',
    partOfSpeech: 'noun',
    definition: 'An individual investor who buys and sells securities for personal accounts, typically in smaller amounts than institutional investors.',
    category: 'Investment',
    relatedTerms: ['Individual Investor', 'Institutional Investor', 'Accredited Investor'],
    platformContext: 'Ujamaa retail investors can invest between €1,000 and €99,999.',
  },
  {
    term: 'Risk Management',
    partOfSpeech: 'noun',
    definition: 'The process of identifying, assessing, and mitigating potential risks that could negatively impact an investment or business.',
    category: 'Investment',
    relatedTerms: ['Diversification', 'Hedging', 'Due Diligence'],
    platformContext: 'Ujamaa employs multiple risk management strategies including collateralization and GDIZ (Benin) certification.',
  },
  {
    term: 'Risk Level',
    partOfSpeech: 'noun',
    definition: 'A classification indicating the degree of uncertainty or potential for loss associated with an investment. Common levels are low, medium, and high.',
    category: 'Investment',
    relatedTerms: ['Risk Assessment', 'Volatility', 'Return'],
    platformContext: 'Ujamaa pools are classified as low, medium, or high risk based on asset class and collateral.',
  },
  {
    term: 'RPC (Remote Procedure Call)',
    pronunciation: 'R-P-C',
    partOfSpeech: 'noun',
    definition: 'A protocol that allows one computer to request a service from another computer over a network. In blockchain, RPC URLs are used to connect wallets to network nodes.',
    category: 'Blockchain',
    relatedTerms: ['Node', 'Endpoint', 'Network'],
    platformContext: 'Ujamaa uses Polygon\'s RPC endpoint: https://rpc-amoy.polygon.technology/',
  },
  // ============================================================================
  // S
  // ============================================================================
  {
    term: 'Sanctions',
    partOfSpeech: 'noun',
    definition: 'Economic or political restrictions imposed by countries or international bodies on specific nations, entities, or individuals. Sanctions prohibit or limit financial transactions.',
    category: 'Compliance',
    relatedTerms: ['OFAC', 'Compliance', 'Blocked Jurisdiction'],
    platformContext: 'Ujamaa blocks investors from sanctioned jurisdictions including Iran, North Korea, and Russia.',
  },
  {
    term: 'Securitization',
    partOfSpeech: 'noun',
    definition: 'The process of pooling various types of debt (like loans or mortgages) and selling them as securities to investors. This transforms illiquid assets into tradable securities.',
    category: 'Tokenization',
    relatedTerms: ['Tokenization', 'Bond', 'Structured Finance'],
  },
  {
    term: 'Smart Contract',
    partOfSpeech: 'noun',
    definition: 'A self-executing computer program stored on a blockchain that automatically enforces the terms of an agreement when predetermined conditions are met.',
    category: 'Blockchain',
    relatedTerms: ['Blockchain', 'Ethereum', 'Automation'],
    platformContext: 'Ujamaa uses smart contracts to automate pool management, yield distribution, and compliance.',
  },
  {
    term: 'Stablecoin',
    partOfSpeech: 'noun',
    definition: 'A cryptocurrency designed to maintain a stable value by being pegged to a reserve asset like a fiat currency (e.g., USD, EUR) or commodity.',
    category: 'DeFi Basics',
    relatedTerms: ['USDC', 'USDT', 'Peg'],
    platformContext: 'Ujamaa uses Ondo Finance\'s stablecoin infrastructure for EUR-backed tokens.',
  },
  {
    term: 'Staking',
    partOfSpeech: 'verb/noun',
    definition: 'The act of locking up cryptocurrency tokens to support a Proof of Stake blockchain network and earn rewards. Stakers help validate transactions and secure the network.',
    category: 'Blockchain',
    relatedTerms: ['Proof of Stake', 'Validator', 'Rewards'],
  },
  {
    term: 'Structured Finance',
    partOfSpeech: 'noun',
    definition: 'Complex financial instruments designed to transfer risk, pool assets, or create customized investment solutions. Often involves securitization and tranching.',
    category: 'Investment',
    relatedTerms: ['Securitization', 'Derivative', 'Tranche'],
  },
  {
    term: 'Share',
    partOfSpeech: 'noun',
    definition: 'A unit of ownership in a fund, company, or pool. Shares represent a proportional claim on the underlying assets and earnings.',
    category: 'Investment',
    relatedTerms: ['Equity', 'Ownership', 'NAV'],
    platformContext: 'Ujamaa pool shares are priced based on NAV and represent ownership in the pooled assets.',
  },
  // ============================================================================
  // T
  // ============================================================================
  {
    term: 'Token',
    partOfSpeech: 'noun',
    definition: 'A digital asset or unit of value issued on a blockchain. Tokens can represent various rights, including ownership, access, or utility within a specific ecosystem.',
    category: 'Blockchain',
    relatedTerms: ['Cryptocurrency', 'NFT', 'Utility Token'],
  },
  {
    term: 'Tokenization',
    partOfSpeech: 'noun',
    definition: 'The process of converting rights to a real-world asset into a digital token on a blockchain. Tokenization enables fractional ownership, increased liquidity, and easier transfer of assets.',
    category: 'Tokenization',
    relatedTerms: ['RWA', 'Blockchain', 'Fractional Ownership'],
    platformContext: 'Ujamaa tokenizes African industrial assets, allowing investors to buy shares as digital tokens.',
  },
  {
    term: 'Transaction Fee',
    partOfSpeech: 'noun',
    definition: 'A fee charged for processing a transaction on a blockchain network. Also known as gas fee on Ethereum and Polygon.',
    category: 'Blockchain',
    relatedTerms: ['Gas Fee', 'Network Fee', 'Miner Fee'],
  },
  {
    term: 'Transparency',
    partOfSpeech: 'noun',
    definition: 'The quality of being open, honest, and easily understood. In finance and blockchain, transparency refers to the availability of information about operations and transactions.',
    category: 'DeFi Basics',
    relatedTerms: ['Audit', 'Disclosure', 'Blockchain'],
    platformContext: 'Ujamaa provides transparent reporting on pool performance, asset certificates, and yield distribution.',
  },
  {
    term: 'Trust',
    partOfSpeech: 'noun',
    definition: 'A legal arrangement where a trustee holds and manages assets on behalf of beneficiaries. Trusts are used for estate planning, asset protection, and structured finance.',
    category: 'Legal',
    relatedTerms: ['Fiduciary', 'Custody', 'Escrow'],
  },
  {
    term: 'Term Sheet',
    partOfSpeech: 'noun',
    definition: 'A non-binding document that outlines the key terms and conditions of a proposed investment. Term sheets serve as a basis for drafting formal legal agreements.',
    category: 'Legal',
    relatedTerms: ['Investment Agreement', 'LOI', 'Structure'],
    platformContext: 'Ujamaa provides term sheets for each pool detailing investment terms, fees, and conditions.',
  },
  {
    term: 'Total Value Locked (TVL)',
    partOfSpeech: 'noun',
    definition: 'The total value of all assets deposited in a DeFi protocol or pool. TVL is a key metric for measuring the size and adoption of a DeFi platform.',
    category: 'DeFi Basics',
    relatedTerms: ['Liquidity', 'AUM', 'DeFi'],
  },
  // ============================================================================
  // U
  // ============================================================================
  {
    term: 'Ujamaa',
    pronunciation: 'Oo-Jah-Mah',
    partOfSpeech: 'proper noun',
    definition: 'A Swahili word meaning "familyhood" or "community," representing a philosophy of African socialism and economic cooperation. The term was popularized by Julius Nyerere, Tanzania\'s first president.',
    category: 'African Finance',
    relatedTerms: ['Africa', 'Community', 'Cooperation'],
    platformContext: 'Ujamaa DeFi Platform embodies the spirit of African economic cooperation through decentralized finance.',
  },
  {
    term: 'EUROD',
    pronunciation: 'U-J-Euro',
    partOfSpeech: 'proper noun',
    definition: 'The Euro-backed stablecoin token used within the Ujamaa platform for investments, yield distribution, and redemptions.',
    category: 'Ujamaa Platform',
    relatedTerms: ['Stablecoin', 'Token', 'EUR'],
    platformContext: 'All Ujamaa pool investments and yields are denominated in EUROD tokens.',
  },
  // ============================================================================
  // V
  // ============================================================================
  {
    term: 'Validator',
    partOfSpeech: 'noun',
    definition: 'A node or entity responsible for verifying and validating transactions on a blockchain network. Validators are rewarded with transaction fees or newly minted tokens.',
    category: 'Blockchain',
    relatedTerms: ['Proof of Stake', 'Consensus', 'Node'],
  },
  {
    term: 'Volatility',
    partOfSpeech: 'noun',
    definition: 'A statistical measure of the dispersion of returns for a given security or market index. High volatility means large price swings in either direction.',
    category: 'Investment',
    relatedTerms: ['Risk', 'Standard Deviation', 'Market Risk'],
  },
  {
    term: 'Vesting',
    partOfSpeech: 'noun',
    definition: 'A schedule that determines when an investor or employee gains full ownership of assets or tokens. Vesting schedules often include a cliff period before any tokens are released.',
    category: 'Investment',
    relatedTerms: ['Lock-up', 'Cliff', 'Schedule'],
  },
  // ============================================================================
  // W
  // ============================================================================
  {
    term: 'Wallet',
    partOfSpeech: 'noun',
    definition: 'A digital tool or application that allows users to store, send, and receive cryptocurrencies. Wallets manage private keys and interact with blockchain networks.',
    category: 'Blockchain',
    relatedTerms: ['Private Key', 'Metamask', 'Address'],
    example: 'Metamask, Trust Wallet, and Ledger are popular crypto wallets.',
  },
  {
    term: 'Web3',
    partOfSpeech: 'noun',
    definition: 'The next generation of the internet, built on blockchain technology, emphasizing decentralization, user ownership, and trustless interactions.',
    category: 'Blockchain',
    relatedTerms: ['Blockchain', 'DeFi', 'dApp'],
  },
  {
    term: 'Wire Transfer',
    partOfSpeech: 'noun',
    definition: 'An electronic method of transferring funds between individuals or entities across different banks or financial institutions, often used for large or international transactions.',
    category: 'Banking',
    relatedTerms: ['Bank Transfer', 'SWIFT', 'Cross-Border'],
    platformContext: 'Ujamaa accepts wire transfers for fiat on-ramping into the platform.',
  },
  {
    term: 'Withdrawal',
    partOfSpeech: 'noun',
    definition: 'The act of removing funds or assets from an investment account, pool, or platform. Withdrawals may be subject to lock-up periods or fees.',
    category: 'Investment',
    relatedTerms: ['Redemption', 'Liquidity', 'Lock-up'],
  },
  // ============================================================================
  // Y
  // ============================================================================
  {
    term: 'Yield',
    partOfSpeech: 'noun',
    definition: 'The income return on an investment, expressed as a percentage of the invested amount. Yield can come from interest, dividends, or capital gains.',
    category: 'Investment',
    relatedTerms: ['APY', 'APR', 'Return'],
    platformContext: 'Ujamaa pools generate yield from interest payments on financed African industrial assets.',
  },
  {
    term: 'Yield Farming',
    partOfSpeech: 'noun',
    definition: 'A DeFi strategy where users provide liquidity to protocols in exchange for rewards, typically in the form of additional tokens or fees.',
    category: 'DeFi Basics',
    relatedTerms: ['Liquidity Pool', 'Staking', 'Rewards'],
  },
  {
    term: 'Yield Distribution',
    partOfSpeech: 'noun',
    definition: 'The process of allocating earned yield or returns to investors, typically on a regular schedule (monthly, quarterly, or annually).',
    category: 'Investment',
    relatedTerms: ['Dividend', 'Interest Payment', 'Distribution'],
    platformContext: 'Ujamaa distributes yield to pool investors based on their share ownership and NAV.',
  },
  // ============================================================================
  // Z
  // ============================================================================
  {
    term: 'Zero-Knowledge Proof (ZK-Proof)',
    partOfSpeech: 'noun',
    definition: 'A cryptographic method that allows one party to prove they know a value or that a statement is true without revealing the actual value or any additional information.',
    category: 'Blockchain',
    relatedTerms: ['Privacy', 'Cryptography', 'ZK-Rollup'],
  },
  {
    term: 'Zone (Industrial/Economic Zone)',
    partOfSpeech: 'noun',
    definition: 'A designated geographic area with special economic regulations and incentives to promote industrial development, trade, and investment.',
    category: 'African Finance',
    relatedTerms: ['GDIZ (Benin)', 'Special Economic Zone', 'Industrial Park'],
    platformContext: 'Ujamaa works with assets located in GDIZ (Benin)-certified industrial zones across Africa.',
  },
];

const CATEGORIES: (Category | 'All')[] = [
  'All',
  'DeFi Basics',
  'Blockchain',
  'Tokenization',
  'Investment',
  'Compliance',
  'African Finance',
  'Ujamaa Platform',
  'Banking',
  'Legal',
];

const Glossary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedLetter, setSelectedLetter] = useState<string>('All');

  // Get all unique first letters
  const letters = useMemo(() => {
    const uniqueLetters = Array.from(
      new Set(GLOSSARY_DATA.map(item => item.term.charAt(0).toUpperCase()))
    ).sort();
    return ['All', ...uniqueLetters];
  }, []);

  // Filter glossary terms
  const filteredTerms = useMemo(() => {
    return GLOSSARY_DATA.filter((item) => {
      const matchesSearch =
        searchQuery === '' ||
        item.term.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.relatedTerms?.some(term =>
          term.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory =
        selectedCategory === 'All' || item.category === selectedCategory;

      const matchesLetter =
        selectedLetter === 'All' ||
        item.term.toUpperCase().startsWith(selectedLetter.toUpperCase());

      return matchesSearch && matchesCategory && matchesLetter;
    }).sort((a, b) => a.term.localeCompare(b.term));
  }, [searchQuery, selectedCategory, selectedLetter]);

  // Group terms by letter for display
  const groupedTerms = useMemo(() => {
    const groups: Record<string, GlossaryTerm[]> = {};
    filteredTerms.forEach((term) => {
      const letter = term.term.charAt(0).toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(term);
    });
    return groups;
  }, [filteredTerms]);

  const getCategoryColor = (category: Category): string => {
    const colors: Record<Category, string> = {
      'DeFi Basics': 'from-[#023D7A] to-[#00A8A8]',
      'Blockchain': 'from-[#48A9F0] to-[#023D7A]',
      'Tokenization': 'from-[#00A8A8] to-[#48A9F0]',
      'Investment': 'from-[#D57028] to-[#F59E0B]',
      'Compliance': 'from-[#023D7A] to-[#8B5B3D]',
      'African Finance': 'from-[#D57028] to-[#8B5B3D]',
      'Ujamaa Platform': 'from-[#00A8A8] to-[#023D7A]',
      'Banking': 'from-[#023D7A] to-[#48A9F0]',
      'Legal': 'from-[#8B5B3D] to-[#023D7A]',
    };
    return colors[category] || 'from-[#023D7A] to-[#00A8A8]';
  };

  return (
    <div className="min-h-screen bg-[#F3F8FA]">
      <Navigation />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white py-24">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h1 className="text-5xl font-extrabold mb-6">
            📖 Ujamaa DeFi Platform Glossary
          </h1>
          <p className="text-xl text-white/90 max-w-4xl mx-auto mb-8">
            Your comprehensive guide to DeFi, blockchain, tokenization, and African finance terminology.
            Understand every term used across the Ujamaa DeFi Platform.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-white/80">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {GLOSSARY_DATA.length} Terms
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              {CATEGORIES.length - 1} Categories
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.148" />
              </svg>
              Multi-language Friendly
            </span>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-white border-b border-[#48A9F0]/20">
        <div className="max-w-7xl mx-auto px-8">
          {/* Search Bar */}
          <div className="max-w-3xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for terms, definitions, or related concepts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full px-6 py-4 pl-14
                  bg-[#F3F8FA] hover:bg-[#F3F8FA] focus:bg-white
                  border border-[#48A9F0]/30 focus:border-[#00A8A8]
                  rounded-2xl
                  text-base
                  text-[#023D7A]
                  placeholder-[#333333]/60
                  transition-all duration-200
                  focus:outline-none focus:ring-2 focus:ring-[#00A8A8]/30
                "
              />
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-[#333333]/60"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#333333]/60 hover:text-[#023D7A]"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {CATEGORIES.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`
                  px-4 py-2 rounded-lg text-sm font-bold transition-all duration-200
                  ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-[#00A8A8] to-[#023D7A] text-white shadow-md'
                      : 'bg-[#F3F8FA] text-[#023D7A] hover:bg-[#023D7A]/10'
                  }
                `}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Alphabet Filter */}
          <div className="flex flex-wrap justify-center gap-1">
            {letters.map((letter) => (
              <button
                key={letter}
                onClick={() => setSelectedLetter(letter)}
                className={`
                  w-10 h-10 rounded-lg text-sm font-bold transition-all duration-200
                  ${
                    selectedLetter === letter
                      ? 'bg-[#023D7A] text-white shadow-md'
                      : 'bg-[#F3F8FA] text-[#023D7A] hover:bg-[#023D7A]/10'
                  }
                `}
              >
                {letter}
              </button>
            ))}
          </div>

          {/* Results Count */}
          <div className="text-center mt-8">
            <p className="text-[#023D7A] font-bold">
              {filteredTerms.length} {filteredTerms.length === 1 ? 'term' : 'terms'} found
              {searchQuery && (
                <span> for "<span className="text-[#00A8A8]">{searchQuery}</span>"</span>
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Glossary Terms */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-8">
          {Object.keys(groupedTerms).length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-20 h-20 mx-auto text-[#333333]/30 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-[#023D7A] mb-4">No terms found</h3>
              <p className="text-[#333333] mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedLetter('All');
                }}
                className="px-6 py-3 bg-gradient-to-r from-[#00A8A8] to-[#023D7A] text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            Object.entries(groupedTerms).map(([letter, terms]) => (
              <div key={letter} className="mb-16">
                {/* Letter Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-[#00A8A8] to-[#023D7A] flex items-center justify-center text-3xl font-extrabold text-white shadow-lg">
                    {letter}
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-[#00A8A8]/30 to-transparent" />
                </div>

                {/* Terms */}
                <div className="space-y-6">
                  {terms.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-2xl p-8 shadow-lg border border-[#48A9F0]/20 hover:shadow-xl hover:border-[#00A8A8]/40 transition-all duration-300"
                    >
                      {/* Term Header */}
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                        <div>
                          <h3 className="text-2xl font-extrabold text-[#023D7A] mb-1">
                            {item.term}
                          </h3>
                          {item.pronunciation && (
                            <p className="text-sm text-[#333333]/60 italic">
                              /{item.pronunciation}/
                            </p>
                          )}
                        </div>
                        <span className={`px-4 py-2 rounded-full text-xs font-bold text-white bg-gradient-to-r ${getCategoryColor(item.category)}`}>
                          {item.category}
                        </span>
                      </div>

                      {/* Part of Speech */}
                      <p className="text-sm text-[#00A8A8] font-bold mb-3">
                        {item.partOfSpeech}
                      </p>

                      {/* Definition */}
                      <p className="text-[#333333] leading-relaxed mb-4">
                        {item.definition}
                      </p>

                      {/* Example */}
                      {item.example && (
                        <div className="bg-[#F3F8FA] border-l-4 border-[#00A8A8] pl-4 pr-4 py-3 rounded-r-lg mb-4">
                          <p className="text-sm text-[#023D7A]">
                            <span className="font-bold">Example:</span> {item.example}
                          </p>
                        </div>
                      )}

                      {/* Platform Context */}
                      {item.platformContext && (
                        <div className="bg-gradient-to-r from-[#023D7A]/5 to-[#00A8A8]/5 border border-[#00A8A8]/30 rounded-xl p-4 mb-4">
                          <p className="text-sm text-[#023D7A]">
                            <span className="font-bold">🔷 Ujamaa Context:</span> {item.platformContext}
                          </p>
                        </div>
                      )}

                      {/* Related Terms */}
                      {item.relatedTerms && item.relatedTerms.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-[#333333]/60 font-medium">Related:</span>
                          {item.relatedTerms.map((related, idx) => (
                            <button
                              key={idx}
                              onClick={() => setSearchQuery(related)}
                              className="text-sm text-[#00A8A8] hover:text-[#023D7A] hover:underline transition-colors"
                            >
                              {related}
                              {idx < item.relatedTerms!.length - 1 && ','}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Quick Reference Footer */}
      <section className="py-16 bg-gradient-to-r from-[#023D7A] to-[#00A8A8] text-white">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Top Categories */}
            <div>
              <h3 className="text-xl font-bold mb-4">📌 Top Categories</h3>
              <ul className="space-y-2">
                {['DeFi Basics', 'Blockchain', 'Investment', 'Tokenization'].map((cat) => (
                  <li key={cat}>
                    <button
                      onClick={() => setSelectedCategory(cat as Category)}
                      className="text-white/90 hover:text-white hover:underline transition-colors text-left"
                    >
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-xl font-bold mb-4">📚 Related Resources</h3>
              <ul className="space-y-2">
                <li>
                  <a href="/deep-dive" className="text-white/90 hover:text-white hover:underline transition-colors">
                    Deep Dive Documentation
                  </a>
                </li>
                <li>
                  <a href="/investors-room" className="text-white/90 hover:text-white hover:underline transition-colors">
                    Investors Room
                  </a>
                </li>
                <li>
                  <a href="/docs/white-paper" className="text-white/90 hover:text-white hover:underline transition-colors">
                    White Paper
                  </a>
                </li>
              </ul>
            </div>

            {/* Need Help */}
            <div>
              <h3 className="text-xl font-bold mb-4">❓ Need Help?</h3>
              <p className="text-white/90 mb-4">
                Can't find what you're looking for? Our support team is here to help.
              </p>
              <a
                href="/select-role"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#023D7A] font-bold rounded-lg hover:bg-[#F3F8FA] transition-colors"
              >
                Contact Support
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </a>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="text-center pt-8 border-t border-white/20">
            <p className="text-white/80 mb-4">
              Ready to put your knowledge into practice?
            </p>
            <a
              href="/select-role"
              className="inline-flex items-center gap-3 px-8 py-4 bg-white text-[#023D7A] font-bold rounded-lg hover:bg-[#F3F8FA] transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              🚀 Start Your Investment Journey
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Glossary;
