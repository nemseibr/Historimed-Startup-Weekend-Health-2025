"use client";

import { useState, useRef, useEffect } from "react";
import { storage, db } from "@/lib/firebase";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  listAll,
  getMetadata,
} from "firebase/storage";
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { StoredFile } from "@/lib/types";
import {
  FileUp,
  Trash2,
  MoreVertical,
  Download,
  Loader2,
  FileX,
  Maximize,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Image from "next/image";

// Hardcoded user for demo purposes
const DEMO_USER_ID = "demo-user";

export default function DrivePage() {
  const { toast } = useToast();
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileToDelete, setFileToDelete] = useState<StoredFile | null>(null);
  const [mounted, setMounted] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setMounted(true);
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      console.log("🔍 Buscando arquivos no Firebase Storage...");

      // Referência para a pasta do usuário no Storage
      const listRef = ref(storage, `users/${DEMO_USER_ID}/files`);

      // Lista todos os arquivos
      const res = await listAll(listRef);

      console.log(`📦 ${res.items.length} arquivo(s) encontrado(s) no Storage`);

      // Array para armazenar as promises de cada arquivo
      const filePromises = res.items.map(async (itemRef) => {
        try {
          // Obtém a URL de download
          const url = await getDownloadURL(itemRef);

          // Obtém os metadados
          const metadata = await getMetadata(itemRef);

          // Extrai o nome sem o timestamp
          const fileName = itemRef.name.replace(/^\d+_/, "");

          return {
            id: itemRef.name, // Usa o nome completo como ID
            name: fileName,
            url: url,
            type: metadata.contentType || "application/octet-stream",
            size: Number(metadata.size) || 0,
            createdAt: metadata.timeCreated
              ? new Date(metadata.timeCreated)
              : new Date(),
          } as StoredFile;
        } catch (error) {
          console.error(`❌ Erro ao processar ${itemRef.name}:`, error);
          return null;
        }
      });

      // Aguarda todas as promises e filtra nulos
      const filesData = (await Promise.all(filePromises)).filter(
        (file): file is StoredFile => file !== null
      );

      // Ordena por data de criação (mais recente primeiro)
      filesData.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

      setFiles(filesData);

      console.log(
        `✅ ${filesData.length} arquivo(s) carregado(s) para exibição`
      );
    } catch (error) {
      console.error("❌ Erro ao buscar arquivos:", error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar arquivos",
        description: "Não foi possível carregar seus arquivos.",
      });
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleUpload(file);
    }
  };

  const handleUpload = (file: File) => {
    setUploading(true);
    setUploadProgress(0);

    const storageRef = ref(
      storage,
      `users/${DEMO_USER_ID}/files/${Date.now()}_${file.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed", error);
        toast({
          variant: "destructive",
          title: "Falha no upload",
          description: "Ocorreu um erro ao enviar seu arquivo.",
        });
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

        await addDoc(collection(db, "files"), {
          name: file.name,
          url: downloadURL,
          type: file.type,
          size: file.size,
          createdAt: new Date(),
        });

        toast({
          title: "Upload concluído",
          description: `${file.name} foi enviado com sucesso.`,
        });
        setUploading(false);
        fetchFiles();
      }
    );
  };

  const handleDelete = async () => {
    if (!fileToDelete) return;

    try {
      await deleteDoc(doc(db, "files", fileToDelete.id));

      toast({
        title: "Arquivo deletado",
        description: `${fileToDelete.name} foi removido.`,
      });
      fetchFiles();
    } catch (error) {
      console.error("Error deleting file:", error);
      toast({
        variant: "destructive",
        title: "Erro ao deletar",
        description: "Não foi possível remover o arquivo.",
      });
    } finally {
      setFileToDelete(null);
    }
  };

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
  };

  if (!mounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Seus Arquivos</h1>
          <p className="text-muted-foreground">
            Gerencie seus exames, laudos e outros documentos de saúde.
          </p>
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
        >
          <FileUp className="mr-2 h-4 w-4" />
          Enviar Arquivo
        </Button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {uploading && (
        <div className="mb-4 space-y-2">
          <p className="text-sm font-medium">Enviando arquivo...</p>
          <Progress value={uploadProgress} />
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : files.length === 0 ? (
        <Card className="text-center py-16 border-2 border-dashed">
          <CardContent>
            <FileX className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">
              Nenhum arquivo encontrado
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Comece enviando seu primeiro documento.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {files.map((file) => (
            <Card key={file.id} className="overflow-hidden group">
              <CardContent className="p-0">
                <div className="relative aspect-square w-full bg-muted flex items-center justify-center">
                  {file.type?.startsWith("image/") ? (
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <FileX className="h-12 w-12 text-muted-foreground" />
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <a
                      href={file.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="icon">
                        <Maximize className="h-5 w-5" />
                      </Button>
                    </a>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 flex flex-col items-start gap-1">
                <div className="w-full flex justify-between items-start">
                  <p
                    className="font-semibold text-sm truncate"
                    title={file.name}
                  >
                    {file.name}
                  </p>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 flex-shrink-0"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          download={file.name}
                        >
                          <Download className="mr-2 h-4 w-4" />
                          Baixar
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setFileToDelete(file)}
                        className="text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Deletar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex justify-between w-full text-xs text-muted-foreground">
                  <span>{formatBytes(file.size)}</span>
                  {file.createdAt && (
                    <span>
                      {format(new Date(file.createdAt), "dd/MM/yyyy", {
                        locale: ptBR,
                      })}
                    </span>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog
        open={!!fileToDelete}
        onOpenChange={(open) => !open && setFileToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o
              arquivo <span className="font-bold">{fileToDelete?.name}</span> de
              nossos servidores.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
