import { Bell } from "lucide-react";

type Props = {
    count: number;
    onClick: () => void;
};

export const NotificationBell: React.FC<Props> = ({ count, onClick }) => (
    <div className="relative cursor-pointer" onClick={onClick}>
        <Bell className="text-gray-700 hover:text-blue-600 transition w-5 h-5" />
        {count > 0 && (
            <span className="absolute -top-1 -right-1 inline-block w-4 h-4 text-[10px] text-white text-center bg-red-600 rounded-full">{count}</span>
        )}
    </div>
);