# 📚 Índice de Recursos para Teste da API

Este documento lista todos os recursos disponíveis para testar a Blackjack API.

---

## 🎯 Por Onde Começar?

### Se você é novo:
1. ✨ Comece com **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Visão geral rápida
2. 📖 Leia **[POSTMAN_GUIDE.md](POSTMAN_GUIDE.md)** - Tutorial completo
3. 🚀 Use **Postman Collection** - A forma mais fácil de testar

### Se você já conhece a API:
- 💻 Use **[api_tests.http](api_tests.http)** - Testes rápidos no VS Code
- ⚡ Execute **[test_api.ps1](test_api.ps1)** - Suite automatizada
- 📋 Consulte **[CURL_EXAMPLES.md](CURL_EXAMPLES.md)** - Referência de comandos

---

## 📁 Arquivos de Teste

### Para Postman

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| [Blackjack_API.postman_collection.json](Blackjack_API.postman_collection.json) | Collection | Coleção completa com todos os endpoints |
| [Blackjack_API_Local.postman_environment.json](Blackjack_API_Local.postman_environment.json) | Environment | Variáveis para ambiente local |
| [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md) | Documentação | Guia completo de uso do Postman |

**Como usar:**
1. Abrir Postman
2. Import → Selecionar os 2 arquivos .json
3. Selecionar environment "Blackjack API - Local"
4. Seguir o guia em POSTMAN_GUIDE.md

---

### Para VS Code

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| [api_tests.http](api_tests.http) | HTTP File | Requests prontos para REST Client |

**Como usar:**
1. Instalar extensão: `REST Client` (humao.rest-client)
2. Abrir arquivo `api_tests.http`
3. Clicar em "Send Request" acima de cada request

**Features:**
- ✅ Variáveis configuráveis no topo
- ✅ Exemplos de todos os endpoints
- ✅ Testes de erro incluídos
- ✅ Comentários explicativos

---

### Scripts Automatizados

| Arquivo | Linguagem | Descrição |
|---------|-----------|-----------|
| [test_api.ps1](test_api.ps1) | PowerShell | Suite completa de testes automatizados |

**Como usar:**
```powershell
# Terminal PowerShell
.\test_api.ps1
```

**O que faz:**
- ✅ Testa todos os endpoints em sequência
- ✅ Valida respostas
- ✅ Gerencia variáveis automaticamente
- ✅ Mostra output colorido
- ✅ Testa cenários de erro
- ✅ Fornece resumo final

---

### Linha de Comando

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| [CURL_EXAMPLES.md](CURL_EXAMPLES.md) | Documentação | Exemplos prontos com cURL |

**Como usar:**
- Copiar e colar comandos do arquivo
- Ajustar variáveis de ambiente
- Funciona em Linux, Mac e Windows (Git Bash)

**Inclui:**
- ✅ Todos os endpoints
- ✅ Versões Linux/Mac e Windows
- ✅ Exemplos com jq para formatação
- ✅ Scripts completos de teste
- ✅ Dicas e truques

---

## 📖 Documentação

### Guias de Uso

| Arquivo | Conteúdo | Público-Alvo |
|---------|----------|--------------|
| [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md) | Tutorial completo do Postman | Iniciantes e intermediários |
| [QUICK_REFERENCE.md](QUICK_REFERENCE.md) | Referência rápida | Todos os níveis |
| [CURL_EXAMPLES.md](CURL_EXAMPLES.md) | Referência cURL | Desenvolvedores CLI |
| [README.md](../../README.md) | Visão geral do projeto | Todos |

### Documentação Técnica

| Arquivo | Conteúdo |
|---------|----------|
| [docs/PRD.md](../PRD.md) | Product Requirements Document |
| [crates/blackjack-api/src/handlers.rs](../../crates/blackjack-api/src/handlers.rs) | Documentação inline dos endpoints |
| [crates/blackjack-api/config.toml](../../crates/blackjack-api/config.toml) | Configuração padrão |

---

## 🎓 Tutoriais por Cenário

### 1. Primeiro Teste (Postman)
**Tempo**: ~5 minutos

```
1. Importar coleção no Postman
2. Health Check → enviar
3. Create Game → enviar (salva game_id)
4. Login → enviar (salva token)
5. Draw Card → enviar
6. Finish Game → enviar
```

**Arquivos necessários:**
- Blackjack_API.postman_collection.json
- Blackjack_API_Local.postman_environment.json

**Guia**: [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md) - Seção "Quick Test Flow"

---

### 2. Teste Multi-Jogador
**Tempo**: ~10 minutos

```
1. Criar jogo com 3 jogadores
2. Login como jogador 1
3. Draw cartas para jogador 1
4. Duplicar pasta no Postman
5. Criar variável player2_token
6. Login como jogador 2
7. Draw cartas para jogador 2
8. Finish e ver resultados
```

