import {
  FormControl,
  FormField,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { signinSchema, signupSchema } from "@/lib/utils";
import { Control, FieldPath, Form } from "react-hook-form";
import { z } from "zod";

type CustomInputProps = {
  type?: string;
  label: string;
  // instead of name: 'email' | 'password'
  name: any;
  // | FieldPath<z.infer<typeof signinSchema>>
  // | FieldPath<z.infer<typeof signupSchema>>;
  control: any;
  // | Control<z.infer<typeof signinSchema>>
  // | Control<z.infer<typeof signupSchema>>;
  placeholder: string;
};

export default function CustomInput({
  type = "text",
  label,
  name,
  control,
  placeholder,
}: CustomInputProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <div className="form-item">
          <FormLabel className="form-label">{label}</FormLabel>
          <div className="flex flex-col w-full">
            <FormControl>
              <Input
                id={name}
                {...field}
                placeholder={placeholder}
                className="input-class"
                type={type}
              />
            </FormControl>
            <FormMessage className="form-message mt-2" />
          </div>
        </div>
      )}
    />
  );
}
