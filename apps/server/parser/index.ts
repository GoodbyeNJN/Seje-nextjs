import { create, remove, update } from "./action";

export const parser = (event: Parser.Event) => {
    const { name } = event;

    switch (name) {
        case "create":
            create(event);
            break;

        case "update":
            update(event);
            break;

        case "remove":
            remove(event);
            break;
    }
};
