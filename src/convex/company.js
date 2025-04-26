import { mutation } from './_generated/server';
import { v } from 'convex/values';

export const uploadReceipt = mutation({
  args: {
    base64: v.string(),
    company: v.string(),
    TIN: v.string(),
    ORnumber: v.string(),
    companyAddress: v.string(),
    date: v.string(),
  },
  handler: async (ctx, args) => {
    const base64Data = args.base64.replace(/^data:image\/png;base64,/, "");

    await ctx.db.insert('receipts', {
      receiptUrl: `data:image/png;base64,${base64Data}`,
      company: args.company,
      TIN: args.TIN,
      ORnumber: args.ORnumber,
      companyAddress: args.companyAddress,
      date: args.date,
    });
  },
});

