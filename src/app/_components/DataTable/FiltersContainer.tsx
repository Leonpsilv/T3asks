interface FiltersContainerProps {
    children: React.ReactNode;
}

export function FiltersContainer({ children }: FiltersContainerProps) {
    return (
        <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {children}
        </div>
    );
}
