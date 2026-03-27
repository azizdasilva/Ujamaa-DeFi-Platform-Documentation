# UJAMAA DeFi Nomenclature

**Author:** Aziz Da Silva - Lead Architect
**Version:** 1.0 (English Translation)
**Date:** March 17, 2026
**Status:** Approved
**Source:** `09_NOMENCLATURE_NAMES.md` (v1.1 - French)
**Translation:** Complete English version

---

## 1. Tokens

### 1.1 Principal Token (Platform)

| Token | Full Name | Symbol | Type | Usage |
|-------|-----------|--------|------|-------|
| **uLP** | Ujamaa Liquidity Provider Token | $uLP$ | Yield-bearing | Liquidity pool share |
| **UJAMAA** | Ujamaa Governance Token | $UJAMAA$ | Governance | Governance (future) |

### 1.2 Tokens by Asset Family

**Format:** `Ujamaa Token [Family]`

| Family | Token Name | Symbol | Code | Example |
|--------|------------|--------|------|---------|
| **RWA** | Ujamaa Token Real World Asset | uRWA | `RWA` | Ujamaa Token RWA - GDIZ Invoice #001 |
| **IND** | Ujamaa Token Industry | uIND | `IND` | Ujamaa Token Industry - Factory Lomé |
| **AGR** | Ujamaa Token Agriculture | uAGR | `AGR` | Ujamaa Token Agriculture - Cotton Pool |
| **MIN** | Ujamaa Token Mining | uMIN | `MIN` | Ujamaa Token Mining - Gold Mine |
| **ENER** | Ujamaa Token Energy | uENER | `ENER` | Ujamaa Token Energy - Solar Farm |
| **RE** | Ujamaa Token Real Estate | uRE | `RE` | Ujamaa Token Real Estate - Abidjan Tower |
| **INFRA** | Ujamaa Token Infrastructure | uINFRA | `INFRA` | Ujamaa Token Infrastructure - Toll Road |

### 1.3 Specific Tokens (Individual Assets)

**Format:** `Ujamaa Token [Family] - [Asset Name]`

**Examples:**
- `Ujamaa Token RWA - GDIZ Invoice #001`
- `Ujamaa Token AGR - Cotton Burkina 2026`
- `Ujamaa Token IND - Factory Lomé III`
- `Ujamaa Token RE - Abidjan Commercial Center`

### 1.4 Supported Stablecoins

| Stablecoin | Name | Symbol | Blockchain |
|------------|------|--------|------------|
| EUR Coin | Ondo EUROD | $EUROD$ | Polygon |
| USD Coin | Ondo Finance USDC | $USDC$ | Polygon |
| CFA Coin (future) | BCEAO CFA Coin | $CFAC$ | Polygon |

---

## 2. Smart Contracts

### 2.1 Smart Contract Naming Conventions

**⚠️ IMPORTANT:** Smart contract naming follows consistent patterns based on token type:

| Contract Category | Naming Pattern | Example | Token Created |
|-------------------|----------------|---------|---------------|
| **Asset Tokenizers** | `[Asset]Tokenizer.sol` | `IndustryTokenizer.sol` | UAT series (fungible, asset-specific) |
| **Pool Tokens** | `[Name]Token.sol` | `ULPToken.sol` | uLP series (fungible, pool-based) |
| **NFT Contracts** | `[Name]NFT.sol` or `[Name]Token.sol` | `UjamaaNFT.sol`, `GuaranteeToken.sol` | NFTs (non-fungible) |
| **Supporting Contracts** | `[Function].sol` | `LiquidityPool.sol`, `ComplianceModule.sol` | N/A (no direct minting) |

**Key Distinction:**
- **"Tokenizer"** = Asset-specific factory that mints UAT tokens
- **"Token"** = Pool token contract (uLP) OR NFT contract
- **No "Tokenizer"** = Supporting infrastructure (pool management, compliance, etc.)

---

### 2.2 Principal Contracts (Core)

| Contract | Full Name | Pattern | Role |
|----------|-----------|---------|------|
| `ULPToken.sol` | Ujamaa Liquidity Provider Token | ERC-3643 + UUPS | Principal yield-bearing token |
| `LiquidityPool.sol` | Ujamaa Liquidity Pool Manager | AccessControl | Pool management |
| `PoolFactory.sol` | Ujamaa Pool Factory | Factory | Creation of new pools |

