// Utility to stream AI responses from backend
export async function streamAIMessage(
  url: string,
  body: any,
  onChunk: (chunk: string) => void
) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!response.body) throw new Error("No response body");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let done = false;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    if (value) {
      onChunk(decoder.decode(value));
    }
  }
}
