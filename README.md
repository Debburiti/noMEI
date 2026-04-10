# ETL PNCP — Contratações com Propostas Abertas

## Proposta

Este projeto implementa um pipeline **ETL (Extract, Transform, Load)** para coletar dados de contratações públicas com recebimento de propostas abertas disponibilizados pela API pública do **Portal Nacional de Contratações Públicas (PNCP)**, tratá-los e persistí-los no **MongoDB Atlas** para análises posteriores.

---

## Arquitetura da Solução

O projeto segue o padrão de **Orientação a Objetos** com separação clara de responsabilidades em camadas:

```
pncp_etl/
├── config/
│   ├── __init__.py
│   └── settings.py          # Configurações via variáveis de ambiente
├── src/
│   ├── __init__.py
│   ├── extractor.py         # Camada Extract — requisições HTTP paginadas
│   ├── transformer.py       # Camada Transform — limpeza e normalização
│   ├── loader.py            # Camada Load — persistência no MongoDB Atlas
│   └── pipeline.py          # Orquestrador ETL
├── .env.example             # Template de variáveis de ambiente
├── .gitignore
├── main.py                  # Ponto de entrada da aplicação
├── requirements.txt
└── README.md
```

### Componentes principais

| Classe | Arquivo | Responsabilidade |
|---|---|---|
| `PNCPExtractor` | `src/extractor.py` | Requisições HTTP paginadas à API PNCP com retentativas automáticas |
| `PNCPTransformer` | `src/transformer.py` | Limpeza, normalização de datas, remoção de nulos e enriquecimento com metadados |
| `MongoDBLoader` | `src/loader.py` | Carga idempotente no MongoDB Atlas via `bulk_write` + `upsert` |
| `ETLPipeline` | `src/pipeline.py` | Orquestração do fluxo Extract → Transform → Load em micro-lotes |
| `Settings` | `config/settings.py` | Configurações centralizadas carregadas de variáveis de ambiente |

---

## Fluxo de Dados

```
┌─────────────────────────────────────────────────────────────────┐
│                        ETLPipeline.run()                        │
│                                                                 │
│  ┌──────────────┐    registros     ┌─────────────────────────┐  │
│  │ PNCPExtractor│ ─── brutos ────► │   PNCPTransformer       │  │
│  │              │  (paginados)     │                         │  │
│  │ GET /v1/     │                  │ • parse de datas → UTC  │  │
│  │ contratacoes │                  │ • normalização strings  │  │
│  │ /proposta    │                  │ • add _id e metadados   │  │
│  └──────────────┘                  └────────────┬────────────┘  │
│                                                 │ documentos    │
│                                                 ▼ em lotes      │
│                                    ┌────────────────────────┐   │
│                                    │  MongoDBLoader         │   │
│                                    │                        │   │
│                                    │ • bulk_write + upsert  │   │
│                                    │ • idempotente por _id  │   │
│                                    │   (numeroControlePNCP) │   │
│                                    └──────────┬─────────────┘   │
└───────────────────────────────────────────────┼─────────────────┘
                                                ▼
                                    ┌────────────────────────┐
                                    │    MongoDB Atlas       │
                                    │  db: pncp              │
                                    │  col: contratacoes_    │
                                    │       proposta         │
                                    └────────────────────────┘
```

### Etapas do fluxo

1. **Extract** — `PNCPExtractor` realiza requisições `GET` ao endpoint `/v1/contratacoes/proposta` com paginação automática. Suporta filtros por `dataFinal`, `uf`, `codigoModalidadeContratacao`, `cnpj`, `codigoMunicipioIbge` e `codigoUnidadeAdministrativa`. Em caso de falha transitória (5xx), executa retentativas com backoff exponencial.

2. **Transform** — `PNCPTransformer` processa cada registro:
   - Converte strings de data para objetos `datetime` com fuso UTC.
   - Faz `strip()` em campos de texto livre.
   - Normaliza a `razaoSocial` do órgão para uppercase.
   - Remove campos `None` para reduzir o tamanho dos documentos.
   - Adiciona `_id` = `numeroControlePNCP` (chave de deduplicação).
   - Adiciona `_etl_ingestao_em` com o timestamp de ingestão.

3. **Load** — `MongoDBLoader` agrega os documentos em micro-lotes e persiste via `bulk_write` com operação `UpdateOne + upsert=True`, garantindo **idempotência** — reexecutar o pipeline não cria duplicatas. Cria automaticamente índices em `modalidadeId`, `situacaoCompraId` e `(unidadeOrgao.ufSigla, dataAberturaProposta)`.

---

## Pré-requisitos

- Python 3.12+
- Conta no [MongoDB Atlas](https://www.mongodb.com/atlas) com cluster ativo

---

## Forma de Execução

### 1. Clone o repositório e instale as dependências

```bash
cd pncp_etl
pip install -r requirements.txt
```

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```bash
cp .env.example .env
```

Edite o `.env` e substitua a `MONGODB_URI` pela sua connection string do Atlas:

```
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=pncp
MONGODB_COLLECTION=contratacoes_proposta
```

### 3. Execute o pipeline

**Execução padrão** (todas as propostas com data final até 30/04/2026):
```bash
python main.py
```

**Filtrado por UF:**
```bash
python main.py --uf pe
```

**Filtrado por UF e modalidade:**
```bash
python main.py --uf pe --modalidade 8
```

**Com intervalo de datas:**
```bash
python main.py --data-inicial 20260401 --data-final 20260409 --uf sp
```

**Filtrado por CNPJ do órgão:**
```bash
python main.py --cnpj 87613659000100
```

### 4. Argumentos disponíveis

| Argumento | Tipo | Descrição |
|---|---|---|
| `--data-final` | `YYYYMMDD` | Data final (padrão: `20260430`) |
| `--data-inicial` | `YYYYMMDD` | Data inicial (opcional) |
| `--uf` | string | Sigla da UF (ex: `pe`, `sp`) |
| `--modalidade` | inteiro | Código da modalidade de contratação |
| `--cnpj` | string | CNPJ do órgão (somente números) |
| `--municipio-ibge` | string | Código IBGE do município |

---

## Segurança

- Credenciais **nunca** são hard-coded; são carregadas exclusivamente de variáveis de ambiente.
- O arquivo `.env` está no `.gitignore` e **não deve ser versionado**.
- A `MONGODB_URI` **não é logada** em nenhum momento.
- Operações de banco usam `upsert` — sem risco de corrupção por execuções duplicadas.
