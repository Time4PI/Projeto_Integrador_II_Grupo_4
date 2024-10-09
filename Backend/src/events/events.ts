import { Request, Response, RequestHandler, response } from "express";
import OracleDB from "oracledb";
import { AccountsHandler } from "../accounts/accounts"; 

export namespace EventsHandler{

    export type Event = {
        creatorEmail: string;
        title: string;   //até 50 caracteres
        description: string;  //até 150 caracteres
        category: string;
        status: string;  //Valor padrão de esperando moderação
        rightResponse: string;  //undefined por padrão, muda quando admin da a resposta
        startDate: string;   //estudar o tipo date
        startHour: string;
        endDate: string;   
        endHour: string;
    };

    let eventsDatabase: Event[] = [];

    export function saveNewEvent(ua: Event) : number{
        eventsDatabase.push(ua);
        return eventsDatabase.length;
    }

    export const addNewEventHandler: RequestHandler = (req: Request, res: Response) => {
        const eCreatorEmail = req.get('creatorEmail');
        const eTitle = req.get('title');
        const eDescription = req.get('description');
        const eCategory = req.get('category');
        const eStartDate = req.get('startDate');
        const eStartHour = req.get('startHour');
        const eEndDate = req.get('endDate');
        const eEndHour = req.get('endHour');
        
        if(eCreatorEmail && eTitle && eDescription && eCategory && eStartDate && eStartHour && eEndDate && eEndHour){
            if (eTitle.length <= 50 && eDescription.length <= 150 && !AccountsHandler.validateEmail(eCreatorEmail)){
                let eStatus: string = "Pending";
                let newEvent: Event = {
                    creatorEmail: eCreatorEmail,
                    title: eTitle,
                    description: eDescription,
                    category: eCategory,
                    status: eStatus,
                    rightResponse: "",
                    startDate: eStartDate,
                    startHour: eStartHour,
                    endDate: eEndDate, 
                    endHour: eEndHour
                }
                const ID = saveNewEvent(newEvent);
                res.statusCode = 200; 
                res.send(`Novo evento adicionado. Código: ${ID}`);
            }else {
                res.statusCode = 400;
                res.send("Dados inválidos na requisição.")
            }

        } else {
            res.statusCode = 400;
            res.send("Parâmetros inválidos ou faltantes.")
        }

    }

}