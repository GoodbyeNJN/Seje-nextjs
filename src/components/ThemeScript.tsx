import { joinWithBaseInAbsolute } from "@/utils/url";

export const ThemeScript: React.FC = () => (
    // 此处需要确保脚本优先执行，所以不能使用 next/script
    <script src={joinWithBaseInAbsolute("/assets/theme.js")} />
);
