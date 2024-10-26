import {Request, RequestHandler, Response} from "express";
import OracleDB from "oracledb";
import dotenv from 'dotenv'; 
dotenv.config();

export namespace AccountsHandler {
    
    export type UserAccount = {
        id: number | undefined;
        completeName: string;
        email: string;
        password: string | undefined;
    };

    export type AccountRow = {
        TOKEN: string;
        ID?: number | undefined;
        COMPLETE_NAME?: string | undefined;
        EMAIL?: string | undefined;
        ACCOUNT_ROLE?: string | undefined;  //todos cadastrados são 'user', mas tem o 'admin'
    };

    export async function getUserRole(userToken: string) : Promise<string | undefined>{
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
    
        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        const userData = await connection.execute<AccountRow>(
            'SELECT TOKEN, ACCOUNT_ROLE FROM ACCOUNTS WHERE TOKEN = :usertoken',
            [userToken]
        );
        
        connection.close();

        if (userData.rows && userData.rows.length > 0){
            return userData.rows[0].ACCOUNT_ROLE;
        }

        return undefined;
    }

    export async function getUserEmail(userID: number): Promise<string|undefined>{
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
    
        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        const userData = await connection.execute<AccountRow>(
            'SELECT TOKEN, EMAIL FROM ACCOUNTS WHERE ID = :userid',
            [userID]
        );
        
        connection.close();

        if (userData.rows && userData.rows.length > 0){
            return userData.rows[0].EMAIL;
        }
        return undefined;
    }

    export async function getUserID(userToken: string) : Promise<number | undefined>{
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        const results = await connection.execute<AccountRow>(
            "SELECT TOKEN, ID FROM ACCOUNTS WHERE TOKEN = :token",
            [userToken]
        );

        await connection.close(); 
        console.dir("getUserID: ");
        console.dir(results.rows);

        if (results.rows && results.rows.length > 0){
            const userID = results.rows[0].ID;
            return userID;
        }

        return undefined;
    }

    export async function saveNewAccount(ua: UserAccount): Promise<string | undefined> {
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
    
        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
    
        await connection.execute(
            'INSERT INTO ACCOUNTS VALUES(SEQ_ACCOUNTS.NEXTVAL, :email, :password, :completename, \'user\', dbms_random.string(\'x\',32))',
            [ua.email, ua.password, ua.completeName]
        );

        const addedAccount = await connection.execute<AccountRow>(
            'SELECT TOKEN, ID FROM ACCOUNTS WHERE EMAIL = :email',
            [ua.email]
        );

        if (addedAccount.rows && addedAccount.rows.length > 0){
            await connection.execute(
                'INSERT INTO WALLET VALUES(:accountid, 0)',
                [addedAccount.rows[0].ID]
            );
        
            await connection.commit();  
            
            console.dir("Token Nova Conta: ");
            console.dir(addedAccount.rows);  // Log para depuração
        
            await connection.close();

            const accountToken: string = addedAccount.rows[0].TOKEN;
            return accountToken; 
        }
        
        connection.close();
    
        return undefined;
    }

    export async function validateEmail(email: string) : Promise<boolean>{
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        const results = await connection.execute(
            'SELECT EMAIL FROM ACCOUNTS WHERE EMAIL = :email',
            [email]
        );

        await connection.close(); 
        
        if (!results.rows || results.rows.length === 0){
            return true;
        }
        return false;
    }
    
    export const signUpHandler: RequestHandler = async(req: Request, res: Response) => {
        
        const pName = req.get('name');
        const pEmail = req.get('email');
        const pPassword = req.get('password');
        
        if(pName && pEmail && pPassword){
            
            if (await validateEmail(pEmail)){
                const newAccount: UserAccount = {
                    id: undefined,
                    completeName: pName,
                    email: pEmail, 
                    password: pPassword,
                }
                const newAccountToken = await saveNewAccount(newAccount);
                console.dir(newAccountToken)
                if (!newAccountToken){
                    res.statusCode = 400;
                    res.send(`Sign Up falhou`); 

                }else{
                    res.statusCode = 200; 
                    res.send(`Nova conta adicionada. Token: ${newAccountToken}`);
                }
            } else{
                res.statusCode = 400;
                res.send("Email Invalido.");
            }
        }else{
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.");
        }
    }

    async function login(email: string, password: string): Promise<string | undefined> {
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        const results = await connection.execute<AccountRow>(
            "SELECT TOKEN FROM ACCOUNTS WHERE EMAIL = :email AND PASSWORD = :password",
            [email, password]
        );

        await connection.close(); 
        console.dir("Token Login: ");
        console.dir(results.rows);
        if (results.rows && results.rows.length > 0) {
            const logedAccountToken = results.rows[0].TOKEN; 
            
            return logedAccountToken;
        }
        
        return undefined;
    }
    

    export const loginHandler: RequestHandler = async (req: Request, res: Response) => {
        const pEmail = req.get('email');
        const pPassword = req.get('password');

        if (pEmail && pPassword) {
            const userToken: string | undefined = await login(pEmail, pPassword);

            if (userToken) {
                res.status(200);
                res.send(`Login realizado com sucesso. Token : ${userToken}`);
            } else {
                res.status(401).send(`Email ou senha inválidos`);
            }
        } else {
            res.status(400).send('Requisição inválida - Parâmetros faltando');
        }
    };
}