"""
Mock Bank Service - MVP-2 Testnet

Simulates bank escrow accounts for investor funds.
Interface compatible with production BIICBankService.

@reference SRS v2.0 Section 4.3
@reference 03_MVP_MOCKING_AND_TESTNET_STRATEGY.md Section 5.3
@reference backend/config/MVP_config.py

@notice MVP-2 TESTNET: This is a testnet deployment. No real funds.
"""

from typing import Dict, List, Optional
from datetime import datetime
from dataclasses import dataclass, field
from enum import Enum
import uuid


class TransactionStatus(Enum):
    """Transaction status enum"""
    PENDING = "PENDING"
    COMPLETED_MVP2 = "COMPLETED_MVP2"  # Testnet only
    FAILED = "FAILED"


class TransactionType(Enum):
    """Transaction type enum"""
    DEPOSIT = "DEPOSIT"
    WITHDRAWAL = "WITHDRAWAL"
    WIRE_TRANSFER = "WIRE_TRANSFER"
    INCOMING_WIRE = "INCOMING_WIRE"
    OUTGOING_WIRE = "OUTGOING_WIRE"


@dataclass
class EscrowAccount:
    """Escrow account data structure"""
    account_id: str
    investor_id: str
    balance: int  # 18 decimals
    currency: str
    status: str
    created_at: str
    bank_name: str


@dataclass
class Transaction:
    """Transaction data structure"""
    tx_id: str
    account_id: str
    type: TransactionType
    amount: int  # 18 decimals
    status: TransactionStatus
    timestamp: str
    description: str
    counterparty_account: Optional[str] = None


class IBankService:
    """
    Abstract interface for bank services.
    
    Production implementation (BIICBankService) must implement this interface.
    Mock implementation (MockBankService) used for testnet.
    """
    
    def create_escrow_account(self, investor_id: str) -> str:
        """Create escrow account for investor"""
        raise NotImplementedError
    
    def deposit(self, account_id: str, amount: int) -> Transaction:
        """Deposit funds to account"""
        raise NotImplementedError
    
    def withdraw(self, account_id: str, amount: int) -> Transaction:
        """Withdraw funds from account"""
        raise NotImplementedError
    
    def get_balance(self, account_id: str) -> int:
        """Get account balance"""
        raise NotImplementedError
    
    def get_transaction_history(self, account_id: str) -> List[Transaction]:
        """Get transaction history for account"""
        raise NotImplementedError
    
    def get_account_details(self, account_id: str) -> EscrowAccount:
        """Get full account details"""
        raise NotImplementedError


