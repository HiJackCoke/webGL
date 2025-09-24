import { ComponentProps } from "react";

const Anchor = ({ href, children }: ComponentProps<"a">) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="font-bold inline-flex items-center gap-2 text-[#3b7a57] hover:underline"
    >
      {children}
    </a>
  );
};

export default Anchor;
