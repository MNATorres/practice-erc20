// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {MiToken} from "../src/MiToken.sol";

contract MiTokenScript is Script {
    function run() public {
        // Expresamos el número directamente en Solidity, libre de errores de consola
        uint256 suministro = 1000 * 10 ** 18;

        // vm.startBroadcast le dice a Foundry que firme las transacciones reales
        vm.startBroadcast();

        // Creamos el token directamente desde el código
        new MiToken(suministro);

        vm.stopBroadcast();
    }
}
