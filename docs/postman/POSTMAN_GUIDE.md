# Coleção Postman - Blackjack API

Esta coleção contém todos os endpoints necessários para testar a API Blackjack Multi-Player.

## 📦 Arquivos

- **Blackjack_API.postman_collection.json** - Coleção completa com todos os endpoints
- **Blackjack_API_Local.postman_environment.json** - Environment para desenvolvimento local

## 🚀 Como Usar

### 1. Importar no Postman

1. Abra o Postman
2. Clique em **Import** (ou use Ctrl+O)
3. Arraste e solte os dois arquivos JSON ou selecione-os
4. Confirme a importação

### 2. Configurar o Environment

1. No canto superior direito do Postman, selecione **Blackjack API - Local**
2. As variáveis já estão pré-configuradas para `http://localhost:8080`

### 3. Fluxo de Teste Recomendado

#### Passo 1: Verificar Saúde do Servidor
```
GET /health
GET /health/ready
```

#### Passo 2: Criar um Novo Jogo
```
POST /api/v1/games
```
- O `game_id` é salvo automaticamente na variável `{{game_id}}`
- Configure os emails dos jogadores no body

#### Passo 3: Fazer Login
```
POST /api/v1/auth/login
```
- Use o `game_id` do passo anterior
- O token JWT é salvo automaticamente na variável `{{jwt_token}}`
- Token válido por 24 horas

#### Passo 4: Jogar
```
POST /api/v1/games/{{game_id}}/draw - Comprar carta
GET  /api/v1/games/{{game_id}}      - Ver estado do jogo
PUT  /api/v1/games/{{game_id}}/ace  - Mudar valor do Ás (se tiver)
```

#### Passo 5: Finalizar
```
POST /api/v1/games/{{game_id}}/finish  - Finalizar jogo
GET  /api/v1/games/{{game_id}}/results - Ver resultados
```

## 📝 Variáveis Disponíveis

| Variável | Descrição | Auto-preenchida? |
|----------|-----------|------------------|
| `base_url` | URL base da API | Não |
| `jwt_token` | Token de autenticação | ✅ Sim (no Login) |
| `game_id` | UUID do jogo atual | ✅ Sim (no Create Game) |
| `player_email` | Email do jogador | Não |
| `card_id` | UUID de uma carta (Ás) | ✅ Sim (quando compra Ás) |

## 🔐 Autenticação

A maioria dos endpoints requer autenticação JWT:

1. **Endpoints Públicos** (sem auth):
   - Health checks
   - Create Game
   - Login

2. **Endpoints Protegidos** (requer JWT):
   - Get Game State
   - Draw Card
   - Set Ace Value
   - Finish Game
   - Get Game Results

O token JWT é configurado automaticamente na coleção através da variável `{{jwt_token}}`.

## 🧪 Scripts de Teste

A coleção inclui scripts automáticos que:

1. **Login**: Extrai e salva o token JWT
2. **Create Game**: Salva o `game_id`
3. **Draw Card**: Salva o `card_id` quando você compra um Ás
4. **Console logs**: Mostra informações úteis no console do Postman

## 📋 Exemplos de Requisições

### Criar Jogo com 3 Jogadores

```json
POST /api/v1/games

{
  "emails": [
    "player1@example.com",
    "player2@example.com",
    "player3@example.com"
  ]
}
```

### Login como Jogador

```json
POST /api/v1/auth/login

{
  "email": "player1@example.com",
  "game_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

### Mudar Valor do Ás

```json
PUT /api/v1/games/{{game_id}}/ace

{
  "card_id": "card-uuid-aqui",
  "as_eleven": false
}
```

## 🔄 Testando com Múltiplos Jogadores

Para simular vários jogadores:

1. Crie um jogo com múltiplos emails
2. Duplique a pasta "Authentication" ou "Player Actions"
3. Crie variáveis adicionais (`player2_email`, `player2_token`, etc.)
4. Configure cada request duplicada para usar variáveis diferentes

Ou use o **Postman Runner** para executar sequências de requests com diferentes datasets.

## ⚠️ Notas Importantes

- O servidor deve estar rodando em `http://localhost:8080`
- Tokens JWT expiram em 24 horas
- Cada jogo tem seu próprio baralho de 52 cartas
- Não é possível comprar cartas após finalizar o jogo
- Um Ás pode ter seu valor alterado múltiplas vezes

## 🐛 Troubleshooting

### "401 Unauthorized"
- Verifique se o token JWT está válido
- Faça login novamente se o token expirou

### "404 Not Found - Game not found"
- Verifique se o `game_id` está correto
- Crie um novo jogo se necessário

### "403 Forbidden - Player not found in game"
- Certifique-se de que o email usado no login está na lista de jogadores do jogo

### Variáveis não preenchidas automaticamente
- Verifique se está usando o environment correto
- Execute os requests na ordem: Create Game → Login → Draw Card

## 📚 Documentação da API

Para mais detalhes sobre cada endpoint, consulte:
- Código fonte: `../../crates/blackjack-api/src/handlers.rs`
- Documentação: `../PRD.md`

## 🎮 Exemplo de Sessão Completa

1. **Verificar servidor**: `GET /health` ✅
2. **Criar jogo**: `POST /api/v1/games` → recebe `game_id`
3. **Login Player 1**: `POST /api/v1/auth/login` → recebe `jwt_token`
4. **Comprar carta**: `POST /api/v1/games/{id}/draw` → recebe carta
5. **Comprar carta**: `POST /api/v1/games/{id}/draw` → recebe carta
6. **Ver estado**: `GET /api/v1/games/{id}` → vê pontos
7. **Se tiver Ás**: `PUT /api/v1/games/{id}/ace` → ajusta valor
8. **Finalizar**: `POST /api/v1/games/{id}/finish` → calcula vencedor
9. **Resultados**: `GET /api/v1/games/{id}/results` → vê ranking

---

**Desenvolvido para**: Blackjack Multi-Player API
**Versão**: 1.0.0
