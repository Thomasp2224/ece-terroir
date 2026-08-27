'use client';

import React, { useRef } from 'react';
import { Upload, Link as LinkIcon, Image as ImageIcon, Check } from 'lucide-react';

interface ImageUploaderProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  presetSuggestions?: { label: string; url: string }[];
}

export default function ImageUploader({
  label,
  value,
  onChange,
  presetSuggestions = [],
}: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size limit (max ~5MB for localStorage friendliness)
    if (file.size > 6 * 1024 * 1024) {
      alert('Veuillez choisir une image de moins de 6 Mo.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onChange(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <label className="block font-bold text-[#78716C] text-xs mb-1">{label} :</label>
      
      {/* Current Preview */}
      <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-[#D4AF37]/50 bg-[#F6F1EA] group h-36 w-full flex items-center justify-center">
        {value ? (
          <>
            <img
              src={value}
              alt="Aperçu"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 rounded-xl bg-[#58111A] text-[#FDFBF7] text-xs font-bold shadow-lg hover:bg-[#722F37] flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Changer la photo</span>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center p-4 space-y-1 text-[#78716C]">
            <ImageIcon className="w-8 h-8 mx-auto text-[#D4AF37]" />
            <p className="text-xs font-semibold">Aucune image sélectionnée</p>
          </div>
        )}
      </div>

      {/* Upload and URL controls */}
      <div className="flex flex-col sm:flex-row items-center gap-2">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="w-full sm:w-auto px-3.5 py-2 rounded-xl bg-[#1B3B2B] text-[#FDFBF7] hover:bg-[#264E3A] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm"
        >
          <Upload className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Importer depuis mon PC</span>
        </button>

        <div className="relative w-full flex-1">
          <LinkIcon className="w-3.5 h-3.5 text-[#78716C] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="url"
            placeholder="Ou coller un lien d'image web (https://...)"
            value={value.startsWith('data:') ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-[#F6F1EA] border border-[#EAE2D8] focus:outline-none focus:border-[#58111A]"
          />
        </div>
      </div>

      {/* Suggested presets if available */}
      {presetSuggestions.length > 0 && (
        <div className="pt-1">
          <span className="text-[10px] text-[#78716C] font-semibold block mb-1">Suggestions de visuels terroir :</span>
          <div className="flex flex-wrap gap-1.5">
            {presetSuggestions.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onChange(preset.url)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold border transition-all flex items-center gap-1 ${
                  value === preset.url
                    ? 'bg-[#58111A] text-[#D4AF37] border-[#D4AF37]'
                    : 'bg-[#FFFFFF] text-[#58111A] border-[#EAE2D8] hover:bg-[#F6F1EA]'
                }`}
              >
                {value === preset.url && <Check className="w-2.5 h-2.5" />}
                <span>{preset.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
