
export interface Department {
    id: number;
    name: string;
    level: number;
    employees: number;
    ambassador?: string | null;
    parent_id?: number | null;
    created_at?: string;
    updated_at?: string;
    children?: Department[];
}

export interface BuscadorProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    filterColumn: keyof Department;
    setFilterColumn: (value: keyof Department) => void;
}

export interface NewDeparmentProps {
    newDepartment: {
        name: string;
        employees: number;
        ambassador: string;
        parent_id: number | null;
    };
    setNewDepartment: (value: {
        name: string;
        employees: number;
        ambassador: string;
        parent_id: number | null;
    }) => void;

}