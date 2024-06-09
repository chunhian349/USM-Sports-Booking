'use server'

import { createClient } from '@/utils/supabase/server'

export async function UpdateReport(report_id: string, report_status: boolean, admin_feedback: string) {
    const supabase = createClient();

    const { error: updateReportError } = await supabase
        .from('Report')
        .update({ report_status, admin_feedback })
        .eq('report_id', report_id)

    if (updateReportError) {
        // console.error(updateReportError)
        return updateReportError.message
    }

    return ''
}

export async function AddFacilityManager(formData: FormData) {
    const supabase = createClient();
    
    const email = formData.get('email') as string ?? ''
    const password = formData.get('password') as string ?? ''
    const full_name = formData.get('full_name') as string ?? ''
    const phone_num = formData.get('phone_num') as string ?? ''

    // Validate password and phone number
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*-_]).{8,}$/;
    if (!passwordRegex.test(password)) {
        return 'Invalid password format.'
    }

    const phoneNumRegex = /^[0-9+]*$/;
    if (!phoneNumRegex.test(phone_num)) {
        return "Invalid phone number format."
    }

    const { data: auth, error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError) {
        // console.error(signUpError)
        return signUpError.message
    }

    const { error: insertUserError } = await supabase
        .from('User')
        .upsert({
            'user_id': auth.user ? auth.user.id : '',
            'email': email,
            'full_name': full_name,
            'phone_num': phone_num,
            'user_type': 'Facility Manager'
        })

    if (insertUserError) {
        // console.error(insertUserError)
        return insertUserError.message
    }

    return ''
}  