# TOTP Key Migration Inspection Report

## A. Algorithm Used
**Algorithm:** `AES-256-GCM` (Advanced Encryption Standard, 256-bit key, Galois/Counter Mode).

## B. Encryption Key Source
**Source:** The key is obtained from `process.env.TOTP_ENCRYPTION_KEY`. 
If it is a valid 64-character hexadecimal string, it is directly converted into a 32-byte Buffer. If it is any other format, it is hashed via SHA-256 to consistently derive a valid 32-byte key.

## C. Fallback Behavior
**Missing Key:** If `process.env.TOTP_ENCRYPTION_KEY` is missing entirely, `crypto.service.ts` gracefully but insecurely falls back to a hardcoded 64-character string:
`0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef`.

## D. Database Field
**Field:** `twoFactorSecretEncrypted` (Type: `String?`) on the `Admin` model in `backend/prisma/schema.prisma`.

## E. Storage Format
**Format:** String containing exactly three colon-separated hexadecimal segments: 
`{ivHex}:{tagHex}:{ciphertextHex}`.
(e.g., Initialization Vector : Authentication Tag : Encrypted Payload).

## F. Decryption & Re-encryption Feasibility
**Feasibility:** **YES.** Because AES-256-GCM is symmetric, a script can read the stored string from the database, split it by colons, and decrypt it back to the raw TOTP plaintext using the hardcoded fallback key. Once the plaintext is in memory, it can be immediately re-encrypted using the new production key and saved back to the database. The user's original TOTP secret (and their authenticator app) remains entirely unchanged.

## G. Staging Testability
**Testability:** **YES.** We can safely write the migration script and test it directly on the Supabase staging database first, verifying that admins can still log in using their 2FA apps after the key rollover.

## H. Required Code for Migration
**Code Requirements:** We need a standalone Node.js/Prisma script that:
1. Instantiates two versions of the AES-256-GCM cipher logic: one hardcoded with the legacy fallback key, and one using the new `process.env.TOTP_ENCRYPTION_KEY`.
2. Queries `prisma.admin.findMany({ where: { twoFactorSecretEncrypted: { not: null } } })`.
3. Iterates over the results, decrypting with the old key and encrypting with the new key.
4. Executes a `prisma.admin.update` to save the new string.
5. Employs a `try/catch` block that skips records that fail decryption (protecting against running the script twice).

## I. Impact on Disabled Accounts
**Impact:** **NONE.** Admin accounts that do not have 2FA enabled have a `null` value in the `twoFactorSecretEncrypted` column. The script will simply skip them, and changing the environment variable will not affect their ability to log in.

## J. Risks and Assumptions
1. **Downtime/Race Condition:** If an admin attempts to log in while the migration script is running but before the production backend restarts with the new key, authentication could momentarily fail.
2. **Double Execution Risk:** If the script runs twice, it will attempt to decrypt already-migrated secrets using the old key. **Mitigation:** AES-GCM includes an authentication tag. Decrypting with the wrong key mathematically guarantees an exception is thrown, preventing silent data corruption.
3. **Backup Assumption:** It assumes a database snapshot is taken prior to running the script.

## Final Classification
**SAFE TO DESIGN STAGING MIGRATION**
