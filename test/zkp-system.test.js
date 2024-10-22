const { expect } = require("chai");
const ZKPSystem = require("../src/zkp-system");
const path = require("path");

describe("ZKP System", function() {
    let zkpSystem;
    
    before(async function() {
        zkpSystem = new ZKPSystem();
        await zkpSystem.initialize();
    });
    
    it("should generate valid proof", async function() {
        const input = {
            recipient: "0x123...",
            amount: 100,
            privateKey: "0x456...",
            senderBalance: 1000,
            nullifier: "0x789..."
        };
        
        const wasmFile = path.join(__dirname, "../build/TokenTransfer_js/TokenTransfer.wasm");
        const zkeyFile = path.join(__dirname, "../build/TokenTransfer.zkey");
        
        const { proof, publicSignals } = await zkpSystem.generateProof(
            input,
            wasmFile,
            zkeyFile
        );
        
        expect(proof).to.not.be.null;
        expect(publicSignals).to.not.be.null;
    });
    
    it("should verify valid proof", async function() {
        // Test implementation
    });
});
