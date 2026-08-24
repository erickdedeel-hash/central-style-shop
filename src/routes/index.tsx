import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { UpsellModal } from "@/components/UpsellModal";
import { BasicUpsellModal } from "@/components/BasicUpsellModal";
import { ReviewsCarousel, reviews } from "@/components/ReviewsCarousel";
import { trackMetaEvent } from "@/lib/meta-pixel";

const U = "/uploads/";

// Checkouts configurados
const CHECKOUT_PREMIUM = "https://pay.cakto.com.br/6rbe8at_1029014";
const CHECKOUT_BASICO = "https://pay.cakto.com.br/32u4n8y_1028963";
const CHECKOUT_BASICO_UPSELL = "https://pay.cakto.com.br/547zr6h_1030011";
// Checkout do upsell de convites digitais (R$27 + R$19,90)
const CHECKOUT_CONVITES_UPSELL = "https://pay.cakto.com.br/zq995c3_1030030";

const CHECKOUT_VALUES: Record<string, number> = {
  [CHECKOUT_PREMIUM]: 27,
  [CHECKOUT_BASICO]: 10,
  [CHECKOUT_BASICO_UPSELL]: 19.9,
  [CHECKOUT_CONVITES_UPSELL]: 46.9,
};



const avatars = [
  `${U}4abfa32c954188f02f103119b065cadd.jpg`,
  `${U}508b90292179604d633d902135c6a103-1.jpg`,
  `${U}a1684998be8f3baa9112c7234e5e31ec.jpg`,
];

const gallery = [
  `${U}046f0eb8f553c5286498ac2966cd7c0d.jpg`,
  `${U}23dc681a52b8cdea75299255c2094b17.jpg`,
  `${U}527a78536093d6d6755f16f446c5c9d3.jpg`,
  `${U}55bd97916a3fcdabb7c3d55b6a873984.jpg`,
  `${U}851dd0c95e1a2f4d207e6f6cea7ebb7d.jpg`,
  `${U}b29bd9c1e72a275f1f41741e7e946ca9.jpg`,
  `${U}527a78536093d6d6755f16f446c5c9d3-34e21b46.jpg`,
  `${U}bdd3a913263d640a20ecbb06f4f0803e.jpg`,
];

const kitImages = [
  `${U}dd08dece71c0b597d58afba021f9d362.jpg`,
  `${U}e6b47a9bcab9cf1bac3c121544d77ae0.jpg`,
  `${U}c2bb0a8adfa926c0df5c795194d26a25.jpg`,
];

const dores = [
  "Perde horas procurando um tema na internet.",
  "Não sabe criar artes bonitas.",
  "Recusa pedidos porque não tem o tema.",
  "Gasta muito dinheiro com decoração de festa.",
  "Fica perdida tentando aprender Canva.",
  "Passa horas fazendo uma única encomenda.",
  "Vive procurando arquivos no Pinterest ou grupos do Facebook.",
  "Tem vontade de começar na papelaria personalizada, mas não sabe por onde começar.",
];

const entregaveis = [
  {
    titulo: "+3.000 Moldes Profissionais",
    texto:
      "Tenha um verdadeiro estoque digital com centenas de temas prontos para imprimir e montar.",
  },
  {
    titulo: "+1.000 Arquivos Editáveis no Canva",
    texto:
      "Troque apenas o nome da criança e personalize tudo em poucos minutos, mesmo usando apenas o celular.",
  },
  {
    titulo: "+600 Kits Festa Completos",
    texto:
      "Caixinhas. Topos de bolo. Convites. Tubetes. Adesivos. Sacolas surpresa. Lembrancinhas. Tudo pronto.",
  },
  {
    titulo: "Aulas Passo a Passo",
    texto: "Aprenda exatamente como editar os arquivos mesmo sem experiência.",
  },
  {
    titulo: "Checklist Para Começar",
    texto: "Saiba exatamente o que fazer para criar suas primeiras peças sem ficar perdida.",
  },
];

