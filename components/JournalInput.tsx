import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileText, X, Loader2, Sparkles, Image as ImageIcon, Plus } from 'lucide-react';
import { analyzePortfolioEntry } from '../services/geminiService';
import { JournalEntry } from '../types';

interface JournalInputProps {
  onNewEntry: (entry: JournalEntry) => void;
}

const JournalInput: React.FC<JournalInputProps> = ({ onNewEntry }) => {
  const [text, setText] = useState('');
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle file input change
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(Array.from(files));
    }
  };

  // Handle paste events
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (isAnalyzing) return;
      
      const items = e.clipboardData?.items;
      if (!items) return;

      const newFiles: File[] = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) newFiles.push(file);
        }
      }

      if (newFiles.length > 0) {
        e.preventDefault();
        processFiles(newFiles);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [isAnalyzing]);

  const processFiles = (newFiles: File[]) => {
    setImages(prev => [...prev, ...newFiles]);
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async () => {
    if (!text && images.length === 0) {
      setError("Please add some notes or upload portfolio screenshots.");
      return;
    }
    
    if(!process.env.API_KEY) {
        setError("System Error: API Key is missing. Please check configuration.");
        return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert all images to base64 strings
      const base64Promises = images.map(img => 
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(img);
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = (error) => reject(error);
        })
      );

      const base64Images = await Promise.all(base64Promises);

      const result = await analyzePortfolioEntry(text, base64Images);
      
      // Complete the entry object
      const newEntry: JournalEntry = {
        ...result as JournalEntry,
        rawInput: text,
        imageUrl: imagePreviews[0] || undefined, // Backward compatibility
        imageUrls: imagePreviews // New field for multiple images
      };

      onNewEntry(newEntry);
      
      // Reset form
      setText('');
      setImages([]);
      setImagePreviews([]);
    } catch (err) {
        console.error(err);
      setError("Failed to analyze portfolio. Please try again. " + (err as Error).message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8" ref={containerRef}>
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-emerald-500/10 rounded-md">
                        <Sparkles className="text-emerald-400" size={18} />
                    </div>
                    <h2 className="text-xl font-semibold text-white">New Entry</h2>
                </div>
                <div className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded border border-slate-700">
                    Ctrl+V to paste
                </div>
            </div>

          {/* Text Input */}
          <div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Jot down your thoughts, strategy changes, or specific context for this month..."
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent h-32 resize-none transition-all mb-4"
            />
          </div>

          {/* Image Preview Grid */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-3 gap-4 mb-4">
                {imagePreviews.map((src, idx) => (
                    <div key={idx} className="relative group rounded-lg overflow-hidden border border-slate-700 bg-slate-950 aspect-video">
                        <img src={src} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                        <button 
                            onClick={() => removeImage(idx)}
                            className="absolute top-2 right-2 p-1.5 bg-slate-900/90 text-slate-300 rounded-full hover:bg-red-500/20 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}
                {/* Small add button in grid */}
                 <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-lg bg-slate-800/30 hover:bg-slate-800 hover:border-emerald-500/40 cursor-pointer transition-all aspect-video"
                >
                    <Plus size={24} className="text-slate-500" />
                    <span className="text-xs text-slate-500 mt-1">Add More</span>
                 </div>
            </div>
          )}

          {/* Initial Image Upload Zone (if no images) */}
          {imagePreviews.length === 0 && (
            <div 
                className="relative border-2 border-dashed border-slate-700 rounded-xl hover:border-emerald-500/50 hover:bg-slate-800/50 cursor-pointer transition-all duration-200 flex flex-col items-center justify-center min-h-[120px]"
                onClick={() => fileInputRef.current?.click()}
            >
                <div className="text-center p-6">
                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-400">
                        <ImageIcon size={20} />
                    </div>
                    <p className="text-slate-300 font-medium text-sm">Click to upload or Paste screenshots</p>
                    <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG</p>
                </div>
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            multiple
            onChange={handleImageUpload} 
          />

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Action Bar */}
          <div className="flex justify-end items-center pt-2">
            <button
              onClick={handleSubmit}
              disabled={isAnalyzing || (!text && images.length === 0)}
              className={`
                flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all
                ${isAnalyzing || (!text && images.length === 0)
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/20'
                }
              `}
            >
              {isAnalyzing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Analyzing Portfolio...
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Analyze & Record
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JournalInput;