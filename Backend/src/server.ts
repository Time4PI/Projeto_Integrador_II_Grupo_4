import express from "express";
import {Request, Response, Router} from "express";
import { AccountsHandler } from "./accounts/accounts";
import { EventsHandler } from "./events/events";
import { TransactionsHandler } from "./transactions/transactions";

const app = express();
const route = Router();
const port = 3000;

app.use(express.json());

//rota padrão
route.get('/', (req: Request, res: Response)=>{
    res.statusCode = 403;
    res.send('Acesso não permitido para esta rota.');
});

route.put('/signUp', AccountsHandler.signUpHandler);

route.get('/login', AccountsHandler.loginHandler);

route.put('/addNewEvent', EventsHandler.addNewEventHandler);

route.get('/getEvents', EventsHandler.getEventsHandler);

route.delete('/deleteEvent', EventsHandler.deleteEventHandler);

route.put('/evaluateNewEvent', EventsHandler.evaluateNewEventHandler);

route.put('/addFunds', TransactionsHandler.addFundsHandler);

route.put('/withdrawFunds', );

route.put('/betOnEvent', );

route.put('/finishEvent', );

route.get('/searchEvent', EventsHandler.searchEventHandler);

app.use(route);
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});
