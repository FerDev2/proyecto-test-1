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
