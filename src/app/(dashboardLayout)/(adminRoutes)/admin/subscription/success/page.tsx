import { Suspense } from "react";
import { handleStripeReturn } from "../_actions";
import { CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

async function SuccessContent({
  searchParams,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: any;
}) {
  const isSuccess = searchParams.success === "true";
  
  // Await the action to clear the cache, but it won't redirect us anymore!
  await handleStripeReturn(searchParams.session_id, isSuccess);

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      {isSuccess ? (
        <>
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-emerald-500/10">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
          </div>
          <h1 className="text-3xl font-extrabold sm:text-4xl text-foreground">Payment Successful!</h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            Thank you! Your university account has been fully activated. You can now start managing scholarships.
          </p>
        </>
      ) : (
        <>
          <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-rose-500/10">
            <XCircle className="h-12 w-12 text-rose-500" />
          </div>
          <h1 className="text-3xl font-extrabold sm:text-4xl text-foreground">Payment Cancelled</h1>
          <p className="mt-4 max-w-md text-lg text-muted-foreground">
            Your checkout process was cancelled or failed. Your account has not been charged.
          </p>
        </>
      )}

      <div className="mt-10">
        <Link href="/admin/subscription">
          <Button 
            className="h-12 rounded-full px-8 font-bold text-white shadow-lg transition-transform hover:scale-105"
            style={{ background: `linear-gradient(135deg, #4b2875, #0097b2)` }}
          >
            Go to My Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default async function StripeSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; success?: string }>;
}) {
  const params = await searchParams; // Await params for Next.js 15

  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" style={{ color: "#0097b2" }} />
            <p className="text-lg font-medium text-muted-foreground">
              Verifying your payment...
            </p>
          </div>
        </div>
      }
    >
      <SuccessContent searchParams={params} />
    </Suspense>
  );
}