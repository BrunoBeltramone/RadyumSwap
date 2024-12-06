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
exports.CONFIG = void 0;
var dotenv = require("dotenv");
var https = require("https");
dotenv.config();
if (!process.env.QUICKNODE_URL) {
    throw new Error('QUICKNODE_URL is not set in the environment variables');
}
if (!process.env.WALLET0_SECRET_KEY) {
    throw new Error('WALLET0_SECRET_KEY is not set in the environment variables');
}
function httpsRequest(url, options, data) {
    return new Promise(function (resolve, reject) {
        var req = https.request(url, options, function (res) {
            var body = '';
            res.on('data', function (chunk) { return body += chunk.toString(); });
            res.on('end', function () { return resolve(body); });
        });
        req.on('error', reject);
        req.write(data);
        req.end();
    });
}
function fetchPriorityFee() {
    return __awaiter(this, void 0, void 0, function () {
        var url, options, requestBody, response, data, extremePriorityFeePerCU, estimatedComputeUnits, totalPriorityFeeInMicroLamports, priorityFeeInSOL;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!process.env.QUICKNODE_URL) {
                        throw new Error('QUICKNODE_URL is not set in the environment variables');
                    }
                    url = new URL(process.env.QUICKNODE_URL);
                    options = {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    };
                    requestBody = JSON.stringify({
                        jsonrpc: '2.0',
                        id: 1,
                        method: 'qn_estimatePriorityFees',
                        params: {
                            last_n_blocks: 100,
                            account: 'CzFW47ygysstRH6v6PygQAkp44GpuNdvAJ38LgELGA5e',
                            api_version: 2
                        }
                    });
                    return [4 /*yield*/, httpsRequest(url.href, options, requestBody)];
                case 1:
                    response = _a.sent();
                    data = JSON.parse(response);
                    if (!isPriorityFeeResponse(data)) {
                        throw new Error('Unexpected response format from priority fee API');
                    }
                    extremePriorityFeePerCU = data.result.per_compute_unit.extreme;
                    estimatedComputeUnits = 300000;
                    totalPriorityFeeInMicroLamports = extremePriorityFeePerCU * estimatedComputeUnits;
                    priorityFeeInSOL = totalPriorityFeeInMicroLamports / 1e15;
                    // Ensure the fee is not less than 0.000001 SOL (minimum fee)
                    return [2 /*return*/, Math.max(priorityFeeInSOL, 0.000001)];
            }
        });
    });
}
function isPriorityFeeResponse(data) {
    return (typeof data === 'object' &&
        data !== null &&
        'jsonrpc' in data &&
        'result' in data &&
        typeof data.result === 'object' &&
        data.result !== null &&
        'per_compute_unit' in data.result &&
        typeof data.result.per_compute_unit === 'object' &&
        data.result.per_compute_unit !== null &&
        'extreme' in data.result.per_compute_unit &&
        typeof data.result.per_compute_unit.extreme === 'number');
}
exports.CONFIG = {
    RPC_URL: process.env.QUICKNODE_URL,
    WALLET0_SECRET_KEY: process.env.WALLET0_SECRET_KEY,
    BASE_MINT: 'So11111111111111111111111111111111111111112', // SOLANA mint address
    QUOTE_MINT: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263', // BONK mint address
    TOKEN_A_AMOUNT: 0.000001,
    EXECUTE_SWAP: true,
    USE_VERSIONED_TRANSACTION: false,
    SLIPPAGE: 5,
    getPriorityFee: fetchPriorityFee,
};
