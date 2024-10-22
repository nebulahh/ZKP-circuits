const snarkjs = require("snarkjs");
const fs = require("fs");
const path = require("path");

async function setup() {
    console.log("Generating circuit parameters...");
    
    const circuit = path.join(__dirname, "../circuits/TokenTransfer.circom");
    const r1csFile = path.join(__dirname, "../build/TokenTransfer.r1cs");
    const wasmFile = path.join(__dirname, "../build/TokenTransfer_js/TokenTransfer.wasm");
    const zkeyFile = path.join(__dirname, "../build/TokenTransfer.zkey");
    
    await snarkjs.compiler(circuit, r1csFile, wasmFile);
    
    const ptau = path.join(__dirname, "../build/powersOfTau28_hez_final_08.ptau");
    await snarkjs.zKey.newZKey(r1csFile, ptau, zkeyFile);
    
    console.log("Setup complete!");
}

setup()
    .then(() => process.exit(0))
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
