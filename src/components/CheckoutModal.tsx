{
type: uploaded file
fileName: megadroidgames/unirecarga-pix-simples/unirecarga-pix-simples-1b6c0eb0622160fd686538019a7772512c01c312/src/components/CheckoutModal.tsx
fullContent:
import { useState, useMemo } from "react";
import { ArrowLeft, Copy, Check, Mail, Phone } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription } from
"@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/data/products";
import { useToast } from "@/hooks/use-toast";
import { generatePixPayload } from "@/lib/utils";

interface CheckoutModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

// Configurações da sua Chave Pix
const PIX_KEY_ID = "4578492e-ccc6-4e03-8bd4-49643647d5b95";
const MERCHANT_NAME = "Unirecarga"; // Nome que aparecerá no banco
const MERCHANT_CITY = "Online";     // Cidade

const CheckoutModal = ({ product, open, onClose }: CheckoutModalProps) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [contact, setContact] = useState("");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Gera o código Pix dinamicamente com base no produto selecionado
  const pixCode = useMemo(() => {
    if (!product) return "";
    return generatePixPayload({
      key: PIX_KEY_ID,
      name: MERCHANT_NAME,
      city: MERCHANT_CITY,
      amount: product.price,
      txid: "***", // Identificador da transação (opcional)
    });
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
    await navigator.clipboard.writeText(pixCode);
    setCopied(true);
    toast({ title: "Código PIX copiado!" });
    setTimeout(() => setCopied(false), 3000);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md border-border bg-card sm:rounded-xl">
        {step === 1 ?
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
                  {contact.includes("@") ?
                <Mail className="h-4 w-4" /> :

                <Phone className="h-4 w-4" />
                }
                </div>
                <Input
                id="contact"
                placeholder="(11) 99999-9999 ou email@exemplo.com"
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                className="bg-secondary border-border pl-9" />

              </div>
              <p className="text-xs text-muted-foreground">
                Enviaremos o código de resgate para esse contato.
              </p>
            </div>

            <Button onClick={handleNext} className="w-full font-semibold" size="lg">
              Próximo
            </Button>
          </> :

        <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-foreground">
                <button
                onClick={() => setStep(1)}
                className="rounded-md p-1 hover:bg-secondary">

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
              <QRCodeSVG value={pixCode} size={200} level="M" />
            </div>

            <div className="space-y-2">
              <Label className="text-foreground">Código PIX (copia e cola)</Label>
              <div className="flex gap-2">
                <Input
                readOnly
                value={pixCode}
                className="bg-secondary border-border text-xs" />

                <Button
                variant="outline"
                size="icon"
                onClick={handleCopy}
                className="shrink-0 border-border">

                  {copied ?
                <Check className="h-4 w-4 text-[hsl(var(--accent))]" /> :

                <Copy className="h-4 w-4" />
                }
                </Button>
              </div>
            </div>

            <p className="text-center text-xs text-muted-foreground">Após o pagamento, o código será enviado automaticamente para o seu WhatsApp ou e-mail. Certifique-se de que os dados foram digitados corretamente.

          </p>
          </>
        }
      </DialogContent>
    </Dialog>);

};

export default CheckoutModal;
}
