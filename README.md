# MPesa Integration Example

Este diretório contém um exemplo simples para chamar o endpoint MPesa da API `https://e2payments.explicador.co.mz/v1`.

## Arquivos
- `mpesa.js`: código Node.js para obter token e consultar `/payments/mpesa/get/all`
- `.env.example`: exemplo de variáveis de ambiente (não comitar `.env`)

## Passos
1. Copie `.env.example` para `.env`
2. Preencha as variáveis no `.env` com suas credenciais reais
3. Instale dependências:

```bash
npm install axios dotenv
```

4. Execute:

```bash
node mpesa.js
```

## Segurança
- Nunca comite credenciais reais no repositório.
- Use `.gitignore` para ignorar `.env`.
