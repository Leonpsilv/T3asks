export function InfoItem({
    label,
    value,
    multiline,
    className,
}: {
    label: string;
    value?: React.ReactNode;
    multiline?: boolean;
    className?: string;
}) {
    return (
        <div className="flex md:flex-col flex-row md:gap-1 gap-2">
            <span className="text-sm text-muted-foreground">
                {label}
            </span>

            <span
                className={className ?? `text-sm font-medium ${multiline ? "whitespace-pre-wrap" : ""
                    }`}
            >
                {value ?? "—"}
            </span>
        </div>
    );
}
