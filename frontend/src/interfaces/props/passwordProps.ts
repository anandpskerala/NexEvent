export interface PasswordProps {
  name: string;
  label?: string;
  errors: Partial<Record<string, string | boolean>>;
  handleForm: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}