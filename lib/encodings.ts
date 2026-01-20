import jschardet from 'jschardet';

export async function detectFileEncoding(file: File): Promise<string> {
  const slice = file.slice(0, 1024);
  const buffer = await slice.arrayBuffer();
  const detected = jschardet.detect(new Uint8Array(buffer));
  return detected.encoding || 'UTF-8';
}
