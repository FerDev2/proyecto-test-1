import { Input } from "@/components/ui/input";
import { Department, NewDepartment } from "@/types/Department";
import { useState } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { BuscadorProps } from "@/types/Buscador";

export default function Buscador({
    searchTerm,
    setSearchTerm,
    filterColumn,
    setFilterColumn,
}: BuscadorProps) {
    const [departments, setDepartments] = useState<Department[]>([]);
    // ⚙️ Estado de ordenamiento
    const [sortConfig, setSortConfig] = useState<{
        column: string | null;
        direction: "asc" | "desc";
    }>({
        column: null,
        direction: "asc",
    });
    const filteredDepartments = [...departments]
        .filter((dep) => {
            const value = dep[filterColumn];
            if (value == null) return false;
            return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
        .sort((a, b) => {
            if (!sortConfig.column) return 0;
            const aValue = (a as any)[sortConfig.column];
            const bValue = (b as any)[sortConfig.column];
            if (aValue == null || bValue == null) return 0;

            if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
            if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
        });

    return (
        <div className="flex items-center gap-4">
            <Select onValueChange={(value) => setFilterColumn(value as keyof Department)}>
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Filtrar por..." />
                </SelectTrigger>
                <SelectContent className="bg-white">
                    <SelectItem value="name">Nombre</SelectItem>
                    <SelectItem value="level">Nivel</SelectItem>
                    <SelectItem value="employees">Empleados</SelectItem>
                    <SelectItem value="ambassador">Embajador</SelectItem>
                </SelectContent>
            </Select>

            <Input
                type="text"
                placeholder={`Buscar por ${filterColumn}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
        </div>
    )
}