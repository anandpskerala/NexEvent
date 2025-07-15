export const CustomLogo = ({ className = "w-16 h-16" }) => (
    <div className={`relative ${className} cursor-pointer`}>
        <svg viewBox="0 0 64 64" className="w-full h-full">
            <defs>
                <linearGradient id="ticketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFD700" />
                    <stop offset="100%" stopColor="#FFA500" />
                </linearGradient>

                <radialGradient id="spotlightGradient">
                    <stop offset="0%" stopColor="rgba(255, 223, 186, 0.2)" />
                    <stop offset="100%" stopColor="rgba(255, 223, 186, 0)" />
                </radialGradient>

                <filter id="ticketGlow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>

                <filter id="softShadow">
                    <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="rgba(0,0,0,0.5)" />
                </filter>
            </defs>

            <g>
                <rect width="64" height="64" rx="12" fill="#1A237E" />
                <rect width="64" height="64" rx="12" fill="url(#spotlightGradient)">
                    <animateTransform attributeName="transform" type="rotate" from="0 32 32" to="360 32 32" dur="15s" repeatCount="indefinite" /> {/* Slower rotation */}
                </rect>
            </g>

            <g filter="url(#softShadow)" className="transition-transform duration-300 hover:scale-105">
                <path
                    d="M16 12 H48 C50.2 12 52 13.8 52 16 V48 C52 50.2 50.2 52 48 52 H16 C13.8 52 12 50.2 12 48 V16 C12 13.8 13.8 12 16 12 Z"
                    fill="url(#ticketGradient)"
                    filter="url(#ticketGlow)"
                />
                <path
                    d="M14 32 L50 32"
                    stroke="#FFF"
                    strokeWidth="1"
                    strokeOpacity="0.8"
                    strokeDasharray="3 2"
                >
                    <animate attributeName="stroke-dashoffset" from="0" to="5" dur="1s" repeatCount="indefinite" />
                </path>

                <path
                    d="M25 40 V24 H28 L36 35 V24 H39 V40 H36 L28 29 V40 H25 Z"
                    fill="#1A237E"
                />
            </g>

            <g opacity="0.9">
                <circle cx="10" cy="10" r="1.5" fill="#FFF">
                    <animate attributeName="r" values="1.5;2.5;1.5" dur="1.8s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.4;0.9" dur="1.8s" repeatCount="indefinite" />
                </circle>
                <circle cx="54" cy="50" r="1.8" fill="#FFF">
                    <animate attributeName="r" values="1.8;2.8;1.8" dur="2.2s" begin="0.7s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.2s" begin="0.7s" repeatCount="indefinite" />
                </circle>
            </g>
        </svg>
    </div>
);