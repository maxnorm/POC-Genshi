export function PageHeader({ title, description }: { title: string, description: string }) {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
      <p className="text-muted-foreground">
        {description}
      </p>
    </div>
  );
} 