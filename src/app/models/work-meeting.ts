export interface WorkMeeting {
    wm_id: number,
    room_id: number,
    wm_name: string,
    wm_description: string,
    wm_datetime_in: Date,
    wm_datetime_out: Date,
    wm_number_of_participants: number,
    wm_agreement_status: number,
    wm_agreement_note: string,
    created_by: number,
    updated_by: number,
    deleted_by: number
}