import { addLeadingSlash, join } from "utils/string";

export const ThemeScript: React.FC = () => (
    // 此处需要确保脚本优先执行，所以不能使用 next/script
    <script src={addLeadingSlash(join(import.meta.env.BASE_URL, "/assets/theme.js"))} />
);
