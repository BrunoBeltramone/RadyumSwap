import { CONFIG } from './config';
import { 
  PublicKey,
  LAMPORTS_PER_SOL,
  Transaction,
  VersionedTransaction,
} from '@solana/web3.js';
import { RaydiumSwap } from './raydium-swap';

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

async function sendTransaction(raydiumSwap: RaydiumSwap, swapTx: Transaction | VersionedTransaction) {
  const latestBlockhash = await raydiumSwap.connection.getLatestBlockhash();
  let txid: string;
  if (swapTx instanceof VersionedTransaction) {
    txid = await raydiumSwap.sendVersionedTransaction(swapTx, latestBlockhash.blockhash, latestBlockhash.lastValidBlockHeight);
  } else {
    txid = await raydiumSwap.sendLegacyTransaction(swapTx);
  }
  console.log(`Transaction sent, signature: ${txid}`);
  console.log(`Transaction executed: https://explorer.solana.com/tx/${txid}`);
}

async function swap() {
  try {
    console.log('Starting swap process...');
    const raydiumSwap = new RaydiumSwap(CONFIG.RPC_URL, CONFIG.WALLET_SECRET_KEY);

    await raydiumSwap.loadPoolKeys();
    const poolInfo = raydiumSwap.findPoolInfoForTokens(CONFIG.QUOTE_MINT, CONFIG.BASE_MINT) 
      || await raydiumSwap.findRaydiumPoolInfo(CONFIG.QUOTE_MINT, CONFIG.BASE_MINT);

    if (!poolInfo) {
      throw new Error("Couldn't find the pool info");
    }

    console.log('Fetching current priority fee...');
    const priorityFee = await CONFIG.getPriorityFee();
    console.log(`Current priority fee: ${priorityFee} SOL`);

    const totalBalance = await getTokenBalance(raydiumSwap, CONFIG.QUOTE_MINT);
    console.log(`Total balance of token: ${totalBalance}`);

    let amountToSell;
    if (CONFIG.SELL_BY_PERCENTAGE) {
      amountToSell = (totalBalance * CONFIG.PERCENTAGE_TO_SELL) / 100;
      console.log(`Selling ${CONFIG.PERCENTAGE_TO_SELL}% of total balance: ${amountToSell}`);
    } else {
      amountToSell = CONFIG.TOKEN_A_AMOUNT;
      console.log(`Selling fixed amount: ${amountToSell}`);
    }

    console.log('Creating swap transaction...');
    const swapTx = await raydiumSwap.getSwapTransaction(
      CONFIG.QUOTE_MINT,
      amountToSell,
      poolInfo,
      CONFIG.USE_VERSIONED_TRANSACTION,
      CONFIG.SLIPPAGE
    );

    console.log(`Using priority fee: ${priorityFee} SOL`);
    console.log(`Transaction signed with payer: ${raydiumSwap.wallet.publicKey.toBase58()}`);
    console.log(`Swapping ${amountToSell} BONK for SOL`);

    if (CONFIG.EXECUTE_SWAP) {
      await sendTransaction(raydiumSwap, swapTx);
    } else {
      console.log('Simulating transaction (dry run)');
      try {
        let simulationResult;
        if (CONFIG.USE_VERSIONED_TRANSACTION) {
          if (!(swapTx instanceof VersionedTransaction)) {
            throw new Error('Expected a VersionedTransaction but received a different type');
          }
          simulationResult = await raydiumSwap.simulateVersionedTransaction(swapTx);
        } else {
          if (!(swapTx instanceof Transaction)) {
            throw new Error('Expected a Transaction but received a different type');
          }
          simulationResult = await raydiumSwap.simulateLegacyTransaction(swapTx);
        }
        console.log('Simulation successful');
        console.log('Simulated transaction details:');
        console.log(`Logs:`, simulationResult.logs);
        console.log(`Units consumed:`, simulationResult.unitsConsumed);
        if (simulationResult.returnData) {
          console.log(`Return data:`, simulationResult.returnData);
        }
      } catch (error) {
        console.error('Error simulating transaction:', error);
      }
    }
  } catch (error) {
    console.error('An error occurred during the swap process:');
    console.error(error);
  }
}

swap().catch((error) => {
  console.error('An error occurred during the swap process:');
  console.error(error);
});