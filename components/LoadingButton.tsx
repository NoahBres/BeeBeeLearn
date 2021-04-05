import { ReactNode, ButtonHTMLAttributes } from "react";

export type LoadingButtonState = "IDLE" | "LOADING" | "SUCCESS" | "ERROR";

type LoadingButtonProps = {
  state: LoadingButtonState;

  idle?: ReactNode;
  loading?: ReactNode;
  success?: ReactNode;
  error?: ReactNode;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const LoadingButton = ({
  state,
  idle,
  loading,
  success,
  error,
  className,
  children,
  ...props
}: LoadingButtonProps) => {
  const myClass = (() => {
    if (state === "IDLE") return "btn-yellow";
    if (state === "LOADING") return "btn-orange shadow-none hover:shadow-none";
    if (state === "SUCCESS") return "btn-green";
    if (state === "ERROR") return "btn-red";
  })();

  return (
    <button
      {...props}
      className={`btn ${myClass} ${className}`}
      disabled={state === "LOADING"}
    >
      {(() => {
        if (state === "IDLE") return idle;
        else if (state === "LOADING") return loading;
        else if (state === "SUCCESS") return success;
        else if (state === "ERROR") return error;
      })()}
    </button>
  );
};

export default LoadingButton;
