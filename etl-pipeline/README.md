# ETL PNCP — Plataforma de Dados para Contratações Públicas

## Proposta

Este projeto implementa uma plataforma de dados voltada para ingestão, processamento, análise e disponibilização de dados públicos de contratações governamentais utilizando a API pública do **Portal Nacional de Contratações Públicas (PNCP)**.

A solução evoluiu de uma pipeline ETL tradicional para uma arquitetura orientada a **Engenharia de Dados** e **DataOps**, incorporando:

* ETL incremental
* Persistência no MongoDB Atlas
* Orquestração com Prefect
* Processamento analítico com PySpark
* Arquitetura medalhão (Bronze / Silver / Gold)
* Exportação analítica em CSV e Parquet
* Observabilidade e monitoramento

---

# Colaboradores

Este projeto foi desenvolvido pelos seguintes integrantes:

* Débora Buriti
* Giulliano Lucas
* Gustavo Lino
* Italo Artur
* Myllena Lins
* Mirella Santana
* Pedro Fernandes

---

# Arquitetura da Solução

O projeto segue uma arquitetura modular orientada a pipelines de dados.

```text
etl-pipeline/
├── analytics_output/
│   └── gold/
├── config/
│   ├── __init__.py
│   └── settings.py
├── src/
│   ├── __init__.py
│   ├── extractor.py
│   ├── transformer.py
│   ├── loader.py
│   └── pipeline.py
├── orchestrate_prefect.py
├── spark_transform.py
├── main.py
├── requirements.txt
├── .env.example
└── README.md
```

---

# Arquitetura Medalhão

O projeto utiliza o modelo medalhão de Engenharia de Dados:

| Camada | Descrição                                             |
| ------ | ----------------------------------------------------- |
| Bronze | Dados brutos extraídos da API pública do PNCP         |
| Silver | Dados tratados e persistidos no MongoDB Atlas via ETL |
| Gold   | Tabelas analíticas processadas com PySpark            |

---

# Fluxo Geral da Plataforma

```text
PNCP API
   ↓
ETL Pipeline
   ↓
MongoDB Atlas (Silver Layer)
   ↓
PySpark Analytics
   ↓
Gold Layer
   ├── oportunidades_por_uf
   ├── oportunidades_mei
   ├── top_orgaos
   ├── maiores_editais
   └── media_por_modalidade
```

---

# Componentes Principais

| Classe / Arquivo                         | Responsabilidade                                 |
| ---------------------------------------- | ------------------------------------------------ |
| `PNCPExtractor` (`src/extractor.py`)     | Extração paginada de dados da API PNCP           |
| `PNCPTransformer` (`src/transformer.py`) | Limpeza, normalização e enriquecimento dos dados |
| `MongoDBLoader` (`src/loader.py`)        | Persistência idempotente no MongoDB Atlas        |
| `ETLPipeline` (`src/pipeline.py`)        | Coordenação do fluxo Extract → Transform → Load  |
| `orchestrate_prefect.py`                 | Orquestração e monitoramento do pipeline         |
| `spark_transform.py`                     | Camada analítica Spark (Gold Layer)              |
| `Settings` (`config/settings.py`)        | Configurações centralizadas                      |

---

# Fluxo ETL

```text
┌─────────────────────────────────────────────────────────────────┐
│                        ETLPipeline.run()                        │
│                                                                 │
│  ┌──────────────┐    registros     ┌─────────────────────────┐  │
│  │ PNCPExtractor│ ─── brutos ───► │   PNCPTransformer       │  │
│  │              │  (paginados)     │                         │  │
│  │ GET /v1/     │                  │ • parse de datas → UTC  │  │
│  │ contratacoes │                  │ • normalização strings  │  │
│  │ /proposta    │                  │ • cálculo MEI           │  │
│  │              │                  │ • add _id e metadata    │  │
│  └──────────────┘                  └────────────┬────────────┘  │
│                                                 │ documentos    │
│                                                 ▼ em lotes      │
│                                    ┌────────────────────────┐   │
│                                    │  MongoDBLoader         │   │
│                                    │                        │   │
│                                    │ • bulk_write + upsert  │   │
│                                    │ • índices automáticos  │   │
│                                    │ • persistência Silver  │   │
│                                    └──────────┬─────────────┘   │
└───────────────────────────────────────────────┼─────────────────┘
                                                ▼
                                    ┌────────────────────────┐
                                    │    MongoDB Atlas       │
                                    │  db: pncp              │
                                    │  collection:            │
                                    │ contratacoes_proposta  │
                                    └────────────────────────┘
```

---

# Funcionalidades ETL

## Extract

O `PNCPExtractor` realiza:

* Requisições HTTP paginadas
* Retry automático em falhas transitórias
* Timeout configurável
* Logs estruturados
* Busca incremental por datas

