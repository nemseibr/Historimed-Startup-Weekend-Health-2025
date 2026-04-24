"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Download,
  FileText,
  FileImage,
  File,
  Calendar,
  Stethoscope,
  Heart,
  Activity,
  Pill,
  UtensilsCrossed,
  Eye,
  Brain,
  Bone,
  Baby,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Tipos
type Anexo = {
  nome: string;
  tipo: string;
  url: string;
};

type EventoMedico = {
  id: string;
  data: string;
  titulo: string;
  descricao: string;
  especialidades: string[];
  anexos: Anexo[];
  detalhes?: string;
};

type TimelineAnual = {
  ano: number;
  eventos: EventoMedico[];
};

// Ícones por especialidade
const especialidadeIcons: { [key: string]: React.ElementType } = {
  cardiologia: Heart,
  endocrinologia: Activity,
  nutrição: UtensilsCrossed,
  oftalmologia: Eye,
  neurologia: Brain,
  ortopedia: Bone,
  pediatria: Baby,
  clínica_geral: Stethoscope,
  default: Stethoscope,
};

// Cores por especialidade
const especialidadeColors: { [key: string]: string } = {
  cardiologia: "bg-red-100 text-red-800 border-red-200",
  endocrinologia: "bg-blue-100 text-blue-800 border-blue-200",
  nutrição: "bg-green-100 text-green-800 border-green-200",
  oftalmologia: "bg-purple-100 text-purple-800 border-purple-200",
  neurologia: "bg-indigo-100 text-indigo-800 border-indigo-200",
  ortopedia: "bg-orange-100 text-orange-800 border-orange-200",
  pediatria: "bg-pink-100 text-pink-800 border-pink-200",
  clínica_geral: "bg-gray-100 text-gray-800 border-gray-200",
};

