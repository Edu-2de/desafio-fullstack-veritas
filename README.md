# Veritas — Mini Kanban

Backend em Go + frontend em React/Vite para um quadro Kanban simples.

## Rodando com Docker

Pré-requisito: Docker (com Compose v2).

```bash
docker compose up -d --build
```

- Front: http://localhost:3000
- Back: http://localhost:8080

As tasks ficam persistidas em JSON num volume nomeado (`back-data`), então
sobrevivem a `docker compose restart`/`down` (sem `-v`). Para apagar tudo:

```bash
docker compose down -v
```

### Variáveis de ambiente

| Serviço | Variável | Onde se aplica | Padrão no compose |
| --- | --- | --- | --- |
| back | `PORT` | runtime | `8080` |
| back | `CORS_ORIGIN` | runtime | `http://localhost:3000` |
| back | `DATA_FILE` | runtime | `/data/tasks.json` |
| front | `VITE_API_URL` | **build time** (embutida no bundle, não é lida em runtime) | `http://localhost:8080` |

Se publicar o front em outra porta/host, ajuste `VITE_API_URL` (build arg do
serviço `front` no `docker-compose.yml`) e `CORS_ORIGIN` (env do serviço
`back`) para apontarem um pro outro.

## Rodando localmente (sem Docker)

**Backend** (Go 1.26+):

```bash
cd back
go run .
```

**Frontend** (Node 24+, pnpm):

```bash
cd front
pnpm install
pnpm dev
```

Copie `back/.env.example` → `back/.env` e `front/.env.example` → `front/.env`
para customizar portas/URLs localmente (essas variáveis não são lidas
automaticamente pelo Go — sirva de referência, exporte-as você mesmo se
precisar mudar os padrões).
