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
        category: string;
        status: string;  //Valor padrão de esperando moderação (Pending, Reproved, Aproved, Closed, Deleted)
        rightResponse: string | undefined;  //undefined por padrão, muda quando admin da a resposta
        startDate: Date;   //estudar o tipo date
        endDate: Date;
    };

    export type EventRow = {
        EVENT_ID: number;
        CREATOR_ID: number;
        TITLE?: string;  
        DESCRIPTION?: string;  
        CATEGORY?: string;
        STATUS?: string;  
        RIGHTRESPONSE?: string | undefined;  
        STARTDATE?: Date;  
        ENDDATE?: Date;
    }

    export async function saveNewEvent(newEvent: Event) : Promise<Number | undefined>{
        OracleDB.outFormat = OracleDB.OUT_FORMAT_OBJECT;
    
        let connection = await OracleDB.getConnection({
            user: process.env.ORACLE_USER,
            password: process.env.ORACLE_PASSWORD,
            connectString: process.env.ORACLE_CONN_STR
        });
    
        await connection.execute(
            'INSERT INTO EVENTS VALUES(SEQ_EVENTS.NEXTVAL, :CREATOR_ID, :TITLE, :DESCRIPTION, :CATEGORY, :STATUS, :RIGHTRESPONSE, :STARTDATE, :ENDDATE',
            [newEvent.creatorID, newEvent.title, newEvent.description, newEvent.category, newEvent.status, newEvent.rightResponse, newEvent.startDate, newEvent.endDate]
        );
    
        await connection.commit();  
        
        const addedEvent = await connection.execute<EventRow>(
            'SELECT EVENT_ID FROM EVENTS WHERE CREATOR_ID = :creatorid AND TITLE = :title',
            [newEvent.creatorID, newEvent.title]
        );
    
        console.dir("ID Novo Evento: "+addedEvent.rows);  // Log para depuração
    
        await connection.close();

        if (addedEvent.rows && addedEvent.rows.length > 0){
            const addedEventID = addedEvent.rows[0].EVENT_ID;
            return addedEventID;
        }
        return undefined;
    }

    function deleteEvent(email: string, title: string){

    }

    export const addNewEventHandler: RequestHandler = async(req: Request, res: Response) => {
        const eCreatorToken = req.get('creatorToken');
        const eTitle = req.get('title');
        const eDescription = req.get('description');
        const eCategory = req.get('category');
        const eStartDate = req.get('startDate');
        const eStartHour = req.get('startHour');
        const eEndDate = req.get('endDate');
        const eEndHour = req.get('endHour');

        if(eCreatorToken && eTitle && eDescription && eCategory && eStartDate && eStartHour && eEndDate && eEndHour){
            const eCreatorID = await AccountsHandler.getUserID(eCreatorToken);
            if (eTitle.length <= 50 && eDescription.length <= 150 && eCreatorID){
                let eStatus: string = "Pending";
                let eFullStartDate = new Date (eStartDate+"T"+eStartHour);      //ex: "2024-12-25T15:00:00"
                let eFullEndDate = new Date (eEndDate+"T"+eEndHour);
                let newEvent: Event = {
                    creatorID: eCreatorID,
                    title: eTitle,
                    description: eDescription,
                    category: eCategory,
                    status: eStatus,
                    rightResponse: "",
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

    export const deleteEventHandler: RequestHandler = (req: Request, res: Response) =>{
        const eCreatorEmail = req.get('creatorEmail');
        const eTitle = req.get('title');

        if (eCreatorEmail && eTitle){

        } else {
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes."); 
        }
    }
    export const getEventsHandler: RequestHandler = (req: Request,  res: Response) =>{
        const eCreatorEmail = req.query.creatorEmail as string;
        const eCategory = req.query.category as string;
        const eStatus = req.query.status as string;

        let fillteredEvents = eventsDatabase;

        if (eCreatorEmail) {
            fillteredEvents = fillteredEvents.filter(event => event.creatorEmail === eCreatorEmail);
        }
        if (eCategory) {
            fillteredEvents = fillteredEvents.filter(event => event.category === eCategory);
        }
        if (eStatus) {
            fillteredEvents = fillteredEvents.filter(event => event.status === eStatus);
        }
    
        if (fillteredEvents.length > 0) {
            res.status(200).json(fillteredEvents);
        } else {
            res.status(404).send("Não foi encontrado nenhum evento");
        }
    }
}