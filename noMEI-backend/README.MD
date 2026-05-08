# noMEI Backend

API REST do projeto noMEI, construída com **FastAPI** + **MongoDB**.

## Requisitos

- [Python 3.12+](https://www.python.org/downloads/)
- [uv](https://docs.astral.sh/uv/) (gerenciador de pacotes)
- Acesso a uma instância MongoDB (local ou Atlas)

### Instalando o `uv`

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

***

## Configuração

### 1. Clone o repositório e acesse a pasta do backend

```bash
git clone https://github.com/GustavoLino728/noMEI.git
cd noMEI/noMEI-backend
```

### 2. Crie o arquivo `.env`

Copie o arquivo de exemplo e preencha as variáveis:

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
# App
APP_ENV=development
APP_DEBUG=true
SECRET_KEY=sua-chave-secreta-com-no-minimo-32-caracteres
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database
MONGODB_URL=mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=pncp

# CORS
CORS_ORIGINS=["http://localhost:3000","http://localhost:5173"]
```

***

## Rodando o projeto

### Modo desenvolvimento (com hot reload)

```bash
uv run fastapi dev app/main.py
```

A API estará disponível em: [http://localhost:8000](http://localhost:8000)

### Modo produção

```bash
uv run uvicorn app.main:app --host 0.0.0.0 --port 8000
```

***

## Documentação da API

Com o servidor rodando, acesse:

| Interface | URL |
|-----------|-----|
| Swagger UI | [http://localhost:8000/docs](http://localhost:8000/docs) |
| ReDoc | [http://localhost:8000/redoc](http://localhost:8000/redoc) |

### Autenticando no Swagger

1. Use o endpoint `POST /api/v1/auth/register` para criar um usuário
2. Faça login em `POST /api/v1/auth/login` e copie o `access_token`
3. Clique no botão **Authorize 🔒** e cole o token no campo `value`
4. Clique em **Authorize** — os próximos requests já incluirão o token automaticamente

***

## Estrutura do projeto

```
app/
├── api/
│   └── v1/
│       └── router.py         # Registro de todos os routers
├── core/
│   ├── config.py             # Configurações via pydantic-settings
│   ├── context.py            # ContextVars para request (user_id, ip)
│   ├── database.py           # Conexão com MongoDB (Motor)
│   ├── dependencies.py       # Depends reutilizáveis (get_current_user)
│   ├── exceptions.py         # Exceções customizadas
│   ├── middleware.py         # CORS, logging, context
│   └── security.py           # Hash de senha, JWT
└── domain/
    ├── auth/                 # Registro e autenticação de usuários
    ├── perfil/               # Perfil do MEI
    ├── contratacoes/         # Contratações do PNCP
    ├── documentos/           # Documentos
    ├── alertas/              # Alertas
    ├── estatisticas/         # Estatísticas
    └── qualificacao/         # Qualificação
```

***

## Dependências principais

| Pacote | Uso |
|--------|-----|
| `fastapi` | Framework web |
| `uvicorn` | Servidor ASGI |
| `motor` | Driver async para MongoDB |
| `pydantic-settings` | Configurações via `.env` |
| `python-jose` | Geração e validação de JWT |
| `bcrypt` | Hash de senhas |