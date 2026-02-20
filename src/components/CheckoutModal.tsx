import { useState, useMemo } from "react";
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

// --- FUNÇÕES DE SEGURANÇA E FORMATAÇÃO DO PIX ---

// 1. Função Matemática Rigorosa para o Checksum (CRC16-CCITT)
const calculateCRC16 = (payload: string): string => {
  let crc = 0xFFFF;
  for (let c = 0; c < payload.length; c++) {
    crc ^= payload.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      if (crc & 0x8000) {
        crc = ((crc << 1) ^ 0x1021) & 0xFFFF; // Adicionado & 0xFFFF para segurança extra no JS
      } else {
        crc = (crc << 1) & 0xFFFF;
      }
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
};

// 2. Montagem do PIX usando a sua Base Perfeita
const generateDynamicPix = (price: number) => {
  // Parte 1 da sua string original (Até a tag da Moeda BRL: 53 03 986)
  const part1 = "00020126580014BR.GOV.BCB.PIX01364578492e-ccc6-4e03-8bd4-49643647d5b9520400005303986";
  
  // Parte 2 da sua string original (Do País BR até a tag do CRC: 58 02 BR ... 63 04)
  const part2 = "5802BR5901N6001C62070503***6304";
  
  // Formatamos o valor exato (ex: 15.50)
  const amountStr = price.toFixed(2);
  
  // Criamos a Tag 54 (Valor): "54" + Tamanho da string do valor + O Valor
  const amountTag = `54${amountStr.length.toString().padStart(2, "0")}${amountStr}`;
  
  // Juntamos tudo ANTES de calcular o código de segurança
  const payloadBeforeCrc = `${part1}${amountTag}${part2}`;
  
  // Calculamos a nova assinatura baseada no texto com o valor
  const newCrc = calculateCRC16(payloadBeforeCrc);
  
  // Retornamos a string final pronta
  return `${payloadBeforeCrc}${newCrc}`;
};

// --- COMPONENTE PRINCIPAL ---

const CheckoutModal = ({ product, open, onClose }: CheckoutModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [contact, setContact] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // O código PIX é recalculado apenas quando o produto muda
  const currentPixCode = useMemo(() => {
    if (!product) return "";
    return generateDynamicPix(product.price);
  }, [product]);

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
    try {
      await navigator.clipboard.writeText(currentPixCode);
      setCopied(true);
      toast({ title: "Código PIX copiado!" });
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      toast({ title: "Erro ao copiar", variant: "destructive" });
    }
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
                  {contact.includes("@") ? (
                    <Mail className="h-4 w-4" />
                  ) : (
                    <Phone className="h-4 w-4" />
                  )}
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
                <button
                  onClick={() => setStep(1)}
                  className="rounded-md p-1 hover:bg-secondary transition-colors"
                >
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

            <div className="flex justify-center rounded-xl bg-white p-6 shadow-sm">
              <QRCodeSVG value={currentPixCode} size={200} level="M" />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Código PIX (copia e cola)</Label>
              <div className="flex gap-2">
                <Input
                  readOnly
                  value={currentPixCode}
                  className="bg-secondary border-border text-xs focus-visible:ring-0"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                  className="shrink-0 border-border"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <p className="text-center text-[10px] leading-tight text-muted-foreground px-4">
              Após o pagamento, o código será enviado para seu contato. Verifique se digitou corretamente.
            </p>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CheckoutModal;
