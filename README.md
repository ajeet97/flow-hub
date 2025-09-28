# FlowHub

**Complex DeFi Workflows Made Simple**

FlowHub is a visual workflow builder that enables users to create sophisticated DeFi transaction sequences on Flow blockchain without requiring technical knowledge of Cadence. Build, execute, and share complex multi-step DeFi strategies through an intuitive drag-and-drop interface.

## 🚀 Features

### **Visual Workflow Builder**
- Drag-and-drop interface for creating complex DeFi workflows
- No Cadence programming knowledge required
- Preview & validate workflow tx before executing

### **Atomic Execution**
- All workflows execute atomically using Cadence transaction scripts

### **Built-in DeFi Components**
- **Wallet**: Withdraw/Deposit Funds from wallet
- **Swap**: Exchange tokens across different DEXs
- **Liquid Staking**: Stake tokens while maintaining liquidity

## 📋 Example Workflows

### Multi-Step Arbitrage Strategy
```
100 FLOW → Swap to USDC → Lend USDC → Borrow stFLOW → Deposit to Yield Protocol
```

### Simple Liquid Staking
```
100 FLOW → Liquid Stake → Receive stFLOW
```

### Leveraged Position
```
1000 USDC → Deposit as Collateral → Borrow FLOW → Swap to USDC → Repeat
```

## 🛠 Getting Started

### Prerequisites
- Flow wallet (Blocto, Lilico, or Flow Wallet)
- Tokens on Flow mainnet/testnet

### Installation
```bash
# Clone the repository
git clone https://github.com/ajeet97/flowhub.git

# Install dependencies
cd flowhub
pnpm install

# Start the development server
pnpm run dev
```

### Creating Your First Workflow

1. **Connect Wallet**: Link your Flow wallet to FlowHub
2. **Select Components**: Click on DeFi components from the sidebar
3. **Configure Parameters**: Set parameters
4. **Connect Steps**: Link components to create your workflow sequence
5. **Validate**: Review the generated Cadence transaction
6. **Execute**: Sign and execute your atomic workflow

## 🏗 Architecture

### Core Components
- **Workflow Engine**: Converts visual workflows to Cadence scripts
- **Component Library**: Modular DeFi building blocks

### Supported Protocols
Currently IncrementFi's swapper & liquid staking is supported.  
More protocols can be integrated by building a connector for the protocol.

## 🔮 Future Scope
- Enhanced Components

  - Flash loans
  - Amount splitting across multiple steps
  - Conditional loops and iterations
  - Multi-wallet capabilities

- Automation & Scheduling

  - Scheduling workflows
  - Recurring workflows

- Marketplace

  - Workflow Marketplace: Share and monetize custom workflows
