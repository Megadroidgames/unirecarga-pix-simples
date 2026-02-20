import { Tv } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card/50 mt-16">
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Tv className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold">
                Uni<span className="text-primary">Recarga</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sua loja de recargas para plataformas de streaming. Receba seu código de resgate de forma rápida e segura.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-foreground">Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">Início</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Produtos</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">Contato</a></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-3 font-semibold text-foreground">Aviso Legal</h4>
            <p className="text-xs text-muted-foreground">
              Os Gift Cards e códigos de recarga vendidos neste site são adquiridos de distribuidores autorizados. Não possuímos vínculo direto com as plataformas de streaming mencionadas.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} UniRecarga. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
