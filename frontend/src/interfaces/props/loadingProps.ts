export interface LazyLoadingScreenProps {
  message?: string;
  tip?: string;
  showProgress?: boolean;
  brandIcon?: React.ReactNode;
}

export interface AnimationDelayStyle extends React.CSSProperties {
  animationDelay?: string;
  animationDirection?: string;
  animationDuration?: string;
}