import os

# Estrutura base dos diretórios
base_dir = os.path.join(os.getcwd(), "src", "app", "components", "ui")
os.makedirs(base_dir, exist_ok=True)

# Dicionário com Nome do Arquivo -> Conteúdo
files = {
    "utils.ts": """
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
""",
    "button.tsx": """
import * as React from "react"
import { cn } from "./utils"

const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(({ className, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn("inline-flex items-center justify-center rounded-md text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 h-9 px-4 py-2 disabled:opacity-50", className)}
      {...props}
    />
  )
})
Button.displayName = "Button"
export { Button }
""",
    "input.tsx": """
import * as React from "react"
import { cn } from "./utils"

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn("flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-1 text-sm text-white shadow-sm placeholder:text-zinc-400 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50", className)}
      ref={ref}
      {...props}
    />
  )
})
Input.displayName = "Input"
export { Input }
""",
    "card.tsx": """
import * as React from "react"
import { cn } from "./utils"

const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-50 shadow", className)} {...props} />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
))
CardTitle.displayName = "CardTitle"

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

export { Card, CardHeader, CardTitle, CardContent }
""",
    "label.tsx": """
import * as React from "react"
import { cn } from "./utils"

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-200", className)} {...props} />
))
Label.displayName = "Label"
export { Label }
""",
    "badge.tsx": """
import * as React from "react"
import { cn } from "./utils"
import { cva, type VariantProps } from "class-variance-authority"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-emerald-600 text-white hover:bg-emerald-700",
        secondary: "border-transparent bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
        destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
        outline: "text-zinc-100 border-zinc-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
""",
    "table.tsx": """
import * as React from "react"
import { cn } from "./utils"

const Table = React.forwardRef<HTMLTableElement, React.HTMLAttributes<HTMLTableElement>>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...props} />
  </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b border-zinc-800", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<HTMLTableSectionElement, React.HTMLAttributes<HTMLTableSectionElement>>(({ className, ...props }, ref) => (
  <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...props} />
))
TableBody.displayName = "TableBody"

const TableRow = React.forwardRef<HTMLTableRowElement, React.HTMLAttributes<HTMLTableRowElement>>(({ className, ...props }, ref) => (
  <tr ref={ref} className={cn("border-b border-zinc-800 transition-colors hover:bg-zinc-900/50 data-[state=selected]:bg-muted", className)} {...props} />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <th ref={ref} className={cn("h-12 px-4 text-left align-middle font-medium text-zinc-400 [&:has([role=checkbox])]:pr-0", className)} {...props} />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(({ className, ...props }, ref) => (
  <td ref={ref} className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)} {...props} />
))
TableCell.displayName = "TableCell"

export { Table, TableHeader, TableBody, TableHead, TableRow, TableCell }
""",
    "select.tsx": """
import * as React from "react"
import { cn } from "./utils"

export const Select = ({ children, onValueChange, value, ...props }: any) => {
  return <div className="relative" {...props}>{children}</div>
}
export const SelectTrigger = ({ className, children, ...props }: any) => (
  <div className={cn("flex h-9 w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm shadow-sm cursor-pointer text-white", className)} {...props}>{children}</div>
)
export const SelectValue = ({ placeholder }: any) => <span>{placeholder}</span>
export const SelectContent = ({ children }: any) => <div className="absolute top-full z-50 min-w-[8rem] w-full overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 text-zinc-50 shadow-md mt-1 p-1">{children}</div>
export const SelectItem = ({ children, value, onValueChange, ...props }: any) => (
  <div onClick={() => { if(onValueChange) onValueChange(value); }} className="relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-zinc-800 hover:text-white" {...props}>{children}</div>
)
"""
}

# Criando os arquivos
print(f"Criando arquivos em: {base_dir}")
for filename, content in files.items():
    path = os.path.join(base_dir, filename)
    with open(path, "w") as f:
        f.write(content.strip())
    print(f"✅ Criado: {filename}")

print("\nConcluído! Agora reinicie o servidor Vite.")
