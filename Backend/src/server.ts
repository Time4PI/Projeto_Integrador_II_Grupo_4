import express from 'express'
import {Router, Request, Response} from 'express'

const app = express();
const route = Router();
const port = 3000;

app.use(express.json());

type Conta = {
    nome: string;
    cpf: string;
    email: string;
    senha: string;
};

let contas: Conta[] = [];

function cadastrarConta(conta: Conta) : number{
    contas.push(conta);
    return contas.length;
}

route.put('/signUp', 
    (req: Request, res: Response)=>{
        //quando usamos req.get queremos bter o parametro no HEADER da requisição
        const pnome = req.get('nome');
        const pcpf = req.get('cpf');
        const pemail = req.get('email');
        const psenha = req.get('senha');

        if(pnome && pcpf && pemail && psenha){
            //proseguir com o cadastro
            const novaConta: Conta = {
                nome: pnome,
                cpf: pcpf,
                email: pemail,
                senha: psenha
            };
            const codConta:number = cadastrarConta(novaConta);
            res.send(`Nova conta adicionada ${codConta}`);
        }else {
            res.send('Faltam parâmetros na requisição');
        }
    }
);

route.put('/login', 
    (req: Request, res: Response)=>{
        
    }
);

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