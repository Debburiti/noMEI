# Arquitetura do ETL Pipeline

Data: 2026-06-13

## Visao geral

O `etl-pipeline` e a camada de Engenharia de Dados da aplicacao noMEI. Ele coleta dados publicos de contratacoes no PNCP, normaliza os registros, persiste documentos curados no MongoDB Atlas e gera uma camada analitica Gold com Spark, arquivos e DuckDB.

O desenho principal segue o fluxo:

```text
PNCP API
  -> Extract
  -> Transform
  -> Load
  -> MongoDB Atlas (Silver)
  -> Spark Analytics
  -> Gold (CSV, Parquet, DuckDB)
```

Tambem existe um fluxo alternativo com Kafka:

```text
PNCP API
  -> Producer Kafka
  -> Topico pncp_contratacoes
  -> Consumer Kafka
  -> Transform
  -> MongoDB Atlas
```

## Estrutura de pastas

```text
etl-pipeline/
├── config/
│   └── settings.py
├── docker/
│   └── docker-compose.yml
├── docs/
├── mcp_service/
│   ├── app.py
│   └── mcp_server.py
├── src/
│   ├── analytics/
│   ├── ingestion/
│   ├── orchestration/
│   ├── processing/
│   ├── security/
│   ├── storage/
│   ├── streaming/
│   └── contracts.py
├── analytics_output/
├── logs/
├── main.py
├── README.md
└── requirements.txt
```

## Camadas da arquitetura

### Configuracao

Arquivo principal:

- `config/settings.py`

Responsabilidade:

- Centralizar parametros da aplicacao.
- Ler variaveis de ambiente.
- Evitar credenciais hardcoded.
- Validar parametros minimos.

Configuracoes relevantes:

- `PNCP_BASE_URL`
- `REQUEST_TIMEOUT`
- `MAX_RETRIES`
- `RETRY_BACKOFF`
- `PAGE_SIZE`
- `BATCH_SIZE`
- `MONGODB_URI`
- `MONGODB_DATABASE`
- `MONGODB_COLLECTION`
- `KAFKA_BOOTSTRAP_SERVERS`
- `KAFKA_TOPIC_PNCP`
- `GOLD_OUTPUT_PATH`
- `GOLD_DUCKDB_PATH`

## ETL principal

### Extract

Arquivo:

- `src/ingestion/extractor.py`

Classe:

- `PNCPExtractor`

Responsabilidade:

- Consumir a API publica de consultas do PNCP.
- Consultar o endpoint `/v1/contratacoes/proposta`.
- Filtrar por intervalo de datas de publicacao.
- Controlar paginacao com `pagina` e `tamanhoPagina`.
- Respeitar `totalPaginas` quando informado pela API.
- Executar retries com backoff exponencial.
- Tratar erros HTTP, erros de rede e respostas invalidas.
- Enriquecer registros com CNAEs dos itens da compra quando disponivel.

Filtros suportados:

- `data_inicial`
- `data_final`
- `uf`
- `codigo_modalidade`
- `cnpj`
- `codigo_municipio_ibge`
- `codigo_unidade_administrativa`
- `max_paginas`
- `page_size`

### Transform

Arquivo:

- `src/processing/transformer.py`

Classe:

- `PNCPTransformer`

Responsabilidade:

- Converter JSON bruto do PNCP em documento curado.
- Converter datas para `datetime` UTC.
- Converter valores monetarios para numerico.
- Normalizar campos textuais.
- Tratar campos ausentes, nulos e vazios.
- Criar chave idempotente `_id`.
- Enriquecer o documento com metadados do ETL.
- Criar campos auxiliares para consulta.
- Aplicar regras basicas de LGPD.

Campos numericos normalizados:

- `valorTotalEstimado`
- `valorTotalHomologado`
- `valorTotalSigiloso`

Campos de data normalizados:

- `dataAtualizacao`
- `dataInclusao`
- `dataAberturaProposta`
- `dataEncerramentoProposta`
- `dataPublicacaoPncp`
- `dataAtualizacaoGlobal`

Metadados adicionados:

- `_id`
- `_etl_ingestao_em`
- `_etl_fonte`
- `_etl_camada`
- `_consulta`
- `_mei_compativel`

### Load

Arquivo:

- `src/storage/loader.py`

Classe:

- `MongoDBLoader`

Responsabilidade:

- Conectar ao MongoDB Atlas.
- Criar indices operacionais.
- Persistir documentos curados em lote.
- Fazer upsert idempotente por `_id`.
- Gravar tambem uma colecao auxiliar de orgaos quando aplicavel.

Estrategia de idempotencia:

```text
_id = numeroControlePNCP
```

Operacao de escrita:

```text
UpdateOne({"_id": doc["_id"]}, {"$set": doc, "$setOnInsert": ...}, upsert=True)
```

Essa abordagem permite reexecutar o pipeline sem duplicar contratacoes.

## Orquestracao OO

Arquivo:

- `src/processing/pipeline.py`

Classe:

- `ETLPipeline`

Responsabilidade:

- Coordenar o fluxo Extract -> Transform -> Load.
- Processar registros em micro-lotes.
- Registrar contadores de execucao.
- Registrar eventos de auditoria.
- Retornar `PipelineResult`.

