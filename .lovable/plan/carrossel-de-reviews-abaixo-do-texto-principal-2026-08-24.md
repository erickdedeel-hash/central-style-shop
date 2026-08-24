# Carrossel de reviews abaixo do texto principal

Substituir a esteira automática de imagens de moldes (logo abaixo do texto principal do topo) por um carrossel de prints de reviews reais, com título e subtítulo acima e o botão laranja de compra imediatamente abaixo.

## Pendência

As capturas de tela dos reviews ainda não foram anexadas. Vou implementar o carrossel completo assim que você enviar as imagens; sem elas não há depoimentos para exibir (não serão inventados).

## O que muda

Acima do carrossel:
- Título: "Veja o que algumas das nossas clientes estão dizendo 💬"
- Subtítulo: "Experiências reais de pessoas que começaram com nossos moldes."

Carrossel:
- Apenas os reviews enviados, na ordem recebida.
- Cada review em card branco, cantos arredondados, sombra suave.
- Imagem inteira visível (`object-fit: contain`), sem cortar textos, nomes ou mensagens.
- Desktop: até 3 reviews por vez. Celular: 1 review por vez, ocupando quase toda a largura.
- Swipe com o dedo no celular.
- Setas discretas nas laterais e indicadores (dots) abaixo.
- Rotação automática lenta (~6s), pausando ao interagir (toque, arraste, hover, clique em seta/dot).

Abaixo do carrossel: o botão laranja de compra permanece exatamente como está.

## O que não muda

Nenhuma outra seção, texto, link, checkout, Meta Pixel/CAPI, Clarity ou modal de upsell é tocado.

## Detalhes técnicos

- Editar somente `src/routes/index.tsx`: substituir o componente `Marquee` por um novo `ReviewsCarousel` no mesmo ponto do topo, mantendo o CTA seguinte intacto.
- Imagens dos reviews salvas em `public/uploads/reviews/` e listadas em um array `reviews` no topo do arquivo.
- Carrossel próprio (sem nova dependência): container com scroll horizontal + `scroll-snap` para swipe nativo no celular, índice controlado por estado para setas, dots e autoplay via `setInterval`, limpo/pausado na interação.
- Estilos com tokens existentes (card branco, `rounded-2xl`, `shadow-md`); nada de cores hardcoded novas.
