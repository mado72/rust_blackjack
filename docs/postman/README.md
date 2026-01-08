# 🧪 Recursos de Teste da API Blackjack

Esta pasta contém todos os recursos necessários para testar a API Blackjack Multi-Player.

## 📦 Arquivos Disponíveis

### Coleções Postman
- **Blackjack_API.postman_collection.json** - Coleção completa com 13 endpoints
- **Blackjack_API_Local.postman_environment.json** - Environment com variáveis pré-configuradas

### Guias de Uso
- **[POSTMAN_GUIDE.md](POSTMAN_GUIDE.md)** - Tutorial completo do Postman (1.100+ linhas)
- **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Referência rápida para consulta (350+ linhas)
- **[CURL_EXAMPLES.md](CURL_EXAMPLES.md)** - Exemplos prontos com cURL (450+ linhas)
- **[API_TESTING_INDEX.md](API_TESTING_INDEX.md)** - Índice navegável de todos os recursos

### Ferramentas de Teste
- **api_tests.http** - Arquivo para VS Code REST Client extension
- **test_api.ps1** - Script PowerShell para testes automatizados

## 🚀 Início Rápido

### Opção 1: Postman (Recomendado)
1. Abra o Postman
2. Import → Selecione `Blackjack_API.postman_collection.json` e `Blackjack_API_Local.postman_environment.json`
3. Selecione o environment "Blackjack API - Local"
4. Comece com: **Health Check** → **Create Game** → **Login** → **Draw Card**

📖 [Ver guia completo](POSTMAN_GUIDE.md)

### Opção 2: VS Code
1. Instale a extensão **REST Client**
2. Abra `api_tests.http`
3. Click "Send Request" acima de cada endpoint

### Opção 3: Testes Automatizados
```powershell
.\test_api.ps1
```

### Opção 4: cURL
Consulte [CURL_EXAMPLES.md](CURL_EXAMPLES.md) para exemplos prontos.

## 📚 Documentação

### Para Iniciantes
1. Comece com [QUICK_REFERENCE.md](QUICK_REFERENCE.md) para visão geral
2. Leia [POSTMAN_GUIDE.md](POSTMAN_GUIDE.md) para tutorial passo a passo
3. Use a coleção Postman para testes interativos

### Para Desenvolvedores Experientes
- Use [api_tests.http](api_tests.http) para testes rápidos
- Execute [test_api.ps1](test_api.ps1) para suite completa
- Consulte [CURL_EXAMPLES.md](CURL_EXAMPLES.md) para scripts

### Navegação Completa
Veja [API_TESTING_INDEX.md](API_TESTING_INDEX.md) para um índice completo com tutoriais por cenário.

## ✨ Features Automáticas

Todas as ferramentas incluem:
- ✅ Gerenciamento automático de JWT tokens
- ✅ Salvamento automático de game_id
- ✅ Salvamento automático de card_id (para Ases)
- ✅ Documentação inline completa
- ✅ Exemplos de testes de erro
- ✅ Scripts de validação

## 🔗 Links Úteis

- [Documentação Principal](../../README.md)
- [Product Requirements Document](../PRD.md)
- [Código Fonte da API](../../crates/blackjack-api/)

## 📊 Matriz de Escolha de Ferramenta

| Situação | Ferramenta Recomendada | Arquivo |
|----------|------------------------|---------|
| Primeiro teste | Postman | `Blackjack_API.postman_collection.json` |
| Desenvolvimento ativo | VS Code REST Client | `api_tests.http` |
| Testes automatizados | PowerShell Script | `test_api.ps1` |
| CI/CD / Scripts | cURL | `CURL_EXAMPLES.md` |
| Aprendendo a API | Postman Guide | `POSTMAN_GUIDE.md` |
| Consulta rápida | Quick Reference | `QUICK_REFERENCE.md` |

## 🆘 Precisa de Ajuda?

1. **Problemas com Postman?** → [POSTMAN_GUIDE.md - Troubleshooting](POSTMAN_GUIDE.md#-troubleshooting)
2. **Erros comuns?** → [QUICK_REFERENCE.md - Erros Comuns](QUICK_REFERENCE.md#️-erros-comuns)
3. **Visão geral de tudo?** → [API_TESTING_INDEX.md](API_TESTING_INDEX.md)

## 📝 Nota

Certifique-se de que o servidor está rodando antes de testar:
```bash
cargo run -p blackjack-api
# Servidor: http://localhost:8080
```

---

**Última atualização**: Janeiro 2026  
**Versão da API**: 1.0.0
