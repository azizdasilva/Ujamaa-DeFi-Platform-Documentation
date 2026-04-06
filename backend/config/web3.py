"""
Web3 Configuration - Contract Addresses
Mirrors frontend config.web3.ts CONTRACTS
"""

class ContractAddresses:
    """Deployed contract addresses on Polygon Amoy Testnet"""
    ULP_TOKEN = "0xb6062A6e63a07C3598629A65ed19021445fB3b26"
    UAT_TOKEN = "0x0000000000000000000000000000000000000000"
    UGT_TOKEN = "0x081fb064eac4597befbb2e1d36d9a78d63a33958"
    LIQUIDITY_POOL = "0x36e27C0b63103863a8a31a6EadEadEa0a0cDc2cf"
    INDUSTRIAL_GATEWAY = "0x882071de6689ec1716bd7e162acf50707ac68930"
    JURISDICTION_COMPLIANCE = "0x4eb4c7f57e62a342ac7f322b87a31a7cd54d453c"
    MOCK_FIAT_RAMP = "0xDC4eFb44fED26593b54cBEEEE9F8b359BAA75A9a"
    MOCK_ESCROW = "0x8d446994fcD9906c573500959cDc8A8271a9485F"
    NAV_GATEWAY = "0x99712f923e3519B4305CEDAd402904299F29A000"
    MOCK_EUROD = "0xe42253d8bd95f73f1fc2fbdcc15fe498632dd4fc"

class Web3Config:
    CONTRACTS = ContractAddresses()
    EXPLORER = "https://amoy.polygonscan.com/"
    CHAIN_ID = 80002

web3_config = Web3Config()
