"use client";

import { useRouter } from "next/navigation";
import { useCallback, useDeferredValue, useEffect, useRef, useState, useTransition } from "react";
import "./input-search.component.scss";
import Loading from "@/app/loading";
import { useForm } from "react-form-ease";
import { useFormik } from "formik";
import { toast } from "react-toastify";

export default function InputSearch({ inputInitialValue, checkTagInitialValue }: { inputInitialValue: string; checkTagInitialValue: boolean; }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const checkboxTag = useRef<HTMLInputElement>(null);
    const [t, setT] = useState<NodeJS.Timeout | null>(null);

    const validate = (values: {
        inputSearch: string;
    }) => {
        const errors: {
            inputSearch: string;
        } = { inputSearch: '' };
        if (values.inputSearch && values.inputSearch.length < 3) {
            errors.inputSearch = 'Mínimo 3 caracteres.';
        }

        return errors;
    };

    const formik = useFormik({
        initialValues: {
            inputSearch: inputInitialValue,
        },
        validate,
        onSubmit: values => {
            alert(JSON.stringify(values, null, 2));
        },
    });

    const handlerSearch = (value: string) => {
        if (t) clearTimeout(t);
        if (value.length > 2 || value.length === 0) {
            setT(setTimeout(() => {
                startTransition(() => {
                    if (value.length !== 0) {
                        checkboxTag.current!.checked ? router.push(`?tag=${value}`) : router.push(`?q=${value}`);
                    } else {
                        router.push('/');
                    }
                });
            }, 1500));
        }
    };

    return (
        <>
            <form className='box-input-search'>
                <input type="text" className='input-search form-control'
                    id="inputSearch"
                    aria-invalid={formik.errors.inputSearch ? "true" : "false"}
                    onChange={formik.handleChange}
                    value={formik.values.inputSearch}
                    onKeyUp={() => handlerSearch(formik.values.inputSearch)}
                />
                {formik.errors.inputSearch ? <div className="feedback-invalid">{formik.errors.inputSearch}</div> : null}
            </form>
            <div className='box-check-inline' >
                <input id='check-tag' type="checkbox" ref={checkboxTag} defaultChecked={checkTagInitialValue} />
                <label htmlFor="check-tag">search in tags only</label>
            </div>
            {isPending && (
                <Loading />
            )}
        </>
    );
}