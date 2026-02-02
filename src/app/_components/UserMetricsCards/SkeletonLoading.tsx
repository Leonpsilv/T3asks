import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

export function MetricsCardSkeleton() {
    return (
        <Card className="w-full bg-white/60">
            <CardHeader>
                <Skeleton className="h-5 w-48" />
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-8 w-16" />
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}
