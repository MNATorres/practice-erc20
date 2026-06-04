// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Importamos el contrato base ERC20 de la librería que ya tienes instalada
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MiToken is ERC20 {
    // Al instanciarse, se define el Nombre, Símbolo y se acuña el suministro inicial
    constructor(uint256 suministroInicial) ERC20("Mi Primer Token", "MPT") {
        // _mint le asigna los tokens directamente a la billetera que despliega (msg.sender)
        _mint(msg.sender, suministroInicial);
    }
}