class MockBankService(IBankService):
    """
    MVP-2 Mock Bank Service
    
    Simulates BIIC/MCB bank operations for testnet.
    Interface compatible with production BIICBankService.
    
    Features:
    - Create escrow accounts (MOCK-ESCROW-{uuid})
    - Deposit/withdrawal simulation
    - Wire transfer simulation (NO REAL MONEY)
    - Transaction history tracking
    - Initial demo balance: 10M UJEUR per account
    """
    
    def __init__(self, initial_balance: int = 10_000_000_000_000_000_000_000_000):
        """
        Initialize mock bank.
        
        Args:
            initial_balance: Starting balance for demo accounts (10M UJEUR, 18 decimals)
        """
        self.accounts: Dict[str, EscrowAccount] = {}
        self.transactions: Dict[str, List[Transaction]] = {}
        self.initial_balance = initial_balance
    
    def create_escrow_account(self, investor_id: str) -> str:
        """
        Create mock escrow account for investor.
        
        Args:
            investor_id: Unique investor identifier
            
        Returns:
            Account ID in format: MOCK-ESCROW-{uuid}
        """
        account_id = f"MOCK-ESCROW-{investor_id}-{uuid.uuid4().hex[:8]}"
        
        self.accounts[account_id] = EscrowAccount(
            account_id=account_id,
            investor_id=investor_id,
            balance=self.initial_balance,
            currency="UJEUR_TEST",
            status="ACTIVE_MVP2",
            created_at=datetime.utcnow().isoformat(),
            bank_name="Mock Bank (MVP-2 Testnet)"
        )
        
        self.transactions[account_id] = []
        
        return account_id
    
    def deposit(self, account_id: str, amount: int) -> Transaction:
        """
        Deposit funds to account (simulation).
        
        Args:
            account_id: Account ID
            amount: Amount to deposit (18 decimals)
            
        Returns:
            Transaction object
            
        Raises:
            ValueError: If account not found or amount is zero
        """
        if account_id not in self.accounts:
            raise ValueError(f"Account not found: {account_id}")
        
        if amount <= 0:
            raise ValueError(f"Invalid deposit amount: {amount}")
        
        # Update balance
        account = self.accounts[account_id]
        account.balance += amount
        
        # Create transaction record
        tx = Transaction(
            tx_id=f"MOCK-DEP-{uuid.uuid4().hex[:12]}",
            account_id=account_id,
            type=TransactionType.DEPOSIT,
            amount=amount,
            status=TransactionStatus.COMPLETED_MVP2,
            timestamp=datetime.utcnow().isoformat(),
            description=f"Mock deposit (testnet only)"
        )
        
        self.transactions[account_id].append(tx)
        
        return tx
    
    def withdraw(self, account_id: str, amount: int) -> Transaction:
        """
        Withdraw funds from account (simulation).
        
        Args:
            account_id: Account ID
            amount: Amount to withdraw (18 decimals)
            
        Returns:
            Transaction object
            
        Raises:
            ValueError: If account not found, insufficient balance, or amount is zero
        """
        if account_id not in self.accounts:
            raise ValueError(f"Account not found: {account_id}")
        
        account = self.accounts[account_id]
        
        if amount <= 0:
            raise ValueError(f"Invalid withdrawal amount: {amount}")
        
        if account.balance < amount:
            raise ValueError(
                f"Insufficient balance: {account.balance} < {amount}"
            )
        
        # Update balance
        account.balance -= amount
        
        # Create transaction record
        tx = Transaction(
            tx_id=f"MOCK-WITH-{uuid.uuid4().hex[:12]}",
            account_id=account_id,
            type=TransactionType.WITHDRAWAL,
            amount=amount,
            status=TransactionStatus.COMPLETED_MVP2,
            timestamp=datetime.utcnow().isoformat(),
            description=f"Mock withdrawal (testnet only)"
        )
        
        self.transactions[account_id].append(tx)
        
        return tx
    
    def get_balance(self, account_id: str) -> int:
        """
        Get account balance.
        
        Args:
            account_id: Account ID
            
        Returns:
            Balance in UJEUR (18 decimals)
            
        Raises:
            ValueError: If account not found
        """
        if account_id not in self.accounts:
            raise ValueError(f"Account not found: {account_id}")
        
        return self.accounts[account_id].balance
    
    def get_transaction_history(self, account_id: str) -> List[Transaction]:
        """
        Get transaction history for account.
        
        Args:
            account_id: Account ID
            
        Returns:
            List of transactions (newest first)
            
        Raises:
            ValueError: If account not found
        """
        if account_id not in self.accounts:
            raise ValueError(f"Account not found: {account_id}")
        
        return sorted(
            self.transactions[account_id],
            key=lambda tx: tx.timestamp,
            reverse=True
        )
    
    def get_account_details(self, account_id: str) -> EscrowAccount:
        """
        Get full account details.
        
        Args:
            account_id: Account ID
            
        Returns:
            EscrowAccount object
            
        Raises:
            ValueError: If account not found
        """
        if account_id not in self.accounts:
            raise ValueError(f"Account not found: {account_id}")
        
        return self.accounts[account_id].copy()
    
    def simulate_wire_transfer(
        self,
        from_account: str,
        to_account: str,
        amount: int,
        description: str = ""
    ) -> str:
        """
        Simulate wire transfer between accounts (NO REAL MONEY).
        
        Args:
            from_account: Source account ID
            to_account: Destination account ID
            amount: Amount to transfer (18 decimals)
            description: Transfer description
            
        Returns:
            Transaction ID
            
        Raises:
            ValueError: If accounts not found or insufficient balance
        """
        if from_account not in self.accounts:
            raise ValueError(f"Source account not found: {from_account}")
        
        if to_account not in self.accounts:
            raise ValueError(f"Destination account not found: {to_account}")
        
        from_acc = self.accounts[from_account]
        
        if amount <= 0:
            raise ValueError(f"Invalid transfer amount: {amount}")
        
        if from_acc.balance < amount:
            raise ValueError(
                f"Insufficient balance: {from_acc.balance} < {amount}"
            )
        
        # Transfer funds (simulation)
        from_acc.balance -= amount
        self.accounts[to_account].balance += amount
        
        # Create transaction records
        tx_id = f"MOCK-WIRE-{uuid.uuid4().hex[:12]}"
        timestamp = datetime.utcnow().isoformat()
        
        # Debit transaction
        debit_tx = Transaction(
            tx_id=tx_id,
            account_id=from_account,
            type=TransactionType.WIRE_TRANSFER,
            amount=amount,
            status=TransactionStatus.COMPLETED_MVP2,
            timestamp=timestamp,
            description=description or "Mock wire transfer",
            counterparty_account=to_account
        )
        self.transactions[from_account].append(debit_tx)
        
        # Credit transaction
        credit_tx = Transaction(
            tx_id=tx_id,
            account_id=to_account,
            type=TransactionType.WIRE_TRANSFER,
            amount=amount,
            status=TransactionStatus.COMPLETED_MVP2,
            timestamp=timestamp,
            description=description or "Mock wire transfer received",
            counterparty_account=from_account
        )
        self.transactions[to_account].append(credit_tx)
        
        return tx_id
    
    def simulate_incoming_wire(
        self,
        to_account: str,
        amount: int,
        description: str = "",
        external_reference: str = ""
    ) -> str:
        """
        Simulate incoming wire from external source (NO REAL MONEY).
        
        Args:
            to_account: Destination account ID
            amount: Amount to receive (18 decimals)
            description: Transfer description
            external_reference: External wire reference
            
        Returns:
            Transaction ID
        """
        if to_account not in self.accounts:
            raise ValueError(f"Account not found: {to_account}")
        
        if amount <= 0:
            raise ValueError(f"Invalid amount: {amount}")
        
        # Add funds (simulation)
        self.accounts[to_account].balance += amount
        
        # Create transaction record
        tx_id = f"MOCK-WIRE-IN-{uuid.uuid4().hex[:12]}"
        timestamp = datetime.utcnow().isoformat()
        
        tx = Transaction(
            tx_id=tx_id,
            account_id=to_account,
            type=TransactionType.INCOMING_WIRE,
            amount=amount,
            status=TransactionStatus.COMPLETED_MVP2,
            timestamp=timestamp,
            description=description or f"Incoming wire: {external_reference}"
        )
        
        self.transactions[to_account].append(tx)
        
        return tx_id
    
    def simulate_outgoing_wire(
        self,
        from_account: str,
        amount: int,
        description: str = "",
        external_reference: str = ""
    ) -> str:
        """
        Simulate outgoing wire to external destination (NO REAL MONEY).
        
        Args:
            from_account: Source account ID
            amount: Amount to send (18 decimals)
            description: Transfer description
            external_reference: External wire reference
            
        Returns:
            Transaction ID
        """
        if from_account not in self.accounts:
            raise ValueError(f"Account not found: {from_account}")
        
        from_acc = self.accounts[from_account]
        
        if amount <= 0:
            raise ValueError(f"Invalid amount: {amount}")
        
        if from_acc.balance < amount:
            raise ValueError(
                f"Insufficient balance: {from_acc.balance} < {amount}"
            )
        
        # Deduct funds (simulation)
        from_acc.balance -= amount
        
        # Create transaction record
        tx_id = f"MOCK-WIRE-OUT-{uuid.uuid4().hex[:12]}"
        timestamp = datetime.utcnow().isoformat()
        
        tx = Transaction(
            tx_id=tx_id,
            account_id=from_account,
            type=TransactionType.OUTGOING_WIRE,
            amount=amount,
            status=TransactionStatus.COMPLETED_MVP2,
            timestamp=timestamp,
            description=description or f"Outgoing wire: {external_reference}"
        )
        
        self.transactions[from_account].append(tx)
        
        return tx_id
    
    def get_stats(self) -> Dict:
        """
        Get bank statistics.
        
        Returns:
            Dictionary with statistics
        """
        total_balance = sum(acc.balance for acc in self.accounts.values())
        total_transactions = sum(len(txs) for txs in self.transactions.values())
        
        return {
            "total_accounts": len(self.accounts),
            "total_balance": total_balance,
            "total_balance_formatted": f"{total_balance / 10**18:,.2f} UJEUR",
            "total_transactions": total_transactions,
            "bank_name": "Mock Bank (MVP-2 Testnet)",
            "is_testnet": True
        }


