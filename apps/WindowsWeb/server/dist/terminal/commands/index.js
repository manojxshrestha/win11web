"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.whoami = exports.systeminfo = void 0;
// Export all command implementations
__exportStar(require("./filesystem"), exports);
__exportStar(require("./network"), exports);
__exportStar(require("./process"), exports);
// Export system commands - hostname is exported from network.ts
var system_1 = require("./system");
Object.defineProperty(exports, "systeminfo", { enumerable: true, get: function () { return system_1.systeminfo; } });
Object.defineProperty(exports, "whoami", { enumerable: true, get: function () { return system_1.whoami; } });
__exportStar(require("./utility"), exports);
//# sourceMappingURL=index.js.map