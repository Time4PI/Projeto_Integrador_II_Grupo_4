import {Request, RequestHandler, Response} from "express";

export namespace AccountsHandler {
    
    export type UserAccount = {
        name:string;
        email:string;
        password:string;
        birthdate:string; 
    };

    let accountsDatabase: UserAccount[] = [];

    export function saveNewAccount(ua: UserAccount) : number{
        accountsDatabase.push(ua);
        return accountsDatabase.length;
    }

    export function validateEmail(email: string) : boolean{
        const validEmail = accountsDatabase.find((obj) => obj.email === email);
        if (!validEmail){
            return true;
        }
        return false;
    }
    
    export const signUpHandler: RequestHandler = (req: Request, res: Response) => {
        
        const pName = req.get('name');
        const pEmail = req.get('email');
        const pPassword = req.get('password');
        const pBirthdate = req.get('birthdate');
        
        if(pName && pEmail && pPassword && pBirthdate){
            
            if (validateEmail(pEmail)){
                const newAccount: UserAccount = {
                    name: pName,
                    email: pEmail, 
                    password: pPassword,
                    birthdate: pBirthdate
                }
                const ID = saveNewAccount(newAccount);
                res.statusCode = 200; 
                res.send(`Nova conta adicionada. Código: ${ID}`);
            } else{
                res.statusCode = 400;
                res.send("Email Invalido.");
            }
        }else{
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.");
        }
    }

    function authenticate(email: string, password: string) : boolean{
        const account = accountsDatabase.find((obj) => obj.email === email);
        if (account === undefined){
            return false;
        }
        if (account.password === password){
            return true;
        }
        return false;
    }

    export const loginHandler: RequestHandler = (req: Request, res: Response) => {
        const pemail = req.get('email');
        const ppassword = req.get('password');

        if (pemail && ppassword){
            if (authenticate(pemail, ppassword)){
                res.statusCode = 400;
                res.send("Acesso garantido!");
            }
            res.statusCode = 400;
            res.send("Credenciais Invalidas.");
        } else {
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.");
        }

    }
}