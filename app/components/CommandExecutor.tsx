"use client";
import {
  FocusEventHandler,
  KeyboardEventHandler,
  useRef,
  useState,
} from "react";
import { useKeyPress, useKeyPressEvent } from "react-use";
import IconLoading from "./icons/Loading";

interface Props {
  handler: (input: string) => Promise<any>;
}

const CommandExecutor = ({ handler }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const input = useRef<HTMLInputElement>(null);

  useKeyPress((e) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
      setOpen(true);
      input.current?.focus();
    }
    return false;
  });

  useKeyPressEvent("Escape", () => close());

  const close = () => {
    if (loading) return;
    setOpen(false);
    setValue("");
    input.current?.blur();
  };

  const execute = async () => {
    setLoading(true);
    try {
      await handler(value);
      close();
    } catch (error) {
      console.error(error);
      setTimeout(() => input.current?.focus(), 50);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed transition-[transform] right-0 bottom-0 pb-3 pr-3"
      style={{ transform: `translateY(${open ? 0 : "100%"})` }}
    >
      <div className="relative">
        <input
          ref={input}
          className="outline-none border-none px-2 py-1 bg-gray-500 block w-[200px] rounded text-[.7em] font-mono"
          style={{ color: loading ? "gainsboro" : "white" }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && execute()}
          onBlur={close}
          disabled={loading}
        />
        {loading && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            <IconLoading />
          </span>
        )}
      </div>
    </div>
  );
};

export default CommandExecutor;
