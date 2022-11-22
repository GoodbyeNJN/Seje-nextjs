declare global {
    namespace Config {
        interface Blog {
            title: string;
            subtitle: string;
            description: string;
            keywords: string[];
            author: string;

            showExcerpt: boolean;
            showReadMore: boolean;
            postsPerPage: number;

            url: Url;

            menu: Menu;

            footer: Footer;

            code: Code;

            paths: Paths;
        }

        interface Url {
            origin: string;
            base: string;
            post: string;
            category: string;
            tag: string;
        }

        interface Menu extends Record<string, string> {
            home: string;
            archives: string;
            categories: string;
            tags: string;
        }

        interface Footer {
            copyright: boolean;
        }

        interface Code {
            theme: string[];
        }

        interface Paths {
            favicon: string;
            posts: string;
            images: string;
            pages: string;
            themes: string;
        }
    }
}

export type Blog = Config.Blog;
