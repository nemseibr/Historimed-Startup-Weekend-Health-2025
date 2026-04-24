"use client";

import { useState, useEffect } from 'react';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Bell, CreditCard, Loader2, Palette, Settings as SettingsIcon, Shield, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

const profileFormSchema = z.object({
  displayName: z.string().min(2, { message: 'O nome deve ter pelo menos 2 caracteres.' }),
  email: z.string().email(),
});

// Hardcoded user for demo purposes
const DEMO_USER = {
    displayName: "Usuário Demo",
    email: "demo@historiomed.com",
    photoURL: null,
};
const DEMO_USER_ID = "demo-user";
const isDemoMode = !isFirebaseConfigured;

function ProfileSection() {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);

    const form = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            displayName: DEMO_USER.displayName || '',
            email: DEMO_USER.email || '',
        },
    });

    useEffect(() => {
        form.reset({
            displayName: DEMO_USER.displayName || '',
            email: DEMO_USER.email || '',
        });
    }, [form]);
    
    async function onSubmit(values: z.infer<typeof profileFormSchema>) {
        setLoading(true);
        try {
            // In a real app, you would update the user profile in Firestore
            console.log("Updating profile...", values);
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast({ title: "Perfil atualizado com sucesso!" });
        } catch(e) {
            toast({ variant: "destructive", title: "Erro", description: "Não foi possível atualizar o perfil." });
        } finally {
            setLoading(false);
        }
    }
  
  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  }

  const userAvatar = PlaceHolderImages.find(p => p.id === 'user-avatar');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Perfil</CardTitle>
        <CardDescription>Gerencie suas informações pessoais.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={DEMO_USER.photoURL || userAvatar?.imageUrl} alt={DEMO_USER.displayName || "User"} data-ai-hint={userAvatar?.imageHint} />
              <AvatarFallback>{getInitials(DEMO_USER.displayName)}</AvatarFallback>
            </Avatar>
            <Button variant="outline">Mudar foto</Button>
        </div>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Nome Completo</FormLabel>
                        <FormControl>
                        <Input placeholder="Seu nome" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                        <Input placeholder="Seu email" {...field} disabled />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <Button type="submit" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Salvar Alterações
                </Button>
            </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function PlanSection() {
    const [userData, setUserData] = useState<{storageUsed: number, storagePlan: number} | null>(null);

    useEffect(() => {
        if (isDemoMode) {
            setUserData({
                storageUsed: 6 * 1024 * 1024 * 1024,
                storagePlan: 15,
            });
            return;
        }

        if (!db) {
            setUserData({ storageUsed: 0, storagePlan: 15 });
            return;
        }

        const unsub = onSnapshot(doc(db, "users", DEMO_USER_ID), (doc) => {
            const data = doc.data();
            if(data) {
                setUserData({
                    storageUsed: data.storageUsed || 0,
                    storagePlan: data.storagePlan || 15
                });
            } else {
                 setUserData({ storageUsed: 0, storagePlan: 15 });
            }
        }, (error) => {
            console.error("Error fetching user plan: ", error);
            setUserData({ storageUsed: 0, storagePlan: 15 });
        });
        return () => unsub();
    }, [isDemoMode]);

    const formatBytes = (bytes: number) => {
        if (bytes === 0) return '0 GB';
        return (bytes / 1024 / 1024 / 1024).toFixed(2);
    }
    
    const usagePercentage = userData ? (userData.storageUsed / (userData.storagePlan * 1024 * 1024 * 1024)) * 100 : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Meu Plano</CardTitle>
        <CardDescription>Verifique seu plano atual e uso de armazenamento.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <h3 className="font-medium mb-2">Uso de Armazenamento</h3>
            {userData ? (
                <>
                    <Progress value={usagePercentage} className="w-full" />
                    <p className="text-sm text-muted-foreground mt-2">
                        {formatBytes(userData.storageUsed)} GB de {userData.storagePlan} GB usados
                    </p>
                </>
            ) : (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            )}
        </div>
        <Card className="bg-primary/10 border-primary/20">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Plano Gratuito</CardTitle>
                    <CardDescription>Seu plano atual.</CardDescription>
                </div>
                <Button>Fazer Upgrade</Button>
            </CardHeader>
        </Card>
      </CardContent>
    </Card>
  );
}

function PreferencesSection() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Preferências</CardTitle>
                <CardDescription>Ajuste as configurações de segurança, notificações e tema.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2"><Bell className="h-4 w-4" /> Notificações</h3>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="notifications-email">Notificações por Email</Label>
                        <Switch id="notifications-email" defaultChecked />
                    </div>
                </div>
                 <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2"><Shield className="h-4 w-4" /> Segurança</h3>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <p className="text-sm">Autenticação de dois fatores</p>
                        <Button variant="outline">Ativar</Button>
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <p className="text-sm">Alterar senha</p>
                        <Button variant="outline">Alterar</Button>
                    </div>
                </div>
                <div className="space-y-4">
                    <h3 className="font-medium flex items-center gap-2"><Palette className="h-4 w-4" /> Tema</h3>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <Label htmlFor="dark-mode">Modo Escuro</Label>
                        <Switch id="dark-mode" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">Configurações</h1>
        <p className="text-muted-foreground">Gerencie seu perfil, plano e preferências.</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile"><User className="w-4 h-4 mr-2" />Perfil</TabsTrigger>
          <TabsTrigger value="plan"><CreditCard className="w-4 h-4 mr-2" />Meu Plano</TabsTrigger>
          <TabsTrigger value="settings"><SettingsIcon className="w-4 h-4 mr-2" />Preferências</TabsTrigger>
        </TabsList>
        <TabsContent value="profile" className="mt-6">
          <ProfileSection />
        </TabsContent>
        <TabsContent value="plan" className="mt-6">
          <PlanSection />
        </TabsContent>
        <TabsContent value="settings" className="mt-6">
          <PreferencesSection />
        </TabsContent>
      </Tabs>
    </div>
  );
}