const ideais = [
  "Quer começar uma renda extra em casa.",
  "Quer trabalhar com papelaria personalizada.",
  "Já vende e deseja produzir muito mais rápido.",
  "Está cansada de procurar temas na internet.",
  "Quer parecer profissional mesmo sem saber design.",
  "Quer fazer festas lindas gastando muito menos.",
  "Quer usar apenas o celular.",
  "Nunca mexeu com Canva.",
];

const paraQuem = [
  { emoji: "💰", texto: "Quero ganhar dinheiro." },
  { emoji: "🎈", texto: "Quer economizar nas festas." },
  { emoji: "📦", texto: "Já trabalha com papelaria." },
];

const conquistas = [
  "Fazer renda extra.",
  "Produzir festas personalizadas.",
  "Economizar na decoração.",
  "Atender mais clientes.",
];

const datas = ["Natal", "Páscoa", "Dia das Mães", "Dia dos Pais", "Chá Revelação", "Mesversário"];

const bonus = [
  {
    n: "BÔNUS 1",
    titulo: "Aula completa de Canva pelo Celular",
    texto: "Aprenda do absoluto zero a editar qualquer molde usando apenas seu celular.",
    valor: "R$47",
  },
  {
    n: "BÔNUS 2",
    titulo: "Guia Completo de Impressão",
    texto:
      "Descubra exatamente como imprimir seus arquivos para obter um acabamento bonito sem desperdiçar papel.",
    valor: "R$37",
  },
  {
    n: "BÔNUS 3",
    titulo: "Checklist Primeiros Pedidos",
    texto: "Um passo a passo simples para você sair do zero e começar muito mais rápido.",
    valor: "R$27",
  },
];

const faq = [
  {
    q: "Nunca trabalhei com papelaria personalizada. Funciona para mim?",
    a: "Sim. A biblioteca foi feita justamente para iniciantes.",
  },
  { q: "Preciso saber Canva?", a: "Não. Você recebe aulas mostrando exatamente como editar." },
  { q: "Preciso de computador?", a: "Não. Você pode editar pelo celular." },
  {
    q: "Posso usar para vender?",
    a: "Sim. Você pode utilizar os arquivos para criar produtos personalizados e atender clientes, conforme os termos de uso do material.",
  },
  {
    q: "Também serve para fazer a festa do meu filho?",
    a: "Sim. Você pode personalizar o nome, imprimir e montar sua própria decoração.",
  },
  {
    q: "Como recebo acesso?",
    a: "Logo após a confirmação do pagamento você recebe acesso imediato à biblioteca.",
  },
];

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Central dos Moldes — +3.000 Moldes e Kits de Festa Prontos" },
      {
        name: "description",
        content:
          "Acesso a mais de 3.000 moldes e kits de festa prontos para editar, imprimir e montar em poucos minutos. Acesso imediato e garantia de 7 dias.",
      },
      {
        property: "og:title",
        content: "Central dos Moldes — +3.000 Moldes e Kits de Festa Prontos",
      },
      {
        property: "og:description",
        content:
          "Biblioteca com +3.000 moldes, +1.000 arquivos editáveis no Canva e +600 kits festa completos. Edite pelo celular.",
      },
      {
        property: "og:image",
        content: "https://moldesdajuh.store/uploads/dd08dece71c0b597d58afba021f9d362.jpg",
      },
      {
        name: "twitter:image",
        content: "https://moldesdajuh.store/uploads/dd08dece71c0b597d58afba021f9d362.jpg",
      },
    ],
  }),
  component: Index,
});

function Marquee() {
  const loop = [...gallery, ...gallery];
  return (
    <div className="relative w-full overflow-hidden py-2">
      <div className="flex w-max animate-marquee gap-3">
        {loop.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="Molde de festa personalizada"
            loading="lazy"
            className="h-56 w-44 flex-none rounded-xl object-cover shadow-md sm:h-64 sm:w-52"
          />
        ))}
      </div>
    </div>
  );
}

