
import React from 'react';
import { FileRecord } from '../types';
import FileCard from './FileCard';

interface FileListProps {
  files: FileRecord[];
  onUpdateFile: (updatedFile: FileRecord) => void;
  onDeleteFile: (fileId: string) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onUpdateFile, onDeleteFile }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-slate-700 border-b pb-2">Expedientes en Curso</h2>
      {files.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-md">
          <p className="text-slate-500">No hay expedientes registrados.</p>
          <p className="text-sm text-slate-400 mt-2">Utilice el formulario para agregar uno nuevo.</p>
        </div>
      ) : (
        files.map(file => (
          <FileCard 
            key={file.id} 
            file={file} 
            onUpdateFile={onUpdateFile} 
            onDeleteFile={onDeleteFile} 
          />
        ))
      )}
    </div>
  );
};

export default FileList;
