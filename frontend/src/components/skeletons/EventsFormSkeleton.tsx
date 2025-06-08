export const EventFormSkeleton = () => {
    return (
        <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md skeleton space-y-6">
            <div>
                <div className="h-4 skeleton rounded w-1/4 mb-4"></div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="h-20 flex-1 skeleton rounded"></div>
                    <div className="h-20 flex-1 skeleton rounded"></div>
                </div>
            </div>

            <div>
                <div className="h-4 skeleton rounded w-1/4 mb-4"></div>
                <div className="flex flex-wrap gap-2">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="h-6 w-20 skeleton rounded-full"></div>
                    ))}
                </div>
            </div>
            <div>
                <div className="h-4 skeleton rounded w-1/4 mb-4"></div>
                <div className="h-10 skeleton  rounded"></div>
            </div>

            {/* Tags */}
            <div>
                <div className="h-4 skeleton  rounded w-1/4 mb-4"></div>
                <div className="flex flex-wrap gap-2 mb-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-6 w-16 skeleton rounded-full"></div>
                    ))}
                </div>
                <div className="flex gap-2">
                    <div className="flex-1 h-10 skeleton  rounded"></div>
                    <div className="w-24 h-10 skeleton rounded"></div>
                </div>
            </div>
            <div>
                <div className="h-4 skeleton rounded w-1/4 mb-4"></div>
                <div className="flex gap-4">
                    <div className="skeleton flex-1 h-16 rounded"></div>
                    <div className="skeleton flex-1 h-16 rounded"></div>
                    <div className="skeleton flex-1 h-16 rounded"></div>
                </div>
            </div>
        </div>
    )
}