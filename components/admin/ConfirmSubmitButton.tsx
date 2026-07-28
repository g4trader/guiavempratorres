"use client";

type Props = {
  children: React.ReactNode;
  message: string;
};

export function ConfirmSubmitButton({ children, message }: Props) {
  return (
    <button
      className="button danger"
      type="submit"
      onClick={(event) => {
        if (!window.confirm(message)) event.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
