
import React, { useState, useEffect, useCallback } from 'react';
import { FileRecord, FileStatus } from './types';
import FileForm from './components/FileForm';
import FileList from './components/FileList';
import { LogoIcon } from './components/icons';

const App: React.FC = () => {
  const [files, setFiles] = useState<FileRecord[]>(() => {
    try {
      const savedFiles = localStorage.getItem('files');
      return savedFiles ? JSON.parse(savedFiles) : [];
    } catch (error) {
      console.error("Error reading from localStorage", error);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('files', JSON.stringify(files));
    } catch (error) {
      console.error("Error writing to localStorage", error);
    }
  }, [files]);

  const handleAddFile = useCallback((newFile: Omit<FileRecord, 'id' | 'status' | 'trackingHistory'>) => {
    const fileToAdd: FileRecord = {
      ...newFile,
      id: new Date().toISOString(),
      status: FileStatus.InProgress,
      trackingHistory: [{
        id: new Date().toISOString() + '-initial',
        date: new Date().toLocaleString('es-AR'),
        note: 'Expediente creado.'
      }],
    };
    setFiles(prevFiles => [fileToAdd, ...prevFiles]);
  }, []);

  const handleUpdateFile = useCallback((updatedFile: FileRecord) => {
    setFiles(prevFiles => 
      prevFiles.map(file => (file.id === updatedFile.id ? updatedFile : file))
    );
  }, []);

  const handleDeleteFile = useCallback((fileId: string) => {
    if(window.confirm('¿Está seguro de que desea eliminar este expediente? Esta acción no se puede deshacer.')) {
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <LogoIcon className="h-10 w-10 text-sky-600" />
            <div>
              <h1 className="text-xl font-bold text-slate-800">Seguimiento de Expedientes</h1>
              <p className="text-sm text-slate-500">Programa N° 77 "Red de Leche Humana de la Provincia del Neuquén"</p>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <FileForm onAddFile={handleAddFile} />
          </div>
          <div className="lg:col-span-2">
            <FileList files={files} onUpdateFile={handleUpdateFile} onDeleteFile={handleDeleteFile} />
          </div>
        </div>
      </main>

      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>&copy; {new Date().getFullYear()} - Provincia del Neuquén. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default App;
