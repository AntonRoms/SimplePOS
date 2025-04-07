import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    company: defineTable({
        companyName: v.string(),
        receiptUrl: v.string(),
        VatRegTin: v.string(),
        BIR: v.string(),
        address: v.string(),
        phone: v.string(),
        createdAt: v.number(),
    })
})