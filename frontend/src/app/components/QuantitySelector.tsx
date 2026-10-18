import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  maxQuantity: number;
  minQuantity?: number;
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  maxQuantity,
  minQuantity = 1,
}: QuantitySelectorProps) {
  const handleDecrement = () => {
    if (quantity > minQuantity) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrement = () => {
    if (quantity < maxQuantity) {
      onQuantityChange(quantity + 1);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleDecrement}
        disabled={quantity <= minQuantity}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="w-8 text-center text-sm text-foreground">{quantity}</span>
      <button
        type="button"
        onClick={handleIncrement}
        disabled={quantity >= maxQuantity}
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
