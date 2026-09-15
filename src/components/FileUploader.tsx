import React, { useRef, useState } from 'react';
import { Upload, Download, Trash2, File, FileArchive, FileText, Image, Code } from 'lucide-react';
import { FileAttachment } from '../types';
import { useTracker } from '../context/TrackerContext';

interface FileUploaderProps {
  entityType?: 'Requirement' | 'Module' | 'CustomizationRequest';
  entityId?: string;
  attachments?: FileAttachment[];
  onUploadSuccess?: (attachment: FileAttachment) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  entityType,
  entityId,
  attachments = [],
  onUploadSuccess
}) => {
  const { uploadFile } = useTracker();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const getFileIcon = (mimeType: string, filename: string) => {
    if (filename.endsWith('.zip') || filename.endsWith('.tar.gz')) return <FileArchive className="w-4 h-4 text-purple-400" />;
    if (mimeType.includes('pdf') || filename.endsWith('.pdf')) return <FileText className="w-4 h-4 text-rose-400" />;
    if (mimeType.includes('image')) return <Image className="w-4 h-4 text-amber-400" />;
    if (filename.endsWith('.py') || filename.endsWith('.js') || filename.endsWith('.json')) return <Code className="w-4 h-4 text-emerald-400" />;
    return <File className="w-4 h-4 text-slate-400" />;
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (let i = 0; i < files.length; i++) {
      const attachment = await uploadFile(files[i], entityType, entityId);
      if (attachment && onUploadSuccess) {
        onUploadSuccess(attachment);
      }
    }
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-3">
      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={e => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={e => {
          e.preventDefault();
          setDragOver(false);
          handleFiles(e.dataTransfer.files);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all ${
          dragOver
            ? 'border-indigo-500 bg-indigo-500/10'
            : 'border-slate-700/80 bg-slate-900/40 hover:border-slate-600 hover:bg-slate-800/40'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={e => handleFiles(e.target.files)}
          multiple
          className="hidden"
        />
        <div className="flex flex-col items-center justify-center gap-1.5 text-xs text-slate-400">
          <Upload className={`w-5 h-5 ${uploading ? 'animate-bounce text-indigo-400' : 'text-slate-400'}`} />
          <p className="font-medium text-slate-300">
            {uploading ? 'Uploading attachment...' : 'Click or drag files here (Module ZIP, specs, PDFs)'}
          </p>
          <span className="text-[10px] text-slate-500">Supports .zip, .pdf, code files up to 50MB</span>
        </div>
      </div>

      {/* Attachment List with Download Button */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-slate-400 tracking-wide uppercase">Attached Files & Packages ({attachments.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {attachments.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 hover:border-slate-600 transition-all"
              >
                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                  <div className="p-1.5 rounded-lg bg-slate-900 border border-slate-700/50">
                    {getFileIcon(file.mimeType, file.name)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-200 truncate">{file.name}</p>
                    <p className="text-[10px] text-slate-400">{formatSize(file.size)}</p>
                  </div>
                </div>

                <a
                  href={file.url}
                  download={file.name}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/20 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-600/40 text-[11px] font-semibold transition-colors shrink-0"
                >
                  <Download className="w-3 h-3" />
                  <span>Download</span>
                </a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
