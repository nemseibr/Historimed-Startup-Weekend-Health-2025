"use client";

import Link from "next/link";
import {
  FilePlus2,
  CalendarClock,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

const features = [
  {
    title: "Enviar Anexos",
    description: "Adicione um novo exame ou consulta.",
    href: "/drive",
    icon: FilePlus2,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    title: "Seu Histórico",
    description: "Veja sua linha do tempo de saúde.",
    href: "/timeline",
    icon: CalendarClock,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
];

export default function DashboardPage() {

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao HistoriMed!
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title} className="group">
            <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <CardHeader>
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg ${feature.bgColor}`}
                >
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle>{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{feature.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Lembretes Recentes</CardTitle>
          <CardDescription>Suas próximas consultas e tarefas.</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="text-center text-muted-foreground py-8">
                <p>Nenhum lembrete por enquanto.</p>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
