import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Checkout</h1>
        <p className="text-muted-foreground mb-8">
          Enter your delivery details to place your order.
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Delivery Information</CardTitle>
          </CardHeader>
          <CardContent>
            <CheckoutForm />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
