"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

type AppOtpFieldProps = {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  hasError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
};

const AppOtpField = ({
  length = 6,
  value,
  onChange,
  hasError = false,
  errorMessage,
  disabled = false,
}: AppOtpFieldProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Split value into individual characters
  const digits = value.split("").concat(Array(length).fill("")).slice(0, length);

  const focusInput = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, length - 1));
      inputRefs.current[clampedIndex]?.focus();
    },
    [length],
  );

  const handleChange = useCallback(
    (index: number, char: string) => {
      if (disabled) return;

      // Only accept digits
      if (char && !/^\d$/.test(char)) return;

      const newValue = value.split("");

      if (char) {
        newValue[index] = char;
        // Move to next input
        if (index < length - 1) {
          focusInput(index + 1);
        }
      } else {
        newValue[index] = "";
      }

      onChange(newValue.join(""));
    },
    [value, onChange, length, focusInput, disabled],
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (disabled) return;

      if (e.key === "Backspace") {
        e.preventDefault();
        if (digits[index]) {
          // Clear current
          handleChange(index, "");
        } else if (index > 0) {
          // Move back and clear
          focusInput(index - 1);
          handleChange(index - 1, "");
        }
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        focusInput(index - 1);
      } else if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        focusInput(index + 1);
      }
    },
    [digits, handleChange, focusInput, length, disabled],
  );

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      if (disabled) return;
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (pasted) {
        onChange(pasted.padEnd(length, "").slice(0, length));
        // Focus last filled input or last input
        focusInput(Math.min(pasted.length, length - 1));
      }
    },
    [onChange, length, focusInput, disabled],
  );

  // Auto-focus first input on mount
  useEffect(() => {
    if (!disabled) {
      focusInput(0);
    }
  }, [focusInput, disabled]);

  return (
    <div>
      <div className="flex items-center justify-center gap-2 sm:gap-3">
        {digits.map((digit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.2 }}
          >
            <input
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit === "" ? "" : digit}
              disabled={disabled}
              onFocus={() => setActiveIndex(index)}
              onBlur={() => setActiveIndex(-1)}
              onChange={(e) => {
                const char = e.target.value.slice(-1);
                handleChange(index, char);
              }}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              aria-label={`Digit ${index + 1}`}
              className={cn(
                "w-11 h-13 sm:w-13 sm:h-14 text-center text-xl sm:text-2xl font-bold",
                "rounded-xl border-2 bg-background outline-none",
                "transition-all duration-200",
                "focus:ring-2 focus:ring-offset-1",
                disabled && "opacity-50 cursor-not-allowed",
                hasError
                  ? "border-destructive focus:ring-destructive/30"
                  : activeIndex === index
                    ? "border-primary ring-2 ring-primary/20"
                    : digit
                      ? "border-primary/50"
                      : "border-border hover:border-primary/30",
              )}
            />
          </motion.div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {hasError && errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -8, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -8, height: 0 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="text-sm text-destructive text-center mt-2"
            role="alert"
          >
            {errorMessage}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppOtpField;