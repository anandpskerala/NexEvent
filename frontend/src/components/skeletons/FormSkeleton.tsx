import React from "react";

interface SkeletonProps {
    colSpan?: number
}

export const FormSkeleton: React.FC<SkeletonProps> = ({colSpan = 3}) => {
    return (
        <>
            {Array.from({ length: 3 }).map((_, index) => (
                <tr key={index}>
                    <td colSpan={colSpan} className="p-4">
                        <div className="w-full h-4 bg-gray-200 rounded skeleton"></div>
                    </td>
                </tr>
            ))}
        </>
    );
};