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
var node_fetch_1 = require("node-fetch");
// Global MCP server URL from environment variable
var MCP_SERVER_URL = process.env.MCP_SERVER_URL || 'http://localhost:4001/mcp';
// Wrap the code in an async function
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var addResponse, addResult, queryResponse, contexts, latestResponse, latestContext, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    console.log("Connecting to MCP server at: ".concat(MCP_SERVER_URL));
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(MCP_SERVER_URL, "/add"), {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({
                                key: "test",
                                value: "from REPL",
                                metadata: {
                                    source: "test-script",
                                    timestamp: Date.now()
                                }
                            })
                        })];
                case 1:
                    addResponse = _a.sent();
                    if (!addResponse.ok) {
                        throw new Error("Failed to add to MCP: ".concat(addResponse.statusText));
                    }
                    return [4 /*yield*/, addResponse.json()];
                case 2:
                    addResult = _a.sent();
                    console.log("✅ Memory added:", addResult);
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(MCP_SERVER_URL, "/query?key=test"))];
                case 3:
                    queryResponse = _a.sent();
                    if (!queryResponse.ok) {
                        throw new Error("Failed to query MCP: ".concat(queryResponse.statusText));
                    }
                    return [4 /*yield*/, queryResponse.json()];
                case 4:
                    contexts = _a.sent();
                    console.log("✅ Contexts fetched:", contexts);
                    return [4 /*yield*/, (0, node_fetch_1.default)("".concat(MCP_SERVER_URL, "/latest?key=test"))];
                case 5:
                    latestResponse = _a.sent();
                    if (!latestResponse.ok) {
                        throw new Error("Failed to get latest memory: ".concat(latestResponse.statusText));
                    }
                    return [4 /*yield*/, latestResponse.json()];
                case 6:
                    latestContext = _a.sent();
                    console.log("✅ Latest context:", latestContext);
                    return [3 /*break*/, 8];
                case 7:
                    error_1 = _a.sent();
                    console.error("❌ Error:", error_1 instanceof Error ? error_1.message : 'Unknown error');
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Run the main function
main();
