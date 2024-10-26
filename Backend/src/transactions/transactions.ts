import { Request, Response, RequestHandler } from "express";
import OracleDB from "oracledb";

export namespace TransactionsHandler{
    export type Bet = {
        BET_ID: number;
        ACCOUNT_ID: number;
        EVENT_ID: number; 
        VALUE: number; 
        BET_DATE: Date;  
        BET_OPTION: string; 
        
    };

}