
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FileUploadSectionProps {
  file: File | null;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUploadSection: React.FC<FileUploadSectionProps> = ({
  file,
  onFileChange,
}) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="file">Arquivo</Label>
      <div className="flex items-center gap-4">
        <Input
          id="file"
          type="file"
          onChange={onFileChange}
          required
          className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-escutaris-green-light file:text-escutaris-green hover:file:bg-escutaris-green-light/80"
        />
        {file && (
          <p className="text-sm text-muted-foreground">
            {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
          </p>
        )}
      </div>
    </div>
  );
};

export default FileUploadSection;
