import Link from "next/link";

export default function TermsPage() {
  return (
    <div className="card max-w-2xl mx-auto">
      <h2 className="section-title">Terms &amp; conditions</h2>
      <p className="mb-4">By using ForgeX you agree to our standard e-commerce terms. Prices are in PKR and may change without notice.</p>
      <p className="mb-4">Cash on delivery orders must be paid in full upon delivery. Returns accepted within 7 days for unused items in original packaging.</p>
      <Link href="/" className="btn btn-outline inline-block no-underline">Back to shop</Link>
    </div>
  );
}
