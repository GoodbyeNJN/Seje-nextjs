import { getAbsolutePath } from "share/utils";

export const FirstLoadScript: React.FC = () => {
    return <script src={getAbsolutePath("assets/theme.js")} />;
};
