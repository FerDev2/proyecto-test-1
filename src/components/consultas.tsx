"use client"

import { useEffect, useState } from "react";

function Consultas() {
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        fetch("http://127.0.0.1:8000/api/departments")
            .then(res => res.json())
            .then(data => console.log("los datos son", data))
            .catch(err => console.error(err));
    }, []);


    return (
        <div>
            <h1>Lista de Departamentos</h1>
            <ul>

            </ul>
        </div>
    );
}

export default Consultas;
