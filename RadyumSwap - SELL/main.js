"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var config_1 = require("./config");
var web3_js_1 = require("@solana/web3.js");
var raydium_swap_1 = require("./raydium-swap");
function getTokenBalance(raydiumSwap, mint) {
    return __awaiter(this, void 0, void 0, function () {
        var userTokenAccounts, tokenAccount, balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, raydiumSwap.getOwnerTokenAccounts()];
                case 1:
                    userTokenAccounts = _a.sent();
                    tokenAccount = userTokenAccounts.find(function (account) {
                        return account.accountInfo.mint.equals(new web3_js_1.PublicKey(mint));
                    });
                    if (!tokenAccount) return [3 /*break*/, 3];
                    return [4 /*yield*/, raydiumSwap.connection.getTokenAccountBalance(tokenAccount.pubkey)];
                case 2:
                    balance = _a.sent();
                    return [2 /*return*/, balance.value.uiAmount || 0];
                case 3: return [2 /*return*/, 0];
            }
        });
    });
}
function sendTransaction(raydiumSwap, swapTx) {
    return __awaiter(this, void 0, void 0, function () {
        var latestBlockhash, txid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, raydiumSwap.connection.getLatestBlockhash()];
                case 1:
                    latestBlockhash = _a.sent();
                    if (!(swapTx instanceof web3_js_1.VersionedTransaction)) return [3 /*break*/, 3];
                    return [4 /*yield*/, raydiumSwap.sendVersionedTransaction(swapTx, latestBlockhash.blockhash, latestBlockhash.lastValidBlockHeight)];
                case 2:
                    txid = _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, raydiumSwap.sendLegacyTransaction(swapTx)];
                case 4:
                    txid = _a.sent();
                    _a.label = 5;
                case 5:
                    console.log("Transaction sent, signature: ".concat(txid));
                    console.log("Transaction executed: https://explorer.solana.com/tx/".concat(txid));
                    return [2 /*return*/];
            }
        });
    });
}
function swap() {
    return __awaiter(this, void 0, void 0, function () {
        var raydiumSwap, poolInfo, _a, priorityFee, totalBalance, amountToSell, swapTx, simulationResult, error_1, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 16, , 17]);
                    console.log('Starting swap process...');
                    raydiumSwap = new raydium_swap_1.RaydiumSwap(config_1.CONFIG.RPC_URL, config_1.CONFIG.WALLET_SECRET_KEY);
                    return [4 /*yield*/, raydiumSwap.loadPoolKeys()];
                case 1:
                    _b.sent();
                    _a = raydiumSwap.findPoolInfoForTokens(config_1.CONFIG.QUOTE_MINT, config_1.CONFIG.BASE_MINT);
                    if (_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, raydiumSwap.findRaydiumPoolInfo(config_1.CONFIG.QUOTE_MINT, config_1.CONFIG.BASE_MINT)];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3:
                    poolInfo = _a;
                    if (!poolInfo) {
                        throw new Error("Couldn't find the pool info");
                    }
                    console.log('Fetching current priority fee...');
                    return [4 /*yield*/, config_1.CONFIG.getPriorityFee()];
                case 4:
                    priorityFee = _b.sent();
                    console.log("Current priority fee: ".concat(priorityFee, " SOL"));
                    return [4 /*yield*/, getTokenBalance(raydiumSwap, config_1.CONFIG.QUOTE_MINT)];
                case 5:
                    totalBalance = _b.sent();
                    console.log("Total balance of token: ".concat(totalBalance));
                    amountToSell = void 0;
                    if (config_1.CONFIG.SELL_BY_PERCENTAGE) {
                        amountToSell = (totalBalance * config_1.CONFIG.PERCENTAGE_TO_SELL) / 100;
                        console.log("Selling ".concat(config_1.CONFIG.PERCENTAGE_TO_SELL, "% of total balance: ").concat(amountToSell));
                    }
                    else {
                        amountToSell = config_1.CONFIG.TOKEN_A_AMOUNT;
                        console.log("Selling fixed amount: ".concat(amountToSell));
                    }
                    console.log('Creating swap transaction...');
                    return [4 /*yield*/, raydiumSwap.getSwapTransaction(config_1.CONFIG.QUOTE_MINT, amountToSell, poolInfo, config_1.CONFIG.USE_VERSIONED_TRANSACTION, config_1.CONFIG.SLIPPAGE)];
                case 6:
                    swapTx = _b.sent();
                    console.log("Using priority fee: ".concat(priorityFee, " SOL"));
                    console.log("Transaction signed with payer: ".concat(raydiumSwap.wallet.publicKey.toBase58()));
                    console.log("Swapping ".concat(amountToSell, " BONK for SOL"));
                    if (!config_1.CONFIG.EXECUTE_SWAP) return [3 /*break*/, 8];
                    return [4 /*yield*/, sendTransaction(raydiumSwap, swapTx)];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 15];
                case 8:
                    console.log('Simulating transaction (dry run)');
                    _b.label = 9;
                case 9:
                    _b.trys.push([9, 14, , 15]);
                    simulationResult = void 0;
                    if (!config_1.CONFIG.USE_VERSIONED_TRANSACTION) return [3 /*break*/, 11];
                    if (!(swapTx instanceof web3_js_1.VersionedTransaction)) {
                        throw new Error('Expected a VersionedTransaction but received a different type');
                    }
                    return [4 /*yield*/, raydiumSwap.simulateVersionedTransaction(swapTx)];
                case 10:
                    simulationResult = _b.sent();
                    return [3 /*break*/, 13];
                case 11:
                    if (!(swapTx instanceof web3_js_1.Transaction)) {
                        throw new Error('Expected a Transaction but received a different type');
                    }
                    return [4 /*yield*/, raydiumSwap.simulateLegacyTransaction(swapTx)];
                case 12:
                    simulationResult = _b.sent();
                    _b.label = 13;
                case 13:
                    console.log('Simulation successful');
                    console.log('Simulated transaction details:');
                    console.log("Logs:", simulationResult.logs);
                    console.log("Units consumed:", simulationResult.unitsConsumed);
                    if (simulationResult.returnData) {
                        console.log("Return data:", simulationResult.returnData);
                    }
                    return [3 /*break*/, 15];
                case 14:
                    error_1 = _b.sent();
                    console.error('Error simulating transaction:', error_1);
                    return [3 /*break*/, 15];
                case 15: return [3 /*break*/, 17];
                case 16:
                    error_2 = _b.sent();
                    console.error('An error occurred during the swap process:');
                    console.error(error_2);
                    return [3 /*break*/, 17];
                case 17: return [2 /*return*/];
            }
        });
    });
}
swap().catch(function (error) {
    console.error('An error occurred during the swap process:');
    console.error(error);
});
