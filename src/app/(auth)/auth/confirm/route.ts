import { type EmailOtpType } from "@supabase/supabase-js";
import { type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;

  if (token_hash && type) {
    const supabase = await createClient();

    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });

    if (!error && data.user) {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: {
            email: data.user.email,
          },
        });

        // Skip if user already exists
        if (!existingUser) {
          // Get avatar URL from user metadata if available
          const fullName = data.user.user_metadata?.full_name || null;

          // Create initial user record using Prisma
          await prisma.user.create({
            data: {
              id: data.user.id,
              email: data.user.email ?? "",
              full_name: fullName ?? "",
            },
          });
        }

        // redirect user to onboarding to complete profile
        return Response.redirect(new URL("/onboarding", request.url));
      } catch (err) {
        console.error("Error creating user:", err);
        return Response.redirect(new URL("/error", request.url));
      }
    }
  }

  // redirect the user to an error page with some instructions
  return Response.redirect(new URL("/error", request.url));
}
