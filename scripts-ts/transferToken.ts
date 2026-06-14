import "dotenv/config";
import {
  createPublicClient,
  createWalletClient,
  http,
  parseUnits,
  formatUnits,
} from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { mainnet } from "viem/chains";

// 1. Direcciones clave
const CONTRATO_TOKEN = (process.env.CONTRATO_TOKEN || "0x5FbDB2315678afecb367f032d93F642f64180aa3") as `0x${string}`;
const BILLETERA_AMIGO = (process.env.BILLETERA_AMIGO || "0x70997970C51812dc3A010C7d01b50e0d17dc79C8") as `0x${string}`; // Cuenta #1 de Anvil

// Clave privada de la Cuenta #0 de Anvil (El emisor y dueño de los tokens)
const CLAVE_PRIVADA_CREADOR = (process.env.CLAVE_PRIVADA_CREADOR || "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80") as `0x${string}`;
const account = privateKeyToAccount(CLAVE_PRIVADA_CREADOR);

// 2. Creamos los dos tipos de clientes de Viem
const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.RPC_URL || "http://127.0.0.1:8545"),
});

const walletClient = createWalletClient({
  account,
  chain: mainnet,
  transport: http(process.env.RPC_URL || "http://127.0.0.1:8545"),
});

// 3. ABI mínimo necesario para la función de escritura (transfer) y lectura (balanceOf)
const erc20AbiTransfer = [
  {
    name: "transfer",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "to", type: "address" },
      { name: "value", type: "uint256" },
    ],
    outputs: [{ type: "bool" }],
  },
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
] as const;

async function main() {
  console.log("🚀 Iniciando proceso de transferencia firmado...");

  // 4. Convertimos 100 tokens a formato Wei (agregando los 18 ceros de forma segura para Solidity)
  const montoAEnviar = "100";
  const montoEnWei = parseUnits(montoAEnviar, 18);

  console.log(
    `\n✍️  Firmando transferencia de ${montoAEnviar} MPT hacia la cuenta del amigo...`,
  );

  // 5. walletClient.writeContract firma y envía la transacción que modifica la blockchain
  const hash = await walletClient.writeContract({
    address: CONTRATO_TOKEN,
    abi: erc20AbiTransfer,
    functionName: "transfer",
    args: [BILLETERA_AMIGO, montoEnWei],
  });

  console.log(`✅ Transacción enviada. Hash del recibo: ${hash}`);
  console.log("⏳ Esperando confirmación del bloque en Anvil...");

  // 6. Esperamos que el bloque se mine localmente para asegurar el cambio
  await publicClient.waitForTransactionReceipt({ hash });
  console.log("🎉 ¡Transacción minada con éxito!");

  // 7. Verificamos mediante una lectura rápida que el balance del amigo se haya actualizado
  const balanceAmigoWei = await publicClient.readContract({
    address: CONTRATO_TOKEN,
    abi: erc20AbiTransfer,
    functionName: "balanceOf",
    args: [BILLETERA_AMIGO],
  });

  console.log(
    `💰 Nuevo balance del amigo: ${formatUnits(balanceAmigoWei, 18)} MPT`,
  );
}

main().catch((error) => {
  console.error("❌ Error en la transferencia:", error);
});
