import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combina múltiples clases de Tailwind y elimina duplicados/conflictos.
 * Ejemplo:
 * cn("p-2 bg-red-500", isActive && "bg-green-500")
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}
