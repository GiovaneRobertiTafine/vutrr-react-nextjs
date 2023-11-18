export interface Data {
    tools: Tool[];
}

export interface Tool {
    id?: string;
    title: string;
    link?: string;
    description: string;
    tags: string[];
}