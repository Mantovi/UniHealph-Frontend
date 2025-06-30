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

const ProductDirectBuyModal = ({ open, onClose, originalPrice, onConfirm }: Props) => {
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

  const isDiscountValid = discount >= 0 && discount <= originalPrice;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Usar pontos para desconto</DialogTitle>
        <div className="space-y-4">
          <div>
            <strong>Pontos disponíveis:</strong>{" "}
            <span className="text-blue-700">{points?.points ?? 0}</span>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <label htmlFor="points" className="font-medium">Usar pontos:</label>
            <input
              id="points"
              type="number"
              value={pointsInput}
              onChange={e => setPointsInput(
                Math.max(0, Math.min(points?.points ?? 0, Number(e.target.value), originalPrice))
              )}
              max={maxPoints}
              min={0}
              className="border rounded px-2 py-1 w-24 focus:ring focus:border-blue-400"
            />
          </div>
          <div>
            <strong>Valor original:</strong>{" "}
            <span className="text-gray-700">R$ {originalPrice.toFixed(2).replace('.', ',')}</span>
          </div>
          <div>
            <strong>Desconto:</strong>{" "}
            <span className={isDiscountValid ? "text-emerald-600" : "text-orange-600"}>
              R$ {discount.toFixed(2).replace('.', ',')}
            </span>
          </div>
          <div>
            <strong>Valor final:</strong>{" "}
            <span className="text-blue-900 font-bold">
              R$ {finalPrice.toFixed(2).replace('.', ',')}
            </span>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-6">
          <Button
            onClick={() => onConfirm(discount)}
            disabled={!isDiscountValid}
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700"
          >
            Seguir
          </Button>
          <Button variant="ghost" onClick={onClose} className="w-full sm:w-auto">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDirectBuyModal;