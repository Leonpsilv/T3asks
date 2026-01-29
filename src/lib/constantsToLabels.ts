export function getLabelByValue<
    T extends Record<string, { value: string; label: string }>
>(config: T, value?: string | null) {
    if (!value) return "--";

    const item = Object.values(config).find(
        (entry) => entry.value === value
    );

    return item?.label ?? "--";
}
