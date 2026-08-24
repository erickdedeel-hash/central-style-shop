import { useEffect } from "react";

const IMG = "/uploads/convites-digitais-exemplo.jpg";

type Props = {
  open: boolean;
  onAccept: () => void;
  onDecline: () => void;
  onClose: () => void;
};

const beneficios = [
  "+100 modelos de convites digitais animados",
  "Temas para todas as ocasiões (infantil, adulto, chá, formatura...)",
  "100% editável em minutos",
  "Botões interativos: endereço, confirmar presença e lista de presentes",
  "Envie direto pelo WhatsApp, sem precisar imprimir",
];

export function UpsellModal({ open, onAccept, onDecline, onClose }: Props) {
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Oferta exclusiva de convites digitais"
      className="fixed inset-0 z-[1001] flex items-center justify-center px-3 py-4"
      style={{ background: "rgba(20,10,40,0.72)" }}
    >
      <div
        className="relative w-[calc(100%-24px)] max-w-[390px] overflow-y-auto rounded-[22px] bg-white text-center"
        style={{
          maxHeight: "92vh",
          boxShadow:
            "0 0 0 4px rgba(255,61,154,0.25), 0 40px 90px -20px rgba(0,0,0,0.55)",
          animation: "upsellIn 240ms ease-out both",
        }}
      >
        {/* BARRA TOPO */}
        <div
          className="relative flex items-center justify-center px-12 py-[10px]"
          style={{ background: "linear-gradient(90deg,#FF3D9A,#6E3BFF)" }}
        >
          <span
            className="font-black text-white uppercase"
            style={{ fontSize: "12px", letterSpacing: "0.05em" }}
          >
            🎉 OFERTA EXCLUSIVA
          </span>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-white"
            style={{ background: "rgba(255,255,255,0.28)", fontSize: "14px", lineHeight: 1 }}
          >
            ✕
          </button>
        </div>

        <div className="px-[18px] pt-4 pb-[18px]">
          <h3
            className="font-black uppercase"
            style={{ fontSize: "16.5px", lineHeight: 1.25, color: "#1F1F1F", margin: 0 }}
          >
            POR MAIS <span style={{ color: "#FF3D9A" }}>R$19,90</span>, LEVE UM PACK DE{" "}
            <span style={{ color: "#6E3BFF" }}>100 CONVITES DIGITAIS</span>
          </h3>

          <div className="relative mt-3 mb-[14px] inline-block w-[70%]">
            <img
              src={IMG}
              alt="Exemplo de convite digital animado"
              loading="lazy"
              className="block w-full rounded-[14px] object-contain"
              style={{
                boxShadow: "0 14px 30px -10px rgba(0,0,0,0.35)",
                transform: "rotate(-3deg)",
              }}
            />
            <span
              className="absolute font-black"
              style={{
                top: "-10px",
                right: "-14px",
                background: "#FFC700",
                color: "#1F1F1F",
                fontSize: "10px",
                padding: "4px 8px",
                borderRadius: "999px",
                transform: "rotate(8deg)",
                boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
                whiteSpace: "nowrap",
              }}
            >
              MAIS PEDIDO 🔥
            </span>
          </div>

          <div
            className="mb-4 rounded-[14px] p-[10px] text-left"
            style={{ background: "#FCEFFF", border: "1px solid #F0D6FF" }}
          >
            <div
              className="grid"
              style={{
                gridTemplateColumns: "14px 1fr",
                rowGap: "6px",
                columnGap: "7px",
                fontSize: "11.5px",
                lineHeight: 1.35,
                color: "#3a3a3a",
              }}
            >
              {beneficios.map((b) => (
                <div key={b} className="col-span-2 grid grid-cols-subgrid">
                  <span style={{ color: "#16C15D" }}>✔</span>
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={onAccept}
            className="block w-full font-black text-white uppercase transition hover:brightness-105"
            style={{
              background: "linear-gradient(90deg,#FF3D9A,#6E3BFF)",
              padding: "13px",
              borderRadius: "12px",
              fontSize: "13.5px",
              boxShadow: "0 14px 28px -8px rgba(110,59,255,0.5)",
              marginBottom: "7px",
              minHeight: "48px",
            }}
          >
            🎉 SIM, QUERO OS CONVITES!
          </button>
          <button
            type="button"
            onClick={onDecline}
            className="block w-full underline"
            style={{ color: "#8a8a8a", fontWeight: 600, padding: "6px", fontSize: "11.5px" }}
          >
            Não, quero continuar sem os convites
          </button>
        </div>
      </div>
    </div>
  );
}
