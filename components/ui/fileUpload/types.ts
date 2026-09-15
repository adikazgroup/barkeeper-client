export interface CustomFile {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  uploaded: boolean;
  uploadProgress: number;
  error: string | null;
  isServerFile: boolean;
  file?: File;
}

export interface FileUploadChangeEvent {
  target: {
    value: CustomFile[];
  };
}
