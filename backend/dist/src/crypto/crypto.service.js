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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CryptoService = void 0;
const common_1 = require("@nestjs/common");
const argon2 = __importStar(require("argon2"));
const crypto = __importStar(require("crypto"));
let CryptoService = class CryptoService {
    encryptionKey;
    constructor() {
        const rawKey = process.env.TOTP_ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
        if (rawKey.length === 64 && /^[0-9a-fA-F]+$/.test(rawKey)) {
            this.encryptionKey = Buffer.from(rawKey, 'hex');
        }
        else {
            this.encryptionKey = crypto.createHash('sha256').update(rawKey).digest();
        }
    }
    async hashPassword(password) {
        return argon2.hash(password, {
            type: argon2.argon2id,
        });
    }
    async verifyPassword(hash, plain) {
        return argon2.verify(hash, plain);
    }
    encrypt(plaintext) {
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        const tag = cipher.getAuthTag();
        return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
    }
    decrypt(encryptedPayload) {
        const parts = encryptedPayload.split(':');
        if (parts.length !== 3) {
            throw new Error('Invalid encrypted payload format');
        }
        const [ivHex, tagHex, ciphertextHex] = parts;
        const iv = Buffer.from(ivHex, 'hex');
        const tag = Buffer.from(tagHex, 'hex');
        const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, iv);
        decipher.setAuthTag(tag);
        let decrypted = decipher.update(ciphertextHex, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        return decrypted;
    }
};
exports.CryptoService = CryptoService;
exports.CryptoService = CryptoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], CryptoService);
//# sourceMappingURL=crypto.service.js.map