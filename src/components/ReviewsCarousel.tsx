import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Prints reais de reviews das clientes.
 * Coloque os arquivos em public/uploads/reviews/ e liste aqui na ordem desejada.
 * Nenhum depoimento é inventado: se a lista estiver vazia, o carrossel não é renderizado.
 */
export const reviews: string[] = [];

const AUTOPLAY_MS = 6000;

export function ReviewsCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const scrollToIndex = useCallback((i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[i] as HTMLElement | undefined;
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft - track.offsetLeft, behavior: "smooth" });
  }, []);

  const goTo = useCallback(
    (i: number, pause = true) => {
      const next = (i + reviews.length) % reviews.length;
      setIndex(next);
      scrollToIndex(next);
      if (pause) setPaused(true);
    },
    [scrollToIndex],
  );

  // Rotação automática lenta, pausada em qualquer interação do usuário
  useEffect(() => {
    if (paused || reviews.length <= 1) return;
    const id = window.setInterval(() => {
      setIndex((prev) => {
        const next = (prev + 1) % reviews.length;
        scrollToIndex(next);
        return next;
      });
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, scrollToIndex]);

  // Mantém os indicadores em sincronia com o swipe do dedo
  const onScroll = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const children = Array.from(track.children) as HTMLElement[];
    let closest = 0;
    let min = Infinity;
    children.forEach((child, i) => {
      const d = Math.abs(child.offsetLeft - track.offsetLeft - track.scrollLeft);
      if (d < min) {
        min = d;
        closest = i;
      }
    });
    setIndex(closest);
  }, []);

  if (reviews.length === 0) return null;

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onPointerDown={() => setPaused(true)}
    >
      <div
        ref={trackRef}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-1 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ touchAction: "pan-x pan-y" }}
      >
        {reviews.map((src, i) => (
          <div
            key={src + i}
            className="w-[88%] flex-none snap-center sm:w-[calc((100%-2rem)/3)]"
          >
            <div className="flex h-full items-center justify-center rounded-2xl bg-card p-3 shadow-md">
              <img
                src={src}
                alt={`Avaliação de cliente ${i + 1}`}
                loading="lazy"
                className="max-h-[420px] w-full rounded-xl object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {reviews.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Ver avaliação anterior"
            onClick={() => goTo(index - 1)}
            className="absolute top-1/2 left-1 -translate-y-1/2 rounded-full bg-card/80 p-2 text-foreground/70 shadow-md backdrop-blur transition hover:text-foreground"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            aria-label="Ver próxima avaliação"
            onClick={() => goTo(index + 1)}
            className="absolute top-1/2 right-1 -translate-y-1/2 rounded-full bg-card/80 p-2 text-foreground/70 shadow-md backdrop-blur transition hover:text-foreground"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          <div className="mt-3 flex justify-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Ir para avaliação ${i + 1}`}
                onClick={() => goTo(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-5 bg-primary" : "w-2 bg-border"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
