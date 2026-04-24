import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-12 w-12 animate-pulse text-primary"
        >
          <path d="M21.5 12H19" />
          <path d="M19 12H17" />
          <path d="M17 12H14" />
          <path d="M14 12H12" />
          <path d="M12 12H10" />
          <path d="M10 12H8" />
          <path d="M8 12H5.5" />
          <path d="M12 21.5V19" />
          <path d="M12 19V17" />
          <path d="M12 17V14" />
          <path d="M12 14V12" />
          <path d="M12 12V10" />
          <path d="M12 10V8" />
          <path d="M12 8V5.5" />
          <path d="M5.5 12H3" />
          <path d="M12 3V2" />
          <path d="M12 22V21" />
          <path d="M3 12H2" />
          <path d="M22 12H21" />
        </svg>
        <p className="text-muted-foreground">Carregando HistoriMed...</p>
      </div>
    </div>
  );
}
