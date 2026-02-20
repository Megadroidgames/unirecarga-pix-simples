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

// --- FUNÇÕES DE UTILIDADE PARA PIX DINÂMICO ---

/**
 * Calcula o CRC16 (CCITT-FALSE) necessário para validar o PIX em bancos como Santander/Itaú.
 */
const calculateCRC16 = (payload: string): string => {
  let result = 0xFFFF;
  for (let i = 0; i < payload.length; i++) {
    result ^= payload.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      if ((result & 0x8000) !== 0) {
        result = (result << 1) ^ 0x1021;
      } else {
        result <<= 1;
      }
    }
  }
  return (result & 0xFFFF).toString(16).toUpperCase().padStart(4, "0");
};

/**
 * Monta a string PIX Copia e Cola com base no preço do produto.
 */
const generateDynamicPix = (price: number) => {
  // Configurações da sua conta (ajuste se necessário)
  const key = "4578492e-ccc6-4e03-8bd4-49643647d5b9"; // Sua chave
  const name = "N"; // Nome do beneficiário (curto para evitar erros de tamanho)
  const city = "C"; // Cidade do beneficiário

  // Montagem do Payload (Padrão EMV Co-branded)
  const part1 = "000201"; // Payload Format Indicator
  const merchantAccount = `26${(14 + 4 + key.length).toString().padStart(2, "0")}0014BR.GOV.BCB.PIX01${key.length.toString().padStart(2, "0")}${key}`;
  const merchantCategory = "52040000";
  const currency = "5303986"; // BRL

  // Valor: Tag 54 + Tamanho + Valor Formatado (ex: 10.00)
  const amountStr = price.toFixed(2);
  const amountTag = `54${amountStr.length.toString().padStart(2, "0")}${amountStr}`;

  const country = "5802BR";
  const merchantName = `59${name.length.toString().padStart(2, "0")}${name}`;
  const merchantCity = `60${city.length.toString().padStart(2, "0")}${city}`;
  const additionalData = "62070503***";
  const crcHeader = "6304";

  const fullPayload = `${part1}${merchantAccount}${merchantCategory}${currency}${amountTag}${country}${merchantName}${merchantCity}${additionalData}${crcHeader}`;
  
  const crcFinal = calculateCRC16(fullPayload);
  return `${fullPayload}${crcFinal}`;
};

// --- COMPONENTE PRINCIPAL ---

const CheckoutModal = ({ product, open, onClose }: CheckoutModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [contact, setContact] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Gera o código PIX apenas quando o produto ou o preço mudam
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
