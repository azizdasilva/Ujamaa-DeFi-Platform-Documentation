# Ujamaa DeFi Platform - Smart Contract Tests
# Phase 5: Integration & Testing

pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../contracts/MVP/UPTToken.sol";
import "../contracts/MVP/LiquidityPool.sol";
import "../contracts/MVP/JurisdictionCompliance.sol";
import "../contracts/MVP/MockEscrow.sol";
import "../contracts/MVP/MockFiatRamp.sol";

// Mock ERC20 for testing
contract MockERC20 is Test {
    string public name = "Mock UJEUR";
    string public symbol = "mUJEUR";
    uint8 public decimals = 18;
    uint256 public totalSupply;
    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    function mint(address to, uint256 amount) external {
        balanceOf[to] += amount;
        totalSupply += amount;
    }

    function approve(address spender, uint256 amount) external returns (bool) {
        allowance[msg.sender][spender] = amount;
        return true;
    }

    function transfer(address to, uint256 amount) external returns (bool) {
        balanceOf[msg.sender] -= amount;
        balanceOf[to] += amount;
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) external returns (bool) {
        allowance[from][msg.sender] -= amount;
        balanceOf[from] -= amount;
        balanceOf[to] += amount;
        return true;
    }
}

// =============================================================================
// UPTToken Tests
// =============================================================================

contract UPTTokenTest is Test {
    UPTToken public uptToken;
    MockERC20 public mockUJEUR;
    
    address public deployer = address(1);
    address public investor = address(2);
    address public poolManager = address(3);

    uint256 public constant INITIAL_NAV = 1e18;
    uint256 public constant MANAGEMENT_FEE_BP = 200; // 2%
    uint256 public constant PERFORMANCE_FEE_BP = 2000; // 20%
    uint256 public constant HURDLE_RATE_BP = 500; // 5%

    function setUp() public {
        // Deploy mock UJEUR
        mockUJEUR = new MockERC20();
        
        // Deploy UPTToken
        uptToken = new UPTToken(
            address(mockUJEUR),
            MANAGEMENT_FEE_BP,
            PERFORMANCE_FEE_BP,
            HURDLE_RATE_BP
        );

        // Grant roles
        vm.startPrank(deployer);
        uptToken.grantRole(uptToken.POOL_MANAGER_ROLE(), poolManager);
        uptToken.grantRole(uptToken.MINTER_ROLE(), deployer);
        uptToken.grantRole(uptToken.REDEEMER_ROLE(), deployer);
        vm.stopPrank();

        // Mint mock UJEUR to investor
        mockUJEUR.mint(investor, 1_000_000 * 1e18); // 1M UJEUR
    }

    function test_InitialState() public view {
        assertEq(uptToken.name(), "Ujamaa Pool Token");
        assertEq(uptToken.symbol(), "UPT");
        assertEq(uptToken.getNAV(), INITIAL_NAV);
        assertEq(uptToken.totalSupply(), 0);
        assertTrue(uptToken.IS_MVP_TESTNET());
    }

    function test_Deposit() public {
        uint256 depositAmount = 100_000 * 1e18; // 100K UJEUR

        vm.startPrank(investor);
        mockUJEUR.approve(address(uptToken), depositAmount);
        
        // First deposit (1:1 at inception)
        uint256 sharesMinted = uptToken.deposit(depositAmount);
        
        assertEq(sharesMinted, depositAmount); // 1:1 at NAV 1.00
        assertEq(uptToken.balanceOf(investor), depositAmount);
        assertEq(uptToken.getTotalPoolValue(), depositAmount);
        vm.stopPrank();
    }

    function test_Redeem() public {
        uint256 depositAmount = 100_000 * 1e18;
        
        // Deposit first
        vm.startPrank(investor);
        mockUJEUR.approve(address(uptToken), depositAmount);
        uptToken.deposit(depositAmount);
        
        // Redeem
        uint256 ujeurReceived = uptToken.redeem(depositAmount);
        
        assertEq(ujeurReceived, depositAmount);
        assertEq(uptToken.balanceOf(investor), 0);
        assertEq(uptToken.totalSupply(), 0);
        vm.stopPrank();
    }

    function test_AddYield() public {
        uint256 depositAmount = 1_000_000 * 1e18;
        uint256 yieldAmount = 100_000 * 1e18; // 10% yield

        // Deposit
        vm.startPrank(investor);
        mockUJEUR.approve(address(uptToken), depositAmount);
        uptToken.deposit(depositAmount);
        vm.stopPrank();

        // Add yield (pool manager only)
        vm.startPrank(poolManager);
        uint256 newNav = uptToken.addYield(yieldAmount, "Test Yield");
        vm.stopPrank();

        // NAV should increase
        assertGt(newNav, INITIAL_NAV);
        assertEq(uptToken.getTotalPoolValue(), depositAmount + yieldAmount);
    }

    function test_GetValue() public {
        uint256 depositAmount = 100_000 * 1e18;

        vm.startPrank(investor);
        mockUJEUR.approve(address(uptToken), depositAmount);
        uptToken.deposit(depositAmount);
        vm.stopPrank();

        uint256 value = uptToken.getValue(investor);
        assertEq(value, depositAmount); // At NAV 1.00
    }

    function testFuzz_DepositRedeem(uint256 amount) public {
        amount = bound(amount, 1_000 * 1e18, 1_000_000 * 1e18);

        vm.startPrank(investor);
        mockUJEUR.approve(address(uptToken), amount);
        uint256 shares = uptToken.deposit(amount);
        uint256 received = uptToken.redeem(shares);
        vm.stopPrank();

        assertEq(received, amount);
    }
}

