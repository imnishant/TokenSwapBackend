import models from "./../../../Config/Databse/Models";
import Axios from "axios";
const Web3 = require("web3");
const Big = require("big.js");
import { response } from "express";
import bcd_abi from './../../../Config/Contract_Abi/bcd_abi';

const { User } = models;

// connect to Infura node
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_NODE));

export default class TransactionModel {
  async getEtherBalance(args) {
    try {
      return new Promise((resolve, reject) => {
        if (args.address) {
          User.findOne({
            wallet_address: args.address
          }).exec((error, user) => {
            if (error) {
              reject({
                message: "DB Exception. Issue in connecting to DB.",
                name: "DBException"
              });
              return;
            }
            if (user) {
              const params = JSON.stringify({
                jsonrpc: "2.0",
                method: "eth_getBalance",
                params: [args.address, "latest"],
                id: 1,
              });
              Axios.post(process.env.INFURA_NODE, params, {
                headers: {
                  "Content-Type": "application/json",
                },
              }).then(response => {
                var ETH_Wei = parseInt(response.data.result, 16);
                ETH_Wei = new Big(ETH_Wei);
                var decimals = Math.pow(10, 18);
                decimals = new Big(decimals);
                var ETH = ETH_Wei.div(decimals);
                ETH = ETH.toFixed(18);
                resolve({
                  wallet_address: args.address,
                  ethereum_balance: ETH
                });
                return;
              });
            } else {
              reject({
                message: "Address not found, please check and try again.",
                name: "NotFoundException"
              });
              return;
            }
          });
        } else {
          reject({
            message: "Incorrect parameter. Expected parameters: { address }",
            name: "IncorrectParameters"
          });
        }
      });
    } catch (error) {
      return error;
    }
  }

  async getBCDBalance(args) {
    try {
      return new Promise((resolve, reject) => {
        if (args.address) {
          User.findOne({
            wallet_address: args.address
          }).exec((error, user) => {
            if (error) {
              reject({
                message: "DB Exception. Issue in connecting to DB.",
                name: "DBException"
              });
              return;
            }
            if (user) {
              const walletAddress = args.address;
              var bcdContractAddress = process.env.BCD_CONTRACT_ADDRESS;
              var contract = new web3.eth.Contract(bcd_abi.abi, bcdContractAddress, {
                from: walletAddress,
              });
              async function getDecimal() {
                var decimal = await contract.methods.decimals().call();
                return decimal;
              }
              contract.methods
                .balanceOf(walletAddress)
                .call()
                .then(async (res) => {
                  res = new Big(res);
                  await getDecimal().then((decimals) => {
                    decimals = parseInt(decimals);
                    decimals = Math.pow(10, decimals);
                    decimals = new Big(decimals);
                    res = res.div(decimals);
                    res = res.toFixed(18);
                    resolve({
                      wallet_address: walletAddress,
                      bcd_balance: res,
                      decimals: decimals
                    });
                    return;
                  });
                });
            } else {
              reject({
                message: "Address not found, please check and try again.",
                name: "NotFoundException"
              });
              return;
            }
          });
        } else {
          reject({
            message: "Incorrect parameter. Expected parameters: { address }",
            name: "IncorrectParameters"
          });
        }
      });
    } catch (error) {
      return error;
    }
  }
}