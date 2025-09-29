import React, { useState, useRef } from 'react';
import { FileRecord } from '../types';
import FileCard from './FileCard';
import { DocumentArrowDownIcon } from './icons';

interface FileListProps {
  files: FileRecord[];
  onUpdateFile: (updatedFile: FileRecord) => void;
  onDeleteFile: (fileId: string) => void;
}

const FileList: React.FC<FileListProps> = ({ files, onUpdateFile, onDeleteFile }) => {
  const [isExportingSummary, setIsExportingSummary] = useState(false);
  const printableSummaryRef = useRef<HTMLDivElement>(null);

  const handleExportSummaryPDF = async () => {
    setIsExportingSummary(true);

    const jsPDF = (window as any)?.jspdf?.jsPDF;
    const html2canvas = (window as any)?.html2canvas;

    if (!printableSummaryRef.current || !jsPDF || !html2canvas) {
      console.error("PDF generation libraries or printable element not found.");
      alert("No se pudieron cargar las dependencias para generar el PDF. Por favor, recargue la página.");
      setIsExportingSummary(false);
      return;
    }

    try {
      const canvas = await html2canvas(printableSummaryRef.current, { scale: 2 });
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
      const widthInPdf = pdfWidth - 20; // 10mm margin on each side
      const heightInPdf = widthInPdf / ratio;

      let heightLeft = heightInPdf;
      let position = 10; // 10mm top margin
      
      pdf.addImage(imgData, 'PNG', 10, position, widthInPdf, heightInPdf);
      heightLeft -= pdfHeight;

      while (heightLeft >= 0) {
        position = heightLeft - heightInPdf;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, widthInPdf, heightInPdf);
        heightLeft -= pdfHeight;
      }
      
      pdf.save('resumen_expedientes.pdf');

    } catch (error) {
      console.error("Error al exportar el resumen en PDF:", error);
      alert("Ocurrió un error al generar el PDF.");
    } finally {
      setIsExportingSummary(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center border-b pb-2 mb-6">
        <h2 className="text-xl font-semibold text-slate-700">Expedientes en Curso</h2>
        <button
          onClick={handleExportSummaryPDF}
          disabled={isExportingSummary || files.length === 0}
          className="flex items-center bg-blue-100 text-blue-800 text-sm font-semibold px-3 py-2 rounded-md hover:bg-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Exportar resumen de todos los expedientes a PDF"
        >
          <DocumentArrowDownIcon className="h-5 w-5 mr-1.5" />
          {isExportingSummary ? 'Exportando...' : 'Exportar Resumen'}
        </button>
      </div>
      
      {files.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-xl shadow-md">
          <p className="text-slate-500">No hay expedientes registrados.</p>
          <p className="text-sm text-slate-400 mt-2">Utilice el formulario para agregar uno nuevo.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {files.map(file => (
            <FileCard 
              key={file.id} 
              file={file} 
              onUpdateFile={onUpdateFile} 
              onDeleteFile={onDeleteFile} 
            />
          ))}
        </div>
      )}
      
      {/* Hidden element for PDF summary rendering */}
      <div className="absolute -left-full">
        <div ref={printableSummaryRef} className="p-10 bg-white text-black" style={{ width: '210mm' }}>
           <h1 className="text-2xl font-bold mb-2">Resumen de Expedientes</h1>
           <p className="text-sm text-gray-600 mb-6">Generado el: {new Date().toLocaleString('es-AR')}</p>
           
           <table className="w-full text-left border-collapse text-base">
              <thead>
                <tr className="bg-slate-700 text-white">
                  <th className="p-3 border border-slate-300">Nombre del Expediente</th>
                  <th className="p-3 border border-slate-300">Fecha de Creación</th>
                  <th className="p-3 border border-slate-300">Estado</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr key={`print-summary-${file.id}`} className={index % 2 !== 0 ? 'bg-slate-100' : 'bg-white'}>
                    <td className="p-2 border border-slate-300">{file.name}</td>
                    <td className="p-2 border border-slate-300">{new Date(file.creationDate).toLocaleDateString('es-AR', { timeZone: 'UTC' })}</td>
                    <td className="p-2 border border-slate-300">{file.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};

export default FileList;