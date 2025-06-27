import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { getPointsBalance } from "@/api/points";
import type { PointsBalance } from "@/types/points";

interface Props {
  open: boolean;
  onClose: () => void;
  originalPrice: number;
  onConfirm: (pointsToUse: number) => void;
}

export default function ProductDirectBuyModal({ open, onClose, originalPrice, onConfirm }: Props) {
  const [points, setPoints] = useState<PointsBalance | null>(null);
  const [pointsInput, setPointsInput] = useState(0);

  useEffect(() => {
    if (open) {
      getPointsBalance()
        .then(setPoints)
        .catch(() => setPoints(null));
      setPointsInput(0);
    }
  }, [open]);

  const maxPoints = Math.min(points?.points ?? 0, originalPrice);
  const discount = Math.min(pointsInput, maxPoints);
  const finalPrice = originalPrice - discount;

  const handleConfirm = () => {
    onConfirm(discount);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Usar pontos para desconto</DialogTitle>
        <div className="space-y-2">
          <div>
            <strong>Pontos disponíveis:</strong> {points?.points ?? 0}
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="points">Usar pontos:</label>
            <input
              id="points"
              type="number"
              value={pointsInput}
              onChange={e => setPointsInput(
                Math.max(
                  0, 
                  Math.min(points?.points ?? 0, Number(e.target.value), originalPrice)
                )
              )}
              max={maxPoints}
              min={0}
              className="border rounded px-2 py-1 w-24"
            />
          </div>
          <div>
            <strong>Valor original:</strong> R$ {originalPrice.toFixed(2).replace('.', ',')}
          </div>
          <div>
            <strong>Desconto:</strong> R$ {discount.toFixed(2).replace('.', ',')}
          </div>
          <div>
            <strong>Valor final:</strong> R$ {finalPrice.toFixed(2).replace('.', ',')}
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleConfirm} disabled={discount > originalPrice || discount < 0}>
            Seguir
          </Button>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
