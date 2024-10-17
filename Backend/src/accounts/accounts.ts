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

    interface AccountRow {
        token: string;
    }

    export async function saveNewAccount(ua: UserAccount) : Promise <string | undefined>{
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        await connection.execute(
            'INSERT INTO ACCOUNTS VALUES(:completeName, :email, :password)',
            [ua.completeName, ua.email, ua.password]
        );

        const addedAccount = await connection.execute<AccountRow>(
            'SELECT token FROM ACCOUNTS WHERE email = :email',
            [ua.email]
        );

        await connection.close(); 

        if (addedAccount.rows){
            return addedAccount.rows[0].token;
        }  
        
        
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
            'SELECT email FROM ACCOUNTS WHERE email = :email',
            [email]
        );

        await connection.close(); 
        
        if (!results.rows){
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
            'SELECT token FROM ACCOUNTS WHERE email = :email AND password = :password',
            [email, password]
        );

        await connection.close(); 

        if (!results.rows) {
            return undefined;
        }
        const logedAccountToken: string = results.rows[0].token; 
        
        return logedAccountToken;
    }
    

    export const loginHandler: RequestHandler = async (req: Request, res: Response) => {
        const pEmail = req.get('email');
        const pPassword = req.get('password');

        if (pEmail && pPassword) {
            const userToken = await login(pEmail, pPassword);

            if (userToken) {
                res.status(200);
                res.send(`Login realizado com sucesso. Token : ${userToken}`);
            } else {
                res.status(401).send('Email ou senha inválidos');
            }
        } else {
            res.status(400).send('Requisição inválida - Parâmetros faltando');
        }
    };
}