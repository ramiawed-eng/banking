"use client";
import { useState } from "react";

import { signupSchema } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CustomInput from "@/components/CustomInput";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { Form } from "@/components/ui/form";

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address1: "",
      state: "",
      postalCode: "",
      dateOfBirth: new Date(Date.now()),
      ssn: "",
      email: "",
      password: "",
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof signupSchema>) {
    setIsLoading(true);
    setTimeout(() => {
      console.log(values);
      setIsLoading(false);
    }, 3000);
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex gap-4">
            <CustomInput
              label="First Name"
              name="firstName"
              control={form.control}
              placeholder="Enter your first name"
            />
            <CustomInput
              label="Last Name"
              name="lastName"
              control={form.control}
              placeholder="Enter your last name"
            />
          </div>
          <CustomInput
            label="Address"
            name="address1"
            control={form.control}
            placeholder="Enter your address"
          />
          <div className="flex gap-4">
            <CustomInput
              label="State"
              name="state"
              control={form.control}
              placeholder="ex: QC"
            />
            <CustomInput
              label="Postal Code"
              name="postalCode"
              control={form.control}
              placeholder="ex: H3T-5H5"
            />
          </div>
          <div className="flex gap-4">
            <CustomInput
              label="Date of birth"
              name="dateOfBirth"
              control={form.control}
              placeholder="yyyy-mm-dd"
              // type="date"
            />
            <CustomInput
              label="SSN"
              name="ssn"
              control={form.control}
              placeholder="ex: 1234"
            />
          </div>
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
                "Sign up"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
}
