import { CONFIG } from './config';
import { RaydiumSwap } from './raydium-swap';
import { PublicKey } from '@solana/web3.js';

async function getTokenBalance(raydiumSwap: RaydiumSwap, mint: string): Promise<number> {
  const userTokenAccounts = await raydiumSwap.getOwnerTokenAccounts();
  const tokenAccount = userTokenAccounts.find(account => 
    account.accountInfo.mint.equals(new PublicKey(mint))
  );
  if (tokenAccount) {
    const balance = await raydiumSwap.connection.getTokenAccountBalance(tokenAccount.pubkey);
    return balance.value.uiAmount || 0;
  }
  return 0;
}

async function checkTokenBalance() {
  try {
    const raydiumSwap = new RaydiumSwap(CONFIG.RPC_URL, CONFIG.WALLET_SECRET_KEY);
    const tokenBalance = await getTokenBalance(raydiumSwap, CONFIG.QUOTE_MINT);
    const tokenSolBalance = await getTokenBalance(raydiumSwap, CONFIG.BASE_MINT);
    console.log(`Balance of token ${CONFIG.QUOTE_MINT}: ${tokenBalance}`);
    console.log(`Balance of Sol token ${CONFIG.BASE_MINT}: ${tokenSolBalance}`);
  } catch (error) {
    console.error('Error fetching token balance:', error);
  }
}

// Llamada a la función checkTokenBalance
checkTokenBalance();