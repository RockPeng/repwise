import type { BlockContent } from "@/sanity.types";

function blockText(block: BlockContent[number]) {
  if (block._type !== "block") {
    return "";
  }

  return (block.children ?? [])
    .map((child) => (child._type === "span" ? child.text ?? "" : ""))
    .join("")
    .trim();
}

export function prepareLessonNotes(
  notes: BlockContent | null,
  keyPoints: Array<string> | null,
) {
  const leadIndex =
    notes?.findIndex(
      (block) =>
        block._type === "block" &&
        block.style === "normal" &&
        !block.listItem &&
        Boolean(blockText(block)),
    ) ?? -1;
  const leadBlock = notes?.[leadIndex];
  const summary = leadBlock?._type === "block" ? blockText(leadBlock) : "";
  const normalizedKeyPoints = new Set(
    (keyPoints ?? []).map((point) => point.trim().toLocaleLowerCase()),
  );
  const overviewNotes = notes?.filter((block, index) => {
    if (index === leadIndex) {
      return false;
    }

    const text = blockText(block);
    if (block._type === "block" && block.listItem && normalizedKeyPoints.has(text.toLocaleLowerCase())) {
      return false;
    }

    return !(
      block._type === "block" &&
      (block.style === "h2" || block.style === "h3") &&
      text.toLocaleLowerCase() === "what this lesson covers"
    );
  });

  return {
    summary: summary || null,
    overviewNotes: overviewNotes?.length ? overviewNotes : null,
  };
}
