# Blackjack API - Guia Rápido de Referência

## 🚀 Início Rápido

### 1. Iniciar o Servidor
```bash
cargo run -p blackjack-api
# Servidor: http://localhost:8080
```

### 2. Importar no Postman
- Importar: `Blackjack_API.postman_collection.json`
- Importar: `Blackjack_API_Local.postman_environment.json`
- Selecionar environment: **Blackjack API - Local**

### 3. Fluxo de Teste
```
Health Check → Create Game → Login → Draw Cards → Finish Game → Results
```

---

## 📋 Endpoints Resumidos

| Endpoint | Método | Auth? | Descrição |
|----------|--------|-------|-----------|
| `/health` | GET | ❌ | Status do servidor |
| `/health/ready` | GET | ❌ | Prontidão dos componentes |
| `/api/v1/auth/login` | POST | ❌ | Autenticar jogador |
| `/api/v1/games` | POST | ❌ | Criar novo jogo |
| `/api/v1/games/:id` | GET | ✅ | Ver estado do jogo |
| `/api/v1/games/:id/draw` | POST | ✅ | Comprar carta |
| `/api/v1/games/:id/ace` | PUT | ✅ | Mudar valor do Ás |
| `/api/v1/games/:id/finish` | POST | ✅ | Finalizar jogo |
| `/api/v1/games/:id/results` | GET | ✅ | Ver resultados |

---

## 🔐 Autenticação

### Token JWT
- Obtido via: `POST /api/v1/auth/login`
- Válido por: **24 horas**
- Header: `Authorization: Bearer <token>`
- Automaticamente gerenciado no Postman ✅

---

## 📝 Variáveis Principais

| Variável | Auto? | Descrição |
|----------|-------|-----------|
| `base_url` | ❌ | `http://localhost:8080` |
| `game_id` | ✅ | UUID do jogo (salvo no Create Game) |
| `jwt_token` | ✅ | Token JWT (salvo no Login) |
| `player_email` | ❌ | Email do jogador atual |
| `card_id` | ✅ | UUID de carta Ás (salvo no Draw Card) |

---

## 🎮 Exemplos de Requests

### Criar Jogo
```json
POST /api/v1/games
{
  "emails": [
    "player1@example.com",
    "player2@example.com"
  ]
}
```

### Login
```json
POST /api/v1/auth/login
{
  "email": "player1@example.com",
  "game_id": "{{game_id}}"
}
```

### Comprar Carta
```
POST /api/v1/games/{{game_id}}/draw
Authorization: Bearer {{jwt_token}}
```

### Mudar Ás
```json
PUT /api/v1/games/{{game_id}}/ace
Authorization: Bearer {{jwt_token}}
{
  "card_id": "{{card_id}}",
  "as_eleven": false
}
```

---

## 📊 Códigos de Status

| Código | Significado | Quando Ocorre |
|--------|-------------|---------------|
| 200 | OK | Request bem-sucedido |
| 400 | Bad Request | Dados inválidos (UUID, contagem de jogadores) |
| 401 | Unauthorized | Token ausente ou inválido |
| 403 | Forbidden | Jogador não está no jogo / jogo finalizado |
| 404 | Not Found | Jogo/jogador/carta não encontrado |
| 409 | Conflict | Jogo já finalizado / jogo não finalizado |
| 410 | Gone | Baralho vazio |
| 429 | Too Many Requests | Rate limit excedido |
| 500 | Internal Server Error | Erro no servidor |

---

## ⚠️ Erros Comuns

### 401 Unauthorized
**Causa**: Token JWT inválido ou expirado  
**Solução**: Fazer login novamente

### 403 Forbidden - Player not in game
**Causa**: Email não está na lista de jogadores  
**Solução**: Usar email que foi incluído no Create Game

### 403 Forbidden - Game finished
**Causa**: Tentando jogar após finalizar  
**Solução**: Criar um novo jogo

