import { Button } from "~/components/ui/button";

interface FiltersActionsProps {
    onApply: () => void;
    onClear: () => void;
    disableClear?: boolean;
}

export function FiltersActions({
    onApply,
    onClear,
    disableClear,
}: FiltersActionsProps) {
    return (
        <div className="flex gap-2 sm:col-span-2 lg:col-span-1">
            <Button
                className="flex-1 bg-green-400/50 hover:bg-green-700/50 cursor-pointer"
                onClick={onApply}
            >
                Aplicar
            </Button>

            <Button
                variant="outline"
                className="flex-1 cursor-pointer"
                onClick={onClear}
                disabled={disableClear}
            >
                Limpar
            </Button>
        </div>
    );
}
