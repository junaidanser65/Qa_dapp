import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const MetaMaskConnect = ({ onConnect }) => {
  const [account, setAccount] = useState('');
  const [error, setError] = useState('');

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        setError('Please install MetaMask to use this app');
        return;
      }

      // Request account access
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      // Check if we're on Sepolia
      const network = await provider.getNetwork();
      if (network.chainId !== 11155111n) { // 11155111 is Sepolia's chain ID
        try {
          // Try to switch to Sepolia
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }], // 0xaa36a7 is Sepolia's chain ID in hex
          });
        } catch (switchError) {
          // If Sepolia is not added to MetaMask, add it
          if (switchError.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [{
                  chainId: '0xaa36a7',
                  chainName: 'Sepolia',
                  nativeCurrency: {
                    name: 'SepoliaETH',
                    symbol: 'SEP',
                    decimals: 18
                  },
                  rpcUrls: ['https://sepolia.infura.io/v3/'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io']
                }]
              });
            } catch (addError) {
              setError('Failed to add Sepolia network to MetaMask');
              return;
            }
          } else {
            setError('Failed to switch to Sepolia network');
            return;
          }
        }
      }

      setAccount(accounts[0]);
      onConnect(provider);
      setError('');
    } catch (err) {
      setError('Failed to connect to MetaMask');
      console.error(err);
    }
  };

  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        setAccount(accounts[0] || '');
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="metamask-connect">
      {!account ? (
        <button onClick={connectWallet} className="connect-button">
          Connect MetaMask
        </button>
      ) : (
        <div className="account-info">
          Connected: {account.slice(0, 6)}...{account.slice(-4)}
        </div>
      )}
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default MetaMaskConnect; 