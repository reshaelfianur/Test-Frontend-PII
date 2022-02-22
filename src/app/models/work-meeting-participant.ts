export interface WorkMeetingParticipant {
    wmp_id: number,
    wm_id: number,
    emp_id: number,
    wmp_absence_status: number,
    wmp_datetime_absence: Date,
    wmp_absence_note: string,
    wmp_is_minutes: number
}