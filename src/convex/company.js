import { mutation, query } from './_generated/server';
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
    await ctx.db.insert('receipts', {
      receiptUrl: `data:image/png;base64,${args.base64}`,
      company: args.company,
      TIN: args.TIN,
      ORnumber: args.ORnumber,
      companyAddress: args.companyAddress,
      date: args.date,
    });
  },
});

export const getByReceiptId = query({
  args: { receiptId: v.string() },
  handler: async (ctx, args) => {
    const receipt = await ctx.db
      .query("receipts")
      .filter((q) => q.eq(q.field("receiptId"), args.receiptId))
      .first();
    return receipt;
  },
});

