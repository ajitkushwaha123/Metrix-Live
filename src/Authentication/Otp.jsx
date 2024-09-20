import React, { useRef, useState } from "react";

export default function Otp({ inputOtp }) {
  // Destructure inputOtp from props
  const [otp, setOtp] = useState(Array(4).fill(""));
  const inputRefs = useRef([]);

  const handleKeyDown = (e) => {
    if (
      !/^[0-9]{1}$/.test(e.key) &&
      e.key !== "Backspace" &&
      e.key !== "Delete" &&
      e.key !== "Tab" &&
      !e.metaKey
    ) {
      e.preventDefault();
    }

    if (e.key === "Delete" || e.key === "Backspace") {
      const index = inputRefs.current.indexOf(e.target);
      if (index > 0) {
        setOtp((prevOtp) => {
          const newOtp = [
            ...prevOtp.slice(0, index - 1),
            "",
            ...prevOtp.slice(index),
          ];
          inputOtp(newOtp);
          return newOtp;
        });
        inputRefs.current[index - 1].focus();
      }
    }
  };

  const handleInput = (e) => {
    const { target } = e;
    const index = inputRefs.current.indexOf(target);
    if (target.value) {
      setOtp((prevOtp) => {
        const newOtp = [
          ...prevOtp.slice(0, index),
          target.value,
          ...prevOtp.slice(index + 1),
        ];
        inputOtp(newOtp);
        return newOtp;
      });
      if (index < otp.length - 1) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleFocus = (e) => {
    e.target.select();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text");
    if (!new RegExp(`^[0-9]{${otp.length}}$`).test(text)) {
      return;
    }
    const digits = text.split("");
    setOtp(digits);
    inputOtp(digits);
  };

  return (
    <section className="bg-white dark:bg-dark">
      <div className="container">
        <div>
          <form id="otp-form" className="flex gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onPaste={handlePaste}
                ref={(el) => (inputRefs.current[index] = el)}
                className="shadow-xs flex w-[64px] items-center justify-center rounded-lg border border-stroke bg-white p-3 text-center text-2xl font-medium text-gray-5 outline-none sm:text-2xl dark:border-dark-3 dark:bg-white/5"
              />
            ))}
          </form>
        </div>
      </div>
    </section>
  );
}
