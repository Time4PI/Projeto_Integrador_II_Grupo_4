import {Request, RequestHandler, Response} from "express";
import OracleDB from "oracledb";

export namespace AccountsHandler {
    
    export type UserAccount = {
        id: number | undefined;
        completeName: string;
        email: string;
        password: string | undefined;
    };

    export async function saveNewAccount(ua: UserAccount) : Promise <UserAccount | undefined>{
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
        
        const connection = await OracleDB.getConnection({
            user: "COLOCAR DPS",
            password: "COLOCAR DPS",
            connectionString: "COLOCAR DPS"
        });

        await connection.execute(
            'INSERT INTO ACCOUNTS VALUES(:completeName, :email, :password)',
            [ua.completeName, ua.email, ua.password]
        );

        const addedAccount = await connection.execute(
            'SELECT id, completeName, email FROM ACCOUNTS WHERE email = :email',
            [ua.email]
        );

        await connection.close(); 

        if (addedAccount){
            return undefined;
        }
        const logedAccount: UserAccount = {
            id: addedAccount.rows[0].id,
            completeName: addedAccount.rows[0].id,
            email: addedAccount.rows[0].id,
            password: undefined
        };
        
        return logedAccount;
    }

    export async function validateEmail(email: string) : Promise<boolean>{
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
        
        const connection = await OracleDB.getConnection({
            user: "COLOCAR DPS",
            password: "COLOCAR DPS",
            connectionString: "COLOCAR DPS"
        });

        const results = await connection.execute(
            'SELECT id, completeName, email FROM ACCOUNTS WHERE email = :email',
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
                const addedAcount = await saveNewAccount(newAccount);
                
                if (!addedAcount){
                    res.statusCode = 400;
                    res.send(`Sign Up falhou`); 

                }else{
                    res.statusCode = 200; 
                    res.send(`Nova conta adicionada. Código: ${addedAcount.id}`);
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

    async function login(email: string, password: string): Promise<UserAccount | undefined> {
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
        
        const connection = await OracleDB.getConnection({
            user: "COLOCAR DPS",
            password: "COLOCAR DPS",
            connectionString: "COLOCAR DPS"
        });

        const results = await connection.execute(
            'SELECT id, completeName, email FROM ACCOUNTS WHERE email = :email AND password = :password',
            [email, password]
        );

        await connection.close(); 

        if (!results.rows) {
            return undefined;
        } else {
            const logedAccount = results.rows[0]; 
            const userAccount: UserAccount = {
                id: logedAccount.id,
                completeName: logedAccount.completeName,
                email: logedAccount.email,
                password: undefined 
            };
            return userAccount;
        }
    }

    export const loginHandler: RequestHandler = async (req: Request, res: Response) => {
            const pEmail = req.get('email');
            const pPassword = req.get('password');

            if (pEmail && pPassword) {
                const user = await login(pEmail, pPassword);

                if (user) {
                    res.status(200).send('Login realizado com sucesso');
                } else {
                    res.status(401).send('Email ou senha inválidos');
                }
            } else {
                res.status(400).send('Requisição inválida - Parâmetros faltando');
            }
        };
}