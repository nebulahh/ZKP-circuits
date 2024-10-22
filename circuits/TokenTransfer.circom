pragma circom 2.0.0;

include "../node_modules/circomlib/circuits/mimcsponge.circom";
include "../node_modules/circomlib/circuits/comparators.circom";

template TokenTransfer() {

    signal input recipient;
    signal input amount;
    signal input nullifier;

    signal input privateKey;
    signal input senderBalance;
    signal input merklePathIndices[20];
    signal input merklePath[20];
    
    signal output newRoot;
    signal output nullifierHash;
    

    component balanceCheck = GreaterEqThan(252);
    balanceCheck.in[0] <== senderBalance;
    balanceCheck.in[1] <== amount;
    balanceCheck.out === 1;

    component nullifierHasher = MiMCSponge(1);
    nullifierHasher.ins[0] <== nullifier;
    nullifierHasher.k <== privateKey;
    nullifierHash <== nullifierHasher.outs[0];
 
    component merkleVerifier = MerkleTreeVerifier(20);
    merkleVerifier.leaf <== nullifierHash;
    for (var i = 0; i < 20; i++) {
        merkleVerifier.pathIndices[i] <== merklePathIndices[i];
        merkleVerifier.path[i] <== merklePath[i];
    }
    newRoot <== merkleVerifier.root;
}

component main {public [recipient, amount, nullifier]} = TokenTransfer();
