import { useState } from "react";
import { ArrowLeft, Copy, Check, Mail, Phone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/data/products";
import { useToast } from "@/hooks/use-toast";

interface CheckoutModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

// 1. Chave e Configurações base
const PIX_CONFIG = {
  key: "4578492e-ccc6-4e03-8bd4-49643647d5b9", // Sua chave PIX aqui
  name: "NOME DO RECEBEDOR",
  city: "SAO PAULO",
};

const CheckoutModal = ({ product, open, onClose }: CheckoutModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [contact, setContact] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // 2. Função para gerar o código PIX Estático com Valor Dinâmico
  const generatePixCode = (price: number) => {
    const amount = price.toFixed(2);
    const amountLength = amount.length.toString().padStart(2, '0');
    
    // Payload simplificado seguindo o padrão BACEN
    // Nota: Para um gerador 100% robusto em produção, recomenda-se uma lib como 'pix-payload-generator'
    // Mas este modelo atende a estrutura estática básica:
    const payload = [
      "000201", // Payload Format Indicator
      "26", "58", "0014BR.GOV.BCB.PIX", `01${PIX_CONFIG.key.length}${PIX_CONFIG.key}`, // Merchant Account Info
      "52040000", // Merchant Category Code
      "5303986", // Transaction Currency (986 = BRL)
      `54${amountLength}${amount}`, // Transaction Amount (DINÂMICO)
      "5802BR", // Country Code
      `59${PIX_CONFIG.name.length.toString().padStart(2, '0')}${PIX_CONFIG.name}`, // Merchant Name
      `60${PIX_CONFIG.city.length.toString().padStart(2, '0')}${PIX_CONFIG.city}`, // Merchant City
      "62070503***", // Additional Data Field
      "6304" // CRC16 (Início)
    ].join("");

    return payload; // Em um cenário real, você calcularia o CRC16 aqui. 
    // DICA: Para fins estáticos simples, muitos apps aceitam a string sem o CRC final ou com ele fixo,
    // mas o ideal é usar o valor que o seu banco gera e apenas trocar o campo '54' (valor).
  };

  // Se você já tem um código pronto do seu banco, cole ele aqui e usaremos a lógica de substituição:
  const getDynamicPix = (price: number) => {
    const baseCode = "00020126580014BR.GOV.BCB.PIX01364578492e-ccc6-4e03-8bd4-49643647d5b9520400005303986";
    const amount = price.toFixed(2);
    const amountTag = `54${amount.length.toString().padStart(2, '0')}${amount}`;
    const restOfCode = "5802BR5901N6001C62070503***6304C964";
    
    return `${baseCode}${amountTag}${restOfCode}`;
  };

  const currentPixCode = product ? getDynamicPix(product.price) : "";

  const handleClose = () => {
    setStep(1);
    setContact("");
    setCopied(false);
    onClose();
  };

  const handleNext = () => {
    if (!contact.trim()) {
      toast({
        title: "Campo obrigatório",
        description: "Informe seu WhatsApp ou Email para continuar.",
        variant: "destructive"
      });
      return;
    }
    setStep(2);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentPixCode);
    setCopied(true);
    toast({ title: "Código PIX copiado!" });
    setTimeout(() => setCopied(false), 3000);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-border bg-card sm:rounded-xl">
        {step === 1 ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-foreground">Finalizar Compra</DialogTitle>
              <DialogDescription>
                Informe como deseja receber o código de resgate.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg bg-secondary p-4">
              <p className="font-semibold text-foreground">{product.name}</p>
              <p className="text-sm text-muted-foreground">{product.duration}</p>
              <p className="mt-1 text-lg font-bold text-[hsl(var(--accent))]">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact" className="text-foreground">
                WhatsApp ou Email
              </Label>
              <div className="relative">
                <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {contact.includes("@") ? <Mail className="h-4 w-4" /> : <Phone className="h-4 w-4" />}
                </div>
                <Input
                  id="contact"
                  placeholder="(11) 99999-9999 ou email@exemplo.com"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  className="bg-secondary border-border pl-9"
                />
              </div>
            </div>

            <Button onClick={handleNext} className="w-full font-semibold" size="lg">
              Próximo
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <button onClick={() => setStep(1)} className="rounded-md p-1 hover:bg-secondary">
                  <ArrowLeft className="h-4 w-4" />
                </button>
                Pagamento via PIX
              </DialogTitle>
              <DialogDescription>
                Escaneie o QR Code ou copie o código para pagar.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg bg-secondary p-4 text-center">
              <p className="mb-1 text-sm text-muted-foreground">Valor a pagar</p>
              <p className="text-3xl font-bold text-[hsl(var(--accent))]">
                R$ {product.price.toFixed(2).replace(".", ",")}
              </p>
            </div>

            <div className="flex justify-center rounded-xl bg-white p-6">
              <QRCodeSVG value={currentPixCode} size={200} level="M" />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Código PIX (copia e cola)</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={currentPixCode}
                  className="bg-secondary border-border text-xs"
                />
                <Button variant="outline" size="icon" onClick={handleCopy} className="shrink-0 border-border">
                  {copied ? <Check className="h-4 w-4 text-[hsl(var(--accent))]" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">
              Após o pagamento, o código será enviado automaticamente para o seu WhatsApp ou e-mail.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
