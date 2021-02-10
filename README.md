# Desafio Dev API REST

Bem vindo ao projeto que implementa um desafio REST, neste documento será apresentado os padrões utilizados, estrutura do projeto, como implementar novas funcionalidades, executar e utilização no Docker.

Para executar, construir e/ou testar este projeto, primeiro execute `npm i`.

## Estrutura do Projeto

Por meio da pasta **apps**, localiza-se os arquivos necessários para a implementação desse desafio. Dentro dela há outras duas subpastas:

- api: contendo o código da API
- database: contendo as instruções DML e DDL do banco

A escolha dessa estrutura de pastas se deve pela extensibilidade em adicionar outros subprojetos à este, tornando um mono-repositório. Em outras palavras podemos ter uma outra pasta com o nome **infrastructure"** contendo o código do terraform para realizar o gerenciamento da infra em alguma nuvem, bem como um outro projeto chamado **front** contendo o cliente que consumiria essa API.

## Padrões

Para a codificação do projeto, foi utilizado alguns padrões, dos quais temos:

- Conventional Commit: padronização de commits
- Snake Case: utilização desse padrão nos objetos do banco (constraints, tabelas, campos, etc...)
- Padrão de constraint de banco: Usando o padrão "snake case", para definirmos o nome e evitar colisões, definimos a seguinte nomenclatura para constraints de banco **<acrônimo da constraint>_<tabela da constraint>_<tabela alvo (no caso de chave estrangeira)>\_<nome da coluba>**. Um exemplo seria `fk_transaction_account_account_id` e `uq_client_id`

## Contribuir

Para executar o código, é necessário entender que há variáveis de ambiente que o projeto utiliza

| Variável de Ambiente | Opcional | Descrição                            |
| -------------------- | -------- | ------------------------------------ |
| PORT                 | Sim      | Porta que a API será disponibilizada |
| DB_HOST              | Não      | Host do banco de dados               |
| DB_PORT              | Não      | Porta do banco de dados              |
| DB_USER              | Não      | Usuário do banco de dados            |
| DB_PASSWORD          | Não      | Senha de usuário do banco de dados   |
| DB_NAME              | Não      | Nome do banco de dados               |

Com essas variáveis de ambiente devidamente setadas, podemos iniciar o servidor utilizando `npm start`.

> Caso esteja usando VSCode, deixe habilitado a opção "Auto Attach" para que o depurador seja vinculado à aplicação automaticamente

## Comandos úteis

- docs -> Gera e disponibiliza a documentação do código em compodoc
- start -> Inicia em modo de desenvolvimento (com depuração) o servidor
- test -> Realiza os testes unitários
- test:e2e -> Realiza os testes end to end
- build -> Realiza o build da aplicação, disponibilizando na pasta "dist"
- format -> Formata o código usando as regras do prettier
- lint -> Executa o lint no código
- docker -> Executa o projeto em modo produção

## Docker

## O que esse projeto não abrange

Por questões de prazo, algumas questões não foram implementadas que são descritas abaixo.

### Versionamento e migração do banco

Soluções como [sqitch](https://sqitch.org/) resolvem muito bem no contexto de CI, seja com Gitlab Runner, seja com Github Actions, mas não foi implementado pelos motivos mencionados acima.

### Terraform

A infraestrutura pronta, mas sem abordagem de nenhum provedor de nuvem, é via docker-compose. A implementação de uma VPC, subnet (privada e pública), configuração do RDS, escolha entre Lambda ou ECS no contexto da AWS é relativamente simples, porém atentei aos requisitos iniciais do projeto.

### CI

Utilizando Gitlab Runner ou Github Actions, uma solução para a implementação da infraestrutura automatizada e deploy do código seria usando uma EC2 própria para realizar todo o trabalho. A escolha de uma EC2 própria é de não precisar criar chaves de comunicação entre AWS e Github/Gitlab tendo que armazenar elas e, eventualmente ter um controle manual de rotacionar essas chaves periodicamente por questões de segurança.

### Testes end-to-end

Não há testes end-to-end no projeto, mas caso houvesse tempo hábil, colocaria dentro da estrutura `apps/api/e2e/*` para armazenar os casos de testes

### Desenho arquitetural

Um desenho arquitetural no draw.io iria melhorar o entendimento da infraestrutura bem como o entendimento do código, porém não obtive tempo.
