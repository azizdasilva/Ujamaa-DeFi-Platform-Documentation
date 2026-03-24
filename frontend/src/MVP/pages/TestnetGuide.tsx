/**
 * Testnet Guide Page
 * 
 * Complete guide for connecting MetaMask and using the Ujamaa DeFi Platform
 * on Polygon Amoy Testnet.
 * 
 * Route: /testnet-guide
 */

import React from 'react';
import MVPBanner from '../components/MVPBanner';
import TestnetNotice from '../components/TestnetNotice';
import Card from '../components/Card';
import Badge from '../components/Badge';
import Button from '../components/Button';

const TestnetGuide: React.FC = () => {
  const steps = [
    {
      number: '1',
      title: 'Install MetaMask',
      description: 'Download and install the MetaMask wallet browser extension',
      icon: '🦊',
      link: 'https://metamask.io/download/',
      linkText: 'Download MetaMask',
    },
    {
      number: '2',
      title: 'Create a Wallet',
      description: 'Set up your wallet and securely store your seed phrase',
      icon: '🔐',
      warning: 'Never share your seed phrase with anyone!',
    },
    {
      number: '3',
      title: 'Add Polygon Amoy Network',
      description: 'Configure your wallet to connect to Polygon Amoy Testnet',
      icon: '🌐',
      details: [
        { label: 'Network Name', value: 'Polygon Amoy Testnet' },
        { label: 'RPC URL', value: 'https://rpc-amoy.polygon.technology/' },
        { label: 'Chain ID', value: '80002' },
        { label: 'Currency Symbol', value: 'POL' },
        { label: 'Block Explorer', value: 'https://amoy.polygonscan.com/' },
      ],
    },
    {
      number: '4',
      title: 'Get Test POL',
      description: 'Request free test POL tokens from the faucet',
      icon: '💰',
      link: 'https://faucet.polygon.technology/',
      linkText: 'Open Faucet',
    },
    {
      number: '5',
      title: 'Connect to Ujamaa',
      description: 'Click "Connect MetaMask" to link your wallet to the platform',
      icon: '🔗',
    },
    {
      number: '6',
      title: 'Start Investing',
      description: 'Browse pools and make test investments with no real money',
      icon: '📈',
    },
  ];

  const faqs = [
    {
      question: 'What is Polygon Amoy Testnet?',
      answer: 'Polygon Amoy is a test blockchain network that mimics the main Polygon network. It allows developers and users to test applications without using real money. All tokens and transactions are fake and only for testing purposes.',
    },
    {
      question: 'Are my investments real?',
      answer: 'No! This is a TESTNET deployment. All investments, yields, and tokens are simulated. No real money is involved. This is purely for demonstration and testing purposes.',
    },
    {
      question: 'How do I get test POL tokens?',
      answer: 'You can get free test POL tokens from the Polygon faucet at https://faucet.polygon.technology/. Simply enter your wallet address and request tokens. You should receive them within seconds.',
    },
    {
      question: 'Can I withdraw my investments?',
      answer: 'Since this is a testnet, you cannot withdraw to real bank accounts. However, you can "redeem" your test investments to receive test tokens back to your wallet, which have no real-world value.',
    },
    {
      question: 'Will this move to mainnet?',
      answer: 'Yes! After thorough testing on testnet, Ujamaa will deploy to Polygon Mainnet (Chain ID: 137) with real stablecoins (UJEUR), real bank integrations, and actual investment opportunities.',
    },
    {
      question: 'Is MetaMask safe?',
      answer: 'MetaMask is a widely-used, reputable wallet with over 30 million users. However, always download it from the official website (metamask.io), never share your seed phrase, and be cautious of phishing sites.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MVPBanner />

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Testnet Setup Guide</h1>
              <p className="text-gray-600 mt-1">Connect MetaMask and start testing</p>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="success" size="md">Polygon Amoy</Badge>
              <TestnetNotice variant="badge" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {/* Testnet Info Banner */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">🚀 Ujamaa DeFi Platform - Testnet MVP</h2>
              <p className="text-blue-700 mb-4">
                Welcome to the Ujamaa DeFi Platform testnet! This is a safe environment to learn about 
                real-world asset tokenization and DeFi investing without any financial risk.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-600">Network</p>
                  <p className="font-bold text-gray-900">Polygon Amoy</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-600">Chain ID</p>
                  <p className="font-bold text-gray-900">80002</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-600">Currency</p>
                  <p className="font-bold text-gray-900">POL (Test)</p>
                </div>
                <div className="bg-white rounded-lg p-3">
                  <p className="text-xs text-gray-600">Explorer</p>
                  <p className="font-bold text-gray-900">Polygonscan</p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Setup Steps */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">📋 Setup Steps</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step) => (
              <Card key={step.number} className="relative overflow-hidden">
                {/* Step Number */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-green-100 to-transparent rounded-bl-full -mr-4 -mt-4" />
                <div className="absolute top-4 right-4 text-4xl font-bold text-green-200">
                  {step.number}
                </div>

                {/* Icon */}
                <div className="w-14 h-14 bg-green-500 rounded-xl flex items-center justify-center text-white mb-4">
                  <span className="text-3xl">{step.icon}</span>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600 mb-4">{step.description}</p>

                {/* Details */}
                {step.details && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    {step.details.map((detail, idx) => (
                      <div key={idx} className="flex justify-between py-1 text-sm">
                        <span className="text-gray-600">{detail.label}:</span>
                        <span className="font-mono font-medium text-gray-900">{detail.value}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Warning */}
                {step.warning && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800 font-medium">⚠️ {step.warning}</p>
                  </div>
                )}

                {/* Link */}
                {step.link && (
                  <a
                    href={step.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-medium"
                  >
                    {step.linkText}
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </Card>
            ))}
          </div>
        </section>

        {/* Network Configuration */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🌐 Network Configuration</h2>
          <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Manual Configuration</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Network Name</label>
                    <input
                      type="text"
                      value="Polygon Amoy Testnet"
                      readOnly
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">RPC URL</label>
                    <input
                      type="text"
                      value="https://rpc-amoy.polygon.technology/"
                      readOnly
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Chain ID</label>
                    <input
                      type="text"
                      value="80002"
                      readOnly
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-4">Currency & Explorer</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm text-gray-600">Currency Symbol</label>
                    <input
                      type="text"
                      value="POL"
                      readOnly
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-600">Block Explorer</label>
                    <input
                      type="text"
                      value="https://amoy.polygonscan.com/"
                      readOnly
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-mono"
                    />
                  </div>
                  <div className="pt-4">
                    <Button
                      variant="primary"
                      onClick={() => window.open('https://faucet.polygon.technology/', '_blank')}
                      className="w-full"
                    >
                      💰 Get Test POL Tokens
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </section>

        {/* FAQs */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">❓ Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <Card key={idx}>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Need Help */}
        <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center text-white flex-shrink-0">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-green-900 mb-2">Need Help?</h3>
              <p className="text-green-700 mb-4">
                If you're having trouble setting up MetaMask or connecting to the testnet, 
                check the MetaMask documentation or contact our support team.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => window.open('https://support.metamask.io/', '_blank')}
                >
                  MetaMask Support
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => window.location.href = '/investors-room'}
                >
                  Back to Investors Room
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="mt-12 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            🚀 MVP: Testnet Guide - Polygon Amoy (Chain ID: 80002) • No Real Funds
          </p>
        </div>
      </footer>
    </div>
  );
};

export default TestnetGuide;
