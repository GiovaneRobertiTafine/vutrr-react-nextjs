import { NextRequest, NextResponse } from 'next/server';
import { Data, Tool } from '../model/data.model';

let data: Data = {
    "tools": [
        {
            "id": '1',
            "title": "Notion",
            "link": "https://notion.so",
            "description": "All in one tool to organize teams and ideas. Write, plan, collaborate, and get organized. ",
            "tags": [
                "organization",
                "planning",
                "collaboration",
                "writing",
                "calendar"
            ]
        },
        {
            "id": '2',
            "title": "json-server",
            "link": "https://github.com/typicode/json-server",
            "description": "Fake REST API based on a json schema. Useful for mocking and creating APIs for front-end devs to consume in coding challenges.",
            "tags": [
                "api",
                "json",
                "schema",
                "node",
                "github",
                "rest"
            ]
        },
        {
            "id": '3',
            "title": "fastify",
            "link": "https://www.fastify.io/",
            "description": "Extremely fast and simple, low-overhead web framework for NodeJS. Supports HTTP2.",
            "tags": [
                "web",
                "framework",
                "node",
                "http2",
                "https",
                "localhost"
            ]
        },
        {
            "title": "test-tool",
            "description": "test-tool description wow",
            "tags": [
                "test",
                "tool",
                "wow",
                "such"
            ],
            "id": '5'
        }
    ]

};
export function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const tag = searchParams.get('tag');
    // const dataResponse = Object.assign({}, data);

    var requestOptions = {
        method: 'GET',
    };

    if (query) {
        // const dataFiltered: Tool[] = data.tools.filter((t) => t.title.toLocaleLowerCase().includes(query.toLocaleLowerCase()));
        // dataResponse.tools = [...dataFiltered];
        return fetch("http://localhost:8000?q=" + query, requestOptions)
            .then(response => response.json())
            .then(result => NextResponse.json(TransformArray(result)))
            .catch(error => NextResponse.json({ status: 500 }));
    } else if (tag) {
        // const dataFiltered: Tool[] = data.tools.filter((t) => !!t.tags.filter((tgs) => tgs.includes(tag)).length);
        // dataResponse.tools = [...dataFiltered];
        return fetch("http://localhost:8000?tag=" + tag, requestOptions)
            .then(response => response.json())
            .then(result => NextResponse.json(TransformArray(result)))
            .catch(error => NextResponse.json({ status: 500 }));
    } else {
        return fetch("http://localhost:8000", requestOptions)
            .then(response => response.json())
            .then(result => NextResponse.json(TransformArray(result)))
            .catch(error => NextResponse.json({ status: 500 }));
    }

}

function TransformArray(res: Tool[]): { tools: Tool[]; } {
    const r = res.map<Tool>((r) => {
        r.tags = (r.tags + '').replace('[', '').replace(']', '').split(',');
        return r;
    });
    return { tools: r };
}

export function POST(request: NextRequest) {
    return request.json()
        .then(async (values: Tool) => {
            console.log(values);
            if (!values.title) return NextResponse.json({ status: 400, message: 'Title é requerido' });
            if (!values.description) return NextResponse.json({ status: 400, message: 'Description é requerido' });
            if (!values.tags.length) return NextResponse.json({ status: 400, message: 'Tags é requerido' });

            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

            var urlencoded = new URLSearchParams();
            urlencoded.append("id", '1');
            urlencoded.append("title", values.title);
            urlencoded.append("link", values.link || "");
            urlencoded.append("description", values.description);
            urlencoded.append("tags", `[${values.tags.join(',').replace("'", "")}]`);
            console.log(urlencoded);
            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: urlencoded,
            };

            return await fetch(`http://localhost:8000`, requestOptions)
                .then(response => response.json())
                .then(result => {
                    if (result.status === 200) return NextResponse.json({ status: 200 });
                    return NextResponse.json(result);
                })
                .catch(error => console.log('error', error));

            // data.tools.push({ id: idRef + 1, ...v } as Tool);
        })
        .catch(err => NextResponse.json({ status: 500 }));
}

export function DELETE(request: NextRequest) {
    var requestOptions = {
        method: 'DELETE',
    };
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    console.log(id);
    return fetch("http://localhost:8000?id=" + id, requestOptions)
        .then(response => response.json())
        .then(result => {
            if (result.status === 200) return NextResponse.json({ status: 200 });
            return NextResponse.json(result);
        })
        .catch(error => console.log('error', error));


}