import Image from 'next/image';
import InputSearch from './components/input-search/input-search.component';
import "./page.scss";
import Link from 'next/link';
import { Data } from './model/data.model';
import { ToastContainer, toast } from 'react-toastify';
import { number } from 'react-form-ease';
import ToastContainerWrapper from './toat-provider';
import ToastProvider from './toat-provider';

async function getToolsList(q?: string, tag?: string) {
    console.log('init');
    let res;
    if (q) {
        res = (await fetch(`http://localhost:3000/api?q=${q}`, { cache: 'no-cache' })).json();
    } else if (tag) {
        res = (await fetch(`http://localhost:3000/api?tag=${tag}`, { cache: 'no-cache' })).json();
    } else {
        res = (await fetch(`http://localhost:3000/api`, { cache: 'no-cache' })).json();
    }
    // await new Promise((resolve) => setTimeout(resolve, 5000));
    return res;
}

export default async function Home({
    searchParams,
}: {
    searchParams: { q?: string; tag?: string; };
}) {
    const qQuery = searchParams.q ?? "";
    const tagQuery = searchParams.tag ?? "";
    const toolsList: Data & { status: number; } = await getToolsList(qQuery, tagQuery);
    const query = (): string => {
        // toast.success("Incluindo com sucesso!");
        if (qQuery) return '?q=' + qQuery;
        if (tagQuery) return '?tag=' + tagQuery;
        return '';
    };

    const queryRemove = (title: string, id: string): string => {
        if (query()) return query() + `&title=${title}&id=${id}`;
        return `?title=${title}&id=${id}`;
    };

    return (
        <main>
            <h1 className='title-vuttr'>VUTTR</h1>
            <h3>Very Useful Tools to Remember</h3>
            <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ display: 'inline-block' }}>
                    <InputSearch inputInitialValue={qQuery || tagQuery} checkTagInitialValue={!!tagQuery.length} />

                </div>
                <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/add" + query()}>
                    <button className='btn btn-primary-success btn-add'>
                        Add
                    </button>
                </Link>
            </div>
            <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {
                    toolsList && toolsList?.['status'] !== 500 ?
                        toolsList.tools.map((t) =>
                            <div key={t.id} className='card'>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <a href="" className='link-title'>{t.title}</a>
                                    <Link style={{ textDecoration: 'none', color: 'inherit' }} href={"/remove" + queryRemove(t.title, t.id!)}>
                                        <button className='btn btn-quartiary-danger btn-remove'>
                                            Remove
                                        </button>
                                    </Link>
                                </div>
                                <p>
                                    {t.description}
                                </p>
                                <div style={{ marginTop: '10px', display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                    {
                                        t.tags.map((tag, i) =>
                                            <span key={i} className={tagQuery && tag.includes(tagQuery) ? 'tag-searched' : ''}>#{tag}</span>
                                        )
                                    }
                                </div>
                            </div>

                        ) : toolsList?.['status'] === 500 ?
                            <ToastProvider notify="Não foi possível obter os dados" type='error' /> :
                            toolsList.status
                }
            </div>
        </main>


    );
}
