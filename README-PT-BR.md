# Zé Atacadista — PWA inicial

Esta pasta contém uma base de loja instalável (PWA) com catálogo, pesquisa, carrinho e gravação de pedidos no Supabase após configuração.

## Estado atual
- Funciona em modo demonstração sem credenciais.
- Ainda NÃO está publicado e não tem URL pública.
- O catálogo de demonstração não representa estoque real.
- A primeira versão não inclui tela administrativa completa; ela exige autenticação e regras específicas antes de armazenar dados reais.

## Publicar gratuitamente (fluxo recomendado)
1. Crie um projeto no Supabase (banco online).
2. Abra SQL Editor e execute `supabase-schema.sql`.
3. Em Project Settings / API, copie Project URL e a chave `anon`/publishable.
4. Cole esses valores em `config.js`. Nunca use `service_role`.
5. Publique estes arquivos em um host estático HTTPS, como Cloudflare Pages, Netlify ou Vercel (plano gratuito conforme limites vigentes).
6. Abra o endereço público gerado e teste o catálogo, instalação e pedido com dados fictícios.
7. Antes de usar comercialmente, implemente login do administrador, políticas RLS restritas, validação de preços no servidor e proteção contra spam. O total do pedido não deve ser confiado apenas ao navegador.

## Limitação importante de segurança
A inserção pública de pedidos neste protótipo permite que qualquer pessoa com o link envie pedidos. Não exponha dados de pedidos nem permita escrita pública em produtos. Para produção, prefira uma função server-side que valide os IDs e preços atuais dos produtos e calcule o total no servidor, com rate limiting/anti-spam.

## Teste local
Abra `index.html` por um servidor local (não `file://`) para testar o PWA. Sem configurar o Supabase, o app exibe produtos de demonstração e bloqueia o envio de pedidos reais.
