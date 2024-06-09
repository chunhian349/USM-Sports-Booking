'use server'

import { createClient } from '@/utils/supabase/server' 

export async function RequestResetPassword(prevState: any, formData: FormData) {      
    const supabase = createClient();

    const { error } = await supabase
        .auth
        .resetPasswordForEmail(
            formData.get('email') as string, 
            {redirectTo: 'localhost:3000/reset_password',}
        );
    
    if (error) {
        console.error(error);
        return { isActionSuccess: false, message: error.message }
    }

    return { isActionSuccess: true, message: "Password reset link sent to your email." }
}