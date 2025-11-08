"use client";

import { useEffect, useState } from "react";
import {
    getDepartments,
    createDepartment,
    deleteMultipleDepartments, // 👈 función para eliminar varios
} from "@/app/api/departments/route";
import { Department } from "@/types/Department";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";

interface NewDepartment {
    name: string;
    employees: number;
    ambassador: string;
    parent_id: number | null;
}


export default function Inicio() {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [filterColumn, setFilterColumn] = useState<keyof Department>("name");

    // Modal
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [newDepartment, setNewDepartment] = useState<NewDepartment>({
        name: "",
        employees: 0,
        ambassador: "",
        parent_id: null,
    });

    // ✅ Estado para checkboxes
    const [selectedDepartments, setSelectedDepartments] = useState<number[]>([]);

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async (): Promise<void> => {
        try {
            const data = await getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error("Error al cargar departamentos:", error);
        }
    };

    // Filtrar departamentos
    const filteredDepartments: Department[] = departments.filter((dep) => {
        const value = dep[filterColumn]; // obtenemos valor de la columna seleccionada
        if (value == null) return false;
        return value.toString().toLowerCase().includes(searchTerm.toLowerCase());
    });

    // Crear nuevo departamento
    const handleCreate = async (): Promise<void> => {
        if (!newDepartment.name.trim()) {
            alert("El nombre del departamento es obligatorio.");
            return;
        }

        try {
            await createDepartment(newDepartment);
            setIsOpen(false);
            setNewDepartment({
                name: "",
                employees: 0,
                ambassador: "",
                parent_id: null,
            });
            await loadDepartments();
        } catch (error) {
            console.error("Error al crear departamento:", error);
            alert("Error al crear el departamento. Revisa los datos.");
        }
    };

    // ✅ Manejar selección individual
    const toggleSelect = (id: number) => {
        setSelectedDepartments((prev) =>
            prev.includes(id)
                ? prev.filter((depId) => depId !== id)
                : [...prev, id]
        );
    };

    // ✅ Manejar eliminar seleccionados
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
            setSelectedDepartments([]); // limpiar selección
            await loadDepartments();
        } catch (error) {
            console.error("Error al eliminar departamentos:", error);
            alert("Ocurrió un error al eliminar los departamentos.");
        }
    };

    // const parentDepartments = filteredDepartments.filter(
    //     (d) => d.parent_id === null
    // );

    // const getChildren = (parentId: number): Department[] => {
    //     return filteredDepartments.filter((d) => d.parent_id === parentId);
    // };


    const renderDepartments = (departments: Department[]) => {
        const getRootParent = (dep: Department): Department | null => {
            // Subir hasta el padre principal
            let parent = departments.find(d => d.id === dep.parent_id);
            while (parent && parent.parent_id) {
                parent = departments.find(d => d.id === parent!.parent_id);
            }
            return parent || null;
        };

        return departments.map(dep => {
            const parent = getRootParent(dep);

            // Caso 1: Departamento principal (sin padre)
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
                        <TableCell>—</TableCell> {/* Subdivisión vacía */}
                        <TableCell>{dep.level}</TableCell> {/* Nivel del padre */}
                        <TableCell>{dep.employees}</TableCell>
                        <TableCell>{dep.ambassador || "-"}</TableCell>
                    </TableRow>
                );
            }

            // Caso 2: Subdepartamento
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
                    <TableCell>{dep.level}</TableCell> {/* Subdivisión = nivel del hijo */}
                    <TableCell>{parent ? parent.level : "—"}</TableCell> {/* Nivel del padre */}
                    <TableCell>{dep.employees}</TableCell>
                    <TableCell>{dep.ambassador || "-"}</TableCell>
                </TableRow>
            );
        });
    };


    return (
        <div className="px-10 py-10 space-y-6">
            {/* Filtros y botón */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Selector de columna */}
                    <Select
                        onValueChange={(value) =>
                            setFilterColumn(value as keyof Department)
                        }
                    >
                        <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Filtrar por..." />
                        </SelectTrigger>
                        <SelectContent>
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

                <div className="flex gap-3">
                    {/* Botón eliminar seleccionados */}
                    <Button
                        disabled={selectedDepartments.length === 0}
                        onClick={handleDeleteSelected}
                        className="bg-red-500 text-white cursor-pointer"
                    >
                        Eliminar seleccionados
                    </Button>

                    {/* Botón Agregar */}
                    <Dialog open={isOpen} onOpenChange={setIsOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-blue-600 hover:bg-blue-700 text-white cursor-pointer">
                                Agregar departamento
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-white">
                            <DialogHeader>
                                <DialogTitle>Nuevo Departamento</DialogTitle>
                            </DialogHeader>

                            <div className="flex flex-col gap-3 py-3">
                                <label htmlFor="name">Ingrese nombre del departamento:</label>
                                <Input
                                    id="name"
                                    placeholder="Nombre del departamento"
                                    value={newDepartment.name}
                                    onChange={(e) =>
                                        setNewDepartment({
                                            ...newDepartment,
                                            name: e.target.value,
                                        })
                                    }
                                />

                                <label htmlFor="employes">Ingrese número de empleados:</label>
                                <Input
                                    id="employes"
                                    placeholder="Número de empleados"
                                    type="number"
                                    min={1}
                                    value={newDepartment.employees}
                                    onChange={(e) =>
                                        setNewDepartment({
                                            ...newDepartment,
                                            employees: Number(e.target.value),
                                        })
                                    }
                                />



                                <label htmlFor="embassador">Ingrese nombre del embajador:</label>
                                <Input
                                    id="embassador"
                                    placeholder="Embajador (opcional)"
                                    value={newDepartment.ambassador}
                                    onChange={(e) =>
                                        setNewDepartment({
                                            ...newDepartment,
                                            ambassador: e.target.value,
                                        })
                                    }
                                />

                                <Select
                                    onValueChange={(value) =>
                                        setNewDepartment({
                                            ...newDepartment,
                                            parent_id: value === "none" ? null : Number(value),
                                        })
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar división superior" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">
                                            Ninguna (Principal)
                                        </SelectItem>
                                        {departments.map((dep) => (
                                            <SelectItem key={dep.id} value={String(dep.id)}>
                                                {dep.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsOpen(false)}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleCreate}>Guardar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Tabla */}
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead></TableHead>
                            <TableHead>Departamento Padre</TableHead>
                            <TableHead>Subdepartamento</TableHead>
                            <TableHead>Subdivisión</TableHead>
                            <TableHead>Nivel</TableHead>
                            <TableHead>Empleados</TableHead>
                            <TableHead>Embajador</TableHead>
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
