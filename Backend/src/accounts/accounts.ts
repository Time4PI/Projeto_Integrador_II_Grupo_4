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
        birthDate: Date | undefined;
    };

    export type AccountRow = {
        TOKEN: string;
        ID?: number | undefined;
        COMPLETE_NAME?: string | undefined;
        EMAIL?: string | undefined;
        ACCOUNT_ROLE?: string | undefined;  //todos cadastrados são 'user', mas tem o 'admin'
        BIRTH_DATE?: Date | undefined;
    };

    async function getOracleConnection() {
        try {
            const connection = await OracleDB.getConnection({
                user: process.env.ORACLE_USER,
                password: process.env.ORACLE_PASSWORD,
                connectString: process.env.ORACLE_CONN_STR,
            });
            return connection;
        } catch (error) {
            console.error('Erro ao conectar ao OracleDB:', error);
            throw new Error('Falha ao conectar ao banco de dados.');
        }
    }
    
    export async function getUserRole(userToken: string): Promise<string | undefined> {
        let connection;
        try {
            connection = await getOracleConnection();
            OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

            const userData = await connection.execute<AccountRow>(
                'SELECT TOKEN, ACCOUNT_ROLE FROM ACCOUNTS WHERE TOKEN = :usertoken',
                [userToken]
            );

            if (userData.rows && userData.rows.length > 0) {
                return userData.rows[0].ACCOUNT_ROLE;
            }
        } catch (error) {
            console.error('Erro ao buscar role do usuário:', error);
        } finally {
            if (connection) await connection.close();
        }
        return undefined;
    }
      
    export async function getUserEmail(userID: number): Promise<string | undefined> {
        let connection;
        try {
            connection = await getOracleConnection();
            OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

            const userData = await connection.execute<AccountRow>(
                'SELECT TOKEN, EMAIL FROM ACCOUNTS WHERE ID = :userid',
                [userID]
            );

            if (userData.rows && userData.rows.length > 0) {
                return userData.rows[0].EMAIL;
            }
        } catch (error) {
            console.error('Erro ao buscar email do usuário:', error);
        } finally {
            if (connection) await connection.close();
        }
        return undefined;
    }

    export async function getUserID(userToken: string): Promise<number | undefined> {
        let connection;
        try {
            connection = await getOracleConnection();
            OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

            const results = await connection.execute<AccountRow>(
                "SELECT TOKEN, ID FROM ACCOUNTS WHERE TOKEN = :token",
                [userToken]
            );

            if (results.rows && results.rows.length > 0) {
                return results.rows[0].ID;
            }
        } catch (error) {
            console.error('Erro ao buscar ID do usuário:', error);
        } finally {
            if (connection) await connection.close();
        }
        return undefined;
    }

    export async function saveNewAccount(ua: UserAccount): Promise<string | undefined> {
        let connection;
        try {
            connection = await getOracleConnection();
            OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

            await connection.execute(
                'INSERT INTO ACCOUNTS VALUES(SEQ_ACCOUNTS.NEXTVAL, :email, :password, :completename, \'user\', dbms_random.string(\'x\',32), :birthdate)',
                [ua.email, ua.password, ua.completeName, ua.birthDate]
            );

            const addedAccount = await connection.execute<AccountRow>(
                'SELECT TOKEN, ID FROM ACCOUNTS WHERE EMAIL = :email',
                [ua.email]
            );

            if (addedAccount.rows && addedAccount.rows.length > 0) {
                await connection.execute(
                    'INSERT INTO WALLET VALUES(:accountid, 0)',
                    [addedAccount.rows[0].ID]
                );
                await connection.commit();

                return addedAccount.rows[0].TOKEN;
            }
        } catch (error) {
            console.error('Erro ao salvar nova conta:', error);
        } finally {
            if (connection) await connection.close();
        }
        return undefined;
    }

    export async function validateEmail(email: string): Promise<boolean> {
        let connection;
        try {
            connection = await getOracleConnection();
            OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

            const results = await connection.execute(
                'SELECT EMAIL FROM ACCOUNTS WHERE EMAIL = :email',
                [email]
            );

            return !(results.rows && results.rows.length > 0);
        } catch (error) {
            console.error('Erro ao validar email:', error);
            return false;
        } finally {
            if (connection) await connection.close();
        }
    }

    function validateUserAge(birthDate: Date) : boolean{
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const hasHadBirthdayThisYear = 
            today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
    
            if(hasHadBirthdayThisYear){
                return age >= 18;
            }
            return age-1 >=18;
    }
    
    export const signUpHandler: RequestHandler = async(req: Request, res: Response) => {
        
        const pName = req.get('name');
        const pEmail = req.get('email');
        const pPassword = req.get('password');
        const pBirthDate = req.get('birthDate'); //2022-01-26
        
        if(pName && pEmail && pPassword && pBirthDate){
            const birthDate = new Date(`${pBirthDate}T00:00:00`);

            const validAge = await validateUserAge(birthDate);
            const validEmail = await validateEmail(pEmail);
            
            if (validEmail && validAge){
                const newAccount: UserAccount = {
                    id: undefined,
                    completeName: pName,
                    email: pEmail, 
                    password: pPassword,
                    birthDate: birthDate
                };
                const newAccountToken = await saveNewAccount(newAccount);
                console.dir(newAccountToken)
                if (!newAccountToken){
                    res.statusCode = 400;
                    res.send(`Sign Up falhou`); 

                }else{
                    res.statusCode = 200; 
                    res.send(`Nova conta adicionada. Token: ${newAccountToken}`);
                }
            }else if(!validAge){
                res.statusCode = 403;
                res.send("Usuário não pode ser menor de 18 anos.");
            }else{
                res.statusCode = 400;
                res.send("Email Invalido.");
            }
        }else{
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.");
        }
    }

    async function login(email: string, password: string): Promise<string | undefined> {
        let connection;
        try {
            connection = await getOracleConnection();
            OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

            const results = await connection.execute<AccountRow>(
                "SELECT TOKEN FROM ACCOUNTS WHERE EMAIL = :email AND PASSWORD = :password",
                [email, password]
            );

            if (results.rows && results.rows.length > 0) {
                return results.rows[0].TOKEN;
            }
        } catch (error) {
            console.error('Erro no login:', error);
        } finally {
            if (connection) await connection.close();
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

    export const getUserInfoHandler: RequestHandler = async (req: Request, res: Response) => {
        const userToken = req.get('token');
    
        if (userToken) {
            const userInfo = await getUserInfo(userToken);
    
            if (userInfo) {
                res.status(200).json({
                    name: userInfo.COMPLETE_NAME,
                    email: userInfo.EMAIL,
                    balance: userInfo.BALLANCE,
                    role: userInfo.ACCOUNT_ROLE,
                    id: userInfo.ID,
                });
            } else {
                res.status(404).send('Usuário não encontrado');
            }
        } else {
            res.status(400).send('Token não fornecido');
        }
    };
    
    async function getUserInfo(token: string): Promise<{ COMPLETE_NAME: string; EMAIL: string; BALLANCE: number; ACCOUNT_ROLE: string; ID: number} | undefined> {
        let connection;
        try {
            connection = await getOracleConnection();
            OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
    
            // Executa a query para obter o nome, email e saldo do usuário com base no token
            const result = await connection.execute<{ COMPLETE_NAME: string; EMAIL: string; BALLANCE: number; ACCOUNT_ROLE: string; ID: number}>(
                `SELECT A.COMPLETE_NAME, A.EMAIL, W.BALLANCE, A.ACCOUNT_ROLE, A.ID
                 FROM ACCOUNTS A 
                 JOIN WALLET W ON A.ID = W.ACCOUNT_ID 
                 WHERE A.TOKEN = :token`,
                [token]
            );
    
            // Verifica se há linhas retornadas e retorna o objeto ou undefined
            if (result.rows && result.rows.length > 0) {
                const userInfo = result.rows[0]; // Pega a primeira linha de resultado
                return {
                    COMPLETE_NAME: userInfo.COMPLETE_NAME,
                    EMAIL: userInfo.EMAIL,
                    BALLANCE: userInfo.BALLANCE,
                    ACCOUNT_ROLE: userInfo.ACCOUNT_ROLE,
                    ID: userInfo.ID,
                };
            }
        } catch (error) {
            console.error('Erro ao buscar informações do usuário:', error);
        } finally {
            if (connection) await connection.close();
        }
        return undefined;
    }
    
}