Resultado da execucao:

- `total_extraido`
- `total_transformado`
- `total_inserido`
- `total_atualizado`
- `total_erros`
- `inicio`
- `fim`
- `sucesso`

## Contratos e POO

Arquivo:

- `src/contracts.py`

Contratos:

- `BaseExtractor`
- `BaseTransformer`
- `BaseRepository`

Objetivo:

- Definir responsabilidades claras.
- Facilitar testes e substituicoes futuras.
- Evitar um script procedural unico.

Implementacoes:

- `PNCPExtractor(BaseExtractor)`
- `PNCPTransformer(BaseTransformer)`
- `MongoDBLoader(BaseRepository)`

## Orquestracao com Prefect

Arquivos:

- `src/orchestration/orchestrate_prefect.py`
- `src/orchestration/deployment.py`

O flow Prefect modela as etapas como tasks:

```text
extract_pncp
  -> transform_pncp
  -> load_mongodb
```

Cada task tem logging e retries configurados. O deployment demonstra agenda diaria:

```text
Nome: etl-pncp-diario
Cron: 0 6 * * *
```

Execucao manual:

```bash
python -m src.orchestration.orchestrate_prefect
```

Deployment agendado:

```bash
python -m src.orchestration.deployment
```

## Kafka e streaming

Arquivos:

- `src/ingestion/producer.py`
- `src/streaming/kafka_consumer.py`
- `src/streaming/kafka_topics.py`
- `src/streaming/stream_pipeline.py`
- `src/orchestration/kafka_flow.py`
- `docker/docker-compose.yml`

Fluxo:

```text
PNCPExtractor
  -> PNCPProducer
  -> Kafka topic
  -> PNCPConsumer
  -> PNCPTransformer
  -> MongoDBLoader
```

Beneficios:

- Desacoplamento entre extracao e carga.
- Tolerancia a falhas entre etapas.
- Reprocessamento por offsets.
- Possibilidade de consumidores paralelos.

Subir Kafka local:

```bash
docker compose -f docker/docker-compose.yml up
```

## Camada analitica com Spark

Arquivos:

- `src/processing/spark_transform.py`
- `src/analytics/gold_generator.py`
- `src/analytics/metrics.py`

Responsabilidade:

- Ler documentos curados do MongoDB Atlas.
- Criar DataFrame Spark.
- Construir agregacoes analiticas.
- Persistir a camada Gold.

Datasets Gold:

- `oportunidades_por_uf`
- `media_por_modalidade`
- `oportunidades_mei`
- `top_orgaos`
- `maiores_editais`
- `maior_valor_por_uf`

Destinos Gold:

- CSV
- Parquet
- DuckDB

Execucao:

```bash
python -m src.processing.spark_transform
```

## Arquitetura medalhao

### Bronze

Dados brutos vindos da API PNCP. A camada Bronze e representada pelos registros retornados pelo `PNCPExtractor` antes da normalizacao.

### Silver

Dados limpos e conformados persistidos no MongoDB Atlas. A colecao principal e `contratacoes_proposta`.

### Gold

Dados agregados e analiticos gerados com Spark e persistidos em `analytics_output/gold/`, em CSV, Parquet e DuckDB.

## MongoDB Atlas

Banco documental usado como camada Silver.

Modelagem:

- Um documento por contratacao.
- `_id` baseado em `numeroControlePNCP`.
- Subdocumentos preservados para `orgaoEntidade` e `unidadeOrgao`.
- Campos normalizados para consulta e analytics.
- Indices para UF, orgao, modalidade, periodo, valor, CNAE, MEI e texto do objeto.

Justificativa:

- O PNCP retorna dados semiestruturados.
- MongoDB preserva a granularidade do documento original.
- Upsert permite reprocessamento sem duplicacao.
- Consultas por filtros operacionais ficam naturais com subdocumentos e indices.

## MCP

Arquivo:

- `mcp_service/mcp_server.py`

Responsabilidade:

- Expor os dados curados para clientes de IA via Model Context Protocol.
- Permitir consultas parametrizadas por UF, orgao, modalidade, periodo e termo no objeto.
- Expor agregacoes como valor total estimado.

Ferramentas principais:

- `consultar_contratacoes`
- `valor_total_contratacoes`
- `consultar_por_uf`
- `consultar_por_orgao`
- `consultar_por_modalidade`
- `consultar_por_periodo`
- `resumo_geral`

Recurso:

- `pncp://resumo`

## Seguranca, LGPD e auditoria

Arquivos:

- `src/security/lgpd.py`
- `src/security/anonymizer.py`
- `src/security/audit.py`

Responsabilidade:

- Remover campos sensiveis.
- Pseudonimizar campos quando necessario.
- Registrar eventos de execucao em log de auditoria.

## Pontos de entrada

CLI principal:

```bash
python main.py
```

Com filtros:

```bash
python main.py --data-inicial 20260601 --data-final 20260613 --uf PE --max-paginas 5
```

Prefect:

```bash
python -m src.orchestration.orchestrate_prefect
```

Spark Gold:

```bash
python -m src.processing.spark_transform
```

MCP:

```bash
python -m mcp_service.mcp_server
```

Streamlit:

```bash
streamlit run mcp_service/app.py
```

