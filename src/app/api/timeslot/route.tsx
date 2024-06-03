import { createClient } from '@/utils/supabase/server'
import { type NextRequest, NextResponse } from 'next/server'

// POST handler to get timeslot data of the selected court and date
export async function POST(request: NextRequest): Promise<Response> {
    const supabase = createClient()
    const { courtData, date } = await request.json()
    //console.log("Court" + courtData)
    //console.log("Date" + date)

    let timeslotData : any = []
    const courtDataLength = (courtData?.length != undefined) ? courtData.length : 0
    for (let index = 0; index < courtDataLength; index++) {
        let { data, error } = await supabase
            .from('BookedTimeslot')
            .select('*')
            .eq('fk_court_id', courtData[index].court_id)
            .eq('timeslot_date', date)

        if (error)
        {
            return new NextResponse(JSON.stringify(error), { status: 500 })
        }
            
        // Deep copy from data to timeslotData
        let tempData = JSON.parse(JSON.stringify(data))
        timeslotData.push(tempData)
    }

    return new NextResponse(JSON.stringify(timeslotData), { status: 200 })
}