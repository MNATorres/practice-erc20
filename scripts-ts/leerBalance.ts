import { createPublicClient, http, formatEther } from "viem";
import { mainnet } from "viem/chains";

// 1. Creamos el cliente público (el puente/lente que mira hacia la Blockchain)
const client = createPublicClient({
  chain: mainnet, // Usamos la configuración base de mainnet para tipos de datos
  transport: http("http://127.0.0.1:8545"), // Apunta directo al puerto donde corre tu Anvil
});

async function main() {
  console.log("🔄 Conectando a la Blockchain local de Anvil...");

  // 2. Le pedimos al cliente que lea el número del bloque actual de tu nodo
  const blockNumber = await client.getBlockNumber();
  console.log(`🚀 ¡Conexión exitosa! Bloque actual en Anvil: #${blockNumber}`);

  // 3. Tomamos la primera dirección pública que te arrojó Anvil al encenderlo
  const direccionPrueba = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  // 4. Leemos su balance de Ether nativo (la respuesta viene como un número gigante: bigint)
  const balanceWei = await client.getBalance({ address: direccionPrueba });

  // 5. Aplicamos la teoría: el balance viene expresado en Wei (sin decimales).
  // formatEther lo convierte en un string legible para un humano.
  const balanceHumano = formatEther(balanceWei);

  console.log(
    `💰 Balance de la cuenta ${direccionPrueba}: ${balanceHumano} ETH`,
  );
}

main().catch((error) => {
  console.error("❌ Error en el script:", error);
});
