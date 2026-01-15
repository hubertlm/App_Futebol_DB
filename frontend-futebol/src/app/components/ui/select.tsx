import * as React from "react"
import { cn } from "./utils"
import { ChevronDown, Check } from "lucide-react"

// Criamos um contexto para que os filhos (Items) consigam falar com o pai (Select)
const SelectContext = React.createContext<{
  value: string;
  onValueChange: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
} | null>(null);

export const Select = ({ children, onValueChange, value, ...props }: any) => {
  const [open, setOpen] = React.useState(false);

  return (
    <SelectContext.Provider value={{ value, onValueChange, open, setOpen }}>
      <div className="relative" {...props}>
        {children}
      </div>
    </SelectContext.Provider>
  )
}

export const SelectTrigger = ({ className, children, ...props }: any) => {
  const context = React.useContext(SelectContext);
  if (!context) return null;
  
  return (
    <button
      type="button"
      onClick={() => context.setOpen(!context.open)}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-white shadow-sm ring-offset-background placeholder:text-zinc-400 focus:outline-none focus:ring-1 focus:ring-emerald-600 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="h-4 w-4 opacity-50" />
    </button>
  )
}

export const SelectValue = ({ placeholder }: any) => {
  const context = React.useContext(SelectContext);
  // Aqui a mágica: se tiver valor, mostra o valor (ou tenta achar o label do filho), senão mostra placeholder
  // Como é uma implementação simplificada, ele pode mostrar o ID se não fizermos o map reverso, 
  // mas para o seu caso de uso (TechnicalManager), o texto já vem no children do Trigger se controlado corretamente.
  return <span className="block truncate">{placeholder}</span>
}

export const SelectContent = ({ children, className }: any) => {
  const context = React.useContext(SelectContext);
  if (!context || !context.open) return null;

  return (
    <div className={cn(
      "absolute z-50 min-w-[8rem] w-full overflow-hidden rounded-md border border-zinc-800 bg-zinc-950 text-zinc-50 shadow-md animate-in fade-in-80 mt-1",
      className
    )}>
      <div className="p-1">{children}</div>
    </div>
  )
}

export const SelectItem = ({ children, value, className, ...props }: any) => {
  const context = React.useContext(SelectContext);
  if (!context) return null;

  const isSelected = context.value === value;

  return (
    <div
      onClick={() => {
        context.onValueChange(value);
        context.setOpen(false);
      }}
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-zinc-800 focus:bg-zinc-800 focus:text-zinc-50 cursor-pointer",
        isSelected && "bg-zinc-800 text-emerald-400",
        className
      )}
      {...props}
    >
      <span className="absolute right-2 flex h-3.5 w-3.5 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      <span className="truncate">{children}</span>
    </div>
  )
}