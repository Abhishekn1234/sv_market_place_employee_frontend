// utils/downloadInvoice.ts
export function downloadInvoicePdf(invoice: any, work: any) {
  const win = window.open("", "_blank");
  if (!win) return;

  win.document.write(`
    <html>
      <head>
        <title>Invoice ${invoice.invoiceNumber}</title>
        <style>
          body { font-family: Arial; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          td, th { border: 1px solid #ddd; padding: 8px; }
          th { background: #f5f5f5; }
        </style>
      </head>
      <body>
        <h2>Invoice</h2>

        <table>
          <tr><th>Invoice No</th><td>${invoice.invoiceNumber}</td></tr>
          <tr><th>Amount</th><td>${invoice.finalAmount} ${invoice.currency}</td></tr>
          <tr><th>Booking ID</th><td>${work._id}</td></tr>
          <tr><th>Customer</th><td>${work.customer?.fullName}</td></tr>
          <tr><th>Service</th><td>${work.service?.name}</td></tr>
        </table>

        <script>
          window.print();
        </script>
      </body>
    </html>
  `);

  win.document.close();
}