import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";

interface MetricsItem {
  label: string;
  value?: number;
  valueClassName?: string;
}

interface MetricsCardProps {
  title: string;
  items: MetricsItem[];
}

export function MetricsCard({
  title,
  items,
}: MetricsCardProps) {
  return (
    <Card className="w-full bg-white/60">
      <CardHeader>
        <CardTitle className="text-lg">
          {title}
        </CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-6">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex flex-col"
          >
            <span className="text-sm text-muted-foreground">
              {item.label}
            </span>
            <span
              className={`text-3xl font-bold ${item.valueClassName ?? ""}`}
            >
              {item.value ?? 0}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
