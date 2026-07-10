import { isImageUrl, proxiedImageSrc } from "@/lib/image";

type ProductImageProps = {
  image: string;
  alt: string;
  className?: string;
  emojiClassName?: string;
  fallback?: string;
};

export default function ProductImage({
  image,
  alt,
  className = "w-full h-full object-cover rounded-lg",
  emojiClassName = "text-6xl",
  fallback = "👗",
}: ProductImageProps) {
  if (isImageUrl(image)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={proxiedImageSrc(image)}
        alt={alt}
        className={className}
        onError={(e) => {
          const el = e.currentTarget;
          el.style.display = "none";
          const parent = el.parentElement;
          if (parent && !parent.querySelector("[data-fallback]")) {
            const span = document.createElement("span");
            span.dataset.fallback = "1";
            span.className = emojiClassName;
            span.textContent = fallback;
            parent.appendChild(span);
          }
        }}
      />
    );
  }

  return <span className={emojiClassName}>{image || fallback}</span>;
}
