"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { authClient } from "@/src/lib/auth-client"
import {Field, useForm} from "@tanstack/react-form"
export function RegisterForm({ ...props }: React.ComponentProps<typeof Card>) {
const form = useForm ({
  defaultValues:{
    name:"",
    email:"",
    password:"",
    role:""
  },
  onSubmit:async({value})=>{
    console.log(value)
  }
})
  const handleWithGoogle = async()=>{
    const data = await authClient.signIn.social({
      provider:"google",
     
      callbackURL:"http://localhost:3000"
    })
  }
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>
          Enter your information below to create your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={(e)=>{
         e.preventDefault();
         form.handleSubmit();

        }}>
          <FieldGroup>
          <form.Field
  name="name"
  children={(field) => {
    return (
      <Field>
        <FieldLabel htmlFor={field.name}>Name</FieldLabel>
        <Input
          type="text"
          id={field.name}
          name={field.name}
          value={field.state.value ?? ""}
          onChange={(e) => field.handleChange(e.target.value)}
        />
      </Field>
    )
  }}
/>
          </FieldGroup>
         
        </form>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button type="submit" form="login-form">submit</Button>
      </CardFooter>
    </Card>
  )
}
