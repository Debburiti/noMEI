# Disponibilidade e Proteção contra Ataques Digitais

## Objetivo

Garantir que a plataforma continue operando mesmo diante de falhas temporárias, indisponibilidade de serviços externos ou erros durante a execução do pipeline de dados.

## Implementação Utilizada

### Prefect para Orquestração

O projeto utiliza o Prefect para orquestração do pipeline ETL. A ferramenta permite monitoramento das execuções, reprocessamento de falhas e automação das tarefas.

### Variáveis de Ambiente

Informações sensíveis, como credenciais do MongoDB Atlas e chaves de API, são armazenadas em arquivos `.env`, evitando exposição direta no código-fonte.

### Auditoria de Execução

Foi implementado um mecanismo de auditoria responsável por registrar eventos importantes do pipeline:

* Início da execução
* Finalização da execução
* Falhas durante o processamento
* Erros de transformação

Os eventos são armazenados em logs estruturados.

## Justificativa da Escolha

O Prefect foi escolhido por ser uma ferramenta leve e simples de configurar.

A auditoria foi implementada para garantir rastreabilidade das operações e facilitar a identificação de falhas.

## Alternativas Possíveis

* Apache Airflow
* Dagster
* AWS Step Functions
* Azure Data Factory

Estas soluções oferecem recursos avançados de escalabilidade, porém possuem maior complexidade operacional.
