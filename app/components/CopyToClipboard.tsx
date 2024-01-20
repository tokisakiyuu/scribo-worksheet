"use client";
import copy from "copy-to-clipboard";
import { ComponentProps, FC, PropsWithChildren } from "react";

interface Props extends ComponentProps<"span">, PropsWithChildren {
  text: string;
}

const CopyToClipboard: FC<Props> = ({ text, children, ...props }) => (
  <span {...props} onClick={() => copy(text)}>
    {children}
  </span>
);

export default CopyToClipboard;