### Filtros suportados

* Data inicial/final
* UF
* Modalidade
* CNPJ
* Município IBGE
* Unidade administrativa

---

## Transform

O `PNCPTransformer` realiza:

* Conversão de datas para UTC
* Limpeza de valores nulos
* Normalização textual
* Enriquecimento dos documentos
* Geração de `_id`
* Criação do campo `_mei_compativel`
* Adição de metadata ETL

---

## Load

O `MongoDBLoader` implementa:

* Persistência idempotente
* `bulk_write`
* `upsert`
* Índices automáticos
* Escrita em micro-lotes

### Índices implementados

* `modalidadeId`
* `situacaoCompraId`
* `unidadeOrgao.ufSigla`
* `valorTotalEstimado`
* `_mei_compativel`
* `cnae_codes`
* `objetoCompra` (texto)

---

# DataOps e Orquestração

A plataforma incorpora conceitos de DataOps para automação e observabilidade.

## Funcionalidades implementadas

* Orquestração com Prefect
* Retry automático
* Logging estruturado
* Execução incremental automática
* Monitoramento de pipelines
* Controle de fluxo ETL
* Observabilidade de execução

---

# Execução Orquestrada com Prefect

A pipeline ETL pode ser executada via Prefect:

```bash
python orchestrate_prefect.py
```

## Recursos da orquestração

* Monitoramento visual
* Retries automáticos
* Logging detalhado
* Pipeline incremental automática
* Controle de execução

---

# Pipeline Analítica com PySpark

A camada analítica foi implementada utilizando PySpark para transformar documentos semiestruturados em tabelas analíticas estruturadas.

## Funcionalidades analíticas

* Agregações analíticas
* Persistência distribuída
* Cache Spark
* Exportação em CSV e Parquet
* Construção da camada Gold

---

# Métricas Analíticas Geradas

* Quantidade de oportunidades por UF
* Média de valor por modalidade
* Oportunidades compatíveis com MEI
* Top órgãos contratantes
* Maiores editais publicados
* Maior valor de contratação por UF

---

# Execução da Pipeline Analítica

```bash
python spark_transform.py
```

---

# Outputs Analíticos

Os datasets gerados são persistidos em:

```text
analytics_output/gold/
```

## Formatos suportados

* CSV
* Parquet

---

# Tecnologias Utilizadas

* Python 3.12
* MongoDB Atlas
* PySpark
* Prefect
* PyMongo
* Requests
* Pandas
* dotenv

---

# Pré-requisitos

* Python 3.12+
* Java JDK (necessário para Spark)
* Conta MongoDB Atlas

---

# Instalação

## 1. Clone o repositório

```bash
git clone <repositorio>
cd etl-pipeline
```

---

## 2. Instale as dependências

```bash
pip install -r requirements.txt
```

---

## 3. Configure as variáveis de ambiente

Crie o `.env`:

```env
MONGODB_URI=mongodb+srv://usuario:senha@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DATABASE=pncp
MONGODB_COLLECTION=contratacoes_proposta
```

---

# Execução ETL

## Execução simples

```bash
python main.py
```

---

## Exemplos

### Filtrar por UF

```bash
python main.py --uf pe
```

### Filtrar por modalidade

```bash
python main.py --uf pe --modalidade 8
```

### Intervalo de datas

```bash
python main.py --data-inicial 20260501 --data-final 20260510
```

### Limitar páginas

```bash
python main.py --max-paginas 5
```

---

# Argumentos Disponíveis

| Argumento          | Tipo     | Descrição             |
| ------------------ | -------- | --------------------- |
| `--data-final`     | YYYYMMDD | Data final da busca   |
| `--data-inicial`   | YYYYMMDD | Data inicial da busca |
| `--uf`             | string   | Sigla da UF           |
| `--modalidade`     | inteiro  | Código da modalidade  |
| `--cnpj`           | string   | CNPJ do órgão         |
| `--municipio-ibge` | string   | Código IBGE           |
| `--max-paginas`    | inteiro  | Limite de páginas     |

---

# Engenharia de Dados Aplicada

O projeto implementa conceitos modernos de Engenharia de Dados:

* Arquitetura medalhão
* ETL incremental
* Persistência idempotente
* Camada analítica Spark
* DataFrames distribuídos
* Pipeline modular
* Observabilidade
* DataOps
* Retry automático
* Processamento analítico

---

# Evoluções Futuras

* Dockerização da plataforma
* Apache Kafka
* Streaming de eventos
* Dashboard analítico
* Data Lake
* Integração com ferramentas BI
* Deploy automatizado
* Airflow/Prefect Server

---

# Licença

Projeto acadêmico desenvolvido para fins educacionais e de pesquisa em Engenharia de Dados e DataOps.
