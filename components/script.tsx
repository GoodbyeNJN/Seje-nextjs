import { joinPathnameWithBasePath } from "@/utils/url";

export const FirstLoadScript: React.FC = () => {
    return <script src={joinPathnameWithBasePath("assets/theme.js")} />;
};
