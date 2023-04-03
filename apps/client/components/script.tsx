import { getAbsolutePath } from "share/utils";

export const FirstLoadScript: React.FC = () => {
    return <script src={getAbsolutePath("scripts/theme.js")} />;
};
