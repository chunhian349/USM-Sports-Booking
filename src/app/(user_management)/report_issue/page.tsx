'use server'
import ReportIssueClient from "./client-site"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

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