**Arquivos necessários:**
- Postman collection

**Guia**: [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md) - Seção "Testing with Multiple Players"

---

### 3. Teste Automatizado Completo
**Tempo**: ~1 minuto

```powershell
.\test_api.ps1
```

**Arquivos necessários:**
- test_api.ps1

**O que acontece:**
- Testa todos os endpoints
- Cria jogo, faz login, compra cartas
- Testa mudança de valor do Ás
- Finaliza e mostra resultados
- Testa cenários de erro

---

### 4. Desenvolvimento com VS Code
**Tempo**: Contínuo

```
1. Abrir api_tests.http no VS Code
2. Ajustar variáveis no topo
3. Click "Send Request" para testar
4. Modificar e re-testar rapidamente
```

**Arquivos necessários:**
- api_tests.http
- REST Client extension

**Vantagens:**
- ⚡ Muito rápido
- 📝 Fácil de modificar
- 💾 Versionável com git
- 🔄 Integrado ao editor

---

### 5. CI/CD ou Scripts
**Tempo**: Variável

Usar cURL para integração em pipelines:

```bash
# Ver CURL_EXAMPLES.md para exemplos completos
source CURL_EXAMPLES.md

# Exemplo: teste básico
./test_health_check.sh
```

**Arquivos necessários:**
- CURL_EXAMPLES.md (como referência)
- Seus próprios scripts bash/PowerShell

---

## 🔧 Ferramentas por Caso de Uso

### Interface Gráfica
**Use**: Postman  
**Quando**: Testes interativos, debugging, demonstrações  
**Arquivos**: `Blackjack_API.postman_collection.json`

### Editor de Código
**Use**: VS Code REST Client  
**Quando**: Desenvolvimento ativo, testes rápidos  
**Arquivos**: `api_tests.http`

### Linha de Comando
**Use**: cURL  
**Quando**: Scripts, CI/CD, automação  
**Arquivos**: `CURL_EXAMPLES.md`

### Testes Automatizados
**Use**: PowerShell Script  
**Quando**: Validação completa, regressão  
**Arquivos**: `test_api.ps1`

---

## 📊 Matriz de Features

|  | Postman | VS Code | cURL | PowerShell |
|---|:---:|:---:|:---:|:---:|
| Interface gráfica | ✅ | ✅ | ❌ | ❌ |
| Auto-save variáveis | ✅ | ⚠️ | ❌ | ✅ |
| Documentação inline | ✅ | ✅ | ✅ | ✅ |
| Teste de scripts | ✅ | ❌ | ❌ | ✅ |
| Versionável | ✅ | ✅ | ✅ | ✅ |
| Fácil compartilhar | ✅ | ✅ | ✅ | ✅ |
| CI/CD ready | ⚠️ | ⚠️ | ✅ | ✅ |
| Curva aprendizado | Baixa | Baixa | Média | Baixa |

**Legenda:**
- ✅ Sim / Suporte completo
- ⚠️ Parcial / Com configuração
- ❌ Não / Não recomendado

---

## 🎯 Escolha Sua Ferramenta

### Você quer...

**...testar rapidamente durante desenvolvimento?**
→ Use **VS Code REST Client** com `api_tests.http`

**...documentação e compartilhamento?**
→ Use **Postman** com as collections

**...automação e CI/CD?**
→ Use **cURL** ou **PowerShell script**

**...aprender a API pela primeira vez?**
→ Comece com **Postman** + **POSTMAN_GUIDE.md**

**...testar tudo de uma vez?**
→ Execute **test_api.ps1**

---

## 📞 Suporte

### Problemas Comuns

**Variáveis não funcionam**
- Postman: Verificar environment selecionado
- VS Code: Usar sintaxe `@variavel = valor`
- cURL: Usar `export` no bash ou `$env:` no PowerShell

**Servidor não responde**
- Verificar se está rodando: `cargo run -p blackjack-api`
- Verificar porta: padrão `8080`
- Ver logs do servidor para erros

**Token expirado**
- Fazer novo login (`POST /api/v1/auth/login`)
- Token válido por 24 horas

### Mais Ajuda

Consulte:
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Troubleshooting
- [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md) - Seção "Troubleshooting"
- [README.md](../../README.md) - Documentação principal

---

## 🚀 Próximos Passos

Depois de testar a API:

1. **Integrar Frontend**: Use os endpoints para criar uma UI
2. **WebSocket**: Implementar notificações real-time (blueprint em websocket.rs)
3. **Persistência**: Adicionar SQLite (migrations já preparadas)
4. **Deploy**: Usar Dockerfile incluído

Ver [docs/PRD.md](../PRD.md) para o roadmap completo.

---

**Mantido por**: Equipe Blackjack API  
**Última atualização**: Janeiro 2026  
**Versão da API**: 1.0.0
