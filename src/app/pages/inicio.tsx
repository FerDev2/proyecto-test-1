"use client";

import { useEffect, useState } from "react";
import {
    getDepartments,
    deleteMultipleDepartments,
} from "@/services/departments";
import { Department, NewDepartment } from "@/types/Department";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import { Button } from "@/components/ui/button";

import Buscador from "./components/buscador";
import FormAdd from "./components/formAdd";
import { ArrowDownZA, ArrowUpAZ, ListFilter } from "lucide-react";

export default function Inicio() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterColumn, setFilterColumn] = useState<keyof Department>("name");
    // const [isOpen, setIsOpen] = useState<boolean>(false);
    const [newDepartment, setNewDepartment] = useState<NewDepartment>({
        name: "",
        employees: 0,
        ambassador: "",
        parent_id: null,
    });
    const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);
    // Estado del ordenamiento
    const [sortConfig, setSortConfig] = useState<{
        column: string | null;
        direction: "asc" | "desc";
    }>({
        column: null,
        direction: "asc",
    });

    useEffect(() => {
        loadDepartments();
    }, []);

    //otener los despartamentos del backend
    const loadDepartments = async (): Promise<void> => {
        try {
            const data = await getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error("Error al cargar departamentos:", error);
        }
    };

    // Ordenar datos
    const handleSort = (column: string) => {
        setSortConfig((prev) => {
            if (prev.column === column) {
                return {
                    column,
                    direction: prev.direction === "asc" ? "desc" : "asc",
                };
            }
            return { column, direction: "asc" };
        });
    };

    // Iconos de ordenamiento
    const sortIcon = (column: string) => {
        if (sortConfig.column !== column) return <ListFilter size={20} />;
        return sortConfig.direction === "asc" ? <ArrowUpAZ size={20} /> : <ArrowDownZA size={20} />;
    };

    // Filtrar ordenamiento
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


    const toggleSelect = (id: number) => {
        setSelectedDepartments((prev) =>
            prev.includes(id)
                ? prev.filter((depId) => depId !== id)
                : [...prev, id]
        );
    };

    const handleDeleteSelected = async () => {
        if (selectedDepartments.length === 0) {
            alert("Selecciona al menos un departamento para eliminar.");
            return;
        }

        const confirmDelete = confirm(
            `¿Seguro que deseas eliminar ${selectedDepartments.length} departamento(s)?`
        );
        if (!confirmDelete) return;

        try {
            await deleteMultipleDepartments(selectedDepartments);
            setSelectedDepartments([]);
            await loadDepartments();
        } catch (error) {
            console.error("Error al eliminar departamentos:", error);
            alert("Ocurrió un error al eliminar los departamentos.");
        }
    };
    //render para mostrar los datos
    const renderDepartments = (departments: Department[]) => {
        const getRootParent = (dep: Department): Department | null => {
            let parent = departments.find((d) => d.id === dep.parent_id);
            while (parent && parent.parent_id) {
                parent = departments.find((d) => d.id === parent!.parent_id);
            }
            return parent || null;
        };

        return departments.map((dep) => {
            const parent = getRootParent(dep);

            if (!dep.parent_id) {
                return (
                    <TableRow key={dep.id}>
                        <TableCell>
                            <input
                                type="checkbox"
                                checked={selectedDepartments.includes(dep.id)}
                                onChange={() => toggleSelect(dep.id)}
                            />
                        </TableCell>
                        <TableCell>{dep.name}</TableCell>
                        <TableCell>—</TableCell>
                        <TableCell>—</TableCell>
                        <TableCell>{dep.level}</TableCell>
                        <TableCell>{dep.employees}</TableCell>
                        <TableCell>{dep.ambassador || "-"}</TableCell>
                    </TableRow>
                );
            }

            return (
                <TableRow key={dep.id}>
                    <TableCell>
                        <input
                            type="checkbox"
                            checked={selectedDepartments.includes(dep.id)}
                            onChange={() => toggleSelect(dep.id)}
                        />
                    </TableCell>
                    <TableCell>{parent ? parent.name : "—"}</TableCell>
                    <TableCell>{dep.name}</TableCell>
                    <TableCell>{dep.level}</TableCell>
                    <TableCell>{parent ? parent.level : "—"}</TableCell>
                    <TableCell>{dep.employees}</TableCell>
                    <TableCell>{dep.ambassador || "-"}</TableCell>
                </TableRow>
            );
        });
    };

    return (
        <div className="px-10 py-10 space-y-6">
            {/* 🔍 Filtros */}
            <div className="flex items-center justify-between">

                <Buscador
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    filterColumn={filterColumn}
                    setFilterColumn={setFilterColumn}
                />

                <div className="flex gap-3">
                    <Button
                        disabled={selectedDepartments.length === 0}
                        onClick={handleDeleteSelected}
                        className="bg-red-500 text-white cursor-pointer"
                    >
                        Eliminar seleccionados
                    </Button>
                    <FormAdd newDepartment={newDepartment} setNewDepartment={setNewDepartment} />
                </div>
            </div>

            {/* 🧾 Tabla */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead
                                onClick={() => handleSort("name")}
                                className="cursor-pointer select-none "
                            >
                                <span>Departamento Padre </span>{sortIcon("name")}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("subdepartamento")}
                                className="cursor-pointer select-none "
                            >
                                Subdepartamento {sortIcon("subdepartamento")}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("level")}
                                className="cursor-pointer select-none "
                            >
                                Subdivisión {sortIcon("level")}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("nivel")}
                                className="cursor-pointer select-none"
                            >
                                Nivel {sortIcon("nivel")}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("employees")}
                                className="cursor-pointer select-none"
                            >
                                Empleados {sortIcon("employees")}
                            </TableHead>
                            <TableHead
                                onClick={() => handleSort("ambassador")}
                                className="cursor-pointer select-none"
                            >
                                Embajador {sortIcon("ambassador")}
                            </TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {filteredDepartments.length > 0 ? (
                            renderDepartments(filteredDepartments)
                        ) : (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center">
                                    No se encontraron resultados
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