# =============================================================================
# FACTORY PATTERN: SERVICE SELECTION
# =============================================================================

def get_bank_service() -> IBankService:
    """
    Factory function to get appropriate bank service.
    
    MVP-2: Returns MockBankService
    Production: Returns BIICBankService (when implemented)
    
    Usage:
        bank_service = get_bank_service()
        account_id = bank_service.create_escrow_account(investor_id)
    
    Returns:
        IBankService implementation
    """
    from config.MVP_config import mvp_config
    
    if mvp_config.MVP_TESTNET and mvp_config.MOCK_BANK:
        return MockBankService()
    else:
        # Production: from banking.biic_bank_service import BIICBankService
        # return BIICBankService()
        raise NotImplementedError(
            "Production bank service not yet implemented. "
            "Use MVP_TESTNET mode for MockBankService."
        )


# =============================================================================
# TESTNET UTILITIES
# =============================================================================

def create_demo_accounts(investor_ids: List[str]) -> Dict[str, str]:
    """
    Create demo accounts for multiple investors.
    
    Args:
        investor_ids: List of investor IDs
        
    Returns:
        Dictionary mapping investor_id → account_id
    """
    bank_service = get_bank_service()
    accounts = {}
    
    for investor_id in investor_ids:
        account_id = bank_service.create_escrow_account(investor_id)
        accounts[investor_id] = account_id
    
    return accounts


def format_balance(balance: int, decimals: int = 18) -> str:
    """
    Format balance with decimals.
    
    Args:
        balance: Balance in smallest unit (18 decimals)
        decimals: Number of decimal places
        
    Returns:
        Formatted string
    """
    return f"{balance / 10**decimals:,.2f}"
