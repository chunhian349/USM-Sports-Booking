'use server'
import { createClient } from "@/utils/supabase/server";
import AdminClient from "./client-side";
import { redirect } from "next/navigation";

export async function UpdateReport(report_id: string, report_status: boolean, admin_feedback: string) {
    const supabase = createClient();

    const { error: updateReportError } = await supabase
        .from('Report')
        .update({ report_status, admin_feedback })
        .eq('report_id', report_id)

    if (updateReportError) {
        console.error(updateReportError)
        throw Error('Failed to update report')
    }
}

export async function AddFacilityManager(formData: FormData) {
    const supabase = createClient();
    
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string
    const phone_num = formData.get('phone_num') as string

    const { data: auth, error: signUpError } = await supabase.auth.signUp({ email, password })

    if (signUpError || auth.user === null) {
        console.error(signUpError)
        throw Error('Failed to add facility manager')
    }

    const { error: insertUserError } = await supabase
        .from('User')
        .upsert({
            'user_id': auth.user.id,
            'email': email,
            'full_name': full_name,
            'phone_num': phone_num,
            'user_type': 'Facility Manager'
        })

    if (insertUserError) {
        console.error(insertUserError)
        throw Error('Failed to add facility manager')
    }
}   

export default async function AdminHomePage() {
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        redirect('/login')
    }

    const { data: facilityManagerData, error: selectUserError } = await supabase
        .from('User')
        .select('user_id, email, full_name, phone_num, user_created_at')
        .eq('user_type', 'Facility Manager')

    if (selectUserError || !facilityManagerData) {
        console.error(selectUserError)
        return <AdminClient facilityManagerData={[]} reportData={[]} />
    }

    const { data: reportData, error: selectReportError } = await supabase
        .from('Report')
        .select('report_id, report_title, report_screenshot, report_desc, report_status, report_created_at, admin_feedback, User(email, user_type)')
        .order('report_created_at', { ascending: false })
        .returns<{
            report_id: string,
            report_title: string,
            report_screenshot: string,
            report_desc: string,
            report_status: boolean,
            report_created_at: string,
            admin_feedback: string,
            User: {
                email: string,
                user_type: string
            }
        }[]>()

    if (selectReportError || !reportData) {
        console.error(selectReportError)
        return <AdminClient facilityManagerData={[]} reportData={[]}  />
    }

    return <AdminClient facilityManagerData={facilityManagerData} reportData={reportData} />
}