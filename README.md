# 🛒 E-commerce JS

Projeto de **loja virtual** desenvolvido com **HTML5, CSS3 e JavaScript (ES6+)**.  
Inclui catálogo de produtos dinâmico, carrinho de compras com persistência e fluxo de checkout com integração à API **ViaCEP** para preenchimento automático de endereço.

---

## 🎯 Finalidade do Projeto

Este projeto foi construído como parte de uma fase prática de estudos, com o objetivo de aplicar conceitos de **lógica de programação, manipulação do DOM, OOP (classes), assíncrono (fetch/async/await)** e **tratamento de erros** em um caso realista de **e-commerce**.

### **Contexto e Objetivo**
- Criar um e-commerce em **HTML/CSS/JS puro** que:
  - Liste produtos em um **catálogo**  
  - Exiba **detalhes de produtos**  
  - Gere e mantenha um **carrinho de compras**  
  - Realize o **checkout com preenchimento automático de endereço via API ViaCEP**

---

## 📌 Escopo Obrigatório (Mínimo Viável)

### 1. Catálogo
- Cards com **imagem, nome, preço e categoria**  
- **Filtros e busca** por nome/categoria  
- **Ordenação simples** (ex.: por preço)

### 2. Detalhe do Produto
- Página ou **modal** com:
  - Descrição
  - Mini-galeria de imagens
  - Botão *Adicionar ao carrinho*

### 3. Carrinho
- Adicionar e remover produtos  
- Alterar quantidades  
- Exibir **subtotal** e **total**

### 4. Checkout com ViaCEP
- Formulário de endereço com:
  - **CEP** (máscara `00000-000`)
  - Rua, número, bairro, cidade e UF  
- Ao digitar 8 dígitos no CEP:
  - Chamar a API **ViaCEP**
  - Autopreencher os campos de endereço  

#### ✅ Tratamento de erros:
- CEP incompleto ou inválido → mensagem clara  
- `{"erro": true}` → **“CEP não encontrado. Preencha manualmente.”**  
- Falha de rede → mantém campos editáveis + mensagem de falha  

#### ♿ Acessibilidade:
- Mensagens em `aria-live`  
- Foco automático no campo **Número** após preenchimento bem-sucedido  

---

## ✨ Funcionalidades Implementadas

- Catálogo dinâmico a partir de `data/products.json`
- Exibição de **cards de produtos**
- **Carrinho persistente** em `localStorage`
- Checkout com integração da **API ViaCEP**
- Layout **responsivo** (mobile-first)
- Organização modular em **CSS** e **JS**

---

## 📂 Estrutura do Projeto

e-commerce-js/
- index.html # página inicial
- /assets/imagens/ # imagens e favicon
- /css/ # estilos
- style.css # estilo principal
- /base/ # estilos base/reset/footer
- /components/ # estilos de componentes (cart, navbar etc.)
- /pages/ # estilos específicos de páginas
- /data/
- products.json # catálogo mock de produtos
- /js/ # scripts JS
- app.js # inicialização
- cart.js # lógica do carrinho
- checkout.js # fluxo de checkout e ViaCEP
- product.js # manipulação de produtos
- ui.js # renderização e DOM

---

## 🚀 Como Executar Localmente

### 1. Clone o repositório:
   git clone https://github.com/queirogaraffael/e-commerce-js.git
   cd e-commerce-js

⚠️ Alguns navegadores bloqueiam requisições locais ao products.json e à API ViaCEP. Para evitar problemas, rode um servidor simples:

### 2. Abra o arquivo index.html diretamente no navegador: 
Python 3
python -m http.server 5173

ou Node.js (http-server)
npx http-server -p 5173

### 3. Acesse no navegador:
👉 http://localhost:5173

--- 


## 🔧 Tecnologias Utilizadas

- HTML5 → marcação semântica

- CSS3 → estilização modular e responsiva

- JavaScript (ES6+) → manipulação do DOM e lógica de negócio

- localStorage → persistência do carrinho

- JSON → simulação de catálogo de produtos

- ViaCEP API → preenchimento automático de endereço no checkout

- fetch / async/await → requisições assíncronas

- Tratamento de erros → mensagens claras e acessíveis

---

## 📸 Telas (exemplos)

- Home / Catálogo

- Carrinho lateral

- Checkout (com ViaCEP)

(adicione prints em /assets/screenshots/ e referencie aqui)

---

 ## 🗺️ Roadmap de Melhorias  

 - Filtros por categoria avançados

 - Busca em tempo real

 - Cupom de desconto

 - Paginação ou scroll infinito

 - Integração com gateway de pagamento real (Stripe, Mercado Pago etc.)

 - Testes unitários (cart.js e checkout.js)

 - Feedback visual avançado (toasts, loaders)

---

## 👨‍💻 Autores

### Raffael Queiroga  
- **LinkedIn:** http://www.linkedin.com/in/raffaelqueiroga  
- **GitHub:** https://github.com/queirogaraffael
- **E-mail:** raffael.queiroga@maisunifacisa.com.br
### Lucas Porto 
- **LinkedIn:**  https://www.linkedin.com/in/lucas-porto-de-ara%C3%BAjo-cavalcante-25367b348/
- **GitHub:** https://github.com/lucasportoac
- **E-mail:** lucas.cavalcante@maisunifacisa.com.br
### João Lucas
- **LinkedIn:**  https://br.linkedin.com/in/jo%C3%A3o-lucas-a388a8330
- **GitHub:** https://github.com/lucbar06
- **E-mail:** joao.barros@maisunifacisa.com.br

