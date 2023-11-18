"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

export default function ToastProvider({ notify, type }: { notify: string; type: 'success' | 'error'; }) {
    useEffect(() => {
        if (type === 'success') {
            toast.success(notify, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                className: "toast-success",
            });
        }
        if (type === 'error') {
            toast.error(notify, {
                position: "bottom-right",
                autoClose: 1000,
                hideProgressBar: true,
                closeOnClick: true,
                draggable: true,
                progress: undefined,
                theme: "colored",
                className: "toast-error",
            });
        }
    }, []);
    return (
        <>
        </>
    );
}