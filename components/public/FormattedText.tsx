import type { ReactNode } from "react";

const inlinePattern = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;

function safeHref(value: string) {
  const href = value.trim();
  return /^(https?:\/\/|\/)/i.test(href) ? href : null;
}

function renderInline(value: string): ReactNode[] {
  return value
    .split(inlinePattern)
    .filter(Boolean)
    .map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith("*") && part.endsWith("*")) {
        return <em key={index}>{part.slice(1, -1)}</em>;
      }
      const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
      if (link) {
        const href = safeHref(link[2]);
        return href ? (
          <a
            href={href}
            key={index}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
          >
            {link[1]}
          </a>
        ) : (
          link[1]
        );
      }
      return part;
    });
}

export function FormattedText({ value, className }: { value: string; className?: string }) {
  const lines = value.split(/\r?\n/);
  const content: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) {
      index += 1;
      continue;
    }
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (index < lines.length && lines[index].trim().startsWith("- ")) {
        items.push(lines[index].trim().slice(2));
        index += 1;
      }
      content.push(
        <ul key={`ul-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ul>
      );
      continue;
    }
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s/.test(lines[index].trim())) {
        items.push(lines[index].trim().replace(/^\d+\.\s/, ""));
        index += 1;
      }
      content.push(
        <ol key={`ol-${index}`}>
          {items.map((item, itemIndex) => (
            <li key={itemIndex}>{renderInline(item)}</li>
          ))}
        </ol>
      );
      continue;
    }
    if (line.startsWith("### ")) content.push(<h3 key={index}>{renderInline(line.slice(4))}</h3>);
    else if (line.startsWith("## "))
      content.push(<h2 key={index}>{renderInline(line.slice(3))}</h2>);
    else if (line.startsWith("> "))
      content.push(<blockquote key={index}>{renderInline(line.slice(2))}</blockquote>);
    else content.push(<p key={index}>{renderInline(line)}</p>);
    index += 1;
  }

  return (
    <div className={className ? `formatted-text ${className}` : "formatted-text"}>{content}</div>
  );
}
