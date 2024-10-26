import { Request, Response, RequestHandler } from "express";
import { AccountsHandler } from "../accounts/accounts";
import OracleDB from "oracledb";

export namespace TransactionsHandler{
    export type Bet = {
        BET_ID?: number;
        ACCOUNT_ID: number;
        EVENT_ID: number; 
        VALUE: number; 
        BET_DATE: Date;  
        BET_OPTION: string; 
        
    };

    type Wallet = {
        ACCOUNT_ID?: number;
        BALLANCE: number;
    };

    type CreditCard = {
        CARD_ID?: number;
        CARD_NUMBER: number;
        CARD_NAME: string;
        CVC: number;
        EXPIRATION_DATE: Date;
    };

    async function registerCreditCard(creditCard: CreditCard):Promise<number|undefined>{
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
    
        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        
        let cardInformations = await connection.execute<CreditCard>(
            'SELECT CARD_ID FROM CREDIT_CARD WHERE CARD_NUMBER = :cardnumber',
            [creditCard.CARD_NUMBER]
        );

        if(cardInformations.rows?.[0]?.CARD_ID){
            let cardConfirmation = await connection.execute<CreditCard>(
                'SELECT CARD_ID FROM CREDIT_CARD WHERE CARD_NUMBER = :cardnumber AND CARD_NAME = :cardname AND CVC = :cvc AND EXPIRATION_DATE = :expirationdate',
                [creditCard.CARD_NUMBER, creditCard.CARD_NAME, creditCard.CVC, creditCard.EXPIRATION_DATE]
            );
            connection.close();

            if(cardConfirmation.rows?.[0]?.CARD_ID){
                return cardConfirmation.rows[0].CARD_ID;
            }
            return undefined;
        }

        await connection.execute(
            'INSERT INTO CREDIT_CARD VALUES(SEQ_CARD.NEXTVAL, :cardnumber, :cardname, :cvc, :expirationdate)',
            [creditCard.CARD_NUMBER, creditCard.CARD_NAME, creditCard.CVC, creditCard.EXPIRATION_DATE]
        );

        connection.commit();

        cardInformations = await connection.execute<CreditCard>(
            'SELECT CARD_ID FROM CREDIT_CARD WHERE CARD_NUMBER = :cardnumber',
            [creditCard.CARD_NUMBER]
        );

        connection.close();

        if (cardInformations.rows?.[0]?.CARD_ID){
            return cardInformations.rows[0].CARD_ID;
        }
        
        return undefined;

    }

    async function addFunds(accountToken: string, value: number, creditCard: CreditCard):Promise<number>{
        const accountID = await AccountsHandler.getUserID(accountToken);

        if(!accountID){
            return 2;
        }

        const creditCardID = await registerCreditCard(creditCard);

        if (!creditCardID){
            return 1;
        }

        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
    
        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        
        await connection.execute(
            'UPDATE WALLET SET BALLANCE = BALLANCE + :value WHERE ACCOUNT_ID = :accountid',
            [value, accountID]
        );

        await connection.execute(
            'INSERT INTO DEPOSITS VALUES(SEQ_DEPOSIT.NEXTVAL, :accountid, :value, :cardid)',
            [accountID, value, creditCardID]
        );

        connection.commit();
        connection.close();

        return 0;
    }

    export const addFundsHandler: RequestHandler = async(req: Request, res: Response) =>{
        const tAccountToken = req.get('accountToken');
        const tValue = Number(req.get('value'));
        const tCardNumber = Number(req.get('cardNumber'));
        const tCardName = req.get('cardName');
        const tCVC = Number(req.get('CVC'));
        const tExpirationDate = req.get('expirationDate'); // yyyy-mm
        
        if (tAccountToken && tValue && tCardNumber && tCardName && tCVC && tExpirationDate && (tValue > 0)) {
            const expirationDate = new Date(`${tExpirationDate}-01T00:00:00`);
            const creditCard: CreditCard = {
                CARD_NUMBER: tCardNumber,
                CARD_NAME: tCardName,
                CVC: tCVC,
                EXPIRATION_DATE: expirationDate
            }

            const result = await addFunds(tAccountToken, tValue, creditCard);

            if (result === 0){
                res.statusCode = 200;
                res.send("Fundos adicionados com sucesso!");
            }else if(result === 1){
                res.statusCode = 500;
                res.send("Falha ao realizar a ação");
            }else {
                res.statusCode = 400;
                res.send("Parâmetros inválidos ou faltantes.");
            }

        } else {
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.")
        }


    }

}