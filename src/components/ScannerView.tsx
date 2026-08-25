import React, { useState, useRef } from "react";
import {
  FileSearch,
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  BookOpen,
  CheckSquare,
  Eye,
  Trash2,
  Sparkles,
  RefreshCw,
  X,
  FileCode,
  Layers,
  TrendingUp,
  DollarSign,
} from "lucide-react";
import { useApp } from "../context/AppContext";
import { ScannedDocument } from "../types";
import { EconomicScannerTab } from "./EconomicScannerTab";

export const ScannerView: React.FC = () => {
  const {
    scannedDocs,
    uploadAndScanDoc,
    convertDocToKnowledge,
    convertDocToTasks,
    updateDocStatus,
    activeRole,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<"ocr" | "finance">("ocr");
  const [isScanning, setIsScanning] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<ScannedDocument | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsScanning(true);
    try {
      const doc = await uploadAndScanDoc(file);
      setNotification(`Documento "${doc.filename}" processado com sucesso!`);
      setSelectedDoc(doc);
    } catch (e: any) {
      setNotification(`Erro ao processar: ${e.message || e}`);
    } finally {
      setIsScanning(false);
      setTimeout(() => setNotification(null), 4000);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  const handleConvertKnowledge = (docId: string) => {
    convertDocToKnowledge(docId);
    setNotification("Documento transformado em artigo no Knowledge Base!");
    if (selectedDoc?.id === docId) {
      setSelectedDoc({ ...selectedDoc, status: "PROCESSED_TO_KNOWLEDGE" });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  const handleConvertTasks = (docId: string) => {
    convertDocToTasks(docId);
    setNotification("Itens de ação extraídos e criados na lista de Tarefas!");
    if (selectedDoc?.id === docId) {
      setSelectedDoc({ ...selectedDoc, status: "PROCESSED_TO_TASK" });
    }
    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#090c14] border border-slate-800 shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <FileSearch className="w-5 h-5 text-emerald-400" />
            <h1 className="text-xl font-bold text-white tracking-wide">Scanner & Inteligência Documental</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
              AI Powered
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            OCR óptico, extração de entidades, DRE económica e conformidade fiscal AGT / BNA.
          </p>
        </div>

        {/* Dual Tab Buttons */}
        <div className="flex items-center p-1 bg-slate-900/90 border border-slate-800 rounded-2xl">
          <button
            onClick={() => setActiveSubTab("ocr")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === "ocr"
                ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>OCR & Documentos</span>
          </button>

          <button
            onClick={() => setActiveSubTab("finance")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-2 ${
              activeSubTab === "finance"
                ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Scanner Económico (DRE)</span>
          </button>
        </div>
      </div>

      {/* Render Subtab */}
      {activeSubTab === "finance" ? (
        <EconomicScannerTab />
      ) : (
        <>
          {notification && (
            <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
              <span>{notification}</span>
              <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white font-bold ml-2">
                ×
              </button>
            </div>
          )}

          {/* Drag & Drop Upload Zone */}
          <div
            onDragEnter={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setDragActive(false);
            }}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 lg:p-10 text-center cursor-pointer transition-all ${
              dragActive
                ? "border-emerald-400 bg-emerald-500/10 scale-[1.01]"
                : "border-slate-800 bg-[#090c14] hover:border-emerald-500/40"
            }`}
          >
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center">
                {isScanning ? (
                  <RefreshCw className="w-6 h-6 animate-spin text-emerald-400" />
                ) : (
                  <UploadCloud className="w-7 h-7" />
                )}
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  {isScanning ? "A processar e a extrair entidades..." : "Arrasta ou clica para carregar ficheiros"}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Suporta relatórios, propostas, briefings, manuais e PDFs (OCR automático com extração estruturada).
                </p>
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx,.md"
            className="hidden"
            onChange={(e) => handleFileUpload(e.target.files)}
          />

          {/* Scanned Documents Grid */}
          <div className="space-y-3">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Documentos Processados ({scannedDocs.length})
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {scannedDocs.map((doc, idx) => (
                <div
                  key={`doc-${doc.id}-${idx}`}
                  onClick={() => setSelectedDoc(doc)}
                  className="bg-[#090c14] border border-slate-800 hover:border-emerald-500/40 rounded-2xl p-5 cursor-pointer group transition-all flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 uppercase">
                        {doc.fileType.toUpperCase()}
                      </span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${
                          doc.status === "APPROVED" || doc.status === "PROCESSED_TO_KNOWLEDGE"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : doc.status === "REVIEW_REQUIRED"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {doc.status.replace(/_/g, " ")}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors truncate">
                      {doc.filename}
                    </h3>

                    <p className="text-xs text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                      {doc.structuredData?.summary || doc.ocrText || "Documento estruturado"}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                    <span>{new Date(doc.uploadDate).toLocaleDateString("pt-PT")}</span>
                    <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspecionar</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Document Detail Drawer Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#090c14] border border-emerald-500/30 rounded-2xl max-w-3xl w-full max-h-[85vh] flex flex-col p-6 shadow-2xl overflow-hidden">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="min-w-0 pr-4">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                  {selectedDoc.fileType.toUpperCase()}
                </span>
                <h2 className="text-base font-bold text-white mt-1 truncate">{selectedDoc.filename}</h2>
              </div>
              <button
                onClick={() => setSelectedDoc(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-xs">
              {/* Executive Summary */}
              {selectedDoc.structuredData && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="font-bold text-emerald-400 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Sumário Executivo & Diagnóstico</span>
                  </h4>
                  <p className="text-slate-200 leading-relaxed">
                    {selectedDoc.structuredData.summary}
                  </p>
                </div>
              )}

              {/* Action items extracted */}
              {selectedDoc.structuredData?.extractedActionItems &&
                selectedDoc.structuredData.extractedActionItems.length > 0 && (
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
                    <h4 className="font-bold text-amber-400 flex items-center space-x-1.5">
                      <CheckSquare className="w-3.5 h-3.5" />
                      <span>Itens de Ação Recomendados</span>
                    </h4>
                    <ul className="space-y-1.5 text-slate-300 list-disc list-inside">
                      {selectedDoc.structuredData.extractedActionItems.map((action, idx) => (
                        <li key={idx}>{action}</li>
                      ))}
                    </ul>
                  </div>
                )}

              {/* Extracted OCR Raw Text */}
              {selectedDoc.ocrText && (
                <div className="space-y-1">
                  <span className="text-slate-400 font-semibold">Texto Extraído (OCR):</span>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-slate-300 font-mono text-[11px] max-h-48 overflow-y-auto leading-relaxed whitespace-pre-wrap">
                    {selectedDoc.ocrText}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <button
                  onClick={() => handleConvertKnowledge(selectedDoc.id)}
                  className="flex-1 sm:flex-initial px-3 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/30 text-indigo-300 rounded-xl font-semibold flex items-center justify-center space-x-1.5 text-xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Converter em Conhecimento</span>
                </button>

                <button
                  onClick={() => handleConvertTasks(selectedDoc.id)}
                  className="flex-1 sm:flex-initial px-3 py-2 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/30 text-amber-300 rounded-xl font-semibold flex items-center justify-center space-x-1.5 text-xs"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Extrair Tarefas</span>
                </button>
              </div>

              <button
                onClick={() => setSelectedDoc(null)}
                className="w-full sm:w-auto px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black font-bold rounded-xl text-xs"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
