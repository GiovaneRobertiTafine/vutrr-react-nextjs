"use client";

import Modal from "../../components/modal/modal.component";
import svgIcon from "../../../../public/assets/icon/Icon-Plus.svg";
import Link from "next/link";
// import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useMemo, useState } from "react";
import { Tool } from "@/app/model/data.model";
import { redirect, usePathname, useRouter } from "next/navigation";
import { FormikErrors, useFormik } from "formik";
import Loading from "../loading";
import { ToastContainer, toast } from 'react-toastify';

export default function Page({
    searchParams
}: {
    searchParams: { q?: string; tag?: string; title: string; id: string; };
}) {
    const router = useRouter();
    const query = useMemo(() => {
        return Object.keys(searchParams)
            .map((k, i, arr) => {
                if (k !== 'title'
                    && k !== 'id') {
                    return (i === 0 ? '?' : '') + k + '=' + ((searchParams as unknown as { [index: string]: string; })[k]) + (i + 1 === arr.length ? '' : ';');
                }
            }).join('');
    }, []);
    const [isLoading, setLoading] = useState(false);

    const handlerRemove = async () => {
        setLoading(true);
        await fetch("http://localhost:3000/api?id=" + searchParams.id, {
            method: "DELETE",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then((v) => {
            v.json().then((r => {
                setLoading(false);
                if (v.status === 200) {
                    toast.success("Removido com sucesso!", {
                        position: "bottom-right",
                        autoClose: 1000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        draggable: true,
                        progress: undefined,
                        theme: "colored",
                        className: "toast-success",
                        onClose: () => window.location.replace('/')
                    });

                }
            }));

        });
    };

    return (
        <>
            <Modal>
                <div style={{ display: "flex", justifyContent: 'space-between' }}>
                    <h5>
                        <img
                            src="/assets/icon/Icon-Close-Preto.svg"
                            alt="t"
                            height="14"
                            width="14" style={{ marginRight: '5px' }} />
                        Remove Tool</h5>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/" + query}>Fechar</Link>
                </div>
                <div style={{ marginTop: '10px', marginBottom: '10px' }}>
                    <p>Are you sure you want to remove <strong>{searchParams.title}</strong>?</p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                    <button className="btn btn-primary-danger" disabled={isLoading} onClick={() => router.back()}>Cancel</button>
                    <button className="btn btn-primary-success" disabled={isLoading} type="submit" onClick={() => handlerRemove()}>Yes, remove</button>
                </div>
            </Modal>
            {
                isLoading ? <Loading /> : ''
            }
        </>
    );
}