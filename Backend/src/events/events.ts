import { Request, Response, RequestHandler, response } from "express";
import OracleDB from "oracledb";
import { AccountsHandler } from "../accounts/accounts"; 
import dotenv from 'dotenv'; 
dotenv.config();

export namespace EventsHandler{

    export type Event = {
        creatorID: number;
        title: string;   //até 50 caracteres
        description: string;  //até 150 caracteres
        category: number;
        status: string;  //Valor padrão de esperando moderação (Pending, Reproved, Aproved, Closed, Deleted)
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

    export async function validateCategory(categoryID: number) : Promise<boolean>{
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
    
        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });

        const result = await connection.execute<categoryRow>(
            'SELECT NAME FROM CATEGORY WHERE CATEGORY_ID = :id',
            [categoryID]
        );

        connection.close();
        console.dir('Categoria escolhida: ');
        console.dir(result.rows);
        if(result.rows && result.rows.length > 0){
            return true;
        }

        return false;

    }

    export async function saveNewEvent(newEvent: Event) : Promise<Number | undefined>{
        
        if (await validateCategory(newEvent.category)){
            OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
    
            let connection = await OracleDB.getConnection({
                user: process.env.ORACLE_USER,
                password: process.env.ORACLE_PASSWORD,
                connectString: process.env.ORACLE_CONN_STR
            });

            await connection.execute(
                'INSERT INTO EVENTS VALUES(SEQ_EVENTS.NEXTVAL, :CREATOR_ID, :TITLE, :DESCRIPTION, :CATEGORY, :STATUS, :RIGHT_RESPONSE, :EVENTDATE, :START_DATE, :END_DATE)',
                [newEvent.creatorID, newEvent.title, newEvent.description, newEvent.category, newEvent.status, newEvent.rightResponse, newEvent.eventDate, newEvent.startDate, newEvent.endDate]
            );
        
            await connection.commit();  
            
            const addedEvent = await connection.execute<EventRow>(
                'SELECT * FROM EVENTS WHERE CREATOR_ID = :creatorid AND TITLE = :title ORDER BY EVENT_ID ASC',
                [newEvent.creatorID, newEvent.title]
            );
        
            await connection.close();

            if (addedEvent.rows && addedEvent.rows.length > 0){
                console.dir("ID Novo Evento: ");
                console.dir(addedEvent.rows[addedEvent.rows.length-1]);  // Log para depuração
                const addedEventID = addedEvent.rows[addedEvent.rows.length-1].EVENT_ID;
                return addedEventID;
            }
            return undefined;
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
            if (eTitle.length <= 50 && eDescription.length <= 150 && eCreatorID){
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
                    res.statusCode = 400; 
                    res.send(`Falha ao adicionar o evento`);
                }
            }else {
                res.statusCode = 400;
                res.send("Dados inválidos na requisição.");
            }

        } else {
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.");
        }

    }

    export async function getFilteredEvents(status: string | undefined, date: string | undefined) : Promise<EventRow[] | undefined>{
        let baseQuery: string = 'SELECT * FROM EVENTS WHERE 1 = 1 ';
        let queryParams: any[] = [];
        let currDate = new Date();


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
    
        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
        
        const results = await connection.execute<EventRow>(
            baseQuery, queryParams
        );

        connection.close();

        if (results.rows && results.rows.length > 0){
            return results.rows;
        }

        return undefined;
    }
    export const getEventsHandler: RequestHandler = (req: Request, res: Response) => {

    export const getEventsHandler: RequestHandler = async (req: Request,  res: Response) =>{
        const eStatus = req.get('status'); //Valores (Pending, Reproved, Aproved, Closed, Deleted) or Any
        const eDate = req.get('date');    //Respostas esperadas: Future, Past or Any

        if (eStatus && eDate){
            const fetchedEvents: EventRow[] | undefined = await getFilteredEvents(eStatus, eDate);
            if (fetchedEvents){
                res.statusCode = 200;
                const response = {
                    mensage: 'Eventos Filtrados: ',
                    events: fetchedEvents
                };
                
                res.json(response);
    
            } else {
                res.statusCode = 200;
                res.send('Nenhum evento encontrado')
            }
        } else {
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes."); 
        }
    }

    export const deleteEventHandler: RequestHandler = (req: Request, res: Response) =>{
        const eCreatorEmail = req.get('creatorEmail');
        const eTitle = req.get('title');

        if (eCreatorEmail && eTitle){

        } else {
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes."); 
        }
    }
}

