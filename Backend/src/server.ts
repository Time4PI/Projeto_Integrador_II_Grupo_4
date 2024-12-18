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

app.get('/home_page', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../../frontend/home_page/index.html"));
});

app.get('/history', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../../frontend/history/history.html"));
});

app.get('/deposit', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../../frontend/deposit/deposit.html"));
});

app.get('/withdraw', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../../frontend/withdraw/withdraw.html"));
});

app.get('/signUp', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../../frontend/signUp/signUp.html"));
});

app.get('/signIn', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../../frontend/signIn/login.html"));
});

app.get('/newEvent', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../../frontend/newEvent/newEvent.html"));
});

app.get('/myEvents', (req: Request, res: Response) => {
    res.sendFile(path.resolve(__dirname, "../../frontend/myEvents/myEvents.html"));
});

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
route.get('/getUserInfo', AccountsHandler.getUserInfoHandler);
route.get('/getUserStatement', TransactionsHandler.getAccountStatementHandler);

app.use(route);

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});


