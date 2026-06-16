interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <section className="rounded-lg border border-forge-line bg-forge-panel p-5 text-center">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-slate-400">{message}</p>
    </section>
  );
}
