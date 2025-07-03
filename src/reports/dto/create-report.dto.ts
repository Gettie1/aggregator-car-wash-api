export class CreateReportDto {
  user_id: string; // ID of the user who is reporting
  booking_id: string; // ID of the booking related to the report
  description: string; // Detailed description of the issue
  status: string; // e.g., "open", "in_progress", "resolved"
  created_at?: Date; // Timestamp when the report was created
  updated_at?: Date; // Timestamp when the report was last updated
}
