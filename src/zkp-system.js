const snarkjs = require("snarkjs");
const { buildMimc7 } = require("circomlibjs");

class ZKPSystem {
    constructor() {
        this.mimc7 = null;
        this.initialize();
    }
    
    async initialize() {
        this.mimc7 = await buildMimc7();
    }
    
    async generateProof(input, wasmFile, zkeyFile) {
        try {
            const { proof, publicSignals } = await snarkjs.groth16.fullProve(
                input,
                wasmFile,
                zkeyFile
            );
            return { proof, publicSignals };
        } catch (error) {
            throw new Error(`Proof generation failed: ${error.message}`);
        }
    }
    
    async verifyProof(verificationKey, publicSignals, proof) {
        try {
            const verified = await snarkjs.groth16.verify(
                verificationKey,
                publicSignals,
                proof
            );
            return verified;
        } catch (error) {
            throw new Error(`Proof verification failed: ${error.message}`);
        }
    }
    
    calculateNullifier(privateKey, salt) {
        return this.mimc7.multiHash([privateKey, salt]);
    }
    
    async generateMerkleProof(tree, leaf) {
        const proof = await tree.prove(leaf);
        return {
            root: proof.root,
            pathIndices: proof.pathIndices,
            path: proof.path
        };
    }
}

module.exports = ZKPSystem;
