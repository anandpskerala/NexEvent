import React from 'react'
import { getRandomBgColor } from '../../utils/randomColor';
import type { CategoryCardProps } from '../../interfaces/props/formProps';
import { Link } from 'react-router-dom';


export const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
    return (
        <Link to={`/events/browse/?category=${category.id}`}>
            <div className={`${getRandomBgColor()} rounded-lg shadow-md overflow-hidden relative w-full max-h-[265px] min-h-[265px] md:max-w-sm mx-auto hover:shadow-lg transition-shadow duration-300 cursor-pointer p-6`}>
                <div className="flex justify-center items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
                        <img src={category.image} alt={category.name} className="w-8 h-8 object-contain" />
                    </div>
                </div>
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2 text-white">{category.name}</h2>
                    <p className="text-sm text-white text-opacity-90">{category.description}</p>
                </div>
            </div>
        </Link>
    )
}