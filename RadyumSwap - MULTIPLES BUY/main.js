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
// ... código existente ...
// Array de criptomonedas disponibles para comprar
var availableCryptos = [{
        name: "Bonk",
        address: "DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263"
    }, {
        name: "Pyth",
        address: "HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3"
    }, {
        name: "Jupiter",
        address: "JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN"
    }, {
        name: "Grass",
        address: "Grass7B4RdKfBCjTKgSqnXkqjwiGvQyFbuSCUJr3XXjs"
    },];
// Función para obtener una criptomoneda al azar
function getRandomCrypto() {
    var randomIndex = Math.floor(Math.random() * availableCryptos.length);
    return availableCryptos[randomIndex].address;
}
// Función para realizar el swap para una billetera específica
function performSwapForWallet(walletSecretKey, crypto) {
    return __awaiter(this, void 0, void 0, function () {
        var raydiumSwap, poolInfo, _a, priorityFee, swapTx, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 10, , 11]);
                    raydiumSwap = new raydium_swap_1.RaydiumSwap(config_1.CONFIG.RPC_URL, walletSecretKey);
                    return [4 /*yield*/, raydiumSwap.loadPoolKeys()];
                case 1:
                    _b.sent();
                    _a = raydiumSwap.findPoolInfoForTokens(config_1.CONFIG.BASE_MINT, crypto);
                    if (_a) return [3 /*break*/, 3];
                    return [4 /*yield*/, raydiumSwap.findRaydiumPoolInfo(config_1.CONFIG.BASE_MINT, crypto)];
                case 2:
                    _a = (_b.sent());
                    _b.label = 3;
                case 3:
                    poolInfo = _a;
                    if (!poolInfo) {
                        throw new Error("Couldn't find the pool info");
                    }
                    return [4 /*yield*/, raydiumSwap.createWrappedSolAccountInstruction(config_1.CONFIG.TOKEN_A_AMOUNT)];
                case 4:
                    _b.sent();
                    return [4 /*yield*/, config_1.CONFIG.getPriorityFee()];
                case 5:
                    priorityFee = _b.sent();
                    console.log("Current priority fee: ".concat(priorityFee, " SOL"));
                    return [4 /*yield*/, raydiumSwap.getSwapTransaction(crypto, config_1.CONFIG.TOKEN_A_AMOUNT, poolInfo, config_1.CONFIG.USE_VERSIONED_TRANSACTION, config_1.CONFIG.SLIPPAGE)];
                case 6:
                    swapTx = _b.sent();
                    if (!config_1.CONFIG.EXECUTE_SWAP) return [3 /*break*/, 8];
                    return [4 /*yield*/, sendTransaction(raydiumSwap, swapTx)];
                case 7:
                    _b.sent();
                    return [3 /*break*/, 9];
                case 8:
                    console.log('Simulating transaction (dry run)');
                    _b.label = 9;
                case 9: return [3 /*break*/, 11];
                case 10:
                    error_1 = _b.sent();
                    console.error('An error occurred during the swap process:');
                    console.error(error_1);
                    return [3 /*break*/, 11];
                case 11: return [2 /*return*/];
            }
        });
    });
}
// Función para recorrer las carteras y realizar compras
function swap() {
    return __awaiter(this, void 0, void 0, function () {
        var i, walletSecretKey, crypto_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    i = 0;
                    _a.label = 1;
                case 1:
                    if (!(i <= 3)) return [3 /*break*/, 4];
                    walletSecretKey = process.env["WALLET".concat(i, "_SECRET_KEY")];
                    if (!walletSecretKey) {
                        console.warn("Cartera ".concat(i, " no est\u00E1 configurada correctamente en las variables de entorno"));
                        return [3 /*break*/, 3];
                    }
                    crypto_1 = getRandomCrypto();
                    console.log("Comprando ".concat(crypto_1, " para la cartera ").concat(i));
                    return [4 /*yield*/, performSwapForWallet(walletSecretKey, crypto_1)];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Llamar a la función para procesar las carteras
swap().catch(function (error) {
    console.error('Ocurrió un error al procesar las carteras:', error);
});
// ... código existente ...
