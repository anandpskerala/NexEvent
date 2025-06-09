export const getRandomBgColor = (): string => {
    const colors = [
        'bg-red-600', 'bg-red-500', 'bg-red-700',
        'bg-orange-600', 'bg-orange-500', 'bg-orange-700',
        'bg-yellow-600', 'bg-yellow-500', 'bg-yellow-700',
        'bg-green-600', 'bg-green-500', 'bg-green-700',
        'bg-teal-600', 'bg-teal-500', 'bg-teal-700',
        'bg-blue-600', 'bg-blue-500', 'bg-blue-700',
        'bg-indigo-600', 'bg-indigo-500', 'bg-indigo-700',
        'bg-purple-600', 'bg-purple-500', 'bg-purple-700',
        'bg-pink-600', 'bg-pink-500', 'bg-pink-700',
        'bg-rose-600', 'bg-rose-500', 'bg-rose-700',
        'bg-cyan-600', 'bg-cyan-500', 'bg-cyan-700',
        'bg-emerald-600', 'bg-emerald-500', 'bg-emerald-700',
        'bg-fuchsia-600', 'bg-fuchsia-500', 'bg-fuchsia-700',
        'bg-lime-600', 'bg-lime-500', 'bg-lime-700',
        'bg-sky-600', 'bg-sky-500', 'bg-sky-700',
        'bg-violet-600', 'bg-violet-500', 'bg-violet-700',
        'bg-zinc-600', 'bg-zinc-500', 'bg-zinc-700',
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
};