### 2.2 Family-Specific Contracts (Asset-Specific)

**Format:** `[Family]Tokenizer.sol`

| Contract | Family | Standard | Usage |
|----------|--------|----------|-------|
| `UjamaaAssetTokenizer.sol (Token Factory) (formerly RWATokenizer.sol)` | Real World Asset | ERC-3643 | RWA asset tokenization |
| `IndustryTokenizer.sol` | Industry | ERC-3643 | Industrial asset tokenization |
| `AgricultureTokenizer.sol` | Agriculture | ERC-3643 | Agricultural asset tokenization |
| `MiningTokenizer.sol` | Mining | ERC-3643 | Mining asset tokenization |
| `EnergyTokenizer.sol` | Energy | ERC-3643 | Energy asset tokenization |
| `RealEstateTokenizer.sol` | Real Estate | ERC-3643 | Real estate asset tokenization |
| `InfrastructureTokenizer.sol` | Infrastructure | ERC-3643 | Infrastructure tokenization |

### 2.3 Certification & Verification Contracts

| Contract | Name | Role |
|----------|------|------|
| `StockCertification.sol` | Ujamaa Stock Certification | Physical stock certification |
| `AssetProof.sol` | Ujamaa Asset Proof | Production data hash notarization |
| `IndustrialGateway.sol` | Ujamaa Industrial Gateway | GDIZ/SIPI certification interface |

### 2.4 Escrow & Payment Contracts

| Contract | Name | Role |
|----------|------|------|
| `EscrowManager.sol` | Ujamaa Escrow Manager | Escrow account management |
| `RepaymentDistributor.sol` | Ujamaa Repayment Distributor | Automated repayment distribution |
| `FiatRamp.sol` | Ujamaa Fiat Ramp | Fiat ↔ Stablecoin conversion |

### 2.5 Compliance Contracts

| Contract | Name | Role |
|----------|------|------|
| `IdentityRegistry.sol` | Ujamaa Identity Registry | Verified identity registry |
| `ComplianceModule.sol` | Ujamaa Compliance Module | Compliance rules |
| `OHADACompliance.sol` | Ujamaa OHADA Compliance | OHADA law compliance |
| `WhitelistManager.sol` | Ujamaa Whitelist Manager | Institutional whitelist management |

### 2.6 Gateway Contracts ⭐ NEW

| Contract | Name | Role | Network |
|----------|------|------|---------|
| `ReserveGateway.sol` | Ujamaa Reserve Gateway | Bank/stablecoin reserve proof | Polygon |
| `PriceGateway.sol` | Ujamaa Price Gateway | Price feeds (EUROD, USDC, NAV) | Polygon |
| `YieldGateway.sol` | Ujamaa Yield Gateway | uLP yield calculation & publication | Polygon |
| `NAVGateway.sol` | Ujamaa NAV Gateway | Net Asset Value per token | Polygon |
| `ChainlinkAdapter.sol` | Ujamaa Chainlink Adapter | Chainlink Price Feeds integration | Polygon |
| `BankGateway.sol` | Ujamaa Bank Gateway | Banking data (escrow balances) | Production |

---

## 3. Liquidity Pools

### 3.1 Pool Naming

**Format:** `Ujamaa [Type] Pool [Number/Region]`

| Type | Format | Example |
|------|--------|---------|
| **Industrial** | Ujamaa Industrial Pool [Region] | Ujamaa Industrial Pool West Africa I |
| **Agriculture** | Ujamaa Agriculture Pool [Crop] | Ujamaa Agriculture Pool Cotton 2026 |
| **Mining** | Ujamaa Mining Pool [Mineral] | Ujamaa Mining Pool Gold Ghana |
| **Real Estate** | Ujamaa Real Estate Pool [City] | Ujamaa Real Estate Pool Abidjan |
| **Energy** | Ujamaa Energy Pool [Type] | Ujamaa Energy Pool Solar Togo |

### 3.2 Pool Identifiers

**Format:** `POOL-[FAMILY]-[REGION]-[NUMBER]`

**Examples:**
- `POOL-IND-WA-001` - Industrial Pool West Africa #1
- `POOL-AGR-CI-002` - Agriculture Pool Côte d'Ivoire #2
- `POOL-MIN-GH-001` - Mining Pool Ghana #1
- `POOL-RE-AB-001` - Real Estate Pool Abidjan #1

