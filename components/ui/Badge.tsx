type BadgeVariant = "default" | "primary" | "season" | "accent";

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-primary-100 text-primary-500",
  primary: "bg-accent-orange/15 text-accent-orange",
  season: "bg-accent-mint text-season-700",
  accent: "bg-accent-yellow/20 text-primary-500",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold font-sans ${variantStyles[variant]}`}
    >
      {children}
    </span>
  );
}
