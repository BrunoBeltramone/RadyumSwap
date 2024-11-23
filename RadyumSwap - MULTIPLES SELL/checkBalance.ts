import { CONFIG } from './config';
import { RaydiumSwap } from './raydium-swap';
import { PublicKey } from '@solana/web3.js';

async function getAllTokenBalances(raydiumSwap: RaydiumSwap): Promise<{ mint: string, balance: number }[]> {
  const userTokenAccounts = await raydiumSwap.getOwnerTokenAccounts();
  const balances = await Promise.all(userTokenAccounts.map(async (account) => {
    const balance = await raydiumSwap.connection.getTokenAccountBalance(account.pubkey);
    return {
      mint: account.accountInfo.mint.toString(),
      balance: balance.value.uiAmount || 0
    };
  }));
  return balances;
}

async function checkAllTokenBalances() {
  try {
    const raydiumSwap = new RaydiumSwap(CONFIG.RPC_URL, CONFIG.WALLET_SECRET_KEY);
    const allBalances = await getAllTokenBalances(raydiumSwap);
    allBalances.forEach(({ mint, balance }) => {
      console.log(`Balance of token ${mint}: ${balance}`);
    });
  } catch (error) {
    console.error('Error fetching all token balances:', error);
  }
}

// Llamada a la función checkAllTokenBalances
checkAllTokenBalances();