import React, { useState } from 'react';
import { FileRecord } from '../types';
import { PlusIcon } from './icons';

interface FileFormProps {
  onAddFile: (newFile: Omit<FileRecord, 'id' | 'status' | 'trackingHistory'>) => void;
}

const FileForm: React.FC<FileFormProps> = ({ onAddFile }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [creationDate, setCreationDate] = useState(new Date().toISOString().split('T')[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && creationDate.trim() && description.trim()) {
      onAddFile({ name, description, creationDate });
      setName('');
      setDescription('');
      setCreationDate(new Date().toISOString().split('T')[0]);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg sticky top-8">
      <h2 className="text-lg font-semibold text-slate-700 mb-4">Registrar nuevo expediente o nota</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="expediente-name" className="block text-sm font-medium text-slate-600 mb-1">
            Número de nota o expediente
          </label>
          <input
            id="expediente-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Ej: Exp. 2024-12345-NQN"
            required
          />
        </div>
        <div>
          <label htmlFor="expediente-description" className="block text-sm font-medium text-slate-600 mb-1">
            Descripción de nota o expediente
          </label>
          <textarea
            id="expediente-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Ingrese una breve descripción..."
            required
          />
        </div>
        <div>
          <label htmlFor="creation-date" className="block text-sm font-medium text-slate-600 mb-1">
            Fecha de Generación
          </label>
          <input
            id="creation-date"
            type="date"
            value={creationDate}
            onChange={(e) => setCreationDate(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 transition"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full flex items-center justify-center bg-sky-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Agregar Expediente
        </button>
      </form>
    </div>
  );
};

export default FileForm;
