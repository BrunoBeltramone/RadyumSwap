"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.RaydiumSwap = void 0;
var web3_js_1 = require("@solana/web3.js");
var raydium_sdk_1 = require("@raydium-io/raydium-sdk");
var anchor_1 = require("@project-serum/anchor");
var base58 = require("bs58");
var fs_1 = require("fs");
var promises_1 = require("fs/promises");
var spl_token_1 = require("@solana/spl-token");
var config_1 = require("./config");
var RaydiumSwap = /** @class */ (function () {
    function RaydiumSwap(RPC_URL, WALLET0_SECRET_KEY) {
        this.allPoolKeysJson = [];
        if (!RPC_URL.startsWith('http://') && !RPC_URL.startsWith('https://')) {
            throw new Error('Invalid RPC URL. Must start with http:// or https://');
        }
        this.connection = new web3_js_1.Connection(RPC_URL, 'confirmed');
        try {
            if (!WALLET0_SECRET_KEY) {
                throw new Error('WALLET0_SECRET_KEY is not provided');
            }
            var secretKey = base58.decode(WALLET0_SECRET_KEY);
            if (secretKey.length !== 64) {
                throw new Error('Invalid secret key length. Expected 64 bytes.');
            }
            this.wallet = new anchor_1.Wallet(web3_js_1.Keypair.fromSecretKey(secretKey));
            console.log('Wallet initialized with public key:', this.wallet.publicKey.toBase58());
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error("Failed to create wallet: ".concat(error.message));
            }
            else {
                throw new Error('Failed to create wallet: Unknown error');
            }
        }
    }
    RaydiumSwap.prototype.loadPoolKeys = function () {
        return __awaiter(this, void 0, void 0, function () {
            var data, _a, _b, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _c.trys.push([0, 3, , 4]);
                        if (!(0, fs_1.existsSync)('mainnet.json')) return [3 /*break*/, 2];
                        _b = (_a = JSON).parse;
                        return [4 /*yield*/, (0, promises_1.readFile)('mainnet.json')];
                    case 1:
                        data = _b.apply(_a, [(_c.sent()).toString()]);
                        this.allPoolKeysJson = data.official;
                        return [2 /*return*/];
                    case 2: throw new Error('mainnet.json file not found');
                    case 3:
                        error_1 = _c.sent();
                        this.allPoolKeysJson = [];
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    RaydiumSwap.prototype.findPoolInfoForTokens = function (mintA, mintB) {
        var poolData = this.allPoolKeysJson.find(function (i) { return (i.baseMint === mintA && i.quoteMint === mintB) || (i.baseMint === mintB && i.quoteMint === mintA); });
        return poolData ? (0, raydium_sdk_1.jsonInfo2PoolKeys)(poolData) : null;
    };
    RaydiumSwap.prototype.getProgramAccounts = function (baseMint, quoteMint) {
        return __awaiter(this, void 0, void 0, function () {
            var layout;
            return __generator(this, function (_a) {
                layout = raydium_sdk_1.LIQUIDITY_STATE_LAYOUT_V4;
                return [2 /*return*/, this.connection.getProgramAccounts(new web3_js_1.PublicKey(RaydiumSwap.RAYDIUM_V4_PROGRAM_ID), {
                        filters: [
                            { dataSize: layout.span },
                            {
                                memcmp: {
                                    offset: layout.offsetOf('baseMint'),
                                    bytes: new web3_js_1.PublicKey(baseMint).toBase58(),
                                },
                            },
                            {
                                memcmp: {
                                    offset: layout.offsetOf('quoteMint'),
                                    bytes: new web3_js_1.PublicKey(quoteMint).toBase58(),
                                },
                            },
                        ],
                    })];
            });
        });
    };
    RaydiumSwap.prototype.findRaydiumPoolInfo = function (baseMint, quoteMint) {
        return __awaiter(this, void 0, void 0, function () {
            var layout, programData, collectedPoolResults, pool, market, authority, marketProgramId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        layout = raydium_sdk_1.LIQUIDITY_STATE_LAYOUT_V4;
                        return [4 /*yield*/, this.getProgramAccounts(baseMint, quoteMint)];
                    case 1:
                        programData = _a.sent();
                        collectedPoolResults = programData
                            .map(function (info) { return (__assign({ id: new web3_js_1.PublicKey(info.pubkey), version: 4, programId: new web3_js_1.PublicKey(RaydiumSwap.RAYDIUM_V4_PROGRAM_ID) }, layout.decode(info.account.data))); })
                            .flat();
                        pool = collectedPoolResults[0];
                        if (!pool)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, this.connection.getAccountInfo(pool.marketId).then(function (item) {
                                if (!item) {
                                    throw new Error('Market account not found');
                                }
                                return __assign({ programId: item.owner }, raydium_sdk_1.MARKET_STATE_LAYOUT_V3.decode(item.data));
                            })];
                    case 2:
                        market = _a.sent();
                        authority = raydium_sdk_1.Liquidity.getAssociatedAuthority({
                            programId: new web3_js_1.PublicKey(RaydiumSwap.RAYDIUM_V4_PROGRAM_ID),
                        }).publicKey;
                        marketProgramId = market.programId;
                        return [2 /*return*/, {
                                id: pool.id,
                                baseMint: pool.baseMint,
                                quoteMint: pool.quoteMint,
                                lpMint: pool.lpMint,
                                baseDecimals: Number.parseInt(pool.baseDecimal.toString()),
                                quoteDecimals: Number.parseInt(pool.quoteDecimal.toString()),
                                lpDecimals: Number.parseInt(pool.baseDecimal.toString()),
                                version: pool.version,
                                programId: pool.programId,
                                openOrders: pool.openOrders,
                                targetOrders: pool.targetOrders,
                                baseVault: pool.baseVault,
                                quoteVault: pool.quoteVault,
                                marketVersion: 3,
                                authority: authority,
                                marketProgramId: marketProgramId,
                                marketId: market.ownAddress,
                                marketAuthority: raydium_sdk_1.Market.getAssociatedAuthority({
                                    programId: marketProgramId,
                                    marketId: market.ownAddress,
                                }).publicKey,
                                marketBaseVault: market.baseVault,
                                marketQuoteVault: market.quoteVault,
                                marketBids: market.bids,
                                marketAsks: market.asks,
                                marketEventQueue: market.eventQueue,
                                withdrawQueue: pool.withdrawQueue,
                                lpVault: pool.lpVault,
                                lookupTableAccount: web3_js_1.PublicKey.default,
                            }];
                }
            });
        });
    };
    RaydiumSwap.prototype.getOwnerTokenAccounts = function () {
        return __awaiter(this, void 0, void 0, function () {
            var walletTokenAccount;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.getTokenAccountsByOwner(this.wallet.publicKey, {
                            programId: raydium_sdk_1.TOKEN_PROGRAM_ID,
                        })];
                    case 1:
                        walletTokenAccount = _a.sent();
                        return [2 /*return*/, walletTokenAccount.value.map(function (i) { return ({
                                pubkey: i.pubkey,
                                programId: i.account.owner,
                                accountInfo: raydium_sdk_1.SPL_ACCOUNT_LAYOUT.decode(i.account.data),
                            }); })];
                }
            });
        });
    };
    RaydiumSwap.prototype.getSwapSide = function (poolKeys, wantFrom, wantTo) {
        if (poolKeys.baseMint.equals(wantFrom) && poolKeys.quoteMint.equals(wantTo)) {
            return "in";
        }
        else if (poolKeys.baseMint.equals(wantTo) && poolKeys.quoteMint.equals(wantFrom)) {
            return "out";
        }
        else {
            throw new Error("Not suitable pool fetched. Can't determine swap side");
        }
    };
    RaydiumSwap.prototype.getSwapTransaction = function (toToken_1, amount_1, poolKeys_1) {
        return __awaiter(this, arguments, void 0, function (toToken, amount, poolKeys, useVersionedTransaction, slippage) {
            var poolInfo, fromToken, swapSide, baseToken, quoteToken, currencyIn, currencyOut, amountIn, slippagePercent, _a, amountOut, minAmountOut, userTokenAccounts, priorityFee, swapTransaction, recentBlockhashForSwap, instructions, versionedTransaction, legacyTransaction;
            if (useVersionedTransaction === void 0) { useVersionedTransaction = true; }
            if (slippage === void 0) { slippage = 5; }
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, raydium_sdk_1.Liquidity.fetchInfo({ connection: this.connection, poolKeys: poolKeys })];
                    case 1:
                        poolInfo = _b.sent();
                        fromToken = poolKeys.baseMint.toString() === spl_token_1.NATIVE_MINT.toString() ? spl_token_1.NATIVE_MINT.toString() : poolKeys.quoteMint.toString();
                        swapSide = this.getSwapSide(poolKeys, new web3_js_1.PublicKey(fromToken), new web3_js_1.PublicKey(toToken));
                        baseToken = new raydium_sdk_1.Token(raydium_sdk_1.TOKEN_PROGRAM_ID, poolKeys.baseMint, poolInfo.baseDecimals);
                        quoteToken = new raydium_sdk_1.Token(raydium_sdk_1.TOKEN_PROGRAM_ID, poolKeys.quoteMint, poolInfo.quoteDecimals);
                        currencyIn = swapSide === "in" ? baseToken : quoteToken;
                        currencyOut = swapSide === "in" ? quoteToken : baseToken;
                        amountIn = new raydium_sdk_1.TokenAmount(currencyIn, amount, false);
                        slippagePercent = new raydium_sdk_1.Percent(slippage, 100);
                        _a = raydium_sdk_1.Liquidity.computeAmountOut({
                            poolKeys: poolKeys,
                            poolInfo: poolInfo,
                            amountIn: amountIn,
                            currencyOut: currencyOut,
                            slippage: slippagePercent,
                        }), amountOut = _a.amountOut, minAmountOut = _a.minAmountOut;
                        return [4 /*yield*/, this.getOwnerTokenAccounts()];
                    case 2:
                        userTokenAccounts = _b.sent();
                        return [4 /*yield*/, config_1.CONFIG.getPriorityFee()];
                    case 3:
                        priorityFee = _b.sent();
                        console.log("Using priority fee: ".concat(priorityFee, " SOL"));
                        return [4 /*yield*/, raydium_sdk_1.Liquidity.makeSwapInstructionSimple({
                                connection: this.connection,
                                makeTxVersion: useVersionedTransaction ? 0 : 1,
                                poolKeys: __assign({}, poolKeys),
                                userKeys: {
                                    tokenAccounts: userTokenAccounts,
                                    owner: this.wallet.publicKey,
                                },
                                amountIn: amountIn,
                                amountOut: minAmountOut,
                                fixedSide: swapSide,
                                config: {
                                    bypassAssociatedCheck: false,
                                },
                                computeBudgetConfig: {
                                    units: 300000,
                                    microLamports: Math.floor(priorityFee * web3_js_1.LAMPORTS_PER_SOL),
                                },
                            })];
                    case 4:
                        swapTransaction = _b.sent();
                        return [4 /*yield*/, this.connection.getLatestBlockhash()];
                    case 5:
                        recentBlockhashForSwap = _b.sent();
                        instructions = swapTransaction.innerTransactions[0].instructions.filter(function (instruction) { return Boolean(instruction); });
                        if (useVersionedTransaction) {
                            versionedTransaction = new web3_js_1.VersionedTransaction(new web3_js_1.TransactionMessage({
                                payerKey: this.wallet.publicKey,
                                recentBlockhash: recentBlockhashForSwap.blockhash,
                                instructions: instructions,
                            }).compileToV0Message());
                            versionedTransaction.sign([this.wallet.payer]);
                            console.log('Versioned transaction signed with payer:', this.wallet.payer.publicKey.toBase58());
                            return [2 /*return*/, versionedTransaction];
                        }
                        legacyTransaction = new web3_js_1.Transaction({
                            blockhash: recentBlockhashForSwap.blockhash,
                            lastValidBlockHeight: recentBlockhashForSwap.lastValidBlockHeight,
                            feePayer: this.wallet.publicKey,
                        });
                        legacyTransaction.add.apply(legacyTransaction, instructions);
                        console.log('Legacy transaction signed with payer:', this.wallet.payer.publicKey.toBase58());
                        return [2 /*return*/, legacyTransaction];
                }
            });
        });
    };
    RaydiumSwap.prototype.sendLegacyTransaction = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var signature, latestBlockhash, confirmationStrategy, confirmation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.sendTransaction(tx, [this.wallet.payer], {
                            skipPreflight: true,
                            preflightCommitment: 'confirmed',
                        })];
                    case 1:
                        signature = _a.sent();
                        console.log('Legacy transaction sent, signature:', signature);
                        return [4 /*yield*/, this.connection.getLatestBlockhash()];
                    case 2:
                        latestBlockhash = _a.sent();
                        confirmationStrategy = {
                            signature: signature,
                            blockhash: latestBlockhash.blockhash,
                            lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
                        };
                        return [4 /*yield*/, this.connection.confirmTransaction(confirmationStrategy, 'confirmed')];
                    case 3:
                        confirmation = _a.sent();
                        if (confirmation.value.err) {
                            throw new Error("Transaction failed: ".concat(confirmation.value.err.toString()));
                        }
                        return [2 /*return*/, signature];
                }
            });
        });
    };
    RaydiumSwap.prototype.sendVersionedTransaction = function (tx, blockhash, lastValidBlockHeight) {
        return __awaiter(this, void 0, void 0, function () {
            var rawTransaction, signature, confirmationStrategy, confirmation;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        rawTransaction = tx.serialize();
                        return [4 /*yield*/, this.connection.sendRawTransaction(rawTransaction, {
                                skipPreflight: true,
                                preflightCommitment: 'confirmed',
                            })];
                    case 1:
                        signature = _a.sent();
                        console.log('Versioned transaction sent, signature:', signature);
                        confirmationStrategy = {
                            signature: signature,
                            blockhash: blockhash,
                            lastValidBlockHeight: lastValidBlockHeight,
                        };
                        return [4 /*yield*/, this.connection.confirmTransaction(confirmationStrategy, 'confirmed')];
                    case 2:
                        confirmation = _a.sent();
                        if (confirmation.value.err) {
                            throw new Error("Transaction failed: ".concat(confirmation.value.err.toString()));
                        }
                        return [2 /*return*/, signature];
                }
            });
        });
    };
    RaydiumSwap.prototype.simulateLegacyTransaction = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.simulateTransaction(tx)];
                    case 1:
                        value = (_a.sent()).value;
                        return [2 /*return*/, value];
                }
            });
        });
    };
    RaydiumSwap.prototype.simulateVersionedTransaction = function (tx) {
        return __awaiter(this, void 0, void 0, function () {
            var value;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.connection.simulateTransaction(tx)];
                    case 1:
                        value = (_a.sent()).value;
                        return [2 /*return*/, value];
                }
            });
        });
    };
    RaydiumSwap.prototype.getTokenAccountByOwnerAndMint = function (mint) {
        return {
            programId: raydium_sdk_1.TOKEN_PROGRAM_ID,
            pubkey: web3_js_1.PublicKey.default,
            accountInfo: {
                mint: mint,
                amount: 0,
            },
        };
    };
    RaydiumSwap.prototype.createWrappedSolAccountInstruction = function (amount) {
        return __awaiter(this, void 0, void 0, function () {
            var lamports, wrappedSolAccount, transaction, rentExemptBalance;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        lamports = amount * web3_js_1.LAMPORTS_PER_SOL;
                        wrappedSolAccount = web3_js_1.Keypair.generate();
                        transaction = new web3_js_1.Transaction();
                        return [4 /*yield*/, (0, spl_token_1.getMinimumBalanceForRentExemptAccount)(this.connection)];
                    case 1:
                        rentExemptBalance = _a.sent();
                        transaction.add(web3_js_1.SystemProgram.createAccount({
                            fromPubkey: this.wallet.publicKey,
                            newAccountPubkey: wrappedSolAccount.publicKey,
                            lamports: rentExemptBalance,
                            space: 165,
                            programId: raydium_sdk_1.TOKEN_PROGRAM_ID,
                        }), (0, spl_token_1.createInitializeAccountInstruction)(wrappedSolAccount.publicKey, spl_token_1.NATIVE_MINT, this.wallet.publicKey), web3_js_1.SystemProgram.transfer({
                            fromPubkey: this.wallet.publicKey,
                            toPubkey: wrappedSolAccount.publicKey,
                            lamports: lamports,
                        }), (0, spl_token_1.createSyncNativeInstruction)(wrappedSolAccount.publicKey));
                        return [2 /*return*/, { transaction: transaction, wrappedSolAccount: wrappedSolAccount }];
                }
            });
        });
    };
    RaydiumSwap.RAYDIUM_V4_PROGRAM_ID = '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8';
    return RaydiumSwap;
}());
exports.RaydiumSwap = RaydiumSwap;