---

## 4. Gateways

### 4.1 Overview

UJAMAA Gateways provide off-chain data to smart contracts in a secure and decentralized manner.

```
┌─────────────────────────────────────────────────────────────────┐
│                    UJAMAA GATEWAY ARCHITECTURE                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐     ┌──────────────┐     ┌──────────────┐    │
│  │  Bank API    │     │  Chainlink   │     │  GDIZ/SIPI   │    │
│  │  (BIIC (Banque Internationale pour l'Industrie et le Commerce)/MCB)  │     │  Price Feeds │     │  Industrial  │    │
│  └──────┬───────┘     └──────┬───────┘     └──────┬───────┘    │
│         │                    │                    │             │
│         ▼                    ▼                    ▼             │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              UJAMAA GATEWAY AGGREGATOR                   │   │
│  │         (BankGateway + PriceGateway + NAVGateway)        │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                   SMART CONTRACTS                        │   │
│  │    ULPToken │ LiquidityPool │ RepaymentDistributor       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### 4.2 Gateway Types

#### A. Reserve Gateway (Proof of Reserve)

**Objective:** Prove that fiat reserves match circulating tokens.

| Data | Source | Frequency | Contract |
|------|--------|-----------|----------|
| Escrow account balance | Bank API (BIIC (Banque Internationale pour l'Industrie et le Commerce)/MCB) | Daily | `ReserveGateway.sol` |
| Stablecoin reserves | Blockchain (on-chain) | Real-time | `ReserveGateway.sol` |
| Reserve ratio | Calculated | Daily | `ReserveGateway.sol` |

**Smart Contract:**
```solidity
// ReserveGateway.sol
interface IReserveGateway {
    function updateReserves(uint256 fiatBalance, uint256 stablecoinBalance) external;
    function getReserveRatio() external view returns (uint256);
    function isOverCollateralized() external view returns (bool);
    function getLastUpdate() external view returns (uint256);
}
```

**Backend Service:**
```python
# services/gateway/reserve_gateway.py
class ReserveGateway:
    def fetch_bank_balance(self, escrow_account: str) -> int:
        """Fetches bank balance from BIIC (Banque Internationale pour l'Industrie et le Commerce)/MCB API."""
        pass

    def fetch_stablecoin_reserves(self, token_address: str) -> int:
        """Fetches on-chain stablecoin reserves."""
        pass

    def calculate_reserve_ratio(self, fiat: int, stablecoin: int) -> Decimal:
        """Calculates reserve ratio."""
        pass
```

---

#### B. Price Gateway (Price Feeds)

**Objective:** Provide stablecoin and tokenized asset prices.

| Data | Source | Frequency | Contract |
|------|--------|-----------|----------|
| EUROD/USD | Chainlink | ~1 min | `PriceGateway.sol` |
| USDC/USD | Chainlink | ~1 min | `PriceGateway.sol` |
| NAV/uLP | Calculated | Daily | `NAVGateway.sol` |
| RWA asset prices | GDIZ/SIPI | Daily | `PriceGateway.sol` |

**Smart Contract:**
```solidity
// PriceGateway.sol
interface IPriceGateway {
    function getPrice(address asset) external view returns (uint256);
    function getPriceWithDecimals(address asset) external view returns (uint256, uint8);
    function isPriceFresh(address asset, uint256 maxAge) external view returns (bool);
}

// Chainlink Integration
interface IChainlinkPriceFeed {
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}
```

**Backend Service:**
```python
# services/gateway/price_gateway.py
class PriceGateway:
    def __init__(self):
        self.chainlink_adapter = ChainlinkAdapter()

    def get_eurc_usd_price(self) -> Decimal:
        """Fetches EUROD/USD price from Chainlink."""
        pass

    def get_usdc_usd_price(self) -> Decimal:
        """Fetches USDC/USD price from Chainlink."""
        pass

    def get_nav_per_ulp(self, pool_id: int) -> Decimal:
        """Calculates NAV per uLP token."""
        pass
