declare global {
    namespace Parser {
        interface PostFileContent {
            data: {
                title: string;
                slug: string;
                date: string;
                categories: string[];
                tags: string[];
            };
            content: string;
            excerpt: string;
        }

        interface PageFileContent {
            data: {
                title: string;
                slug: string;
            };
            content: string;
        }
    }
}

export {};
