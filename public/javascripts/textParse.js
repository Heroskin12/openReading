function splitParagraphs(text) {
  const paragraphs = text.split("\n").map((paragraph) => paragraph.trim());
  return paragraphs.filter((paragraph) => paragraph.length > 0);
}

module.exports = splitParagraphs;
