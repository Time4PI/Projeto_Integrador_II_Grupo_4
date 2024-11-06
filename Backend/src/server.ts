import express, { Request, Response, Router } from "express";
import cors from "cors";
import path from "path";
import { AccountsHandler } from "./accounts/accounts";
import { EventsHandler } from "./events/events";
import { TransactionsHandler } from "./transactions/transactions";

const app = express();
const route = Router();
const port = 3000;

app.use(cors());
app.use(express.json());

// Serve arquivos estáticos da pasta "frontend"
app.use(express.static(path.resolve(__dirname, "../../frontend")));

route.get('/', (req: Request, res: Response) => {
    res.status(403).send('Acesso não permitido para esta rota.');
});

route.put('/signUp', AccountsHandler.signUpHandler);
route.get('/login', AccountsHandler.loginHandler);
route.put('/addNewEvent', EventsHandler.addNewEventHandler);
route.get('/getEvents', EventsHandler.getEventsHandler);
route.delete('/deleteEvent', EventsHandler.deleteEventHandler);
route.put('/evaluateNewEvent', EventsHandler.evaluateNewEventHandler);
route.get('/searchEvent', EventsHandler.searchEventHandler);
route.put('/addFunds', TransactionsHandler.addFundsHandler);
route.put('/withdrawFunds', TransactionsHandler.withdrawFundsHandler);
route.put('/betOnEvent', TransactionsHandler.betOnEventHandler);
route.put('/finishEvent', TransactionsHandler.finishEventHandler);

app.use(route);

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});


