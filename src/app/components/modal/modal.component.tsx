"use client";

import Link from "next/link";
import "./modal.component.scss";
import { redirect, usePathname, useRouter } from "next/navigation";

export default function Modal(props: {
    // ...
    children: React.ReactNode;
}) {
    const route = useRouter();
    const pathName = usePathname();

    if (pathName === '/') return null;
    return (
        <div className="modal-backdrop" onClick={(e) => {
            if ((e.target as HTMLElement).className.includes('modal-backdrop')) route.push('/');
        }}>
            <div className="modal card">
                {props.children}
            </div>

        </div>
    );
}