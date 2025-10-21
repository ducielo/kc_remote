import React, { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  UploadCloud, 
  FileImage, 
  Loader2, 
  Check, 
  X, 
  Eye, 
  Trash2,
  Download,
  Image as ImageIcon,
  File,
  AlertCircle
} from 'lucide-react';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { toast } from 'sonner';

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: Date;
  status: 'uploading' | 'completed' | 'error';
  progress?: number;
}

interface FileUploadProps {
  acceptedTypes?: string[];
  maxFileSize?: number; // in bytes
  maxFiles?: number;
  files: UploadedFile[];
  onFilesChange: (files: UploadedFile[]) => void;
  onUpload?: (files: File[]) => Promise<void>;
  className?: string;
  disabled?: boolean;
  showPreview?: boolean;
  allowMultiple?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  acceptedTypes = ['image/*'],
  maxFileSize = 5 * 1024 * 1024, // 5MB
  maxFiles = 10,
  files,
  onFilesChange,
  onUpload,
  className = '',
  disabled = false,
  showPreview = true,
  allowMultiple = true
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const validateFile = (file: File): string | null => {
    // Check file type
    const isValidType = acceptedTypes.some(type => {
      if (type.endsWith('/*')) {
        return file.type.startsWith(type.slice(0, -1));
      }
      return file.type === type;
    });

    if (!isValidType) {
      return `Type de fichier non supporté. Types acceptés: ${acceptedTypes.join(', ')}`;
    }

    // Check file size
    if (file.size > maxFileSize) {
      return `Fichier trop volumineux. Taille maximale: ${formatFileSize(maxFileSize)}`;
    }

    // Check max files limit
    if (files.length >= maxFiles) {
      return `Nombre maximum de fichiers atteint (${maxFiles})`;
    }

    return null;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, [disabled]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled) return;

    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  }, [disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = async (fileList: File[]) => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileList.forEach(file => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    // Show validation errors
    errors.forEach(error => toast.error(error));

    if (validFiles.length === 0) return;

    setIsUploading(true);

    try {
      // Create file objects with uploading status
      const newFiles: UploadedFile[] = validFiles.map(file => ({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
        size: file.size,
        uploadedAt: new Date(),
        status: 'uploading',
        progress: 0
      }));

      // Add files to state immediately with uploading status
      onFilesChange([...files, ...newFiles]);

      // Simulate upload process with progress
      for (let i = 0; i < newFiles.length; i++) {
        const fileToUpdate = newFiles[i];
        
        // API: uploadFile()
        // Simulate upload progress
        for (let progress = 0; progress <= 100; progress += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          
          onFilesChange(prev => 
            prev.map(f => 
              f.id === fileToUpdate.id 
                ? { ...f, progress } 
                : f
            )
          );
        }

        // Mark as completed
        onFilesChange(prev => 
          prev.map(f => 
            f.id === fileToUpdate.id 
              ? { ...f, status: 'completed', progress: 100 } 
              : f
          )
        );

        toast.success(`${validFiles[i].name} uploadé avec succès`);
      }

      // Call custom upload handler if provided
      if (onUpload) {
        await onUpload(validFiles);
      }

    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Erreur lors de l\'upload');
      
      // Mark failed uploads
      onFilesChange(prev => 
        prev.map(f => 
          newFiles.some(nf => nf.id === f.id) 
            ? { ...f, status: 'error' } 
            : f
        )
      );
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.url);
      onFilesChange(files.filter(f => f.id !== fileId));
      toast.success('Fichier supprimé');
    }
  };

  const downloadFile = (file: UploadedFile) => {
    const link = document.createElement('a');
    link.href = file.url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'completed':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : dragActive
            ? 'border-red-400 bg-red-50'
            : 'border-gray-300 hover:border-gray-400 cursor-pointer'
        }`}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={allowMultiple}
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
          disabled={disabled}
        />
        
        <div className="space-y-4">
          <UploadCloud className={`w-12 h-12 mx-auto ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
          <div>
            <p className={`text-lg font-medium ${disabled ? 'text-gray-400' : 'text-gray-900'}`}>
              {dragActive ? 'Déposez vos fichiers ici' : 'Glissez-déposez vos fichiers ici'}
            </p>
            <p className={`text-sm mt-2 ${disabled ? 'text-gray-300' : 'text-gray-500'}`}>
              ou cliquez pour sélectionner des fichiers
            </p>
          </div>
          {!disabled && (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-4"
              style={{ backgroundColor: 'rgba(192, 54, 24, 0.9)' }}
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Upload en cours...
                </>
              ) : (
                <>
                  <FileImage className="w-4 h-4 mr-2" />
                  Choisir des fichiers
                </>
              )}
            </Button>
          )}
          <p className={`text-xs ${disabled ? 'text-gray-300' : 'text-gray-400'}`}>
            Formats acceptés: {acceptedTypes.join(', ')} (max {formatFileSize(maxFileSize)})
          </p>
        </div>
      </div>

      {/* Files List */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900">
              Fichiers ({files.length}/{maxFiles})
            </h3>
            {files.filter(f => f.status === 'completed').length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFilesChange([])}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Tout supprimer
              </Button>
            )}
          </div>

          <div className="grid gap-3">
            <AnimatePresence>
              {files.map((file) => (
                <motion.div
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      {file.type.startsWith('image/') && showPreview ? (
                        <img
                          src={file.url}
                          alt={file.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gray-200 rounded flex items-center justify-center">
                          {getFileIcon(file.type)}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.name}
                        </p>
                        {getStatusIcon(file.status)}
                      </div>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)}
                        </p>
                        <Badge 
                          variant={
                            file.status === 'completed' ? 'default' :
                            file.status === 'error' ? 'destructive' : 'secondary'
                          }
                          className="text-xs"
                        >
                          {file.status === 'uploading' ? 'Upload...' :
                           file.status === 'completed' ? 'Complété' : 'Erreur'}
                        </Badge>
                      </div>
                      
                      {file.status === 'uploading' && file.progress !== undefined && (
                        <Progress value={file.progress} className="mt-2 h-1" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 ml-3">
                    {file.status === 'completed' && (
                      <>
                        {file.type.startsWith('image/') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(file.url, '_blank')}
                            className="p-1 h-auto"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => downloadFile(file)}
                          className="p-1 h-auto"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="p-1 h-auto text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};