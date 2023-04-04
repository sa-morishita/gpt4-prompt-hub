import { memo, type FC, type ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import type { CodeComponent } from "react-markdown/lib/ast-to-react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import rehypeMathjax from "rehype-mathjax";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";

interface CustomComponentProps {
  children: ReactNode;
}

interface Props {
  response: string;
}

const Markdown: FC<Props> = ({ response }) => {
  const CodeBlock: CodeComponent = ({ inline, className, children }) => {
    if (inline) {
      return <code className={className}>{children}</code>;
    }
    const match = /language-(\w+)/.exec(className || "");
    const lang = match && match[1] ? match[1] : "";
    return (
      <SyntaxHighlighter style={gruvboxDark} language={lang}>
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    );
  };

  const CustomTable = ({ children }: CustomComponentProps) => (
    <table className="divide-y divide-gray-300 bg-slate-50">{children}</table>
  );

  const CustomThead = ({ children }: CustomComponentProps) => (
    <thead>{children}</thead>
  );

  const CustomTbody = ({ children }: CustomComponentProps) => (
    <tbody className="divide-y divide-gray-200">{children}</tbody>
  );

  const CustomTr = ({ children }: CustomComponentProps) => (
    <tr className="divide-x divide-gray-200">{children}</tr>
  );

  const CustomTh = ({ children }: CustomComponentProps) => (
    <th className="py-3.5 pl-4 pr-4 text-left text-sm font-bold text-gray-900 whitespace-nowrap">
      {children}
    </th>
  );

  const CustomTd = ({ children }: CustomComponentProps) => (
    <td className="py-4 px-4 pr-4 text-sm text-gray-900 break-words">
      {children}
    </td>
  );

  return (
    <ReactMarkdown
      className="prose"
      rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeMathjax]}
      remarkPlugins={[remarkGfm, remarkMath]}
      components={{
        code: CodeBlock,
        table: CustomTable,
        thead: CustomThead,
        tbody: CustomTbody,
        tr: CustomTr,
        th: CustomTh,
        td: CustomTd,
      }}
    >
      {response}
    </ReactMarkdown>
  );
};

export default memo(Markdown);
