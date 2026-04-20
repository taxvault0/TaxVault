const ErrorField = ({ error }) => {
  if (!error) return null;

  return (
    <p className="text-sm text-red-600 mt-1">
      {error}
    </p>
  );
};

export default ErrorField;