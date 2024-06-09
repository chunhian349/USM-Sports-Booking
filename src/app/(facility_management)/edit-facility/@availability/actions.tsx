'use server'
import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function AddCourt(court_name: string, court_status: boolean, facility_id: string/*, formData: FormData*/) {
    const supabase = createClient()
    const { error } = await supabase
        .from('Court')
        .insert({
            court_name: court_name,
            court_status: court_status,
            fk_facility_id: facility_id,
        })

    if (error) {
        const errorMessage = "Add Court failed (" + error.message + ")"
        redirect('/error/?error=' + errorMessage)
    }
}

export async function DeleteCourt(court_id: string) {
    const supabase = createClient()
    const { error } = await supabase
        .from('Court')
        .delete()
        .eq('court_id', court_id)

    if (error) {
        const errorMessage = "Delete Court failed (" + error.message + ")"
        redirect('/error/?error=' + errorMessage)
    }
}