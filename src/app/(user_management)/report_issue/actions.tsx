'use server'

import { createClient } from '@/utils/supabase/server'

export async function SubmitReport(prevState: any, formData: FormData) {
    const supabase = createClient()

    const user_id = formData.get('userid') as string ?? ''
    const report_title = formData.get('reportTitle') as string ?? ''
    const report_desc = formData.get('reportDesc') as string ?? ''
    const report_screenshot = formData.get('screenshot') as File ?? null

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