function Cta({
  children,
  className = "",
  href = "#planos",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-full bg-accent px-8 py-4 text-base font-extrabold tracking-wide text-accent-foreground shadow-lg transition hover:brightness-105 sm:text-lg ${className}`}
    >
      {children}
    </a>
  );
}

function Index() {
  const [open, setOpen] = useState<number | null>(null);
  const [seconds, setSeconds] = useState(120);
  const [upsellOpen, setUpsellOpen] = useState(false);
  const [basicUpsellOpen, setBasicUpsellOpen] = useState(false);


  useEffect(() => {
    const t = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) {
          clearInterval(t);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const fireConfetti = useCallback(async () => {
    const confetti = (await import("canvas-confetti")).default;
    const colors = ["#FF3D9A", "#6E3BFF", "#FFC700", "#2E9BFF", "#16C15D", "#FF7A00"];
    const mobile = window.innerWidth < 640;
    const end = Date.now() + 3000;
    confetti({
      particleCount: mobile ? 90 : 160,
      spread: 100,
      startVelocity: 45,
      origin: { x: 0.5, y: 0.55 },
      colors,
      disableForReducedMotion: true,
    });
    const tick = () => {
      if (Date.now() > end) return;
      confetti({
        particleCount: mobile ? 8 : 14,
        spread: 120,
        startVelocity: 30,
        ticks: 220,
        origin: { x: Math.random(), y: -0.05 },
        colors,
        disableForReducedMotion: true,
      });
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, []);

  const startUpsell = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setUpsellOpen(true);
  }, []);

  const startBasicUpsell = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setBasicUpsellOpen(true);
  }, []);

  const go = (url: string) => {
    setUpsellOpen(false);
    setBasicUpsellOpen(false);
    if (url.startsWith("#")) {
      document.querySelector(url)?.scrollIntoView({ behavior: "smooth" });
      return;
    }
    // Clique real que leva ao checkout → InitiateCheckout (browser + CAPI, mesmo event_id)
    const value = CHECKOUT_VALUES[url];
    const tracked = trackMetaEvent(
      "InitiateCheckout",
      value ? { value, currency: "BRL" } : undefined,
    );
    void Promise.race([tracked, new Promise((r) => setTimeout(r, 300))]).then(() => {
      window.location.href = url;
    });
  };



  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");


  return (
    <div className="min-h-screen bg-background">
      <div className="bg-primary py-2 text-center text-xs font-extrabold tracking-widest text-primary-foreground sm:text-sm">
        PROMOÇÃO VÁLIDA SOMENTE HOJE
      </div>

      {/* HERO */}
      <section className="px-4 pt-10 pb-6 text-center">
        <div className="mx-auto flex max-w-3xl flex-col items-center">
          <div className="flex items-center gap-3">
            <div className="flex">
              {avatars.map((src, i) => (
                <img
                  key={src}
                  src={src}
                  alt="Cliente satisfeita"
                  className={`h-10 w-10 rounded-full border-2 border-background object-cover ${i > 0 ? "-ml-3" : ""}`}
                />
              ))}
            </div>
            <div className="text-left">
              <div className="text-sm text-accent">★★★★★</div>
              <div className="text-sm font-bold text-foreground">+1200 avaliações</div>
            </div>
          </div>

          <h1 className="mt-6 text-[2rem] leading-[1.12] font-black tracking-tight text-balance sm:text-5xl sm:leading-[1.08] md:text-6xl">
            Transforme seu celular em uma{" "}
            <span className="text-primary">ferramenta de renda extra</span> com{" "}
            <span className="text-accent">+3.000 moldes</span> prontos para vender
          </h1>

          <p className="mt-6 max-w-xl text-base font-bold text-balance text-muted-foreground sm:text-lg">
            Escolha o tema, personalize pelo celular no Canva, imprima e crie produtos para oferecer
            aos seus clientes — mesmo que você esteja começando agora e não saiba criar artes.
          </p>
        </div>

        <div className="mt-10">
          <h2 className="text-xl font-black text-balance sm:text-3xl">
            Veja o que algumas das nossas clientes estão dizendo 💬
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm font-semibold text-balance text-muted-foreground sm:text-base">
            Experiências reais de pessoas que começaram com nossos moldes.
          </p>
          <div className="mt-6">{reviews.length > 0 ? <ReviewsCarousel /> : <Marquee />}</div>
        </div>

        <div className="mt-8 px-2">
          <Cta
            href={CHECKOUT_PREMIUM}
            className="w-full max-w-md text-sm leading-tight sm:w-auto sm:text-lg"
            onClick={(e) => {
              e.preventDefault();
              go(CHECKOUT_PREMIUM);
            }}
          >
            QUERO ACESSAR OS +3.000 MOLDES POR R$27
          </Cta>
        </div>

        <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-1 text-sm font-bold text-muted-foreground">
          <span>✓ Acesso imediato</span>
          <span>✓ Editável pelo celular</span>
          <span>✓ Garantia de 7 dias</span>
        </div>

        <p className="mx-auto mt-3 max-w-md text-xs text-muted-foreground">
          Produto digital para criação de personalizados. Nenhum material físico será enviado.
        </p>

      </section>

      {/* BIBLIOTECA */}
      <section className="bg-secondary/40 px-4 py-14">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-black sm:text-4xl">Veja uma pequena parte da biblioteca</h2>
          <p className="mt-3 text-muted-foreground">
            Uma pequena amostra de tudo o que está te esperando lá dentro.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {gallery.map((src) => (
              <img
                key={src}
                src={src}
                alt="Kit de festa pronto para imprimir"
                loading="lazy"
                className="aspect-[3/4] w-full rounded-xl object-cover shadow"
              />
            ))}
          </div>
          <div className="mt-6 inline-block rounded-full bg-primary px-5 py-2 text-sm font-extrabold text-primary-foreground">
            +500 temas variáveis
          </div>
        </div>
      </section>

      {/* DORES */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-black sm:text-3xl">
            Se você já passou por alguma dessas situações...
          </h2>
          <ul className="mt-8 space-y-3">
            {dores.map((d) => (
              <li
                key={d}
                className="flex gap-3 rounded-xl border border-border bg-card p-4 text-sm font-semibold sm:text-base"
              >
                <span className="text-destructive">❌</span>
                {d}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-center text-lg font-extrabold text-primary">
            Então essa biblioteca foi feita para você.
          </p>
        </div>
      </section>

      {/* O QUE VAI RECEBER */}
      <section className="bg-secondary/40 px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-black sm:text-4xl">O que você vai receber</h2>
          <p className="mt-3 text-center text-muted-foreground">
            Uma biblioteca completa para nunca mais começar uma arte do zero.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {entregaveis.map((e) => (
              <div key={e.titulo} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <h3 className="text-lg font-extrabold text-primary">{e.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{e.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* IDEAL PARA */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-black sm:text-3xl">
            Esse acesso é ideal para quem:
          </h2>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {ideais.map((i) => (
              <li key={i} className="flex gap-3 text-sm font-semibold sm:text-base">
                <span className="text-success">✅</span>
                {i}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* O QUE CONSEGUE CRIAR */}
      <section className="bg-secondary/40 px-4 py-14">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="text-3xl font-black sm:text-4xl">O que você consegue criar</h2>
          <div className="mt-8">
            <Marquee />
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-4xl">
          <h2 className="text-center text-3xl font-black sm:text-4xl">Para quem é</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {paraQuem.map((p) => (
              <div
                key={p.texto}
                className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
              >
                <div className="text-3xl">{p.emoji}</div>
                <p className="mt-3 text-sm font-extrabold">{p.texto}</p>
                <div className="mt-2 text-primary">↓</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROVA SOCIAL */}
      <section className="bg-primary px-4 py-14 text-primary-foreground">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-2xl font-black sm:text-3xl">
            Milhares de pessoas já criam festas incríveis com essa biblioteca.
          </h2>
          <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2 font-bold">
            {conquistas.map((c) => (
              <span key={c}>✔ {c}</span>
            ))}
          </div>
        </div>
      </section>

      {/* DATAS */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-black sm:text-4xl">Biblioteca</h2>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {datas.map((d) => (
              <span
                key={d}
                className="rounded-full border border-border bg-card px-5 py-2 text-sm font-extrabold"
              >
                {d}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* BÔNUS */}
      <section className="bg-secondary/40 px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-2xl font-black sm:text-3xl">
            Além da Biblioteca, Você Também Recebe Estes Bônus Exclusivos
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {bonus.map((b) => (
              <div key={b.n} className="rounded-2xl border border-border bg-card p-6 shadow-sm">
                <div className="text-2xl">🎁</div>
                <div className="mt-2 text-xs font-extrabold tracking-widest text-primary">{b.n}</div>
                <h3 className="mt-1 text-lg font-extrabold">{b.titulo}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{b.texto}</p>
                <p className="mt-4 font-extrabold">
                  <span className="text-muted-foreground line-through">{b.valor}</span>{" "}
                  <span className="text-success">Grátis</span>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm font-extrabold tracking-wide text-primary">
            TODOS INCLUÍDOS GRATUITAMENTE NO KIT COMPLETO
          </p>
        </div>
      </section>

      {/* PLANOS */}
      <section id="planos" className="px-4 py-14">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-center text-3xl font-black sm:text-4xl">
            Escolha como você quer começar
          </h2>
          <div className="mt-10 grid items-start gap-6 lg:grid-cols-2">
            {/* Básico */}
            <div className="rounded-3xl border border-border bg-card p-7 shadow-sm">
              <h3 className="text-xl font-extrabold">Kit Papelaria Básica</h3>
              <ul className="mt-5 space-y-2 text-sm font-semibold">
                <li>✔ Mais de 500 moldes prontos</li>
                <li>✔ +250 arquivos editáveis no Canva</li>
                <li>✔ +300 kits festa completos</li>
                <li>✔ Acesso imediato</li>
                <li className="text-muted-foreground">✗ Sem bônus incluso</li>
                <li className="text-muted-foreground">✗ Sem passo a passo incluso</li>
              </ul>
              <div className="mt-6">
                <div className="text-sm font-bold text-muted-foreground line-through">R$37</div>
                <div className="text-xs font-extrabold tracking-widest text-muted-foreground">
                  POR APENAS
                </div>
                <div className="text-4xl font-black text-primary">R$10</div>
              </div>
              <a
                href="https://pay.cakto.com.br/32u4n8y_1028963"
                onClick={startBasicUpsell}
                className="mt-6 block rounded-full border-2 border-primary px-6 py-3 text-center text-sm font-extrabold text-primary transition hover:bg-primary hover:text-primary-foreground"
              >
                QUERO COMEÇAR AGORA
              </a>

            </div>

            {/* Premium */}
            <div className="relative rounded-3xl border-2 border-primary bg-card p-7 shadow-xl">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-extrabold whitespace-nowrap text-primary-foreground">
                ⭐ MAIS ESCOLHIDO ⭐
              </div>
              <h3 className="text-xl font-extrabold">Papelaria Premium VIP</h3>
              <p className="mt-1 text-sm font-bold text-muted-foreground">
                Tudo do plano básico + 4 bônus
              </p>
              <div className="mt-4 grid grid-cols-3 gap-2">
                {kitImages.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt="Kit completo de papelaria personalizada"
                    loading="lazy"
                    className="aspect-square w-full rounded-lg object-cover"
                  />
                ))}
              </div>
              <ul className="mt-5 space-y-2 text-sm font-semibold">
                <li>✔ 3.000 moldes prontos</li>
                <li>✔ Arquivos editáveis no Canva</li>
                <li>✔ Guia: Como Vender Papelaria Personalizada</li>
                <li>✔ Kits festa completos</li>
                <li>
                  ✔ Pacote de Datas Comemorativas
                  <span className="block text-xs font-normal text-muted-foreground">
                    Natal, Páscoa, Dia das Mães, Dia dos Pais, Chá Revelação, Mesversário e muito
                    mais.
                  </span>
                </li>
              </ul>
              <div className="mt-5 rounded-2xl bg-secondary p-4">
                <div className="text-xs font-extrabold tracking-widest text-primary">
                  ★ BÔNUS EXCLUSIVOS
                </div>
                <ul className="mt-2 space-y-1 text-sm font-semibold">
                  <li>★ Bônus 1 — Aula Completa de Canva pelo Celular</li>
                  <li>★ Bônus 2 — Guia Completo de Impressão</li>
                  <li>★ Bônus 3 — Checklist dos Primeiros Pedidos</li>
                  <li>★ Bônus 4 — Pack de Artes para Divulgação</li>
                </ul>
              </div>
              <div className="mt-6">
                <div className="text-sm font-bold text-muted-foreground line-through">R$67</div>
                <div className="text-xs font-extrabold tracking-widest text-muted-foreground">
                  POR APENAS
                </div>
                <div className="text-5xl font-black text-primary">R$27</div>
              </div>
              <Cta
                className="mt-6 w-full"
                href="https://pay.cakto.com.br/6rbe8at_1029014"
                onClick={startUpsell}
              >
                QUERO ACESSAR AGORA →
              </Cta>

            </div>
          </div>
        </div>
      </section>

      {/* GARANTIA */}
      <section className="bg-secondary/40 px-4 py-14">
        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <img
            src={`${U}Selo-de-Garantia-de-7-Dias-PNG-Transparente-Sem-Fundo-1.png`}
            alt="Selo de Garantia de 7 Dias"
            loading="lazy"
            className="h-32 w-32 object-contain"
          />
          <h2 className="mt-4 text-3xl font-black">Garantia</h2>
          <p className="mt-3 font-bold">Você terá 7 dias de garantia.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Se acessar a biblioteca e perceber que ela não é para você, basta solicitar o reembolso
            dentro do prazo.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Sem perguntas complicadas.</p>
          <p className="text-sm text-muted-foreground">Sem burocracia.</p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-14">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-black tracking-wide sm:text-3xl">
            PERGUNTAS FREQUENTES
          </h2>
          <div className="mt-8 space-y-3">
            {faq.map((f, i) => (
              <div key={f.q} className="overflow-hidden rounded-xl border border-border bg-card">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 p-4 text-left text-sm font-extrabold"
                >
                  {f.q}
                  <span className="text-primary">⌄</span>
                </button>
                {open === i && (
                  <p className="border-t border-border p-4 text-sm text-muted-foreground">{f.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFERTA / RODAPÉ */}
      <section className="bg-primary px-4 py-12 text-center text-primary-foreground">
        <div className="mx-auto max-w-2xl">
          <div className="text-sm font-extrabold">⏳ Oferta expira em {mm}:{ss}</div>
          <h2 className="mt-4 text-2xl font-black sm:text-3xl">
            POR MAIS R$9,90, LEVE O KIT COMPLETO +4 BÔNUS GRATUITOS
          </h2>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {kitImages.map((src) => (
              <img
                key={src}
                src={src}
                alt="Kit completo com bônus"
                loading="lazy"
                className="aspect-square w-full rounded-xl object-cover"
              />
            ))}
          </div>
          <div className="mt-8">
            <Cta>🛒 SIM, QUERO O KIT COMPLETO</Cta>
          </div>
        </div>
      </section>

      <footer className="px-4 py-8 text-center text-sm font-bold text-muted-foreground">
        Biblioteca das Festas Express
      </footer>

      <UpsellModal
        open={upsellOpen}
        onAccept={() => {
          void fireConfetti();
          setTimeout(() => go(CHECKOUT_CONVITES_UPSELL || CHECKOUT_PREMIUM), 450);
        }}
        onDecline={() => go(CHECKOUT_PREMIUM)}
        onClose={() => go(CHECKOUT_PREMIUM)}
      />

      <BasicUpsellModal
        open={basicUpsellOpen}
        onAccept={() => {
          void fireConfetti();
          setTimeout(() => go(CHECKOUT_BASICO_UPSELL), 450);
        }}
        onDecline={() => go(CHECKOUT_BASICO)}
        onClose={() => go(CHECKOUT_BASICO)}
      />



    </div>
  );
}
