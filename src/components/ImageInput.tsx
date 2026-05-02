import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Upload, X, Link2, RefreshCw } from "lucide-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
  bucket?: string;
  className?: string;
  placeholder?: string;
}

// Reusable image input — paste URL OR upload file to Supabase Storage 'images' bucket.
export function ImageInput({ value, onChange, bucket = "images", className = "", placeholder = "Paste URL or upload" }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function upload(file: File) {
    setUploading(true);
    setError(null);
    try {
      if (file.size > 8 * 1024 * 1024) {
        throw new Error("File too large (max 8MB)");
      }
      const ext = (file.name.split(".").pop() || "png").toLowerCase();
      const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage.from(bucket).upload(path, file, {
        upsert: false,
        contentType: file.type || undefined,
      });
      if (upErr) throw upErr;
      const { data } = supabase.storage.from(bucket).getPublicUrl(path);
      onChange(data.publicUrl);
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    }
    setUploading(false);
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
          <input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-sm focus:border-white/40 outline-none transition-colors placeholder:text-white/20"
          />
        </div>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-1.5 rounded-xl bg-white/10 border border-white/10 px-3 py-2.5 text-xs hover:bg-white/15 transition-colors disabled:opacity-50 shrink-0"
        >
          {uploading ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
          {uploading ? "Uploading..." : "Upload"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
            e.target.value = "";
          }}
        />
      </div>
      {error && <p className="text-[11px] text-red-400">{error}</p>}
      {value && (
        <div className="flex items-center gap-2">
          <img
            src={value}
            alt=""
            className="h-12 w-12 rounded-lg object-cover border border-white/10"
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <span className="text-[10px] text-white/30 truncate flex-1">{value}</span>
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-white/30 hover:text-white/60 transition-colors"
            aria-label="Remove image"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
