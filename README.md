# PokéLanding — Documentação Básica

## 📘 Descrição
PokéLanding é uma landing page interativa voltada para fãs de Pokémon. A página permite que o usuário busque por Pokémon por nome ou número diretamente na Pokédex. Ela possui um banner rotativo com imagens e formulários de busca em cada slide, responsividade para dispositivos móveis e autenticação básica, e uma página com pesquisa e visualização dos pokemons por região.


## 🎨 Funcionalidades
- Conectado a API oficial da Pokédex (PokéAPI)
- Filtro por região
- Pesquisa por nome
- Setas de navegação e pontos indicadores e botões
- Formulário de busca no banner 
- Responsividade para telas pequenas (mobile)
- Validação de CPF no formulário de cadastro
- Login e cadastro com base local (via localStorage)
- Favicon personalizado

## 🔧 Como usar

1. Clone o repositório:
```bash
git clone https://github.com/SouzaCleber98/pokeLandingPage.git
```

2. Abra o index.html no navegador ou use o GitHub Pages:
- Suba os arquivos para o GitHub
- Vá em: Configurações > Pages > Selecione a branch main > root > Save
- Acesse o link gerado (ex: https://souzacleber98.github.io/pokeLandingPage)

3. Editar conteúdo:
- Altere os slides dentro da section .carousel
- As imagens estão na pasta assets/img
- Textos podem ser personalizados diretamente no HTML

## 🛠️ Desenvolvimento
- HTML5 + CSS3
- JavaScript Vanilla
- Sem dependências externas (leve e simples)
- Estrutura modularizada (carousel, validação, login separados)

## ✨ Futuras melhorias (sugestão)
- Pesquisa por id
- Filtro por tipo
- Armazenamento real de usuários e mensagens do contatos via Firebase ou banco de dados
- Melhor Feedback visual de sucesso/erro nos campos
- Melhor acessibilidade (teclado, leitores de tela)
- Animações entre os slides ou feedbacks visuais mais ricos
- Mudança e personalização de temas, e modo escuro.

## 📌 Observações
- O projeto é acadêmico/experimental
- Para funcionar a autenticação e validação local, é necessário rodar localmente com um pequeno servidor (ex: Live Server no VSCode)

---

Desenvolvido por Cleber Souza 🧑‍💻
