'use server'

import { createClient } from '@/utils/supabase/server'

export async function signup(prevState: any, formData: FormData) {
  const supabase = createClient()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  // Validate password format (8 characters, which at least 1 uppercase, 1 lowercase, 1 number each)
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*-_]).{8,}$/;
  if (!passwordRegex.test(data.password)) {
    return {
      isActionSuccess: false, 
      message: "Invalid password format." 
    }
  }

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    console.error(error)
    return { isActionSuccess: false, message: error.message }
  }

  return { isActionSuccess: true, message: "Sign up successful. Please check your email for verification." }
}