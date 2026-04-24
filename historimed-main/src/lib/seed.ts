import { collection, writeBatch, Timestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { HealthHistoryItem } from '@/lib/types';

const seedData: Omit<HealthHistoryItem, 'id'>[] = [
  {
    date: Timestamp.fromDate(new Date('2023-10-26')),
    title: 'Check-up Anual',
    summary: 'Exames de rotina com Dr. Silva.',
    details: 'Resultados dos exames de sangue normais, pressão arterial 120/80. Nenhuma preocupação levantada.',
    category: 'Check-up',
  },
  {
    date: Timestamp.fromDate(new Date('2023-05-15')),
    title: 'Consulta de Alergia',
    summary: 'Alergia sazonal, rinite.',
    details: 'Prescrito anti-histamínico para alergias sazonais. Acompanhamento se os sintomas persistirem.',
    category: 'Consulta',
  },
  {
    date: Timestamp.fromDate(new Date('2022-11-02')),
    title: 'Vacina da Gripe',
    summary: 'Vacinação anual contra a gripe.',
    details: 'Recebeu a vacina quadrivalente contra a gripe na farmácia local.',
    category: 'Vacinação',
  },
  {
    date: Timestamp.fromDate(new Date('2022-03-20')),
    title: 'Lesão no Tornozelo',
    summary: 'Entorse de tornozelo jogando futebol.',
    details: 'Raio-X não mostrou fratura. Diagnosticado com entorse de grau 2. Fisioterapia recomendada.',
    category: 'Lesão',
  },
  {
    date: Timestamp.fromDate(new Date('2021-10-20')),
    title: 'Check-up Anual',
    summary: 'Exames anuais de rotina.',
    details: 'Todos os marcadores de saúde dentro da faixa normal. Discutida a importância da dieta e do exercício.',
    category: 'Check-up',
  },
];

export async function seedHealthHistory(userId: string) {
  const healthHistoryRef = collection(db, 'users', userId, 'healthHistory');
  const batch = writeBatch(db);

  seedData.forEach((item) => {
    const docRef = doc(healthHistoryRef); // Creates a new document reference with a random ID
    batch.set(docRef, item);
  });
  
  // Also create a demo user document if it doesn't exist
  const userDocRef = doc(db, "users", userId);
  batch.set(userDocRef, {
    uid: userId,
    displayName: "Usuário Demo",
    email: "demo@historiomed.com",
    createdAt: new Date(),
    storageUsed: 0,
    storagePlan: 15, // GB
  }, { merge: true });


  await batch.commit();
}
