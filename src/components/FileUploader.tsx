import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, Image, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface FileUploaderProps {
  onUpload: (file: File) => Promise<void>;
  accept?: string;
  maxSize?: number; // in bytes
  label?: string;
}

interface UploadState {
  file: File | null;
  uploading: boolean;
  progress: number;
  error: string | null;
  success: boolean;
}

export function FileUploader({
  onUpload,
  accept = '.pdf,.doc,.docx,.jpg,.jpeg,.png,.gif',
  maxSize = 5 * 1024 * 1024, // 5MB
  label = 'Drop files here or click to upload',
}: FileUploaderProps) {
  const [state, setState] = useState<UploadState>({
    file: null,
    uploading: false,
    progress: 0,
    error: null,
    success: false,
  });
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.includes('pdf') || type.includes('document')) return FileText;
    return File;
  };

  const validateFile = (file: File): string | null => {
    if (file.size > maxSize) {
      return `File size exceeds ${Math.round(maxSize / (1024 * 1024))}MB limit`;
    }

    const allowedTypes = accept.split(',').map(t => t.trim());
    const ext = '.' + file.name.split('.').pop()?.toLowerCase();

    if (!allowedTypes.includes(ext) && !allowedTypes.includes(file.type)) {
      return `File type not allowed. Accepted: ${accept}`;
    }

    return null;
  };

  const handleFile = useCallback(async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setState(prev => ({ ...prev, error: validationError }));
      return;
    }

    setState({ file, uploading: true, progress: 0, error: null, success: false });

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setState(prev => ({
          ...prev,
          progress: Math.min(prev.progress + 10, 90),
        }));
      }, 100);

      await onUpload(file);

      clearInterval(progressInterval);
      setState({ file, uploading: false, progress: 100, error: null, success: true });

      // Reset after success
      setTimeout(() => {
        setState({ file: null, uploading: false, progress: 0, error: null, success: false });
      }, 3000);
    } catch (err) {
      setState(prev => ({
        ...prev,
        uploading: false,
        error: 'Upload failed. Please try again.',
      }));
    }
  }, [onUpload, maxSize, accept]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setState({ file: null, uploading: false, progress: 0, error: null, success: false });
    if (inputRef.current) inputRef.current.value = '';
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full">
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !state.file && inputRef.current?.click()}
        className={`relative p-8 border-2 border-dashed rounded-2xl transition-all cursor-pointer ${
          isDragging
            ? 'border-cyan-500 bg-cyan-500/10'
            : state.file
            ? 'border-slate-700 bg-slate-800/30'
            : 'border-slate-700 hover:border-cyan-500/50 hover:bg-slate-800/30'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleInputChange}
          className="hidden"
        />

        <AnimatePresence mode="wait">
          {!state.file ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto mb-4">
                <Upload className={`w-8 h-8 ${isDragging ? 'text-cyan-400' : 'text-slate-400'}`} />
              </div>
              <p className="text-slate-300 mb-2">{label}</p>
              <p className="text-xs text-slate-500">
                Max size: {Math.round(maxSize / (1024 * 1024))}MB
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center gap-4"
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center">
                  {state.success ? (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  ) : (
                    (() => {
                      const Icon = getFileIcon(state.file.type);
                      return <Icon className="w-6 h-6 text-cyan-400" />;
                    })()
                  )}
                </div>
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{state.file.name}</p>
                <p className="text-xs text-slate-400">{formatSize(state.file.size)}</p>

                {state.uploading && (
                  <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${state.progress}%` }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
                    />
                  </div>
                )}

                {state.success && (
                  <p className="text-xs text-green-400 mt-1">Upload complete!</p>
                )}
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearFile();
                }}
                className="flex-shrink-0 p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                disabled={state.uploading}
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Error */}
      {state.error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <p className="text-red-400 text-sm">{state.error}</p>
        </motion.div>
      )}
    </div>
  );
}
