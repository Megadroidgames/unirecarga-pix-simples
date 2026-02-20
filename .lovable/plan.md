# UniRecarga - Site de Recarga de Assinaturas

## Visão Geral

Site de venda de códigos de recarga para plataformas de streaming (UniTv, YouCine, CineDuo, OnPix Tv, LuaTv, RedPlay, BlueTv). O fluxo é simples: escolher produto → informar contato → pagar via PIX.

## Página Principal - Loja

- Header com logo "UniRecarga" e barra de busca
- Grid de produtos organizados por categoria com cards mostrando:
  - Imagem do produto
  - Nome (ex: "Recarga YouCine 365D")
  - Preço original riscado e preço promocional
  - Badge "Combo!" nos produtos em promoção
  - Botão "Comprar"
- Filtro por categoria (UniTv, YouCine, CineDuo, OnPix Tv, LuaTv, RedPlay, BlueTv)

### Produtos (copiados do site de referência):

- **YouCine**: 30D (R$9,99) | 365D (R$90)
- **UniTv**: 30D (R$15) | 90D (R$40) | 180D (R$80) | 365D (R$100)
- **CineDuo**: 365D (R$99,99)
- **OnPix Tv**: 30D (R$10) | 365D (R$99,99)
- **LuaTv**: 90D (R$51,99)

## Fluxo de Compra (2 etapas simples)

### Etapa 1 - Contato

Ao clicar em "Comprar", abre um modal/página com:

- Resumo do produto selecionado e valor
- Campo para digitar WhatsApp ou Email (onde receberá o código de resgate)
- Botão "Próximo"

### Etapa 2 - Pagamento PIX

- QR Code gerado a partir da chave PIX estática do dono
- Código PIX "copia e cola" com botão para copiar
- Valor a pagar em destaque
- Instruções simples: "Escaneie o QR Code ou copie o código para pagar"

## Footer

- Informações sobre o site
- Aviso legal sobre Gift Cards
- Links de navegação

## Design

- Estilo moderno e escuro (similar ao site de referência com fundo azul-escuro/navy)
- Cards de produto clean com destaque nos preços promocionais
- Totalmente responsivo (mobile-first)
- Sem necessidade de login ou cadastro - fluxo direto e rápido

## Observações Técnicas

- Site 100% frontend, sem backend necessário
- QR Code gerado no cliente a partir da chave PIX fornecida
- Sem checkout automatizado - pagamento manual via PIX
- Dados dos produtos hardcoded no código