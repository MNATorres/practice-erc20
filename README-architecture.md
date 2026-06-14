# 🗺️ The Architecture Map (Full Stack Web3)

When building a Web3 application, the architecture is divided into two major worlds that must learn to communicate: the **Blockchain World (Immutable Backend)** and the **Traditional World (Frontend/Off-chain Scripts)**.

Here is the breakdown of what has been built, organized by layers:

---

## 🏢 Layer 1: The Immutable Brick (Solidity)
* **What is built:** The `MiToken.sol` file (located in [src/MiToken.sol](file:///wsl.localhost/Ubuntu/home/matias/practice-erc20/src/MiToken.sol)).
* **Why it matters:** This is the core logic of the system. In traditional development, your business rules and database run on a central server (like AWS or Firebase) that you can shut down, modify, or hack. In Web3, you write these rules in Solidity. Once deployed, they are public, auditable, immutable (no one can change them), and run in a decentralized manner. Your token contract defines who owns what.

---

## 🏭 Layer 2: The Infrastructure / The Engine (Anvil)
* **What is built:** The console running the `anvil` command.
* **Why it matters:** For a Solidity contract to function, it needs a blockchain operating system (the EVM - Ethereum Virtual Machine). Because deploying to the real Ethereum mainnet costs real money and takes time to confirm each block, we use Anvil as an ultra-fast local simulator. Anvil mimics the exact behavior of Ethereum in your computer's memory, provides pre-funded test accounts with mock ETH, and exposes a local port (`http://127.0.0.1:8545`) so the rest of the world can communicate with it.

---

## 🚀 The Bridge: Deployment Scripts (Foundry Script)
* **What is built:** The `MiToken.s.sol` file (located in [script/MiToken.s.sol](file:///wsl.localhost/Ubuntu/home/matias/practice-erc20/script/MiToken.s.sol)) and the command `forge script ... --broadcast`.
* **Why it matters:** Your `.sol` files are just human-readable source code. `forge script` compiles this code (translating it into machine-readable bytecode and generating ABIs) and, through the `--broadcast` flag, sends it over the local network to deploy or "inject" the contract into Anvil. Upon completion, it returns the **Contract Address**, which acts as the unique "phone number" to call and interact with your token in the future.

---

## 🌐 Layer 3: The External Application (TypeScript + Viem)
* **What is built:** The scripts `leerBalance.ts`, `leerToken.ts`, and `transferToken.ts` inside [scripts-ts/](file:///wsl.localhost/Ubuntu/home/matias/practice-erc20/scripts-ts).
* **Why it matters:** Everyday users do not open a Linux terminal to interact with smart contracts. They use web interfaces (React, Next.js) or mobile apps. These user interfaces need a translator to connect to the blockchain. In our codebase, **Viem** serves as that translator.
* With Viem, you create a public client that connects to the local Anvil port (`8545`), references your deployed contract address, and queries the current balances from outside the blockchain.

---

## 🔄 End-to-End Data Flow
Here is how data travels from one end to the other when querying balances or executing scripts:

```
 [Your Contract in Anvil] 
        │
        ▼ (Returns balance in Wei: "1000000000000000000000" as a TypeScript BigInt)
   [Viem Library]
        │
        ▼ (Applies 'formatUnits' function using the 18 decimals of the token)
 [Your TypeScript Script] ──▶ Prints to console: "1000 MPT" ✅
```

1. Your TypeScript script asks Viem: *"I want to check the `balanceOf` this address."*
2. Viem translates this query into a standardized network request (JSON-RPC) and calls the local Anvil port.
3. The Anvil node executes the contract bytecode in its local memory and returns a massive integer native to the EVM (a `bigint` represented in Wei).
4. Your TypeScript code receives this raw BigInt, formats it by dividing it by the token's 18 decimal places, and displays it elegantly on your screen as: `1000 MPT`.
