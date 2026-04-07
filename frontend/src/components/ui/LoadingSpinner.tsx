interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = 'Laden...' }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-10">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-400 border-t-transparent" />
      <p className="animate-pulse font-bold text-blue-400">{message}</p>
    </div>
  );
};