// =============================================================================
// JurisdictionCompliance Tests
// =============================================================================

contract JurisdictionComplianceTest is Test {
    JurisdictionCompliance public compliance;

    function setUp() public {
        compliance = new JurisdictionCompliance();
    }

    function test_InitialState() public view {
        assertEq(compliance.getBlockedJurisdictionsCount(), 12);
        assertTrue(compliance.IS_MVP_TESTNET());
    }

    function test_BlockedJurisdictions() public view {
        // All 12 blocked jurisdictions
        string[] memory blockedCodes = new string[](12);
        blockedCodes[0] = "KP";
        blockedCodes[1] = "IR";
        blockedCodes[2] = "SY";
        blockedCodes[3] = "CU";
        blockedCodes[4] = "MM";
        blockedCodes[5] = "BY";
        blockedCodes[6] = "RU";
        blockedCodes[7] = "VE";
        blockedCodes[8] = "SD";
        blockedCodes[9] = "YE";
        blockedCodes[10] = "ML";
        blockedCodes[11] = "BF";

        for (uint256 i = 0; i < blockedCodes.length; i++) {
            assertTrue(compliance.isJurisdictionBlocked(blockedCodes[i]));
            assertFalse(compliance.isJurisdictionAllowed(blockedCodes[i]));
        }
    }

    function test_AllowedJurisdictions() public view {
        // African markets
        string[] memory africanCodes = new string[](9);
        africanCodes[0] = "NG";
        africanCodes[1] = "KE";
        africanCodes[2] = "ZA";
        africanCodes[3] = "GH";
        africanCodes[4] = "MU";
        africanCodes[5] = "CI";
        africanCodes[6] = "SN";
        africanCodes[7] = "TG";
        africanCodes[8] = "BJ";

        for (uint256 i = 0; i < africanCodes.length; i++) {
            assertFalse(compliance.isJurisdictionBlocked(africanCodes[i]));
            assertTrue(compliance.isJurisdictionAllowed(africanCodes[i]));
        }

        // International
        string[] memory intlCodes = new string[](5);
        intlCodes[0] = "EU";
        intlCodes[1] = "UK";
        intlCodes[2] = "UAE";
        intlCodes[3] = "SG";
        intlCodes[4] = "US";

        for (uint256 i = 0; i < intlCodes.length; i++) {
            assertFalse(compliance.isJurisdictionBlocked(intlCodes[i]));
            assertTrue(compliance.isJurisdictionAllowed(intlCodes[i]));
        }
    }

    function test_InvestorRegistration() public {
        address investor = address(1);
        
        vm.prank(investor);
        JurisdictionCompliance.ComplianceStatus status = 
            compliance.registerInvestorJurisdiction(investor, "US");
        
        assertEq(uint8(status), uint8(JurisdictionCompliance.ComplianceStatus.ALLOWED));
    }

    function test_BlockedInvestorRegistration() public {
        address investor = address(1);
        
        vm.prank(investor);
        JurisdictionCompliance.ComplianceStatus status = 
            compliance.registerInvestorJurisdiction(investor, "KP");
        
        assertEq(uint8(status), uint8(JurisdictionCompliance.ComplianceStatus.BLOCKED));
    }
}

