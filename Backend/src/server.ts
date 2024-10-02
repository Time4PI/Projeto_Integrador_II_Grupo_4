import express from "express";
import {Request, Response, Router} from "express";
import { AccountsHandler } from "./accounts/accounts";

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

route.put('/addNewEvent', 
    (req: Request, res: Response)=>{
        
    }
);

route.get('/getEvents', 
    (req: Request, res: Response)=>{
        
    }
);

route.delete('/deleteEvent', 
    (req: Request, res: Response)=>{
        
    }
);

route.put('/evaluateNewEvent', 
    (req: Request, res: Response)=>{
        
    }
);

route.put('/eaddFunds', 
    (req: Request, res: Response)=>{
        
    }
);

route.put('/withdrawFunds', 
    (req: Request, res: Response)=>{
        
    }
);

route.put('/betOnEvent', 
    (req: Request, res: Response)=>{
        
    }
);

route.put('/finishEvent', 
    (req: Request, res: Response)=>{
        
    }
);

route.put('/searchEvent', 
    (req: Request, res: Response)=>{
        
    }
);

app.use(route);
app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});