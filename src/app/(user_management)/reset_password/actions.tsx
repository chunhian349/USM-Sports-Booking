'use server'

import { createClient } from '@/utils/supabase/server'

export async function ResetPassword(prevState: any, formData: FormData) {   
    const supabase = createClient()

    const newPassword = formData.get('newPassword') as string

    // Validate password format (8 characters, which at least 1 uppercase, 1 lowercase, 1 number each)
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*-_]).{8,}$/;
    if (!passwordRegex.test(newPassword)) {
        return {
        isActionSuccess: false, 
        message: "Invalid password format." 
        }
    }
    
    const { data, error } = await supabase
        .auth
        .updateUser({ password: newPassword })

    if (error) {
        console.error(error)
        return { isActionSuccess: false, message: error.message }
    }
    
    return { isActionSuccess: true, message: "Password updated successfully!" }
}