// Dados mock de 2020-2025
const timelineData: TimelineAnual[] = [
  {
    ano: 2020,
    eventos: [
      {
        id: "evt-2020-01",
        data: "2020-03-15",
        titulo: "Consulta com Dr. João Silva — Cardiologista",
        descricao: "Primeira consulta cardiológica de rotina. Paciente apresentou pressão arterial levemente elevada.",
        especialidades: ["cardiologia"],
        anexos: [
          { nome: "Eletrocardiograma_2020.pdf", tipo: "pdf", url: "#" },
          { nome: "Exame_Sangue_2020.pdf", tipo: "pdf", url: "#" },
        ],
        detalhes:
          "Consulta inicial para avaliação cardiovascular. Foram solicitados exames complementares para investigação de hipertensão arterial. Paciente orientado sobre mudanças no estilo de vida.",
      },
      {
        id: "evt-2020-02",
        data: "2020-06-22",
        titulo: "Acompanhamento Nutricional — Dra. Maria Santos",
        descricao: "Plano alimentar personalizado para controle de peso e melhoria dos índices glicêmicos.",
        especialidades: ["nutrição"],
        anexos: [
          { nome: "Plano_Alimentar_2020.docx", tipo: "docx", url: "#" },
          { nome: "Tabela_Nutricional.pdf", tipo: "pdf", url: "#" },
        ],
        detalhes:
          "Avaliação nutricional completa. Elaborado plano alimentar com foco em redução de carboidratos refinados e aumento de fibras. Orientações sobre horários de refeições e hidratação.",
      },
      {
        id: "evt-2020-03",
        data: "2020-09-10",
        titulo: "Consulta Oftalmológica — Dr. Carlos Mendes",
        descricao: "Exame de rotina para atualização do grau dos óculos.",
        especialidades: ["oftalmologia"],
        anexos: [
          { nome: "Receita_Oculos_2020.pdf", tipo: "pdf", url: "#" },
          { nome: "Mapeamento_Retina_2020.png", tipo: "png", url: "#" },
        ],
        detalhes:
          "Exame oftalmológico completo. Detectada pequena alteração no grau. Nova receita de óculos prescrita. Retorno agendado para 6 meses.",
      },
    ],
  },
  {
    ano: 2021,
    eventos: [
      {
        id: "evt-2021-01",
        data: "2021-02-18",
        titulo: "Retorno Cardiológico — Dr. João Silva",
        descricao: "Acompanhamento da pressão arterial. Resultados dos exames dentro da normalidade.",
        especialidades: ["cardiologia"],
        anexos: [
          { nome: "ECG_2021.pdf", tipo: "pdf", url: "#" },
          { nome: "Holter_24h_2021.pdf", tipo: "pdf", url: "#" },
        ],
        detalhes:
          "Pressão arterial controlada com medicação. Exames complementares sem alterações significativas. Manutenção do tratamento atual.",
      },
      {
        id: "evt-2021-02",
        data: "2021-05-12",
        titulo: "Consulta Endocrinológica — Dra. Ana Costa",
        descricao: "Avaliação de função tireoidiana e controle glicêmico.",
        especialidades: ["endocrinologia"],
        anexos: [
          { nome: "TSH_T4_T3_2021.pdf", tipo: "pdf", url: "#" },
          { nome: "Hemoglobina_Glicada_2021.pdf", tipo: "pdf", url: "#" },
        ],
        detalhes:
          "Função tireoidiana normal. Glicemia de jejum levemente elevada. Orientações sobre dieta e atividade física. Retorno em 3 meses.",
      },
      {
        id: "evt-2021-03",
        data: "2021-08-30",
        titulo: "Ultrassonografia Abdominal",
        descricao: "Exame de imagem para avaliação de órgãos abdominais.",
        especialidades: ["clínica_geral"],
        anexos: [
          { nome: "USG_Abdomen_2021.pdf", tipo: "pdf", url: "#" },
          { nome: "Imagens_USG_2021.zip", tipo: "zip", url: "#" },
        ],
        detalhes:
          "Ultrassonografia sem alterações significativas. Fígado, vesícula, pâncreas e rins com aspecto normal.",
      },
    ],
  },
  {
    ano: 2022,
    eventos: [
      {
        id: "evt-2022-01",
        data: "2022-01-20",
        titulo: "Consulta Neurológica — Dr. Pedro Alves",
        descricao: "Avaliação de cefaleia recorrente. Exames neurológicos normais.",
        especialidades: ["neurologia"],
        anexos: [
          { nome: "Ressonancia_Cranio_2022.pdf", tipo: "pdf", url: "#" },
          { nome: "EEG_2022.pdf", tipo: "pdf", url: "#" },
        ],
        detalhes:
          "Cefaleia tensional diagnosticada. Ressonância magnética sem alterações. Prescrição de medicação preventiva e orientações sobre hábitos de sono.",
      },
      {
        id: "evt-2022-02",
        data: "2022-04-15",
        titulo: "Retorno Nutricional — Dra. Maria Santos",
        descricao: "Ajuste do plano alimentar após perda de peso significativa.",
        especialidades: ["nutrição"],
        anexos: [
          { nome: "Plano_Alimentar_Atualizado_2022.docx", tipo: "docx", url: "#" },
          { nome: "Evolucao_Peso_2022.pdf", tipo: "pdf", url: "#" },
        ],
        detalhes:
          "Excelente evolução do peso. Plano alimentar ajustado para manutenção. Orientações sobre atividade física.",
      },
      {
        id: "evt-2022-03",
        data: "2022-07-08",
        titulo: "Consulta Ortopédica — Dr. Roberto Lima",
        descricao: "Avaliação de dor lombar. Prescrição de fisioterapia.",
        especialidades: ["ortopedia"],
        anexos: [
          { nome: "RaioX_Coluna_2022.pdf", tipo: "pdf", url: "#" },
          { nome: "Receita_Fisioterapia_2022.pdf", tipo: "pdf", url: "#" },
        ],
        detalhes:
          "Dor lombar mecânica. Raio-X sem alterações estruturais. Encaminhamento para fisioterapia com 10 sessões prescritas.",
      },
    ],
  },
  {
    ano: 2023,
    eventos: [
      {
        id: "evt-2023-01",
        data: "2023-03-10",
        titulo: "Check-up Anual Completo",
        descricao: "Exames de rotina anuais: sangue, urina e imagem.",
        especialidades: ["clínica_geral"],
        anexos: [
          { nome: "Hemograma_Completo_2023.pdf", tipo: "pdf", url: "#" },
          { nome: "Bioquimica_Sangue_2023.pdf", tipo: "pdf", url: "#" },
          { nome: "EAS_Urina_2023.pdf", tipo: "pdf", url: "#" },
        ],
        detalhes:
          "Todos os exames dentro da normalidade. Hemograma, função renal e hepática normais. Colesterol e triglicerídeos controlados.",
      },
      {
        id: "evt-2023-02",
        data: "2023-06-25",
        titulo: "Retorno Cardiológico — Dr. João Silva",
        descricao: "Acompanhamento anual. Sistema cardiovascular estável.",
        especialidades: ["cardiologia"],
        anexos: [
          { nome: "EcoCardiograma_2023.pdf", tipo: "pdf", url: "#" },
          { nome: "Teste_Ergometrico_2023.pdf", tipo: "pdf", url: "#" },
        ],
        detalhes:
          "Ecocardiograma normal. Teste ergométrico sem alterações. Pressão arterial bem controlada. Manutenção do tratamento.",
      },
      {
        id: "evt-2023-03",
        data: "2023-09-14",
        titulo: "Consulta Oftalmológica — Dr. Carlos Mendes",
        descricao: "Exame anual de rotina. Atualização da receita de óculos.",
        especialidades: ["oftalmologia"],
        anexos: [
          { nome: "Receita_Oculos_2023.pdf", tipo: "pdf", url: "#" },
          { nome: "Campo_Visual_2023.pdf", tipo: "pdf", url: "#" },
        ],
        detalhes:
          "Grau dos óculos atualizado. Campo visual normal. Fundo de olho sem alterações. Retorno em 12 meses.",
      },
    ],
  },
  {
    ano: 2024,
    eventos: [
      {
        id: "evt-2024-01",
        data: "2024-02-05",
        titulo: "Acompanhamento Endocrinológico — Dra. Ana Costa",
        descricao: "Controle glicêmico melhorado. Ajuste de medicação.",
        especialidades: ["endocrinologia"],
        anexos: [
          { nome: "Hemoglobina_Glicada_2024.pdf", tipo: "pdf", url: "#" },
          { nome: "Perfil_Lipidico_2024.pdf", tipo: "pdf", url: "#" },
        ],
        detalhes:
          "Glicemia bem controlada. Hemoglobina glicada dentro da meta. Redução da dose de medicação. Orientações sobre dieta mantidas.",
      },
      {
        id: "evt-2024-02",
        data: "2024-05-20",
        titulo: "Consulta Nutricional — Dra. Maria Santos",
        descricao: "Manutenção do peso. Plano alimentar revisado.",
        especialidades: ["nutrição"],
        anexos: [
          { nome: "Plano_Alimentar_2024.docx", tipo: "docx", url: "#" },
          { nome: "Avaliacao_Composicao_Corporal_2024.pdf", tipo: "pdf", url: "#" },
        ],
        detalhes:
          "Peso estável. Composição corporal melhorada. Plano alimentar ajustado para incluir mais proteínas. Orientações sobre suplementação.",
      },
      {
        id: "evt-2024-03",
        data: "2024-08-12",
        titulo: "Consulta Neurológica — Dr. Pedro Alves",
        descricao: "Cefaleia controlada. Redução da frequência dos episódios.",
        especialidades: ["neurologia"],
        anexos: [
          { nome: "Avaliacao_Neurologica_2024.pdf", tipo: "pdf", url: "#" },
        ],
        detalhes:
          "Cefaleia tensional bem controlada. Frequência dos episódios reduzida em 70%. Manutenção do tratamento preventivo.",
      },
    ],
  },
  {
    ano: 2025,
    eventos: [
      {
        id: "evt-2025-01",
        data: "2025-01-15",
        titulo: "Check-up Anual 2025",
        descricao: "Exames de rotina anuais. Todos os resultados normais.",
        especialidades: ["clínica_geral"],
        anexos: [
          { nome: "Hemograma_2025.pdf", tipo: "pdf", url: "#" },
          { nome: "Bioquimica_2025.pdf", tipo: "pdf", url: "#" },
          { nome: "EAS_Urina_2025.pdf", tipo: "pdf", url: "#" },
        ],
        detalhes:
          "Check-up completo realizado. Todos os exames dentro da normalidade. Saúde geral em bom estado. Orientações sobre prevenção mantidas.",
      },
      {
        id: "evt-2025-02",
        data: "2025-03-22",
        titulo: "Retorno Cardiológico — Dr. João Silva",
        descricao: "Sistema cardiovascular estável. Pressão arterial controlada.",
        especialidades: ["cardiologia"],
        anexos: [
          { nome: "ECG_2025.pdf", tipo: "pdf", url: "#" },
          { nome: "EcoCardiograma_2025.pdf", tipo: "pdf", url: "#" },
        ],
        detalhes:
          "Avaliação cardiológica completa. ECG e ecocardiograma normais. Pressão arterial bem controlada. Manutenção do tratamento atual.",
      },
    ],
  },
];