```

---

#### C. Yield Gateway (uLP Yield)

**Objective:** Calculate and publish uLP token yield.

| Data | Source | Frequency | Contract |
|------|--------|-----------|----------|
| Accumulated yield | Calculated | Real-time | `YieldGateway.sol` |
| APY (Annual Percentage Yield) | Calculated | Daily | `YieldGateway.sol` |
| Yield history | Backend | Daily | `YieldGateway.sol` |

**Smart Contract:**
```solidity
// YieldGateway.sol
interface IYieldGateway {
    function getCurrentYield() external view returns (uint256);
    function getAPY() external view returns (uint256);
    function getYieldHistory(uint256 days) external view returns (uint256[] memory);
    function updateYield(uint256 newYield) external;
}
```

**Backend Service:**
```python
# services/gateway/yield_gateway.py
class YieldGateway:
    def calculate_current_yield(self, pool_id: int) -> Decimal:
        """Calculates current pool yield."""
        pass

    def calculate_apy(self, daily_yield: Decimal) -> Decimal:
        """Calculates annualized APY."""
        pass

    def get_yield_history(self, pool_id: int, days: int) -> List[Decimal]:
        """Fetches yield history."""
        pass
```

---

#### D. NAV Gateway (Net Asset Value)

**Objective:** Calculate net asset value per uLP token.

| Data | Source | Frequency | Contract |
|------|--------|-----------|----------|
| Total pool value | Calculated | Daily | `NAVGateway.sol` |
| NAV per token | Calculated | Daily | `NAVGateway.sol` |
| Underlying asset values | GDIZ/SIPI | Daily | `NAVGateway.sol` |

**Smart Contract:**
```solidity
// NAVGateway.sol
interface INAVGateway {
    function getNAV() external view returns (uint256);
    function getNAVPerShare() external view returns (uint256);
    function updateNAV(uint256 totalValue, uint256 totalShares) external;
    function getLastUpdate() external view returns (uint256);
}
```

**Backend Service:**
```python
# services/gateway/nav_gateway.py
class NAVGateway:
    def calculate_total_pool_value(self, pool_id: int) -> Decimal:
        """Calculates total pool value."""
        pass

    def calculate_nav_per_share(self, total_value: Decimal, total_shares: Decimal) -> Decimal:
        """Calculates NAV per uLP share."""
        pass

    def update_nav_on_chain(self, pool_id: int, nav: Decimal) -> str:
        """Updates NAV on blockchain."""
        pass
```

---

#### E. Bank Gateway (Banking Data)

**Objective:** Provide verified banking data to smart contracts.

| Data | Source | Frequency | Contract |
|------|--------|-----------|----------|
| Escrow account balance | Bank API | Real-time | `BankGateway.sol` |
| Escrow transactions | Bank API | Real-time | `BankGateway.sol` |
| Payment status | Bank API | Event | `BankGateway.sol` |

**Smart Contract:**
```solidity
// BankGateway.sol
interface IBankGateway {
    function getEscrowBalance(string calldata accountId) external view returns (uint256);
    function getPaymentStatus(string calldata paymentId) external view returns (uint8);
    function updateBalance(string calldata accountId, uint256 newBalance) external;
}
```

**Backend Service:**
```python
# services/gateway/bank_gateway.py
class BankGateway:
    def __init__(self, bank_api_client: BankAPIClient):
        self.bank_client = bank_api_client

    def fetch_escrow_balance(self, account_id: str) -> int:
        """Fetches escrow account balance."""
        pass

    def fetch_payment_status(self, payment_id: str) -> PaymentStatus:
        """Fetches payment status."""
        pass

    def submit_balance_update(self, account_id: str, balance: int) -> str:
        """Submits balance update to blockchain."""
        pass
```

---

### 4.3 Chainlink Integration

**Supported Price Feeds:**

| Pair | Feed Address (Polygon Amoy) | Decimals |
|------|-----------------------------|----------|
| EUR/USD | `0x...` (to configure) | 8 |
| USD/USD | `0x...` (stable) | 8 |
| MATIC/USD | `0x...` (to configure) | 8 |

**Integration Code:**
```solidity
// ChainlinkAdapter.sol
import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";

