import type { LazyLoadingScreenProps } from "../../interfaces/props/loadingProps";

export const LazyLoadingScreen: React.FC<LazyLoadingScreenProps> = ({
  message = 'Getting things ready...',
}) => {
  return (
    <div className="relative flex items-center justify-center h-screen w-full bg-gradient-to-tr from-indigo-100 to-purple-100 overflow-hidden">
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="absolute w-6 h-6 bg-indigo-400 rounded-full opacity-50 animate-float"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDuration: `${4 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 2}s`,
            transform: `scale(${0.6 + Math.random() * 0.8})`,
          }}
        />
      ))}

      {/* Content */}
      <div className="z-10 text-center">
        <h2 className="text-2xl font-semibold text-indigo-800 mb-4 animate-pulse">{message}</h2>
        <p className="text-sm text-indigo-600">Please wait while we prepare your experience</p>
      </div>
    </div>
  );
};