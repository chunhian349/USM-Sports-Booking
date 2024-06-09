'use server'
import ReportIssueClient from "./client-site"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export async function SubmitReport(prevState: any, formData: FormData) {
    const supabase = createClient()

    const user_id = formData.get('userid') as string
    const report_title = formData.get('reportTitle') as string
    const report_desc = formData.get('reportDesc') as string
    const report_screenshot = formData.get('screenshot') as File

    const screenshotURL = 'reportScreenshot/' + user_id + '/' + report_screenshot.name
    const { error: insertImageError } = await supabase
        .storage
        .from('images')
        .upload(screenshotURL, report_screenshot)

    if (insertImageError && insertImageError.message !== 'The resource already exists') {
        console.error(insertImageError)
        return { isActionSuccess: false, message: insertImageError.message }
    }

    const { error: insertReportError } = await supabase
        .from('Report')
        .insert([{ 
            'fk_user_id': user_id, 
            'report_title': report_title, 
            'report_screenshot': (process.env.NEXT_PUBLIC_IMAGE_BUCKET_URL + screenshotURL), 
            'report_desc': report_desc,
            'report_status': false
        }])

    if (insertReportError) {
        console.error(insertReportError)
        return { isActionSuccess: false, message: insertReportError.message }
    }

    return { isActionSuccess: true, message: "Report submitted successfully." }
}

export default async function ReportIssuePage() {
    const supabase = createClient()

    const { data: { user }, error: getAuthUserError } = await supabase.auth.getUser()
    if (getAuthUserError || !user) {
        console.log(getAuthUserError)
        redirect('/')
    }

    const { data: reportData, error: selectReportError } = await supabase
        .from('Report')
        .select('report_id, report_title, report_screenshot, report_desc, report_status, report_created_at, admin_feedback')
        .eq('fk_user_id', user.id)
        .order('report_created_at', { ascending: false })

    if (selectReportError || !reportData) {
        console.log("Report select failed")
        console.error(selectReportError)
        return <ReportIssueClient user_id={user.id} reportData={[]} />
    }

    return <ReportIssueClient user_id={user.id} reportData={reportData} />
}