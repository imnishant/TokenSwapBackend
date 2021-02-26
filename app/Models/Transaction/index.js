import models from "./../../../Config/Databse/Models";
import Axios from "axios";
const Web3 = require("web3");
const Big = require("big.js");
import { response } from "express";

const { User } = models;

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
                  ethereum_address: args.address,
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
}