# Game-Library-Manager---Projeto-Acad-mico
🎮 Game Library Manager – Aplicação Web
📌 Descrição do Projeto

O Game Library Manager é uma aplicação web para gerenciamento de uma biblioteca de jogos físicos, permitindo o cadastro de usuários, jogos e o controle de empréstimos.

O sistema foi projetado seguindo uma arquitetura em camadas (Controller, Service, Repository, Model), utilizando princípios REST, separação de responsabilidades e boas práticas de desenvolvimento backend e frontend.

O objetivo do projeto é aplicar conceitos de:

Front-end / Client-side;

Back-end / Server-side;

REST;

Padrões de Projeto;

Controle de acesso com autenticação;

Testes automatizados;

Deploy e CI/CD;

Observabilidade.

🧱 Arquitetura -🔹 Arquitetura Monolítica em Camadas

O sistema será estruturado em:
Controller → Service → Repository → Banco de Dados

Camadas:
Controller → Exposição de endpoints REST
Service → Regras de negócio
Repository → Acesso a dados
Model/Entity → Representação das entidades do sistema


🧩 Funcionalidades - 🔹 CRUD Principal

CRUD completo de Jogos:
Criar jogo
Listar jogos
Atualizar jogo
Remover jogo

🔐 Controle de Acesso

O sistema contará com:
Endpoint de login
Geração de token JWT
Proteção de rotas autenticadas
Controle de acesso baseado em token

🌐 Front-end
Interface simples para:
Cadastro de jogos
Cadastro de usuários
Realização de empréstimos
Listagem de histórico

Tecnologias possíveis:
HTML + CSS + JavaScript
Comunicação via API REST.

🗄 Banco de Dados
Inicialmente:
H2 (ambiente de desenvolvimento)
Possível produção:
PostgreSQL

🧪 Testes
Testes unitários na camada Service
Validação de regras de negócio
Testes de endpoints principais

🔁 CI/CD

Repositório GitHub
Pipeline automático para:
Build
Testes
Deploy

📊 Observabilidade
Logs estruturados
Monitoramento básico de erros
Possível integração futura com ferramenta de monitoramento

📎 Repositório
Código-fonte, documentação e wiki estarão disponíveis no GitHub.

🎯 Conclusão
O projeto busca integrar conceitos teóricos e práticos da disciplina de Programação Web, aplicando padrões de projeto, arquitetura organizada e boas práticas de desenvolvimento, resultando em uma aplicação funcional, testável e implantada em produção.
