'use server'

import AccountForm from './account-form'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export default async function Account() {
    const supabase = createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    // If no user is logged in, redirect to login page
    if (!user) {
        redirect('/login')
    }

    const { data: publicUserData, error } = await supabase
        .from('User')
        .select(`full_name, phone_num, user_type`)
        .eq('user_id', user.id) 
        .single();

    // Handle unexpected error
    if (error) {
        console.error(error)
        redirect('/error/?error=' + error.message)
    }

    // There is auth user id but no user data found, unexpected error
    if (!publicUserData) {
        redirect('/error/?error=No user data found for the current user. Please contact the administrator.')
    }

    const userData = {
        user_id: user.id,
        email: user.email === undefined ? '' : user.email,
        full_name: publicUserData.full_name as string,
        phone_num: publicUserData.phone_num as string,
        user_type: publicUserData.user_type as string,
    }

  return <AccountForm userData={userData} />
}