contract ChainlinkAdapter {
    AggregatorV3Interface internal priceFeed;

    constructor(address priceFeedAddress) {
        priceFeed = AggregatorV3Interface(priceFeedAddress);
    }

    function getLatestPrice() public view returns (int256) {
        (
            uint80 roundID,
            int256 price,
            uint256 startedAt,
            uint256 timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();

        require(timeStamp > block.timestamp - 1 hours, "Stale price");
        return price;
    }

    function getPriceWithDecimals() public view returns (uint256) {
        int256 price = getLatestPrice();
        uint8 feedDecimals = priceFeed.decimals();
        return uint256(price) * (10 ** (18 - feedDecimals));
    }
}
```

---

### 4.4 Gateway Security

**Security Mechanisms:**

| Mechanism | Description | Implementation |
|-----------|-------------|----------------|
| **Freshness Check** | Verify data is recent | `require(block.timestamp - lastUpdate < MAX_AGE)` |
| **Multi-Source** | Aggregate multiple data sources | Chainlink + Bank API + Manual |
| **Access Control** | Restrict who can update | `onlyRole(GATEWAY_UPDATER_ROLE)` |
| **Circuit Breaker** | Pause in case of anomaly | `whenNotPaused` modifier |
| **Heartbeat** | Periodic verification | Automated keeper network |

**Example:**
```solidity
// GatewaySecurity.sol
abstract contract GatewaySecurity {
    uint256 public constant MAX_DATA_AGE = 1 days;
    uint256 public lastUpdate;
    address public gatewayUpdater;
    bool public paused;

    modifier onlyGatewayUpdater() {
        require(msg.sender == gatewayUpdater, "Not authorized");
        _;
    }

    modifier dataIsFresh() {
        require(block.timestamp - lastUpdate < MAX_DATA_AGE, "Stale data");
        _;
    }

    modifier whenNotPaused() {
        require(!paused, "Gateway paused");
        _;
    }

    function emergencyPause() external onlyOwner {
        paused = true;
    }

    function emergencyUnpause() external onlyOwner {
        paused = false;
    }
}
```

---

### 4.5 API Endpoints (Gateways)

```
# Reserve Gateway
GET    /api/v1/gateway/reserves              - Current reserves
GET    /api/v1/gateway/reserves/ratio        - Reserve ratio
GET    /api/v1/gateway/reserves/history      - Reserve history
POST   /api/v1/gateway/reserves/update       - Update (admin)

# Price Gateway
GET    /api/v1/gateway/prices/:asset         - Asset price
GET    /api/v1/gateway/prices/nav            - Current NAV
GET    /api/v1/gateway/prices/history/:asset - Price history
POST   /api/v1/gateway/prices/update         - Update (admin)

# Yield Gateway
GET    /api/v1/gateway/yield/current         - Current yield
GET    /api/v1/gateway/yield/apy             - Annualized APY
GET    /api/v1/gateway/yield/history         - Yield history
POST   /api/v1/gateway/yield/update          - Update (admin)

# Bank Gateway
GET    /api/v1/gateway/bank/balance/:id      - Account balance
GET    /api/v1/gateway/bank/payment/:id      - Payment status
GET    /api/v1/gateway/bank/transactions/:id - Transactions
POST   /api/v1/gateway/bank/webhook          - Bank webhook
```

---

### 4.6 Backend Services (Gateways)

```
backend/
├── services/
│   ├── gateway/                   # ⭐ NEW - Gateway Services
│   │   ├── __init__.py
│   │   ├── reserve_gateway.py     # Proof of reserve
│   │   ├── price_gateway.py       # Price feeds
│   │   ├── yield_gateway.py       # Yield calculation
│   │   ├── nav_gateway.py         # NAV calculation
│   │   ├── bank_gateway.py        # Banking data
│   │   └── chainlink_adapter.py   # Chainlink integration
│   │
│   ├── demo/                      # Demo services
│   │   └── ...
│   │
│   └── mock/                      # Mocks
│       └── ...
│
├── api/
│   ├── gateway/                   # ⭐ NEW - Gateway API
│   │   ├── __init__.py
│   │   ├── reserve.py
│   │   ├── price.py
│   │   ├── yield.py
│   │   ├── nav.py
│   │   └── bank.py
│   │
│   └── ...
│
└── models/
    ├── gateway/                   # ⭐ NEW - Gateway Models
    │   ├── __init__.py
    │   ├── reserve.py
    │   ├── price.py
    │   ├── yield.py
    │   └── bank.py
    │
    └── ...
```

---

### 4.7 Frontend Components (Gateways)

```
frontend/src/
├── demo/
│   ├── components/
│   │   ├── gateway/               # ⭐ NEW - Gateway Components
│   │   │   ├── ReserveDisplay.tsx     # Reserve display
│   │   │   ├── PriceFeed.tsx          # Price feed
│   │   │   ├── YieldChart.tsx         # Yield chart
│   │   │   ├── NAVIndicator.tsx       # NAV indicator
│   │   │   ├── GatewayStatus.tsx      # Gateway status
│   │   │   └── ChainlinkFeed.tsx      # Chainlink integration
│   │   │
│   │   └── ...
│   │
│   └── ...
│
└── ...
```

---

## 5. Backend Services

### 5.1 Principal Services

| Service | Name | File | Role |
|---------|------|------|------|
| **Pool Manager** | `pool_manager.py` | `services/demo/pool_manager.py` | Pool management |
| **Yield Calculator** | `yield_calculation.py` | `services/demo/yield_calculation.py` | uLP yield calculation |
| **Redemption Service** | `redemption_service.py` | `services/demo/redemption_service.py` | uLP redemption management |

### 5.2 Gateway Services ⭐ NEW

| Service | Name | File | Role |
|---------|------|------|------|
| **Reserve Gateway** | `reserve_gateway.py` | `services/gateway/reserve_gateway.py` | Proof of reserve |
| **Price Gateway** | `price_gateway.py` | `services/gateway/price_gateway.py` | Price feeds |
| **Yield Gateway** | `yield_gateway.py` | `services/gateway/yield_gateway.py` | uLP yield |
| **NAV Gateway** | `nav_gateway.py` | `services/gateway/nav_gateway.py` | Net Asset Value |
| **Bank Gateway** | `bank_gateway.py` | `services/gateway/bank_gateway.py` | Banking data |
| **Chainlink Adapter** | `chainlink_adapter.py` | `services/gateway/chainlink_adapter.py` | Chainlink integration |

### 5.3 Mock Services (Demo)

| Service | Name | File | Role |
|---------|------|------|------|
| **Mock Bank** | `mock_bank.py` | `services/mock/mock_bank.py` | Bank simulation |
| **Mock Escrow** | `mock_escrow.py` | `services/mock/mock_escrow.py` | Escrow simulation |
| **Mock GDIZ** | `mock_gdiz.py` | `services/mock/mock_gdiz.py` | GDIZ certification simulation |

### 5.4 Production Services (Future)

| Service | Name | File | Role |
|---------|------|------|------|
| **Bank Integration** | `bank_integration.py` | `services/production/bank_integration.py` | BIIC (Banque Internationale pour l'Industrie et le Commerce)/MCB integration |
| **Escrow Service** | `escrow_service.py` | `services/production/escrow_service.py` | Real escrow account management |
| **GDIZ Integration** | `gdiz_integration.py` | `services/production/gdiz_integration.py` | GDIZ/SIPI API |
| **Compliance Service** | `compliance_service.py` | `services/production/compliance_service.py` | Institutional KYB/KYC |

---

## 6. API Endpoints

### 6.1 Pools

```
GET    /api/v1/pools              - List of pools
GET    /api/v1/pools/:id          - Pool details
GET    /api/v1/pools/:id/stats    - Pool statistics
GET    /api/v1/pools/:id/financings - Pool financings
POST   /api/v1/pools              - Create pool (admin)
POST   /api/v1/pools/:id/deposit  - Deposit to pool
POST   /api/v1/pools/:id/redeem   - Redeem uLP shares
```

### 6.2 uLP Token

```
GET    /api/v1/ulp/balance/:address  - uLP balance
GET    /api/v1/ulp/value/:address    - uLP value
GET    /api/v1/ulp/nav               - NAV per uLP token
GET    /api/v1/ulp/yield             - Accumulated yield
POST   /api/v1/ulp/statement         - Generate yield statement
```

### 6.3 Gateways ⭐ NEW

```
# Reserve Gateway
GET    /api/v1/gateway/reserves              - Current reserves
GET    /api/v1/gateway/reserves/ratio        - Reserve ratio
GET    /api/v1/gateway/reserves/history      - Reserve history

# Price Gateway
GET    /api/v1/gateway/prices/:asset         - Asset price
GET    /api/v1/gateway/prices/nav            - Current NAV
GET    /api/v1/gateway/prices/history/:asset - Price history

# Yield Gateway
GET    /api/v1/gateway/yield/current         - Current yield
GET    /api/v1/gateway/yield/apy             - Annualized APY
GET    /api/v1/gateway/yield/history         - Yield history

# Bank Gateway
GET    /api/v1/gateway/bank/balance/:id      - Account balance
GET    /api/v1/gateway/bank/payment/:id      - Payment status
GET    /api/v1/gateway/bank/transactions/:id - Transactions
```

### 6.4 Certification

```
GET    /api/v1/certificates              - List of certificates
GET    /api/v1/certificates/:id          - Certificate details
POST   /api/v1/certificates/submit       - Submit stock
POST   /api/v1/certificates/:id/certify  - Certify stock (GDIZ)
POST   /api/v1/certificates/:id/reject   - Reject stock
```

### 6.5 Escrow (Production)

```
GET    /api/v1/escrow/accounts       - Escrow accounts
GET    /api/v1/escrow/accounts/:id   - Account details
POST   /api/v1/escrow/accounts       - Create escrow account
POST   /api/v1/escrow/fund           - Fund account
POST   /api/v1/escrow/withdraw       - Withdraw from account
GET    /api/v1/escrow/transactions   - Transaction history
```

---

## 7. Frontend Components

### 7.1 Demo Pages

| Component | File | Route | Role |
|-----------|------|-------|------|
| `PoolList` | `demo/pages/PoolList.tsx` | `/demo/pools` | Pool list |
| `PoolDetail` | `demo/pages/PoolDetail.tsx` | `/demo/pools/:id` | Pool details |
| `ULPHoldings` | `demo/pages/ULPHoldings.tsx` | `/demo/ulp/holdings` | uLP holdings |
| `ULPDeposit` | `demo/pages/ULPDeposit.tsx` | `/demo/ulp/deposit` | EUROD → uLP deposit |
| `ULPRedeem` | `demo/pages/ULPRedeem.tsx` | `/demo/ulp/redeem` | uLP → EUROD redemption |

### 7.2 Gateway Components ⭐ NEW

| Component | File | Role |
|-----------|------|------|
| `ReserveDisplay` | `demo/components/gateway/ReserveDisplay.tsx` | Reserve display |
| `PriceFeed` | `demo/components/gateway/PriceFeed.tsx` | Chainlink price feed |
| `YieldChart` | `demo/components/gateway/YieldChart.tsx` | Yield chart |
| `NAVIndicator` | `demo/components/gateway/NAVIndicator.tsx` | NAV indicator |
| `GatewayStatus` | `demo/components/gateway/GatewayStatus.tsx` | Gateway status |
| `ChainlinkFeed` | `demo/components/gateway/ChainlinkFeed.tsx` | Chainlink integration |

### 7.3 Reusable Components

| Component | File | Role |
|-----------|------|------|
| `DemoBanner` | `demo/components/DemoBanner.tsx` | Disclaimer banner |
| `TestnetNotice` | `demo/components/TestnetNotice.tsx` | Testnet notice |
| `MockDataBadge` | `demo/components/MockDataBadge.tsx` | Mock data indicator |

---

## 8. File Naming Conventions

### 8.1 Smart Contracts

**Format:** `[Name].sol` (PascalCase)

**Examples:**
- `ULPToken.sol`
- `LiquidityPool.sol`
- `ReserveGateway.sol`

### 8.2 Backend Services

**Format:** `[name]_service.py` (snake_case)

**Examples:**
- `pool_manager.py`
- `yield_calculation.py`
- `reserve_gateway.py`

### 8.3 Frontend Components

**Format:** `[Name].tsx` (PascalCase)

**Examples:**
- `PoolList.tsx`
- `ULPDeposit.tsx`
- `ReserveDisplay.tsx`

### 8.4 API Routes

**Format:** `/api/v1/[resource]` (kebab-case for sub-resources)

**Examples:**
- `/api/v1/pools`
- `/api/v1/ulp/balance`
- `/api/v1/gateway/reserves`

---

## 9. Database Tables

### 9.1 Core Tables

| Table | Name | Role |
|-------|------|------|
| `pools` | Pools | Pool records |
| `financings` | Financings | Financing records |
| `ulp_tokens` | ULP Tokens | uLP token holdings |
| `investors` | Investors | Investor records |

### 9.2 Gateway Tables ⭐ NEW

| Table | Name | Role |
|-------|------|------|
| `gateway_reserves` | Gateway Reserves | Reserve history |
| `gateway_prices` | Gateway Prices | Price history |
| `gateway_yields` | Gateway Yields | Yield history |
| `gateway_nav` | Gateway NAV | NAV history |
| `gateway_bank_data` | Gateway Bank Data | Banking data cache |

---

## 10. Environment Variables

### 10.1 Core Variables

```env
# Blockchain
POLYGON_AMOY_RPC=https://rpc-amoy.polygon.technology/
POLYGON_CHAIN_ID=80002

# Contracts
ULP_TOKEN_ADDRESS=0x...
LIQUIDITY_POOL_ADDRESS=0x...

# Bank (Production)
BIIC_API_KEY=<key>
BIIC_BASE_URL=https://api.biic.mu/
```

### 10.2 Gateway Variables ⭐ NEW

```env
# Chainlink
CHAINLINK_PRICE_FEED_EUR_USD=0x...
CHAINLINK_PRICE_FEED_USD_USD=0x...

# Gateway Update Intervals
GATEWAY_RESERVE_UPDATE_INTERVAL=86400  # 24 hours
GATEWAY_PRICE_UPDATE_INTERVAL=60       # 1 min
GATEWAY_NAV_UPDATE_INTERVAL=86400      # 24 hours

# Freshness Thresholds
GATEWAY_MAX_DATA_AGE=86400             # 24 hours
GATEWAY_STALE_PRICE_THRESHOLD=3600     # 1 hour
```

---

## 11. Glossary

| Term | Definition |
|------|------------|
| **uLP** | Ujamaa Liquidity Provider token; yield-bearing ERC-3643 token |
| **NAV** | Net Asset Value; value per uLP token |
| **APY** | Annual Percentage Yield; expected annual return |
| **TVL** | Total Value Locked; total assets in pool |
| **KYB** | Know Your Business; enhanced due diligence for institutions |
| **ERC-3643** | Token standard for permissioned securities |
| **ONCHAINID** | Decentralized identity protocol |
| **Gateway** | Service providing off-chain data to smart contracts |
| **Reserve Gateway** | Proves fiat reserves match circulating tokens |
| **Price Gateway** | Provides asset price feeds |
| **Yield Gateway** | Calculates and publishes uLP yield |
| **Bank Gateway** | Provides verified banking data |

---

**Document Control:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | March 17, 2026 | Aziz Da Silva | Initial English translation |
| **1.1** | **March 17, 2026** | **Aziz Da Silva** | **🆕 Oracle → Gateway (all references updated)** |

### Changes in v1.1:

**🆕 Complete Oracle → Gateway Rename:**

**Smart Contracts:**
- ✅ `ReserveOracle.sol` → `ReserveGateway.sol`
- ✅ `PriceOracle.sol` → `PriceGateway.sol`
- ✅ `YieldOracle.sol` → `YieldGateway.sol`
- ✅ `NAVOracle.sol` → `NAVGateway.sol`
- ✅ `BankOracle.sol` → `BankGateway.sol`

**Backend Services:**
- ✅ `services/oracle/` → `services/gateway/`
- ✅ `reserve_oracle.py` → `reserve_gateway.py`
- ✅ `price_oracle.py` → `price_gateway.py`
- ✅ `yield_oracle.py` → `yield_gateway.py`
- ✅ `nav_oracle.py` → `nav_gateway.py`
- ✅ `bank_oracle.py` → `bank_gateway.py`

**API Endpoints:**
- ✅ `/api/v1/oracle/` → `/api/v1/gateway/`
- ✅ All oracle routes updated to gateway routes

**Frontend Components:**
- ✅ `components/oracle/` → `components/gateway/`
- ✅ `OracleStatus.tsx` → `GatewayStatus.tsx`

**Database Tables:**
- ✅ `oracle_*` → `gateway_*`

**Environment Variables:**
- ✅ `ORACLE_*` → `GATEWAY_*`

**Glossary:**
- ✅ Oracle → Gateway
- ✅ All oracle definitions updated

**Architecture:**
- ✅ `ORACLE ARCHITECTURE` → `GATEWAY ARCHITECTURE`
- ✅ `ORACLE AGGREGATOR` → `GATEWAY AGGREGATOR`

**Approval Required:** Proceed with implementation

**Next Step:** Begin Week 2, Day 1 tasks (Smart Contract Deployment)

---

*Ujamaa DeFi Platform - Tokenize African Real-World Assets*
*Nomenclature & Naming Conventions - English Version*
*Gateway Architecture (formerly Oracle)*


