
# 🔗 PostaFácil Back-End

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)
![License](https://img.shields.io/github/license/ikarofreitas/postafacil-back-end)
![Stars](https://img.shields.io/github/stars/ikarofreitas/postafacil-back-end)

> 🛠 API REST moderna desenvolvida em Node.js e TypeScript para suportar funcionalidades do PostaFácil (frontend).

## 📌 Visão Geral

A API fornece endpoints RESTful para:

✔️ Criar posts  
✔️ Listar posts  
✔️ Atualizar posts  
✔️ Excluir posts

A aplicação segue princípios de arquiteturas REST e boas práticas de desenvolvimento.

## 🧰 Tecnologias

| Tecnologia | Propósito |
|------------|-----------|
| `Node.js` | Runtime JavaScript |
| `TypeScript` | Tipagem estática |
| `Express` | Framework HTTP |
| `Prisma` | ORM para banco de dados |
| `PostgreSQL` (ou outro) | Banco de dados relacional |
| `dotenv` | Variáveis de ambiente |

## 📌 Endpoints Principais

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/posts` | Lista todos os posts |
| GET | `/posts/:id` | Busca um post por ID |
| POST | `/posts` | Cria um novo post |
| PUT | `/posts/:id` | Atualiza post existente |
| DELETE | `/posts/:id` | Remove post |

## 🚀 Começando (Desenvolvimento)

### Pré-requisitos

✔️ Node.js v16+  
✔️ Banco de dados rodando (ex: PostgreSQL)

### Instalação

```sh
git clone https://github.com/ikarofreitas/postafacil-back-end.git
cd postafacil-back-end
npm install
