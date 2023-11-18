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
    searchParams: string;
}) {
    const [inputTag, setInputTag] = useState<string>('');
    const pathname = usePathname();
    const query = useMemo(() => {
        return Object.keys(searchParams)
            .map((k, i, arr) =>
                (i === 0 ? '?' : '') + k + '=' + ((searchParams as unknown as { [index: string]: string; })[k]) + (i + 1 === arr.length ? '' : ';')).join('');

    }, []);
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    const validate = (values: Tool): void | object | Promise<FormikErrors<Tool>> | undefined => {
        const errors: any = {};
        if (!values.title) {
            errors.title = 'Nome é requerido.';
        }
        if (values.link && values.link.length < 3) {
            errors.link = 'Mínimo 3 carateres.';
        }
        if (!values.description) {
            errors.description = 'Descrição é requerido.';
        }
        if (!values.tags.length) {
            errors.tags = 'Tags é requerido.';
        }

        return errors;
    };

    const formik = useFormik<Tool>({
        initialValues: {
            title: '',
            link: '',
            description: '',
            tags: []
        },
        validate,
        onSubmit: async (values) => {
            setLoading(true);
            await fetch("http://localhost:3000/api", {
                method: "POST",
                body: JSON.stringify(values),
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then((v) => {
                v.json().then((r => {
                    setLoading(false);
                    if (v.status === 200) {
                        formik.setSubmitting(true);
                        toast.success("Incluindo com sucesso!", {
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

        }
    });

    useEffect(() => {
        formik.resetForm();
    }, [pathname]);

    const handlerTagValue = () => {
        if (inputTag) {
            formik.setFieldValue(`tags[${formik.values.tags.length}]`, inputTag, false);
            setInputTag('');
            formik.setFieldError('tags', undefined);
        }
    };

    const handlerRemoveTagValue = (index: number) => {
        formik.setFieldValue(`tags`, formik.values.tags.filter((v, i) => i !== index), false);
        formik.validateField('tags');
    };

    return (
        <>
            <Modal>
                <div style={{ display: "flex", justifyContent: 'space-between' }}>
                    <h5>
                        <img
                            src="/assets/icon/Icon-Plus-Preto.svg"
                            alt="t"
                            height="14"
                            width="14" style={{ marginRight: '5px' }} />
                        Add New Tool</h5>
                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/" + query}>Fechar</Link>
                </div>
                <div style={{ paddingTop: '20px', width: "90%", margin: '0 auto' }}>
                    <form onSubmit={formik.handleSubmit}>
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="inputName">Tool Name*</label>
                            <input
                                type="text" id="title" className='form-control' aria-invalid={formik.errors.title ? "true" : "false"}
                                onChange={formik.handleChange}
                                value={formik.values.title}
                                disabled={formik.isSubmitting} />
                            {formik.errors.title && <div className="feedback-invalid">{formik.errors.title}</div>}

                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="inputLink">Tool Link</label>
                            <input type="text" id="link" className='form-control' aria-invalid={formik.errors.link ? "true" : "false"}
                                onChange={formik.handleChange}
                                value={formik.values.link}
                                disabled={formik.isSubmitting} />
                            {formik.errors.link && <div className="feedback-invalid">{formik.errors.link}</div>}
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="textAreaDescription">Tool Description*</label>
                            <textarea rows={3} id="description" className="form-control" aria-invalid={formik.errors.description ? "true" : "false"}
                                onChange={formik.handleChange}
                                value={formik.values.description}
                                disabled={formik.isSubmitting}></textarea>
                            {formik.errors.description && <div className="feedback-invalid">{formik.errors.description}</div>}
                        </div>

                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="inputTags">Tags*</label>
                            <div className="input-list form-control"
                                aria-invalid={formik.errors.tags ? "true" : "false"}
                                aria-disabled={formik.isSubmitting}
                            >
                                {
                                    formik.values.tags.map((v, index) => {
                                        return (
                                            <span className="item" key={index}>
                                                {v}
                                                <img src="/assets/icon/Icon-Close.svg" className="remove" alt="x"
                                                    onClick={() => handlerRemoveTagValue(index)} />
                                            </span>
                                        );
                                    })
                                }
                                <input type="text" id="inputTags" className='form-control input-inside' placeholder="Inserir Tag"
                                    value={inputTag}
                                    onChange={(e) => setInputTag(e.target.value)}
                                    onBlur={() => { handlerTagValue(); }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handlerTagValue();
                                        }
                                    }}
                                    disabled={formik.isSubmitting}
                                />

                            </div>
                            {formik.errors.tags && <div className="feedback-invalid">{formik.errors.tags}</div>}
                        </div>

                        <button style={{ marginTop: '10px', float: 'right' }} id="btn-form-add" disabled={formik.isSubmitting} className="btn btn-primary-success" type="submit">Add Tool</button>
                    </form>
                </div>
            </Modal>
            {
                isLoading ? <Loading /> : ''
            }
        </>
    );
}