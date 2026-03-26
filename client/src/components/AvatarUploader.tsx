import { useEffect, useMemo, useRef, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Trash2, UploadCloud, User as UserIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { getApiUrl } from "@/lib/queryClient";

type Props = {
  avatarUrl: string | null;
  disabled?: boolean;
  onDone?: () => void;
};

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

async function readApiErrorMessage(res: Response): Promise<string> {
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const payload = await res.json().catch(() => null);
    const message = payload?.message;
    if (typeof message === "string" && message.trim()) return message;
  }
  const text = (await res.text().catch(() => "")) || "";
  return text.trim() || `Erro (HTTP ${res.status})`;
}

function withCacheBust(url: string, cacheBustKey: number): string {
  const u = new URL(url, window.location.origin);
  u.searchParams.set("v", String(cacheBustKey));
  return u.toString();
}

export function AvatarUploader({ avatarUrl, disabled, onDone }: Props) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [cacheBustKey, setCacheBustKey] = useState(0);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const remoteAvatarSrc = useMemo(() => {
    if (!avatarUrl) return null;
    // Ensure it works with VITE_API_URL or same-origin
    const full = getApiUrl(avatarUrl);
    // Cache-bust only when we explicitly refresh (upload/remove)
    return withCacheBust(full, cacheBustKey);
  }, [avatarUrl, cacheBustKey]);

  const displaySrc = previewUrl || remoteAvatarSrc;
  const canSave = !!selectedFile && !!previewUrl && !disabled;
  const canUploadPick = !disabled;
  const canRemove = !!previewUrl || !!avatarUrl;

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch(getApiUrl("/api/profile/avatar"), {
        method: "POST",
        body,
        credentials: "include",
      });

      if (!res.ok) {
        const message = await readApiErrorMessage(res);
        throw new Error(message);
      }

      const json = (await res.json()) as { avatarUrl?: string };
      if (!json?.avatarUrl) {
        throw new Error("Resposta inválida (sem avatarUrl).");
      }
      return json;
    },
    onSuccess: () => {
      setErrorText(null);
      setSelectedFile(null);
      setCacheBustKey((v) => v + 1);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      onDone?.();
      toast({ title: "Foto atualizada", description: "Seu avatar foi salvo com sucesso." });
    },
    onError: (err: any) => {
      const msg = err?.message || "Não foi possível enviar a foto.";
      setErrorText(msg);
      toast({ variant: "destructive", title: "Erro no upload", description: msg });
    },
  });

  const removeMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(getApiUrl("/api/profile/avatar"), {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const message = await readApiErrorMessage(res);
        throw new Error(message);
      }

      const json = (await res.json()) as { avatarUrl?: null };
      return json;
    },
    onSuccess: () => {
      setErrorText(null);
      setSelectedFile(null);
      setCacheBustKey((v) => v + 1);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      onDone?.();
      toast({ title: "Foto removida", description: "Seu avatar foi removido." });
    },
    onError: (err: any) => {
      const msg = err?.message || "Não foi possível remover a foto.";
      setErrorText(msg);
      toast({ variant: "destructive", title: "Erro ao remover", description: msg });
    },
  });

  const isBusy = uploadMutation.isPending || removeMutation.isPending;

  const handlePick = () => {
    setErrorText(null);
    inputRef.current?.click();
  };

  const handleFileChange = (file: File | null) => {
    setErrorText(null);
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      const msg = "Tipo inválido. Use JPEG, PNG ou WebP.";
      setErrorText(msg);
      toast({ variant: "destructive", title: "Arquivo inválido", description: msg });
      setSelectedFile(null);
      return;
    }

    if (file.size > MAX_AVATAR_BYTES) {
      const msg = "Arquivo muito grande. Tamanho máximo: 2MB.";
      setErrorText(msg);
      toast({ variant: "destructive", title: "Arquivo muito grande", description: msg });
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleRemove = () => {
    setErrorText(null);
    // If there's a local preview not saved yet, just clear it.
    if (previewUrl && selectedFile) {
      setSelectedFile(null);
      return;
    }
    if (!avatarUrl || disabled) return;
    removeMutation.mutate();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <Avatar className="h-16 w-16 ring-2 ring-primary/25">
          {displaySrc ? <AvatarImage src={displaySrc} alt="Avatar" /> : null}
          <AvatarFallback className="bg-primary/10 text-primary">
            <UserIcon className="h-7 w-7" />
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <div className="text-sm font-semibold text-foreground">Foto do perfil</div>
          <div className="text-xs text-foreground-secondary">
            JPEG, PNG ou WebP • até 2MB
          </div>
          {errorText ? (
            <div className="mt-2 text-xs text-danger">{errorText}</div>
          ) : null}
        </div>
      </div>

      <input
        id="avatar-upload-input"
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        aria-label="Upload avatar"
        title="Upload avatar"
        disabled={!canUploadPick || isBusy}
        onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)}
      />

      <div className="flex flex-wrap gap-2 sm:ml-auto">
        <Button
          type="button"
          variant="outline"
          onClick={handlePick}
          disabled={!canUploadPick || isBusy}
          className="gap-2"
        >
          {isBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}
          Upload photo
        </Button>

        <Button
          type="button"
          onClick={() => selectedFile && uploadMutation.mutate(selectedFile)}
          disabled={!canSave || isBusy}
          className="gap-2"
        >
          {uploadMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Save
        </Button>

        <Button
          type="button"
          variant="secondary"
          onClick={handleRemove}
          disabled={!canRemove || disabled || isBusy}
          className="gap-2"
        >
          {removeMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          Remove photo
        </Button>
      </div>
    </div>
  );
}

