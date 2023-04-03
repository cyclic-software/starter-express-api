const BN = require('bn.js');
const bn = new BN();
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
var curve = require('elliptic').curve;

// y = x^2 -2x + 3


let nodeIndex = [
    new BN(1),
    //new BN(2),
    new BN(3),
    new BN(4),
    //new BN(5),

];

let shares = [
    new BN("fb85caadc86644ed19b3e4d951f8154ab0833f62b1de587ae984bbe887a3e82246e5115ade386a401f6ca9238b398175b7c2c4ed59a94d2b0b06fad21d7ec311", "hex"),
    //new BN("5c9e83afde9e9e89a67d50c8fe2d717de33b7b11071bc61289783c13dfa15824f1f0bf7878c7dd53eb516bbb3b00973f1a35fb69700e943c96505055e68b9431", "hex"),
    new BN("-135b514ed7c045c97a95cdd5d517096f32758a4b345b29e00c6cbd5acdf96f345f6fee3762252e221288831b0131e379875d050e4342ea01898de6e6eb0fcaf15", "hex"),
    new BN("-46275bf3688d543098621846d46d1587bafb7c82bef21ecf760a1232ace75b6d05f7a4d43b85c6abce82e2dcebc77308c886c3e082a2af086acb612a5d1fd0a48", "hex"),
    //new BN("-8f1f8907c876337f05fb904cafea50c4aa06261edb70073be7b9473cae4d55e3ef8fc0154b23ddfa00f9bde65f74391c942e9c1fe3f877cd241d101416ed47c3b", "hex"),

];

function lagrangeInterpolation(shares, nodeIndex) {
    if (shares.length !== nodeIndex.length) {
        return null;
    }
    let secret = new BN(0);
    for (let i = 0; i < shares.length; i += 1) {
        let upper = new BN(1);
        let lower = new BN(1);
        for (let j = 0; j < shares.length; j += 1) {
            if (i !== j) {
                upper = upper.mul(nodeIndex[j].neg());
                upper = upper.umod(ec.n);
                let temp = nodeIndex[i].sub(nodeIndex[j]);
                temp = temp.umod(ec.n);
                lower = lower.mul(temp).umod(ec.n);
            }
        }
        let delta = upper.mul(lower.invm(ec.n)).umod(ec.n);
        delta = delta.mul(shares[i]);
        secret = secret.add(delta);
    }
    return secret.umod(ec.n);
}

const derivedPrivateKey = lagrangeInterpolation(shares, nodeIndex);
console.log(derivedPrivateKey);

//privateket 46614476767777658307523919476986223844918179847846400990762178436108490408339
//20dfbe9414c31333b947040669adb038b8d77144e22cd917790a592d08ae0fb4

