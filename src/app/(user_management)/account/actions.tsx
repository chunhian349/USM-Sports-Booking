'use server'

import { createClient } from '@/utils/supabase/server'

export async function UpdateProfile(prevState: any, formData: FormData) {
    const supabase = createClient()

    const user_id = formData.get('userid') as string ?? ''
    const fullname = formData.get('fullname') as string ?? ''
    const phonenum = formData.get('phonenum') as string ?? ''

    const phoneRegex = /^[0-9+]*$/
    if (!phoneRegex.test(phonenum)) {
        return {
            isActionSuccess: false,
            message: "Invalid phone number format."
        }
    }

    const { error } = await supabase
        .from('User')
        .update({
        full_name: fullname,
        phone_num: phonenum,
        })
        .eq('user_id', user_id)

    if (error) {
        console.error(error)
        return { isActionSuccess: false, message: error.message }
    }

    return { isActionSuccess: true, message: "Profile updated successfully." }
}