import { useState, useCallback } from "react";
import { Upload, Link as LinkIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ImageUploaderProps {
  onImageSelect: (imageUrl: string) => void;
  isLoading?: boolean;
}

export const ImageUploader = ({ onImageSelect, isLoading }: ImageUploaderProps) => {
  const [imageUrl, setImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image size should be less than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setPreviewUrl(result);
      onImageSelect(result);
    };
    reader.readAsDataURL(file);
  }, [onImageSelect]);

  const handleUrlSubmit = useCallback(() => {
    if (!imageUrl.trim()) {
      toast.error("Please enter an image URL");
      return;
    }

    try {
      new URL(imageUrl);
      setPreviewUrl(imageUrl);
      onImageSelect(imageUrl);
      setShowUrlInput(false);
    } catch {
      toast.error("Please enter a valid URL");
    }
  }, [imageUrl, onImageSelect]);

  const clearImage = () => {
    setPreviewUrl(null);
    setImageUrl("");
  };

  return (
  <div className="w-full max-w-3xl mx-auto">
      {!previewUrl ? (
        <div className="space-y-4">
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              disabled={isLoading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer transition-all hover:border-primary hover:bg-accent/40 disabled:cursor-not-allowed disabled:opacity-50"
              style={{
                borderColor: "hsl(var(--border))",
                background: "hsl(var(--accent) / 0.15)"
              }}
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
                <p className="mb-2 text-sm font-medium">
                  <span className="text-primary">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WEBP up to 10MB
                </p>
              </div>
            </label>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-muted-foreground" style={{background: "hsl(var(--accent) / 0.15)"}}>Or</span>
            </div>
          </div>

          {showUrlInput ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleUrlSubmit()}
                  disabled={isLoading}
                />
                <Button onClick={handleUrlSubmit} disabled={isLoading}>
                  Load
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUrlInput(false)}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowUrlInput(true)}
              disabled={isLoading}
              className="w-full"
            >
              <LinkIcon className="w-4 h-4 mr-2" />
              Use Image URL
            </Button>
          )}
        </div>
      ) : (
        <div className="relative">
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className="w-full h-64 object-contain rounded-lg border"
            style={{
              borderColor: "hsl(var(--border))",
              background: "hsl(var(--accent) / 0.15)"
            }}
          />
          <Button
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearImage}
            disabled={isLoading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
