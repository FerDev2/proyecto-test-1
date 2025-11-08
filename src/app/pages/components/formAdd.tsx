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
import { useEffect, useState } from "react";
import { Department, NewDepartment } from "@/types/Department";
import {
    getDepartments,
    createDepartment,
    deleteMultipleDepartments,
} from "@/services/departments";
import { NewDeparmentProps } from "@/types/Buscador";


export default function FormAdd({
    newDepartment,
    setNewDepartment }
    : NewDeparmentProps) {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

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


    return (
        <div>

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
                        <label htmlFor="name">Nombre:</label>
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

                        <label htmlFor="employees">Número de empleados:</label>
                        <Input
                            id="employees"
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

                        <label htmlFor="ambassador">Embajador:</label>
                        <Input
                            id="ambassador"
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
    )
}