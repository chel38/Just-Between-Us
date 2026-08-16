const loadedImages = new Set<string>();
const inFlightImages = new Map<string, Promise<void>>();

export function preloadStoryImage(src: string): Promise<void> {
  if (loadedImages.has(src)) return Promise.resolve();
  const existing = inFlightImages.get(src);
  if (existing) return existing;
  const promise = new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => { loadedImages.add(src); resolve(); };
    image.onerror = () => reject(new Error(`Story image could not be preloaded: ${src}`));
    image.src = src;
  }).finally(() => inFlightImages.delete(src));
  inFlightImages.set(src, promise);
  return promise;
}