### 404 Not Found - Game not found
**Causa**: `game_id` inválido ou não existe  
**Solução**: Verificar o UUID ou criar novo jogo

### 409 Conflict - Game not finished
**Causa**: Tentando ver resultados antes de finalizar  
**Solução**: Chamar `POST /api/v1/games/:id/finish` primeiro

---

## 🧪 Ferramentas de Teste

### Postman
```
✅ Melhor para: Interface visual, debugging
📁 Arquivo: Blackjack_API.postman_collection.json
📖 Guia: POSTMAN_GUIDE.md
```

### VS Code REST Client
```
✅ Melhor para: Testes rápidos no editor
📁 Arquivo: api_tests.http
💡 Extensão: humao.rest-client
```

### PowerShell Script
```
✅ Melhor para: Testes automatizados completos
📁 Arquivo: test_api.ps1
▶️ Executar: .\test_api.ps1
```

### cURL
```
✅ Melhor para: Linha de comando, scripts
📁 Arquivo: CURL_EXAMPLES.md
🐧 Linux/Mac ready
```

---

## 🎯 Cenários de Teste

### Teste Básico (1 jogador)
1. Create Game com 1 email
2. Login
3. Draw 2-3 cartas
4. Finish Game
5. Get Results

### Teste Multi-jogador
1. Create Game com 3+ emails
2. Login como jogador 1
3. Draw cartas para jogador 1
4. Trocar token (login como jogador 2)
5. Draw cartas para jogador 2
6. Finish Game
7. Get Results

### Teste Ás
1. Create Game
2. Login
3. Draw até pegar um Ás (script salva ID automaticamente)
4. Set Ace Value para 11
5. Set Ace Value para 1
6. Ver diferença nos pontos

### Teste Bust
1. Create Game
2. Login
3. Draw várias cartas até estourar (> 21)
4. Verificar `busted: true`
5. Finish e verificar que perdeu

---

## 🔄 Workflow Recomendado

### Desenvolvimento
```bash
# Terminal 1: Servidor
cargo run -p blackjack-api

# Terminal 2: Testes
cargo test --workspace

# Terminal 3: Testes de API
.\test_api.ps1
```

### Debugging
1. Usar Postman para requests individuais
2. Verificar logs no terminal do servidor
3. Usar `RUST_LOG=debug` para logs detalhados

### CI/CD
```bash
# Testes completos
cargo test --workspace
cargo clippy --workspace -- -D warnings
cargo fmt --workspace --check

# Build de produção
cargo build --release -p blackjack-api
```

---

## 📚 Documentação Completa

- **API Endpoints**: [../../crates/blackjack-api/src/handlers.rs](../../crates/blackjack-api/src/handlers.rs)
- **Postman**: [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md)
- **cURL**: [CURL_EXAMPLES.md](CURL_EXAMPLES.md)
- **PRD**: [../PRD.md](../PRD.md)

---

## 🆘 Troubleshooting

### Servidor não inicia
```bash
# Verificar se a porta está em uso
netstat -ano | findstr :8080

# Mudar porta
$env:BLACKJACK_SERVER_PORT=3000
cargo run -p blackjack-api
```

### Variáveis não salvam no Postman
1. Verificar environment selecionado (canto superior direito)
2. Ver se está usando `{{variavel}}` corretamente
3. Executar requests na ordem correta

### Token expira rápido
```toml
# Ajustar em config.toml
[jwt]
expiration_hours = 48  # 2 dias
```

### Rate limit muito restritivo
```toml
# Ajustar em config.toml
[rate_limit]
requests_per_minute = 30  # Aumentar
```

---

## ⚡ Atalhos Úteis

### Postman
- `Ctrl+Enter`: Enviar request
- `Ctrl+E`: Abrir environments
- `Ctrl+Shift+C`: Abrir console

### VS Code REST Client
- `Ctrl+Alt+R`: Enviar request
- `Ctrl+Alt+C`: Cancelar request
- `Ctrl+Alt+H`: Ver history

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2026
