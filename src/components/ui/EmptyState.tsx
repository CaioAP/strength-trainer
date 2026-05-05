export default function EmptyState({ message }: { message: string }): React.JSX.Element {
  return (
    <div className="text-center py-12 bg-brand-surface rounded-lg shadow-card opacity-50">
      <p className="text-xs text-text-subtle font-bold uppercase tracking-widest">{message}</p>
    </div>
  );
}
