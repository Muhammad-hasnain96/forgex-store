import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="card max-w-2xl mx-auto prose prose-sm">
      <h2 className="section-title">Privacy policy</h2>
      <p>SilkLane respects your privacy. We collect only the information needed to process orders: name, email, phone, and delivery address.</p>
      <p>Payment details are not stored on our servers. Order data is kept in our database for fulfilment and support.</p>
      <p>Contact <a href="mailto:support@silklane.pk">support@silklane.pk</a> for data requests.</p>
      <Link href="/" className="btn btn-outline inline-block mt-4 no-underline">Back to shop</Link>
    </div>
  );
}
