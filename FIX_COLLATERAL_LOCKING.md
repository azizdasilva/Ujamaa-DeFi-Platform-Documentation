# Fix for 500 Error: Collateral Locking Failed

## Problem
The API was returning a 500 error with message `Collateral locking failed: ('execution reverted', '0x')` when trying to lock collateral on-chain. This error provided no useful information about why the contract reverted.

## Changes Made

### 1. Improved Error Handling in `blockchain_service.py`
**File:** `backend/services/blockchain_service.py` - `_build_and_send_tx()` method

**Changes:**
- Added try-catch around gas estimation to detect contract reverts BEFORE sending the transaction
- Added explicit check for transaction status after receipt
- Better error messages that distinguish between:
  - Gas estimation failures (contract would revert)
  - On-chain transaction failures
  - Other execution errors

**Expected Output:**
```
❌ Gas estimation failed: execution reverted: TokenNotFound
```
Instead of just:
```
('execution reverted', '0x')
```

### 2. Improved Error Handling in `originator.py`
**File:** `backend/api/originator.py` - financing request endpoint

**Changes:**
- Added specific exception handling for `ValueError` (contract reverts)
- Added specific exception handling for `HTTPException` (validation errors)
- Better error messages mapped to appropriate HTTP status codes:
  - 400 for contract reverts (client error - invalid request)
  - 500 for unexpected errors (server error)

### 3. Added Pre-Flight Checks
**File:** `backend/api/originator.py`

**Changes:**
- Before attempting to lock collateral, the code now verifies:
  1. Token exists on-chain (`ownerOf(tokenId)` returns non-zero address)
  2. Token status is UNLOCKED (status == 0)
  3. Deployer address is authorized (either token owner or has MINTER_ROLE)

**Expected Output:**
```
✅ Pre-flight checks passed: Token #123 owned by 0xABC..., status UNLOCKED
```
Or if there's an issue:
```
❌ Smart contract reverted: Token #123 is LOCKED on-chain (must be UNLOCKED)
```

## Common Causes of This Error

Based on the smart contract code, the `lockCollateral` function will revert if:

1. **Token Not Found** - `_ownerOf(tokenId) == address(0)`
   - The uGT token ID doesn't exist on-chain
   - **Solution:** Verify the token was minted correctly

2. **Token Already Locked** - `guarantee.status != CollateralStatus.UNLOCKED`
   - The token is already locked as collateral or in another state
   - **Solution:** Check the token's current status and use appropriate action

3. **Unauthorized Caller** - `!isOwner && !isMinter`
   - The deployer wallet is neither the token owner nor has MINTER_ROLE
   - **Solution:** Either:
     - Transfer token ownership to the deployer address
     - Grant MINTER_ROLE to the deployer address
     - Use the token owner's wallet to call the function

4. **Invalid Pool Address** - `poolAddress == address(0)`
   - GUARANTEE_TOKENIZER contract address not configured
   - **Solution:** Set `CONTRACT_GUARANTEE_TOKENIZER` in `.env`

5. **Invalid Financing ID** - `financingId == 0`
   - Should not occur with current implementation (uses timestamp)

## Testing

After these changes, when you submit a financing request:

1. **If successful:**
   ```
   ✅ Pre-flight checks passed: Token #123 owned by 0xABC..., status UNLOCKED
   ✅ Collateral locked on-chain: 0x123...
   ```

2. **If token is already locked:**
   ```
   ❌ Smart contract reverted: Token #123 is LOCKED on-chain (must be UNLOCKED)
   ```

3. **If unauthorized:**
   ```
   ❌ Smart contract reverted: Deployer 0xDEF... is not authorized to lock token #123. Must be owner (0xABC...) or have MINTER_ROLE
   ```

4. **If token doesn't exist:**
   ```
   ❌ Smart contract reverted: Token #123 does not exist on-chain
   ```

## Next Steps

1. Restart your backend server to apply these changes
2. Try the financing request again
3. Check the backend console logs for the detailed error message
4. Based on the error, take appropriate action (see "Common Causes" above)

## Files Modified
- `backend/services/blockchain_service.py` - Better error handling in `_build_and_send_tx()`
- `backend/api/originator.py` - Pre-flight checks and improved error handling
