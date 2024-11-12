import { Request, Response, RequestHandler, response } from "express";
import OracleDB from "oracledb";
import { AccountsHandler } from "../accounts/accounts"; 
import { TransactionsHandler } from "../transactions/transactions";
import dotenv from 'dotenv'; 
import nodemailer from 'nodemailer';

dotenv.config();

export namespace EventsHandler{

    export type Event = {
        creatorID: number;
        title: string;   //até 50 caracteres
        description: string;  //até 150 caracteres
        category: number;
        status: string;  //Valor padrão de esperando moderação (Pending, Reproved, Approved, Closed, Deleted)
        rightResponse: string | undefined;  //undefined por padrão, muda quando admin da a resposta
        eventDate: Date;
        startDate: Date;   //estudar o tipo date
        endDate: Date;
    };

    export type EventRow = {
        EVENT_ID: number;
        CREATOR_ID?: number;
        TITLE?: string;  
        DESCRIPTION?: string;  
        CATEGORY?: number;
        STATUS?: string;  
        RIGHT_RESPONSE?: string | undefined;  
        EVENT_DATE?: Date;
        START_DATE?: Date;  
        END_DATE?: Date;
    };

    export type categoryRow = {
        CATEGORY_ID: number;
        NAME: string;
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

    export async function validateCategory(categoryID: number): Promise<boolean> {
        let connection;
        try {
            connection = await getOracleConnection();
            const result = await connection.execute<categoryRow>(
                'SELECT NAME FROM CATEGORY WHERE CATEGORY_ID = :id',
                [categoryID]
            );
            await connection.close();
            console.dir('Categoria escolhida: ');
            console.dir(result.rows);
            if(result.rows && result.rows.length > 0){
                return true;
            }
            return false;
        } catch (error) {
            console.error("Erro ao validar categoria:", error);
            return false;
        }
    }

    export async function saveNewEvent(newEvent: Event): Promise<Number | undefined> {
        let connection;
        try {
            if (await validateCategory(newEvent.category)) {
                connection = await getOracleConnection();
                await connection.execute(
                    'INSERT INTO EVENTS VALUES(SEQ_EVENTS.NEXTVAL, :CREATOR_ID, :TITLE, :DESCRIPTION, :CATEGORY, :STATUS, :RIGHT_RESPONSE, :EVENTDATE, :START_DATE, :END_DATE)',
                    [
                        newEvent.creatorID, newEvent.title, newEvent.description,
                        newEvent.category, newEvent.status, newEvent.rightResponse,
                        newEvent.eventDate, newEvent.startDate, newEvent.endDate
                    ]
                );
                await connection.commit();

                const addedEvent = await connection.execute<EventRow>(
                    'SELECT * FROM EVENTS WHERE CREATOR_ID = :creatorid AND TITLE = :title ORDER BY EVENT_ID ASC',
                    [newEvent.creatorID, newEvent.title]
                );
                await connection.close();

                if (addedEvent.rows && addedEvent.rows.length > 0) {
                    console.dir("ID Novo Evento: ");
                    console.dir(addedEvent.rows[addedEvent.rows.length-1]);
                    const addedEventID = addedEvent.rows[addedEvent.rows.length - 1].EVENT_ID;
                    return addedEventID;
                }
            }
        } catch (error) {
            console.error("Erro ao salvar evento:", error);
        }
        return undefined;
    }

    export const addNewEventHandler: RequestHandler = async(req: Request, res: Response) => {
        const eCreatorToken = req.get('creatorToken');
        const eTitle = req.get('title');
        const eDescription = req.get('description');
        const eCategory = Number(req.get('category'));
        const eEventDate = req.get('eventDate');
        const eStartDate = req.get('startDate');
        const eStartHour = req.get('startHour');
        const eEndDate = req.get('endDate');
        const eEndHour = req.get('endHour');


        if(eCreatorToken && eTitle && eDescription && eCategory && eEventDate && eStartDate && eStartHour && eEndDate && eEndHour){
            const eCreatorID = await AccountsHandler.getUserID(eCreatorToken);
            const userRole = await AccountsHandler.getUserRole(eCreatorToken);

            if (eTitle.length <= 50 && eDescription.length <= 150 && eCreatorID && userRole !== "admin"){
                let eStatus: string = "Pending";
                let eFullStartDate = new Date (`${eStartDate}T${eStartHour}`);      //ex: "2024-12-25T15:00:00"
                let eFullEndDate = new Date (`${eEndDate}T${eEndHour}`);                   
                let eFullEventDate = new Date(`${eEventDate}T00:00:00`);

                console.dir(eFullEndDate);  //depuração

                let newEvent: Event = {
                    creatorID: eCreatorID,
                    title: eTitle,
                    description: eDescription,
                    category: eCategory,
                    status: eStatus,
                    rightResponse: "",
                    eventDate: eFullEventDate,
                    startDate: eFullStartDate,
                    endDate: eFullEndDate
                }


                const newEventID = await saveNewEvent(newEvent);
                if (newEventID){
                    res.statusCode = 200; 
                    res.send(`Novo evento adicionado. Código: ${newEventID}`);
                } else {
                    res.statusCode = 500; 
                    res.send(`Falha ao adicionar o evento`);
                }
            }else if(userRole === "admin"){
                res.statusCode = 403;
                res.send("Admin não tem permissão para criar eventos.");
            }else {
                res.statusCode = 400;
                res.send("Dados inválidos na requisição.");
            }

        } else {
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.");
        }

    }

    export async function getFilteredEvents(status: string | undefined, date: string | undefined): Promise<EventRow[] | undefined> {
        let connection;
        try {
            let baseQuery = 'SELECT * FROM EVENTS WHERE 1 = 1 ';
            const queryParams: any[] = [];
            const currDate = new Date();

            if (status != 'Any'){
                baseQuery += 'AND STATUS = :status ';
                queryParams.push(status);
            }
    
            if (date != 'Any'){
                if (date === 'Future'){
                    baseQuery += 'AND EVENT_DATE > :currdate ';
                } else if (date === 'Past') {
                    baseQuery += 'AND EVENT_DATE < :currdate ';
    
                }
                queryParams.push(currDate);
            }

            baseQuery += 'ORDER BY EVENT_ID ASC';

            OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;

            connection = await getOracleConnection();

            const results = await connection.execute<EventRow>(
                baseQuery, queryParams
            );

            await connection.close();

            if (results.rows && results.rows.length > 0){
                return results.rows;
            }

            return undefined;
        } catch (error) {
            console.error("Erro ao buscar eventos:", error);
            return undefined;
        }
    }

    export const getEventsHandler: RequestHandler = async (req: Request, res: Response) => {
        try {
            const eStatus = req.query.status as string;  //Valores (Pending, Reproved, Approved, Closed, Deleted) or Any
            const eDate = req.query.date as string;      //Respostas esperadas: Future, Past or Any
    
            if (eStatus && eDate) {
                const fetchedEvents: EventRow[] | undefined = await getFilteredEvents(eStatus, eDate);
                if (fetchedEvents) {
                    res.status(200).json({
                        mensage: 'Eventos Filtrados: ',
                        events: fetchedEvents
                    });
                } else {
                    res.status(204).send('Nenhum evento encontrado');
                }
            } else {
                res.status(400).send("Parâmetros inválidos ou faltantes. Certifique-se de enviar 'status' e 'date'.");
            }
        } catch (error) {
            console.error('Erro ao buscar eventos:', error);
            res.status(500).send('Erro interno no servidor ao buscar eventos');
        }
    };
    
    


    async function deleteEvent(userToken: string, eventID: number): Promise<number> {
        let connection;
        try {
            const userID = await AccountsHandler.getUserID(userToken);
    
            if (!userID) return 2; // parâmetros inválidos
    
            OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
            connection = await getOracleConnection();
    
            try {
                const eventInformations = await connection.execute<EventRow>(
                    'SELECT * FROM EVENTS WHERE CREATOR_ID = :userid AND EVENT_ID = :eventid AND STATUS IN(\'Pending\', \'Approved\')',
                    [userID, eventID]
                );
    
                const betsInformations = await connection.execute<TransactionsHandler.Bet>(
                    'SELECT BET_ID FROM BETS WHERE EVENT_ID = :eventid',
                    [eventID]
                );
    
                console.dir(`Bets feitas: `); // depuração
                console.dir(betsInformations.rows);
    
                if (eventInformations.rows && eventInformations.rows.length > 0 && betsInformations.rows?.length === 0) {
                    await connection.execute(
                        'UPDATE EVENTS SET STATUS = \'Deleted\' WHERE CREATOR_ID = :userid AND EVENT_ID = :eventid',
                        [userID, eventID]
                    );
                    await connection.commit();
    
                    const updateConfirmation = await connection.execute<EventRow>(
                        'SELECT STATUS FROM EVENTS WHERE CREATOR_ID = :userid AND EVENT_ID = :eventid',
                        [userID, eventID]
                    );
    
                    if (updateConfirmation.rows && updateConfirmation.rows.length > 0) {
                        console.dir(updateConfirmation.rows[0]);
                        return 0; // sucesso
                    }
                    return 1; // falha no update
                }
            } finally {
                await connection.close();
            }
        } catch (error) {
            console.error('Erro ao deletar evento:', error);
            return 3; // erro inesperado
        }
    
        return 2; // parâmetros inválidos
    }

    export const deleteEventHandler: RequestHandler = async(req: Request, res: Response) =>{
        const eCreatorToken = req.get('creatorToken');
        const eEventID = Number(req.get('eventID'));

        if (eCreatorToken && eEventID){
            const deletionResult: number = await deleteEvent(eCreatorToken, eEventID);

            if(deletionResult === 0){
                res.statusCode = 200;
                res.send('Evento deletado com sucesso');

            }else if(deletionResult === 1){
                res.statusCode = 500;
                res.send('Servidor falhou em deletar o evento');

            }else{
                res.statusCode = 403;
                res.send('Usuário não tem permissão para alterar o evento');

            }
        } else {
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes."); 
        }
    }

    async function sendRejectionEmail(email: string, eventTitle: string, eventID:Number, reason: string) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              type: 'OAuth2',
              user: process.env.MAIL_USERNAME,
              pass: process.env.MAIL_PASSWORD,
              clientId: process.env.OAUTH_CLIENTID,
              clientSecret: process.env.OAUTH_CLIENT_SECRET,
              accessToken: process.env.OAUTH_ACCESS_TOKEN,
              refreshToken: process.env.OAUTH_REFRESH_TOKEN
            }
          } as any);
    
        let mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Seu evento foi reprovado',
            text: `Seu evento "${eventTitle}" foi reprovado pelo motivo: ${reason}.`
        };
    
        await transporter.sendMail(mailOptions, function(err, data) {
            if (err) {
              console.dir("Error " + err);
            } else {
              console.dir("Email sent successfully");
            }
          });
    }

    async function evaluateNewEvent(eventID: number, evaluation: string, reason?: string): Promise<number> {
        let connection;
        try {
            OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
            connection = await getOracleConnection();
    
            try {
                const eventInfo = await connection.execute<EventRow>(
                    'SELECT CREATOR_ID, TITLE, STATUS FROM EVENTS WHERE EVENT_ID = :eventID',
                    [eventID]
                );
    
                if (!eventInfo.rows || eventInfo.rows.length === 0) {
                    return 404; // Evento não encontrado
                }
    
                const creatorID = eventInfo.rows[0].CREATOR_ID;
                const eventTitle = eventInfo.rows[0].TITLE;
                const eventStatus = eventInfo.rows[0].STATUS;
    
                if (eventStatus !== 'Pending') {
                    return 400; // Evento já foi avaliado
                }
    
                if (evaluation === 'Approved') {
                    await connection.execute(
                        'UPDATE EVENTS SET STATUS = :status WHERE EVENT_ID = :eventID',
                        [evaluation, eventID]
                    );
                    await connection.commit();
                    return 200; // Aprovado com sucesso
                }
    
                if (evaluation === 'Reproved' && creatorID && reason) {
                    await connection.execute(
                        'UPDATE EVENTS SET STATUS = :status WHERE EVENT_ID = :eventID',
                        [evaluation, eventID]
                    );
                    await connection.commit();
    
                    const userEmail = await AccountsHandler.getUserEmail(creatorID);
                    if (userEmail && eventTitle) {
                        await sendRejectionEmail(userEmail, eventTitle, eventID, reason);
                    }
                    return 200; // Reprovado com sucesso
                }
    
                return 400; // Parâmetros inválidos
            } finally {
                await connection.close();
            }
        } catch (error) {
            console.error('Erro ao avaliar evento:', error);
            return 500; // Erro interno
        }
    }
    
    export const evaluateNewEventHandler: RequestHandler = async(req: Request, res: Response) =>{
        const pAdminToken = req.get('adminToken');
        const eEventID = Number(req.get('eventID'));
        const eEvaluation = req.get('evaluation');  //Approved ou Reproved
        const eReason = req.get('reason');

        if (eEvaluation === 'Reproved' && !eReason){
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.");
        }

        if (eEventID && eEvaluation && pAdminToken){
            const checkRole: string | undefined = await AccountsHandler.getUserRole(pAdminToken);

            if (checkRole === 'admin'){
                const result = await evaluateNewEvent(eEventID, eEvaluation, eReason);

                if(result === 200){
                    res.statusCode = 200;
                    res.send(`Evento marcado como ${eEvaluation} com sucesso!`);
                }else if(result === 400){
                    res.statusCode = 400;
                    res.send("Evento já avaliado");
                }else if(result === 404){
                    res.statusCode = 404;
                    res.send("Evento não existe");
                }
            }else{
                res.statusCode = 403;
                res.send("Usuario não possui permissão para essa ação.");
            }
        } else {
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.");
        }
    }

    async function searchEvent(keyword: string): Promise<EventRow[] | undefined> {
        let connection;
        try {
            OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
            connection = await getOracleConnection();
    
            try {
                const currDate: Date = new Date();
                const searchLine: string = `%${keyword.toLowerCase()}%`;
    
                const searchResults = await connection.execute<EventRow>(
                    `SELECT * FROM EVENTS WHERE END_DATE > :currdate AND STATUS = 'Approved' 
                     AND (LOWER(TITLE) LIKE :searchline OR LOWER(DESCRIPTION) LIKE :searchline)
                     ORDER BY END_DATE DESC`,
                    {
                        currdate: currDate,
                        searchline: searchLine
                    }
                );
    
                console.dir(searchResults); // Depuração
    
                if (searchResults.rows && searchResults.rows.length > 0) {
                    return searchResults.rows;
                }
    
                return undefined;
            } finally {
                await connection.close();
            }
        } catch (error) {
            console.error('Erro ao buscar evento:', error);
            return undefined;
        }
    }
    

    export const searchEventHandler: RequestHandler = async(req: Request, res: Response) =>{
        const sKeyword = req.get('keyword');

        if(sKeyword){
            const searchResult: EventRow[] | undefined = await searchEvent(sKeyword);

            if(searchResult){
                res.statusCode = 200;
                const response = {
                    mensage: 'Eventos encontrados: ',
                    events: searchResult
                };
                
                res.json(response);

            }else {
                res.statusCode = 404;
                res.send("Não existem eventos correspondentes");
            }

        }else{
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.");
        }
    }
}

