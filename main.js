const BN = require('bn.js');
const bn = new BN();
var EC = require('elliptic').ec;
var ec = new EC('secp256k1');
var curve = require('elliptic').curve;
const crypto = require("crypto");

function generateShares(length) {
  let array = [];
  for (let i = 0; i < length; i++) {
    let temp2 = new BN(crypto.randomBytes(64).toString("hex"), "hex");
    array[i] = temp2;
  }
  return array;;
}
let shares = generateShares(2);
console.log("Initial state PRIVATE KEY:");
priKey = new BN(crypto.randomBytes(64).toString("hex"), "hex").umod(ec.n);
console.log(priKey);


let nodeIndex = [
  new BN(1),
  new BN(2),
  new BN(3),
  new BN(4),
  new BN(5),

];

var index = 0;
function generateSharesLagrangeInterpolation(shares, nodeIndex, priKey) {
  let secret = new BN(0);
  for (let i = index; i <= shares.length; i += 1) {
    let upper = new BN(1);
    let lower = new BN(1);
    for (let j = index; j <= shares.length; j += 1) {
      if (i !== j) {
        upper = upper.mul(nodeIndex[j].neg());
        let temp = nodeIndex[i].sub(nodeIndex[j]);
        lower = lower.mul(temp);
      }
    }
    let delta = upper.div(lower);
    if (i == shares.length) {
      index++;
      let delta2 = priKey.sub(secret);
      let share = delta2.div(delta);
      return share;
    }
    delta = delta.mul(shares[i]);
    secret = secret.add(delta);

  }
}

shares[2] = generateSharesLagrangeInterpolation(shares, nodeIndex, priKey);
shares[3] = generateSharesLagrangeInterpolation(shares, nodeIndex, priKey);
shares[4] = generateSharesLagrangeInterpolation(shares, nodeIndex, priKey);

console.log(nodeIndex);
console.log(shares);

console.log("Rebuild PRIVATE KEY:");
let newPriKey = lagrangeInterpolation(shares, nodeIndex);
console.log(newPriKey);

function lagrangeInterpolation(shares, nodeIndex) {

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