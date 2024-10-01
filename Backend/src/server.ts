import express from 'express'
import {Router, Request, Response} from 'express'

const app = express();
const route = Router();
const port = 3000;

app.use(express.json());

type Conta = {
    nome: string;
    data_nasc: string;
    email: string;
    senha: string;
};

let contas: Conta[] = [];

function consultarEmail(email: string) : boolean{
    for(var i = 0; i < contas.length; i++){
        if (contas[i].email == email){
            return false;
        }
    }
    return true;
}

function cadastrarConta(conta: Conta) : number{
    contas.push(conta);
    return contas.length;
}


function loginConta(email: string, senha: string) : boolean{
    for(var i = 0; i < contas.length; i++){
        if (contas[i].email === email){
            if (contas[i].senha === senha){
                return true;
            }
            return false;
        }
    }
    return false;
} 

route.put('/signUp', 
    (req: Request, res: Response)=>{
        const pnome = req.get('nome');
        const pdatanasc = req.get('data_nasc');
        const pemail = req.get('email');
        const psenha = req.get('senha');

        if(pnome && pdatanasc && pemail && psenha){
            //proseguir com o cadastro
            if (consultarEmail(pemail)){
                const novaConta: Conta = {
                    nome: pnome,
                    data_nasc: pdatanasc,
                    email: pemail,
                    senha: psenha
                };
                const codConta:number = cadastrarConta(novaConta);
                res.send(`Nova conta adicionada ${codConta}`);
            }else{
                res.send(`Email já cadastrado.`);
            }
          
        }else {
            res.send('Faltam parâmetros na requisição');
        }
    }
);

route.get('/login', 
    (req: Request, res: Response)=>{
        const pemail = req.get('email');
        const psenha = req.get('senha');

        if(pemail && psenha){
            //proseguir com o login
            if (loginConta(pemail, psenha)){
                res.send(`Acesso Concedido!`);

            }else{
                res.send(`Credenciais Invalidas.`);
            }
          
        }else {
            res.send('Faltam parâmetros na requisição');
        }
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