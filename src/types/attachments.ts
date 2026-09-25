/** `POST /api/attachments` data (201). The same file again returns the same record (checksum). */
export interface Attachment {
  id: number;
  type: string;
  original_name: string;
  mime_type: string;
  file_size: number;
  download_url: string;
  captured_at: string | null;
  uploaded_at: string;
}
