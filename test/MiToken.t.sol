// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test, console} from "forge-std/Test.sol";
import {MiToken} from "../src/MiToken.sol"; // Asegúrate de que apunte al nombre de tu archivo

contract MiTokenTest is Test {
    MiToken public token;

    // Creamos dos direcciones ficticias de prueba
    address public creador = address(0x1);
    address public usuarioA = address(0x2);

    // Definimos 1,000 tokens iniciales considerando los 18 decimales (en Wei)
    uint256 public suministroInicial = 1000 * 10 ** 18;

    // Se ejecuta de manera automática antes de CADA test
    function setUp() public {
        // vm.prank fuerza a que la siguiente llamada la haga la dirección 'creador'
        vm.prank(creador);
        token = new MiToken(suministroInicial);
    }

    // 1. Validar que el total supply se haya asignado por completo al creador
    function test_SuministroInicial() public view {
        assertEq(token.totalSupply(), suministroInicial);
        assertEq(token.balanceOf(creador), suministroInicial);
    }

    // 2. Validar que la función estándar transfer funcione correctamente
    function test_TransferirTokens() public {
        uint256 montoAEnviar = 150 * 10 ** 18;

        // El creador hace la transferencia hacia el usuarioA
        vm.prank(creador);
        token.transfer(usuarioA, montoAEnviar);

        // Validamos que los balances se hayan modificado de manera correcta
        assertEq(token.balanceOf(usuarioA), montoAEnviar);
        assertEq(token.balanceOf(creador), suministroInicial - montoAEnviar);
    }
}
