
import React, { useState, useRef } from 'react';
import { FileRecord, FileStatus, TrackingUpdate } from '../types';
import StatusBadge from './StatusBadge';
import { DocumentTextIcon, PencilIcon, TrashIcon, CheckCircleIcon, ArrowUturnLeftIcon, DocumentArrowDownIcon } from './icons';

interface FileCardProps {
  file: FileRecord;
  onUpdateFile: (updatedFile: FileRecord) => void;
  onDeleteFile: (fileId: string) => void;
}

const FileCard: React.FC<FileCardProps> = ({ file, onUpdateFile, onDeleteFile }) => {
  const [newNote, setNewNote] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const printableRef = useRef<HTMLDivElement>(null);

  const handleAddNote = () => {
    if (newNote.trim() === '') return;
    const newUpdate: TrackingUpdate = {
      id: new Date().toISOString(),
      date: new Date().toLocaleString('es-AR'),
      note: newNote,
    };
    onUpdateFile({
      ...file,
      trackingHistory: [newUpdate, ...file.trackingHistory],
    });
    setNewNote('');
  };

  const handleToggleStatus = () => {
    const newStatus = file.status === FileStatus.InProgress ? FileStatus.Resolved : FileStatus.InProgress;
    const noteText = newStatus === FileStatus.Resolved ? 'Expediente marcado como resuelto.' : 'Expediente reabierto.';
    const statusUpdate: TrackingUpdate = {
      id: new Date().toISOString(),
      date: new Date().toLocaleString('es-AR'),
      note: noteText,
    };
    onUpdateFile({
      ...file,
      status: newStatus,
      trackingHistory: [statusUpdate, ...file.trackingHistory]
    });
  };
  
  const handleExportPDF = async () => {
    setIsExporting(true);
    // Use global jsPDF and html2canvas from CDN
    const { jsPDF } = (window as any).jspdf;
    const html2canvas = (window as any).html2canvas;

    if (!printableRef.current || !jsPDF || !html2canvas) {
      console.error("PDF generation libraries not found.");
      setIsExporting(false);
      return;
    }
    
    const canvas = await html2canvas(printableRef.current, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4'
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;
    const ratio = imgWidth / imgHeight;
    const widthInPdf = pdfWidth - 20;
    const heightInPdf = widthInPdf / ratio;

    let heightLeft = heightInPdf;
    let position = 10;
    
    pdf.addImage(imgData, 'PNG', 10, position, widthInPdf, heightInPdf);
    heightLeft -= pdfHeight;

    while (heightLeft >= 0) {
      position = heightLeft - heightInPdf;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 10, position, widthInPdf, heightInPdf);
      heightLeft -= pdfHeight;
    }

    pdf.save(`expediente-${file.name.replace(/\s+/g, '_')}.pdf`);
    setIsExporting(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-shadow duration-300 hover:shadow-xl">
        {/* Card Header */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-sky-800">{file.name}</h3>
            <p className="text-sm text-slate-500 mt-1">
              Creado el: {new Date(file.creationDate).toLocaleDateString('es-AR', { timeZone: 'UTC' })}
            </p>
          </div>
          <div className="mt-3 sm:mt-0">
            <StatusBadge status={file.status} />
          </div>
        </div>

        {/* Tracking History */}
        <div className="p-5">
          <h4 className="font-semibold text-slate-600 mb-3 flex items-center">
            <DocumentTextIcon className="h-5 w-5 mr-2 text-slate-400"/>
            Historial de Seguimiento
          </h4>
          <div className="max-h-60 overflow-y-auto space-y-3 pr-2 border-l-2 border-slate-200 ml-2">
            {file.trackingHistory.map((update, index) => (
              <div key={update.id} className="relative pl-6">
                <div className="absolute left-[-9px] top-1 h-4 w-4 bg-white border-2 border-sky-500 rounded-full"></div>
                {index !== file.trackingHistory.length -1 && <div className="absolute left-[-1px] top-4 h-full w-0.5 bg-slate-200"></div>}
                <p className="text-xs text-slate-400">{update.date}</p>
                <p className="text-sm text-slate-700">{update.note}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Add Note Form */}
        {file.status === FileStatus.InProgress && (
          <div className="p-5 border-t border-slate-200">
             <h4 className="font-semibold text-slate-600 mb-3 flex items-center">
                <PencilIcon className="h-5 w-5 mr-2 text-slate-400"/>
                Agregar Seguimiento
            </h4>
            <div className="flex items-start space-x-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:ring-sky-500 focus:border-sky-500 transition text-sm"
                placeholder="Describa el estado, con quién habló, acciones a realizar, oficina actual, etc."
              />
              <button
                onClick={handleAddNote}
                className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-md hover:bg-slate-800 transition-colors duration-200 text-sm whitespace-nowrap"
              >
                Agregar
              </button>
            </div>
          </div>
        )}

        {/* Card Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap gap-2 justify-end">
          <button onClick={handleExportPDF} disabled={isExporting} className="flex items-center bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-2 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50">
            <DocumentArrowDownIcon className="h-5 w-5 mr-1.5"/>
            {isExporting ? 'Exportando...' : 'Exportar PDF'}
          </button>
          
          <button onClick={handleToggleStatus} className={`flex items-center text-sm font-semibold px-3 py-2 rounded-md transition-colors ${file.status === FileStatus.InProgress ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'}`}>
            {file.status === FileStatus.InProgress ? 
              <><CheckCircleIcon className="h-5 w-5 mr-1.5"/> Marcar como Resuelto</> : 
              <><ArrowUturnLeftIcon className="h-5 w-5 mr-1.5"/> Reabrir Expediente</>
            }
          </button>
          
          <button onClick={() => onDeleteFile(file.id)} className="flex items-center bg-red-100 text-red-800 text-sm font-semibold px-3 py-2 rounded-md hover:bg-red-200 transition-colors">
            <TrashIcon className="h-5 w-5 mr-1.5"/>
            Eliminar
          </button>
        </div>
      </div>
      {/* Hidden element for PDF rendering */}
      <div className="absolute -left-full">
        <div ref={printableRef} className="p-10 bg-white text-black" style={{ width: '210mm' }}>
           <h1 className="text-2xl font-bold mb-2">Informe de Expediente</h1>
           <p className="text-sm text-gray-600 mb-6">Programa N° 77 "Red de Leche Humana de la Provincia del Neuquén"</p>
           
           <div className="mb-6 p-4 border rounded">
              <p><strong className="font-semibold">Nombre:</strong> {file.name}</p>
              <p><strong className="font-semibold">Fecha de Creación:</strong> {new Date(file.creationDate).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</p>
              <p><strong className="font-semibold">Estado Actual:</strong> {file.status}</p>
           </div>
           
           <h2 className="text-xl font-semibold mb-4 border-b pb-2">Historial de Seguimiento</h2>
           <div className="space-y-4">
             {file.trackingHistory.map(update => (
               <div key={`print-${update.id}`} className="pb-2 border-b border-dashed">
                 <p className="text-sm text-gray-500 mb-1">{update.date}</p>
                 <p className="text-base">{update.note}</p>
               </div>
             ))}
           </div>
        </div>
      </div>
    </>
  );
};

export default FileCard;
