
"use client";

import { useEffect, useState } from "react";
import { getDepartments } from "@/app/api/departments/route";
import { Department } from "@/types/Department";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

export default function Inicio() {

    const [departments, setDepartments] = useState<Department[]>([]);

    useEffect(() => {
        getDepartments().then(setDepartments).catch(console.error);
    }, []);
    return (
        <div className="px-50 py-20">
            <div className="p-4">
                <h1 className="text-xl font-bold">Departamentos</h1>
                <ul>
                    {departments.map((d) => (
                        <li key={d.id} className="flex gap-5">
                            <p>{d.name}</p>
                            <p>{d.level}</p>
                            <p>{d.employees}</p>
                            <p>{d.ambassador}</p>
                            <ul className="flex gap-5">
                                {
                                    d.children?.map((c) => (
                                        <li>
                                            <p>{c.name}</p>
                                            <p>{c.level}</p>
                                            <p>{c.employees}</p>
                                            <p>{c.ambassador}</p>
                                        </li>
                                    ))
                                }
                            </ul>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}