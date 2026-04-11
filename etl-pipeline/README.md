# ETL PNCP — Contratações com Propostas Abertas

## Proposta

Este projeto implementa um pipeline **ETL (Extract, Transform, Load)** para coletar dados de contratações públicas com recebimento de propostas abertas disponibilizados pela API pública do **Portal Nacional de Contratações Públicas (PNCP)**, tratar esses dados e persistir os documentos no **MongoDB Atlas**.


## Colaboradores

Este projeto foi desenvolvido pelos seguintes integrantes:

Débora Buriti
Giulliano Muniz
Gustavo Lino
Italo Artur
Myllena Lins
Mirella Santana
Pedro Fernandes

## Arquitetura da Solução

O projeto segue separação clara de responsabilidades em camadas e usa `main.py` como ponto de entrada:

```
etl-pipeline/
├── config/
│   ├── __init__.py
│   └── settings.py          
├── src/
│   ├── __init__.py
│   ├── extractor.py        
│   ├── transformer.py      
│   ├── loader.py            
│   └── pipeline.py         
├── .env.example             
├── main.py                  
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

1. **Extract** — `PNCPExtractor` realiza requisições `GET` ao endpoint `/v1/contratacoes/proposta` com paginação automática. Suporta filtros por `dataFinal`, `dataInicial`, `uf`, `codigoModalidadeContratacao`, `cnpj`, `codigoMunicipioIbge` e `codigoUnidadeAdministrativa`.

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

## Como Executar

### 1. Instale as dependências

```powershell
cd etl-pipeline
pip install -r requirements.txt
```

> Em sistemas Unix, use `cd etl-pipeline` e `cp .env.example .env`.

### 2. Configure as variáveis de ambiente

Copie o arquivo de exemplo e preencha com suas credenciais:

```powershell
copy .env.example .env
```

Edite o arquivo `.env` e configure:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=pncp
MONGODB_COLLECTION=contratacoes_proposta
```

### 3. Execute o pipeline

```powershell
python main.py
```

### Exemplos de uso

```powershell
python main.py --uf pe
python main.py --uf pe --modalidade 8
python main.py --data-inicial 20260401 --data-final 20260409 --uf sp
python main.py --cnpj 87613659000100
```

### Argumentos disponíveis

| Argumento | Tipo | Descrição |
|---|---|---|
| `--data-final` | `YYYYMMDD` | Data final de encerramento de propostas (padrão: `20260430`) |
| `--data-inicial` | `YYYYMMDD` | Data inicial de encerramento de propostas (opcional) |
| `--uf` | string | Sigla da UF (ex: `pe`, `sp`) |
| `--modalidade` | inteiro | Código da modalidade de contratação |
| `--cnpj` | string | CNPJ do órgão contratante |
| `--municipio-ibge` | string | Código IBGE do município |

---


