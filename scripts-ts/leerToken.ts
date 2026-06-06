import { createPublicClient, http, formatUnits } from "viem";
import { mainnet } from "viem/chains";

// 1. Configuración del cliente conectado a tu nodo local de Anvil
const client = createPublicClient({
  chain: mainnet,
  transport: http("http://127.0.0.1:8545"),
});

// 2. La dirección real del contrato que te acaba de dar la terminal
const CONTRATO_TOKEN = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// 3. La dirección de la Cuenta #0 (quien firmó el despliegue con su clave privada)
const CUENTA_DUEÑA = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

// 4. El "Fragmento de ABI" para indicarle a Viem cómo hablar con el estándar ERC20
const erc20AbiBasic = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ type: "uint256" }],
  },
  {
    name: "decimals",
    type: "function",
    stateMutability: "view",
    inputs: [],
    outputs: [{ type: "uint8" }],
  },
] as const;

async function main() {
  console.log("🔍 Consultando balances de tu Smart Contract en Anvil...");

  // 5. Leemos cuántos decimales tiene tu token (por estándar OpenZeppelin devolverá 18)
  const decimals = await client.readContract({
    address: CONTRATO_TOKEN,
    abi: erc20AbiBasic,
    functionName: "decimals",
  });

  // 6. Consultamos el saldo del creador (vuelve como un BigInt gigante sin decimales)
  const balanceWei: bigint = await client.readContract({
    address: CONTRATO_TOKEN,
    abi: erc20AbiBasic,
    functionName: "balanceOf",
    args: [CUENTA_DUEÑA],
  });

  // 7. Pasamos el BigInt a formato legible combinándolo con sus 18 decimales
  const balanceHumano = formatUnits(balanceWei, decimals);

  console.log(`\n📊 Datos del Token leídos con Viem:`);
  console.log(`   • Decimales detectados: ${decimals}`);
  console.log(`   • Balance de ${CUENTA_DUEÑA}: ${balanceHumano} MPT`);
}

main().catch((error) => {
  console.error("❌ Error en la lectura:", error);
});
