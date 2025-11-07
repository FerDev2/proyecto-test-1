import Image from "next/image";

const list_menu = [
    {
        id: 1,
        name: 'dashboard',
        link: '#dashboard'
    },
    {
        id: 2,
        name: 'Organizacion',
        link: '#organizacion'
    },
    {
        id: 3,
        name: 'Modelos',
        link: '#modelos'
    },
    {
        id: 4,
        name: 'Seguimiento',
        link: '#seguimiento'
    },
]
export default function Header() {
    return (
        <header className="bg-[#1890FF] py-5">
            <ul className="flex items-center gap-5">
                {
                    list_menu.map(item => (
                        <li key={item.id} className="px-7">
                            <a href={item.link}>
                                {item.name}
                            </a>
                        </li>
                    ))
                }

            </ul>
        </header>
    )
}