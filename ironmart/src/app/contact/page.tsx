import Link from "next/link";

export default function ContactPage() {
  return (
    <div className="card max-w-md mx-auto">
      <h2 className="section-title">Contact us</h2>
      <p><strong>Email:</strong> support@ironmart.com</p>
      <p><strong>Phone:</strong> +92-300-1234567</p>
      <p><strong>Hours:</strong> Mon–Fri, 9 AM – 6 PM</p>
      <Link href="/" className="btn btn-orange inline-block mt-6 no-underline">Back to shop</Link>
    </div>
  );
}