// =============================================================================
// MockEscrow Tests
// =============================================================================

contract MockEscrowTest is Test {
    MockEscrow public escrow;
    address public investor = address(1);
    address public investor2 = address(2);

    function setUp() public {
        escrow = new MockEscrow();
    }

    function test_CreateEscrowAccount() public {
        vm.prank(address(escrow.ESCROW_ADMIN_ROLE()));
        string memory accountId = escrow.createEscrowAccount(investor, 0);
        
        assertTrue(bytes(accountId).length > 0);
        assertEq(escrow.getBalance(accountId), 0);
    }

    function test_CreateDemoAccount() public {
        vm.prank(address(0)); // Admin
        string memory accountId = escrow.createDemoAccount(investor);
        
        uint256 balance = escrow.getBalance(accountId);
        assertEq(balance, escrow.INITIAL_DEMO_BALANCE());
        assertEq(balance, 10_000_000 * 1e18); // 10M UJEUR
    }

    function test_WireTransfer() public {
        // Create accounts
        string memory account1 = escrow.createDemoAccount(investor);
        string memory account2 = escrow.createDemoAccount(investor2);
        
        uint256 initialBalance = escrow.getBalance(account1);
        uint256 transferAmount = 100_000 * 1e18;
        
        // Wire transfer
        string memory txId = escrow.simulateWireTransfer(
            account1,
            account2,
            transferAmount,
            "Test transfer"
        );
        
        assertEq(
            escrow.getBalance(account1),
            initialBalance - transferAmount
        );
        assertEq(
            escrow.getBalance(account2),
            escrow.INITIAL_DEMO_BALANCE() + transferAmount
        );
        assertTrue(bytes(txId).length > 0);
    }
}

// =============================================================================
// LiquidityPool Tests
// =============================================================================

contract LiquidityPoolTest is Test {
    LiquidityPool public pool;
    UPTToken public uptToken;
    MockERC20 public mockUJEUR;

    function setUp() public {
        mockUJEUR = new MockERC20();
        uptToken = new UPTToken(
            address(mockUJEUR),
            200, // 2% management fee
            2000, // 20% performance fee
            500 // 5% hurdle rate
        );
        
        pool = new LiquidityPool(address(uptToken), address(mockUJEUR));
    }

    function test_InitialState() public view {
        assertTrue(pool.IS_MVP_TESTNET());
        assertEq(pool.nextFinancingId(), 1);
    }

    function test_PoolFamilies() public view {
        // Test all 5 pool families exist
        LiquidityPool.PoolFamily[5] memory families = [
            LiquidityPool.PoolFamily.POOL_INDUSTRIE,
            LiquidityPool.PoolFamily.POOL_AGRICULTURE,
            LiquidityPool.PoolFamily.POOL_TRADE_FINANCE,
            LiquidityPool.PoolFamily.POOL_RENEWABLE_ENERGY,
            LiquidityPool.PoolFamily.POOL_REAL_ESTATE
        ];

        for (uint256 i = 0; i < families.length; i++) {
            LiquidityPool.PoolConfig memory config = pool.getPoolConfig(families[i]);
            assertTrue(bytes(config.name).length > 0);
        }
    }

    function test_DiversificationLimits() public {
        // Set test pool value
        vm.prank(address(0));
        pool.setTestPoolValue(10_000_000 * 1e18); // 10M UJEUR

        // Try to create financing exceeding per-industrial limit (20%)
        vm.expectRevert(LiquidityPool.ExceedsPerIndustrialLimit.selector);
        pool.createFinancing(
            LiquidityPool.PoolFamily.POOL_INDUSTRIE,
            "Manufacturing",
            address(1),
            3_000_000 * 1e18, // 30% - exceeds 20% limit
            1000, // 10%
            365
        );
    }
}
