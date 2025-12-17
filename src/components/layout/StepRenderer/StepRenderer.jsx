export default function StepRenderer({ step, pages }) {
  return pages[step] ?? null;
}
