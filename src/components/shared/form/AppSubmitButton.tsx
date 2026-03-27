import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import React from "react";

type AppSubmitButtonProps = {
  isPending?: boolean;
  children: React.ReactNode;
  pendingLabel?: string;
  className?: string;
  disabled?: boolean;
  style?: React.CSSProperties; 
};

const AppSubmitButton = ({
  isPending,
  children,
  pendingLabel = "Submitting...",
  className,
  disabled = false,
  style,
}: AppSubmitButtonProps) => {
  const isDisabled = disabled || isPending;

  return (
    <Button
      type="submit"
      disabled={isDisabled}
      style={style}
      className={cn(
        "w-full active:scale-[0.98] transition-all duration-200",
        className,
      )}
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin" aria-hidden="true" />
          {pendingLabel || children}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default AppSubmitButton;