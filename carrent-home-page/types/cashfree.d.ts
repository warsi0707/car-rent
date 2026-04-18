declare module "@cashfreepayments/cashfree-js" {
  export function load(config: { mode: "sandbox" | "production" }): Promise<CashfreeInstance>;
  
  interface CashfreeInstance {
    checkout(options: {
      paymentSessionId: string;
      redirectTarget?: "_self" | "_blank";
    }): void;
  }
}