// Função para obter ícone do tipo de arquivo
const getFileIcon = (tipo: string) => {
  if (tipo === "pdf") return FileText;
  if (tipo === "png" || tipo === "jpg" || tipo === "jpeg") return FileImage;
  return File;
};

// Função para formatar data
const formatarData = (data: string) => {
  return format(new Date(data), "d 'de' MMMM 'de' yyyy", { locale: ptBR });
};

// Componente de Anexo
const AnexoItem = ({ anexo }: { anexo: Anexo }) => {
  const FileIcon = getFileIcon(anexo.tipo);
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Button
        variant="outline"
        size="sm"
        className="w-full justify-start gap-2 text-sm"
        onClick={() => {
          // Simulação de download/visualização
          console.log(`Abrindo: ${anexo.nome}`);
        }}
      >
        <FileIcon className="h-4 w-4" />
        <span className="truncate flex-1 text-left">{anexo.nome}</span>
        <Download className="h-4 w-4" />
      </Button>
    </motion.div>
  );
};

// Componente de Evento
const EventoCard = ({ evento }: { evento: EventoMedico }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
    >
      <Card className="mb-6 hover:shadow-lg transition-shadow">
        <Accordion type="single" collapsible>
          <AccordionItem value={evento.id} className="border-0">
            <AccordionTrigger className="px-6 py-4 hover:no-underline">
              <div className="flex-1 text-left space-y-2">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatarData(evento.data)}</span>
                  </div>
                  {evento.especialidades.map((esp) => {
                    const Icon =
                      especialidadeIcons[esp] || especialidadeIcons.default;
                    return (
                      <Badge
                        key={esp}
                        variant="outline"
                        className={especialidadeColors[esp] || especialidadeColors.clínica_geral}
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {esp.replace("_", " ")}
                      </Badge>
                    );
                  })}
                </div>
                <h3 className="text-lg font-semibold font-headline">
                  {evento.titulo}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {evento.descricao}
                </p>
                {evento.anexos.length > 0 && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                    <FileText className="h-3 w-3" />
                    <span>{evento.anexos.length} anexo(s)</span>
                  </div>
                )}
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-6">
              <div className="space-y-4 pt-2">
                {evento.detalhes && (
                  <div className="text-sm text-muted-foreground">
                    <p className="whitespace-pre-wrap">{evento.detalhes}</p>
                  </div>
                )}
                {evento.anexos.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Anexos
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {evento.anexos.map((anexo, idx) => (
                        <AnexoItem key={idx} anexo={anexo} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Card>
    </motion.div>
  );
};

// Componente principal
export default function TimelinePage() {
  // Ordena em ordem decrescente (2025 -> 2020)
  const timelineDataOrdenada = [...timelineData].reverse();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <h1 className="text-4xl font-bold font-headline mb-2">
          Linha do Tempo Médica
        </h1>
        <p className="text-muted-foreground">
          Histórico clínico completo de 2025 a 2020
        </p>
      </motion.div>

      <div className="relative">
        {/* Linha vertical da timeline */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-200 via-blue-300 to-blue-200 hidden md:block" />

        <div className="space-y-16">
          {timelineDataOrdenada.map((anoData, index) => (
            <motion.div
              key={anoData.ano}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Marcador do ano */}
              <div className="flex items-center gap-4 mb-6">
                <div className="hidden md:block relative z-10">
                  <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">
                      {anoData.ano}
                    </span>
                  </div>
                </div>
                <div className="md:hidden">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold">
                      {anoData.ano}
                    </span>
                  </div>
                </div>
                <div className="flex-1 border-t border-border" />
              </div>

              {/* Eventos do ano */}
              <div className="md:ml-24 space-y-4">
                {[...anoData.eventos].reverse().map((evento) => (
                  <EventoCard key={evento.id} evento={evento} />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
