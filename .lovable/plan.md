# Auditoria de bugs e correções da página

Revisei `src/routes/index.tsx`, `src/components/UpsellModal.tsx`, `src/components/BasicUpsellModal.tsx`, `src/components/ReviewsCarousel.tsx`, `src/lib/meta-pixel.ts`, `src/lib/meta-capi.functions.ts` e `src/routes/__root.tsx`. O build está sem erros; os problemas abaixo são de lógica/comportamento, não de compilação.

## Falhas encontradas e correção

1. Botão final "🛒 SIM, QUERO O KIT COMPLETO" (seção laranja do rodapé) não vende nada
   - Causa: `<Cta>` renderizado sem `href` e sem `onClick`, então usa o padrão `#planos` e apenas rola a página, mesmo anunciando "por mais R$9,90 leve o kit completo".
   - Correção: apontar para o checkout do kit completo (mesmo destino do aceite do upsell básico) usando `onClick` que chama `go(...)`, para também disparar o InitiateCheckout.

2. Confete duplicado no fluxo de R$27
   - Causa: `startUpsell` dispara confete ao **abrir** o modal e `onAccept` dispara de novo.
   - Correção: remover o disparo da abertura; confete apenas no clique em "SIM, QUERO OS CONVITES!", como especificado.

3. Cronômetro do rodapé roda infinitamente e trava em 00:00
   - Causa: `setInterval` continua ativo após `seconds` chegar a 0, atualizando estado sem efeito.
   - Correção: parar o intervalo quando chegar a 0 (limpar dentro do próprio efeito).

4. URLs de checkout duplicadas em texto puro no JSX
   - Causa: os `href` dos botões dos planos usam a string literal em vez das constantes `CHECKOUT_BASICO` / `CHECKOUT_PREMIUM`; se um link mudar, o fallback fica divergente.
   - Correção: usar as constantes.

5. Autoplay do carrossel de reviews morre no celular
   - Causa: `onTouchStart`/`onPointerDown` chamam `setPaused(true)` e nada volta para `false` no toque (só `onMouseLeave`, que não existe em touch).
   - Correção: retomar a rotação após um intervalo de inatividade (timer que volta `paused` para `false`) e limpar o timer no unmount.

6. Coluna vazia na seção "Para quem é"
   - Causa: grid fixo em `lg:grid-cols-4` com apenas 3 itens após a remoção do quarto card.
   - Correção: usar `lg:grid-cols-3` e centralizar.

7. Animação `fade-in` inexistente no overlay do upsell básico
   - Causa: `animation: "fade-in 220ms ..."` referencia um keyframe que não existe em `src/styles.css` (só `upsellIn` e `marquee`), então o overlay entra sem transição.
   - Correção: adicionar o keyframe `fade-in` em `src/styles.css` (ou reutilizar um existente).

8. Modais sem fechar por ESC
   - Causa: nenhum listener de teclado; em desktop o ESC não faz nada, prendendo o usuário no modal (o `X` funciona).
   - Correção: listener de `keydown` (ESC → `onClose`) enquanto `open`, com cleanup.

9. Pixel sem fallback `<noscript>`
   - Causa: apenas o carregamento via JS; visitas sem JS não contam PageView.
   - Correção: adicionar a imagem `noscript` oficial do Pixel no shell do root (não altera nada do CAPI nem do event_id/deduplicação).

## Detalhes técnicos

- Arquivos alterados: `src/routes/index.tsx`, `src/components/UpsellModal.tsx`, `src/components/BasicUpsellModal.tsx`, `src/components/ReviewsCarousel.tsx`, `src/styles.css`, `src/routes/__root.tsx`.
- Nada muda em: textos, cores, layout dos cards, imagens locais em `public/uploads/`, Microsoft Clarity, `META_CAPI_ACCESS_TOKEN`, e nos destinos de checkout já definidos (R$10, R$27, R$19,90 e bundle).
- Verificação final: build sem erros e checagem no navegador dos dois fluxos de upsell (aceitar, recusar, fechar) mais o botão do rodapé.
