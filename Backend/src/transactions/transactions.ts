import { Request, Response, RequestHandler } from "express";
import { AccountsHandler } from "../accounts/accounts";
import OracleDB from "oracledb";
import { EventsHandler } from "../events/events";

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

    type BankAccount = {
        BANK_ID?: number;
        ACCOUNT_NUMBER: number;
        BANK_NUMBER: number;
        AGENCY: number;
    };

    type Pix = {
        PIX_ID?: number;
        KEY: string;
    };

    async function verifyWalletCredit(accountID: number, value: number):Promise<boolean>{
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
    
        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        const validWallet = await connection.execute<Wallet>(
            'SELECT ACCOUNT_ID FROM WALLET WHERE ACCOUNT_ID = :accountid AND BALLANCE >= :value',
            [accountID, value]
        );
        await connection.close();
        console.dir('valid wallet: ');
        console.dir(validWallet.rows?.[0]?.ACCOUNT_ID);
        if (validWallet.rows?.[0]?.ACCOUNT_ID){
            return true;
        }
        return false;
    }

    async function debitFromWallet(accountID: number, value: number){
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
    
        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

       await connection.execute(
        'UPDATE WALLET SET BALLANCE = BALLANCE - :value WHERE ACCOUNT_ID = :accountid',
        [value, accountID]
       );

       await connection.commit();
       await connection.close();
       
    }

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

        await connection.commit();

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

        await connection.commit();
        await connection.close();

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
            res.send("Parâmetros inválidos ou faltantes.");
        }
    }

    async function registerWithdrawBank(bankAccount: BankAccount):Promise<number|undefined>{
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
    
        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        let bankInformation = await connection.execute<BankAccount>(
            'SELECT BANK_ID FROM BANK_ACCOUNT WHERE ACCOUNT_NUMBER = :accountnumber',
            [bankAccount.ACCOUNT_NUMBER]
        );

        if(bankInformation.rows?.[0]?.BANK_ID){ 
            bankInformation = await connection.execute<BankAccount>(
                'SELECT BANK_ID FROM BANK_ACCOUNT WHERE ACCOUNT_NUMBER = :accountnumber AND BANK_NUMBER = :banknumber AND AGENCY = :agency',
                [bankAccount.ACCOUNT_NUMBER, bankAccount.BANK_NUMBER, bankAccount.AGENCY]
            );
            await connection.close();
            console.dir(`Bank ID: ${bankInformation.rows?.[0]?.BANK_ID}`);

            if(bankInformation.rows?.[0]?.BANK_ID){
                return bankInformation.rows[0].BANK_ID;
            }

            return undefined;
        }

        await connection.execute(
            'INSERT INTO BANK_ACCOUNT VALUES(SEQ_BANK.NEXTVAL, :accountnumber, :banknumber, :agency)',
            [bankAccount.ACCOUNT_NUMBER, bankAccount.BANK_NUMBER, bankAccount.AGENCY]
        ); 
        await connection.commit();

        bankInformation = await connection.execute<BankAccount>(
            'SELECT BANK_ID FROM BANK_ACCOUNT WHERE ACCOUNT_NUMBER = :accountnumber',
            [bankAccount.ACCOUNT_NUMBER]
        ); 
        await connection.close();
        
        if(bankInformation.rows?.[0]?.BANK_ID){ 
            return bankInformation.rows?.[0]?.BANK_ID;
        }

        return undefined;
    }

    async function registerWithdrawPix(pix: Pix):Promise<number|undefined>{
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
    
        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        let pixInformation = await connection.execute<Pix>(
            'SELECT PIX_ID FROM PIX WHERE KEY = :pixkey',
            [pix.KEY]
        );

        if(pixInformation.rows?.[0]?.PIX_ID){
            await connection.close();
            return pixInformation.rows[0].PIX_ID;
        }

        await connection.execute(
            'INSERT INTO PIX VALUES(SEQ_PIX.NEXTVAL, :key)',
            [pix.KEY]
        );
        await connection.commit();

        pixInformation = await connection.execute<Pix>(
            'SELECT PIX_ID FROM PIX WHERE KEY = :pixkey',
            [pix.KEY]
        );
        await connection.close();

        if(pixInformation.rows?.[0]?.PIX_ID){
            return pixInformation.rows[0].PIX_ID;
        }

        return undefined;
    }

    function WithdrawTax(value: number){
        if (value<=100){
            return 0.04;
        }
        if (value<=1000){
            return 0.03;
        }
        if (value<=5000){
            return 0.02;
        }
        if (value<=100000){
            return 0.01;
        }
        return 0;
    }

    async function verifyWithdrawQuota(accountID: number, value: number){
        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        const currdate = new Date();

        const result = await connection.execute<{ TOTAL: number }>(
            `SELECT SUM(VALUE) AS TOTAL FROM WITHDRAWALS WHERE ACCOUNT_ID = :accountID 
               AND TRUNC(WITHDRAWAL_DATE) = TRUNC(:currdate)`,
            [accountID, currdate]
        );
        await connection.close();
        console.dir(`Itens do dia: `)
        console.dir(result.rows);

        let totalWithdrawnToday = 0;
        if(result.rows?.[0]?.TOTAL){
            totalWithdrawnToday = result.rows[0].TOTAL;
        }
        console.dir(totalWithdrawnToday);

        return (totalWithdrawnToday + value) <= 101000;
    }

    async function withdrawFunds(accountToken: string, value: number, pix: Pix | undefined, bankAccount: BankAccount | undefined):Promise<number>{
        if (value<=0 || value>101000){
            return 1;
        }

        const accountID = await AccountsHandler.getUserID(accountToken);
        if (!accountID){
            return 1;
        }

        const validWalletCredit = await verifyWalletCredit(accountID, value);
        if (!validWalletCredit){
            return 2;
        }

        const validDailyQuota = await verifyWithdrawQuota(accountID, value);
        if(!validDailyQuota){
            return 3;
        }
        const withdrawTax = await WithdrawTax(value);

        let pixID = null;
        let bankID = null;
        if (pix){
            pixID = await registerWithdrawPix(pix);
            
        }
        if (bankAccount){
            bankID = await registerWithdrawBank(bankAccount);
        }

        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        const currdate = new Date();

        await connection.execute(
            `INSERT INTO WITHDRAWALS VALUES(
                SEQ_WITHDRAWAL.NEXTVAL,
                :accountid,
                :value,
                :withdrawaltax,
                :currdate,
                :bankid,
                :pixid
            )`,
            [accountID, value, (value*withdrawTax), currdate,bankID, pixID]
        );

        await debitFromWallet(accountID, value);
        connection.commit();
        connection.close();

        return 0;
    }

    export const withdrawFundsHandler: RequestHandler = async(req: Request, res: Response) =>{
        const tAccountToken = req.get('accountToken');
        const tValue = Number(req.get('value'));
        const tPixKey = req.get('pixKey');
        const tBankAccountNumber = Number(req.get('bankAccountNumber'));
        const tBankNumber = Number(req.get('BankNumber'));
        const tAgencyNumber = Number(req.get('angencyNumber')); 

        if(tAccountToken && tValue && (tPixKey || (tBankAccountNumber && tBankNumber && tAgencyNumber)) && !(tPixKey && (tBankAccountNumber && tBankNumber && tAgencyNumber))){
            let pix: Pix | undefined = undefined;
            let bankAccount: BankAccount | undefined = undefined;
            if(tPixKey){
                pix = {
                    KEY: tPixKey
                };
            }else {
                bankAccount = {
                    ACCOUNT_NUMBER: tBankAccountNumber,
                    BANK_NUMBER: tBankNumber,
                    AGENCY: tAgencyNumber
                };
            }

            const result = await withdrawFunds(tAccountToken, tValue, pix, bankAccount);

            if (result === 0){
                res.statusCode = 200;
                res.send("Dinheiro sacado com sucesso.");
            } else if(result === 1){
                res.statusCode = 400;
                res.send("Parâmetros inválidos.");
            }else if(result === 2){
                res.statusCode = 409;
                res.send("Saldo Insufuciente.");
            } else if(result === 3){
                res.statusCode = 429;
                res.send("Limite de saque excedido.");
            }


        }else{
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.");
        }
    }

    async function betOnEvent(bet: Bet):Promise<number>{
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        const validEvent = await connection.execute<EventsHandler.EventRow>(
            'SELECT EVENT_ID FROM EVENTS WHERE EVENT_ID = :eventid AND END_DATE >= :currdate AND STATUS = \'Approved\'',
            [bet.EVENT_ID, bet.BET_DATE]
        );

        if(!validEvent.rows?.[0]?.EVENT_ID){
            connection.close();
            return 1;
        }

        const validWallet = await verifyWalletCredit(bet.ACCOUNT_ID, bet.VALUE);

        if(!validWallet){
            connection.close();
            return 2;
        }

        await debitFromWallet(bet.ACCOUNT_ID, bet.VALUE);
        await connection.execute(
            'INSERT INTO BETS VALUES(SEQ_BET.NEXTVAL, :accountid, :eventid, :value, :betdate, :betoption)',
            [bet.ACCOUNT_ID, bet.EVENT_ID, bet.VALUE, bet.BET_DATE, bet.BET_OPTION]
        );
        connection.commit();
        connection.close();

        return 0;
    }

    export const betOnEventHandler: RequestHandler = async(req: Request, res: Response) =>{
        const tAccountToken = req.get('accountToken');
        const tEventID = Number(req.get('eventID'));
        const tValue = Number(req.get('value'));
        const tBetOption = req.get('betOption'); //sim ou não
        
        if (tAccountToken && tEventID && tValue && tBetOption &&(tValue>0)){
            const userID = await AccountsHandler.getUserID(tAccountToken);
            const currdate = new Date();

            if (userID){
                const newBet: Bet = {
                    ACCOUNT_ID: userID,
                    EVENT_ID: tEventID,
                    VALUE: tValue, 
                    BET_DATE: currdate,  
                    BET_OPTION: tBetOption.toLowerCase()
                }
                const result = await betOnEvent(newBet);
                if(result === 0){
                    res.statusCode = 200;
                    res.send("Aposta registrada com sucesso.");
                }else if(result === 1){
                    res.statusCode = 400;
                    res.send("Evento Invalido.");
                }else if(result === 2){
                    res.statusCode = 402;
                    res.send("Saldo insuficiente.");
                }

            }else {
                res.statusCode = 400;
                res.send("Parâmetros inválidos ou faltantes.");
            }
        }else {
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.");
        }

    }

    async function finishEvent(admToken: string, eventID: number, verdict: string):Promise<number>{
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
        const connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        if(verdict != 'sim' && verdict != 'não'){
            connection.close();
            return 400;
        }

        const userRole = await AccountsHandler.getUserRole(admToken);
        if (userRole !== "admin") {
            connection.close();
            return 403;
        }

        const eventResult = await connection.execute(
            `SELECT STATUS FROM EVENTS WHERE EVENT_ID = :eventID AND STATUS = 'Approved'`,
            [eventID]
        );

        if (!eventResult.rows || eventResult.rows.length === 0) {
            await connection.close();
            return 404;
        }

        await connection.execute(
            `UPDATE EVENTS 
             SET STATUS = 'Closed', RIGHT_RESPONSE = :verdict 
             WHERE EVENT_ID = :eventID`,
            [verdict, eventID]
        );
        

        const totalBets = await connection.execute<Bet>(
            `SELECT VALUE FROM BETS 
             WHERE EVENT_ID = :eventID`,
            [eventID]
        );

        const winningBetsResult = await connection.execute<Bet>(
            `SELECT ACCOUNT_ID, VALUE FROM BETS 
             WHERE EVENT_ID = :eventID AND BET_OPTION = :verdict`,
            [eventID, verdict]
        );

        if(!winningBetsResult.rows?.[0]?.ACCOUNT_ID || !totalBets.rows?.[0]?.VALUE){
            connection.close();
            return 0;
        }

        let totalBetValue = 0;
        for(var i = 0; i < totalBets.rows.length; i++){
            totalBetValue += totalBets.rows[i].VALUE;
        }

        let totalWinningBetValue = 0;
        for(var i = 0; i < winningBetsResult.rows.length; i++){
            totalWinningBetValue += winningBetsResult.rows[i].VALUE;
        }
        
        for(var i = 0; i < winningBetsResult.rows.length; i++){
            const winningAmount = (winningBetsResult.rows[i].VALUE / totalWinningBetValue) * totalBetValue;

            await connection.execute(
                `UPDATE WALLET 
                 SET BALLANCE = BALLANCE + :winningAmount 
                 WHERE ACCOUNT_ID = :accountID`,
                [winningAmount, winningBetsResult.rows[i].ACCOUNT_ID]
            );
        }

        await connection.commit(); // Confirma todas as operações de atualização
        await connection.close();

        return 0;
    }

    export const finishEventHandler: RequestHandler = async(req: Request, res: Response) =>{
        const tAdmToken = req.get("admToken");
        const tEventID = Number(req.get("eventID"));
        const tVerdict = req.get("verdict"); // ocorreu(sim) não ocorreu(não)

        if (tAdmToken && tEventID && tVerdict){
            const finishEventResult = await finishEvent(tAdmToken, tEventID, tVerdict);

            if(finishEventResult === 0){
                res.statusCode = 200;
                res.send("Evento finalizado com sucesso. Os fundos foram distribuídos.");
            }else if(finishEventResult === 403){
                res.statusCode = 403;
                res.send("Sem permissão para finalizar o evento.");
            }else if(finishEventResult === 404){
                res.statusCode = 404;
                res.send("Evento não encontrado.");
            }else{
                res.statusCode = 400;
                res.send("Parâmetros inválidos.");
            }


        }else {
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.");
        }
    }

}