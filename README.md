# 🎲 Projeto Integrador II — Grupo 4 - Site de Apostas Simulado  

## 🏆 Sobre o Projeto  

O **Site de Apostas Simulado** é uma plataforma web acadêmica desenvolvida como parte do **Projeto Integrador II** do curso de Engenharia de Software.  
A aplicação tem como objetivo aplicar na prática os conceitos de **desenvolvimento full stack**, **engenharia de software** e **banco de dados relacional**.

O sistema permite aos usuários **criar e participar de apostas em eventos futuros**, como jogos esportivos, eleições e fenômenos naturais, de forma totalmente simulada.  
Conta também com **carteira virtual**, **histórico de transações**, **envio automatizado de e-mails** e **filtros de busca** para facilitar a navegação.

---

## ⚙️ Funcionalidades Principais  

- 🧍 **Cadastro e Login** de usuários autenticados  
- 🎯 **Criação, aprovação e apostas** em eventos simulados  
- 💰 **Carteira virtual** com depósito e saque simulados  
- 🧾 **Histórico de transações e apostas**  
- 📬 **Envio automático de e-mails** com o NodeMailer  
- 🔍 **Busca e filtros** de eventos  

---

## 🛠️ Tecnologias Utilizadas  

- **Frontend:** HTML, CSS, JavaScript, Bootstrap  
- **Backend:** Node.js com TypeScript  
- **Banco de Dados:** Oracle SQL  
- **Outras:** NodeMailer (envio de e-mails automáticos)

---

## 🚀 Como Executar o Projeto Localmente  

### 1. 📦 Clonar o repositório  
```bash
git clone https://github.com/Time4PI/Projeto_Integrador_II_Grupo_4.git
cd Projeto_Integrador_II_Grupo_4
```

### 2. ⚙️ Instalar dependências  

Certifique-se de ter o **Node.js** instalado em sua máquina.  
Em seguida, instale as dependências do projeto:  

```bash
npm install
```

### 3. 🔑 Configurar variáveis de ambiente  

Crie um arquivo **.env** na raiz do projeto com as seguintes variáveis (ajuste conforme suas credenciais):  

```env
DB_USER=seu_usuario  
DB_PASSWORD=sua_senha  
DB_CONNECTION_STRING=host:porta/nome_banco  
```

### 4. ▶️ Executar o servidor backend  

Para iniciar o servidor TypeScript em modo de desenvolvimento:  

```bash
npm run dev
```

O servidor será iniciado em:  
👉 **http://localhost:3000**

### 5. 💻 Executar o frontend  

Abra o arquivo `index.html` com o **Live Server** para visualizar o projeto no navegador.  

O site estará disponível em:  
👉 **http://localhost:8080**

---

## 🧪 Exemplos de Endpoints Principais  

| Método | Rota | Descrição |
|--------|------|------------|
| `POST` | `/signUp` | Cadastro de usuário |
| `POST` | `/login` | Autenticação de usuário |
| `POST` | `/addNewEvent` | Criação de novo evento |
| `GET`  | `/getEvents` | Retorna eventos filtrados |
| `PUT`  | `/evaluateNewEvent` | Aprovação/reprovação de evento |
| `POST` | `/addFunds` | Adicionar fundos à carteira |
| `POST` | `/withdrawFunds` | Solicitar saque |
| `POST` | `/betOnEvent` | Apostar em evento |
| `PUT`  | `/finishEvent` | Finalizar evento e distribuir ganhos |
| `GET`  | `/searchEvent` | Busca de eventos por palavra-chave |

---

## 🖼️ Demonstrações  


---

## 👨‍💻 Equipe  

Desenvolvido por **Grupo 4 – Turma 2**  
Projeto acadêmico do curso de **Engenharia de Software**, com foco em **desenvolvimento full stack** e **boas práticas de engenharia de software**.

CAIO DOS SANTOS CUNHA – 24005297\
GUILHERME GIUSEPE PIOVEZAN – 24014345\
HUGO SILVA PINHEIRO – 24012527\
NARAYAN FONSECA JAKOWATZ - 24018023\
---

