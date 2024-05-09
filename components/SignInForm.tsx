"use client";
import { useState } from "react";

import { signinSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";
import { signIn } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof signinSchema>>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signinSchema>) {
    setIsLoading(true);
    try {
      // Sign up with
      const response = await signIn({
        email: values.email,
        password: values.password,
      });

      if (response) router.push("/");
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CustomInput
            label="Email"
            name="email"
            control={form.control}
            placeholder="Please enter your Email"
          />
          <CustomInput
            label="Password"
            name="password"
            control={form.control}
            type="password"
            placeholder="Please enter your password"
          />
          <div className="flex flex-col gap-4">
            <Button type="submit" className="form-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> &nbsp;
                  Loading...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
