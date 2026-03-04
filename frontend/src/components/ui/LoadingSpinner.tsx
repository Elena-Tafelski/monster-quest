interface LoadingSpinnerProps {
  message?: string;
}

export const LoadingSpinner = ({ message = "Laden..." }: LoadingSpinnerProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-10">
      <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-blue-400 font-bold animate-pulse">{message}</p>
    </div>
  );
};