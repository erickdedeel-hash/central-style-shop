import { useEffect, useState } from "react";

const U = "/uploads/";

const thumbs = [
  `${U}dd08dece71c0b597d58afba021f9d362.jpg`,
  `${U}e6b47a9bcab9cf1bac3c121544d77ae0.jpg`,
  `${U}c2bb0a8adfa926c0df5c795194d26a25.jpg`,
];

const itens = [
  "+3.000 moldes prontos (em vez de 500)",
  "+1.000 arquivos editáveis no Canva",
  "+600 kits festa completos",
  "Pacote de Datas Comemorativas (Natal, Páscoa, Dia das Mães e mais)",
];

const bonus = [
  "Bônus 1 — Aula Completa de Canva pelo Celular",
  "Bônus 2 — Guia Completo de Impressão",
  "Bônus 3 — Checklist dos Primeiros Pedidos",
  "Bônus 4 — Pack de Artes para Divulgação",
];

type Props = {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
};

export function BasicUpsellModal({ open, onAccept, onDecline, onClose }: Props) {
  const [seconds, setSeconds] = useState(300);

  useEffect(() => {
    if (!open) return;
    setSeconds(300);
    const t = setInterval(() => setSeconds((s) => (s > 0 ? s - 1 : 0)), 1000);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearInterval(t);
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Oferta do Kit Completo"
      className="fixed inset-0 z-[1001] flex items-center justify-center px-3 py-4"
      style={{ background: "rgba(15,10,25,0.72)", animation: "fade-in 220ms ease-out both" }}
    >
      <div
        className="relative w-[calc(100%-24px)] max-w-[390px] overflow-y-auto rounded-[22px] bg-white text-center"
        style={{
          maxHeight: "92vh",
          boxShadow: "0 40px 90px -20px rgba(0,0,0,0.6)",
          animation: "upsellIn 250ms ease-out both",
        }}
      >
        {/* BARRA TOPO */}
        <div
          className="relative flex items-center justify-center px-11 py-[11px]"
          style={{ background: "#FF7A00" }}
        >
          <span className="font-extrabold text-white" style={{ fontSize: "14.5px" }}>
            {seconds > 0 ? (
              <>
                ⌛ Oferta expira em{" "}
                <strong style={{ fontWeight: 900 }}>
                  {mm}:{ss}
                </strong>
              </>
            ) : (
              <strong style={{ fontWeight: 900 }}>O tempo acabou!</strong>
            )}
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-1/2 right-[10px] flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-white"
            style={{ background: "rgba(255,255,255,0.3)", fontSize: "15px", lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <div className="px-[18px] pt-[18px] pb-[18px]">
          <h3
            className="font-black uppercase"
            style={{ fontSize: "20px", lineHeight: 1.2, color: "#141414", margin: 0 }}
          >
            POR MAIS <span style={{ color: "#FF7A00" }}>R$9,90</span>, LEVE O KIT COMPLETO{" "}
            <span style={{ color: "#6E3BFF" }}>+4 BÔNUS GRATUITOS</span>
          </h3>

          <div className="mt-[14px] flex items-center justify-center gap-[10px]">
            {thumbs.map((src) => (
              <img
                key={src}
                src={src}
                alt="Exemplo de molde do Kit Completo"
                loading="lazy"
                className="rounded-[8px] object-cover"
                style={{ width: "82px", height: "82px" }}
              />
            ))}
          </div>

          <div
            className="mt-[14px] rounded-[14px] px-[12px] py-[11px] text-left"
            style={{ background: "#F6F0FF", border: "1px solid #E3D4FF" }}
          >
            <div
              className="text-center font-black uppercase"
              style={{ color: "#6E3BFF", fontSize: "12.5px", letterSpacing: "0.02em" }}
            >
              O QUE VOCÊ RECEBE NO KIT COMPLETO
            </div>
            <div
              className="mt-[9px] grid"
              style={{
                gridTemplateColumns: "14px 1fr",
                rowGap: "7px",
                columnGap: "9px",
                fontSize: "12.5px",
                lineHeight: 1.35,
                color: "#2b2b2b",
              }}
            >
              {itens.map((t) => (
                <div key={t} className="col-span-2 grid grid-cols-subgrid">
                  <span style={{ color: "#16A34A" }}>✔</span>
                  <span>{t}</span>
                </div>
              ))}
              {bonus.map((t) => (
                <div key={t} className="col-span-2 grid grid-cols-subgrid">
                  <span style={{ color: "#FF7A00" }}>★</span>
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onAccept}
            className="mt-[14px] block w-full font-black text-white uppercase transition hover:brightness-105"
            style={{
              background: "#FF7A00",
              padding: "15px",
              borderRadius: "12px",
              fontSize: "15px",
              boxShadow: "0 14px 28px -10px rgba(255,122,0,0.65)",
              minHeight: "50px",
            }}
          >
            🛒 SIM, QUERO O KIT COMPLETO
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="mt-[10px] block w-full underline"
            style={{ color: "#8a8a8a", fontWeight: 700, padding: "4px", fontSize: "12.5px" }}
          >
            Não, quero continuar só com o Kit Básico
          </button>
        </div>
      </div>
    </div>
  );
}
