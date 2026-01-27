"use client";

import { useTransition, useState } from "react";
import { createUser, deleteUser } from "@/lib/actions";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    UserPlus,
    Loader2,
    Shield,
    User,
    Key,
    Trash2,
    Users as UsersIcon
} from "lucide-react";
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface UserManagementProps {
    users: any[];
}

export function UserManagement({ users }: UserManagementProps) {
    const [isPending, startTransition] = useTransition();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        startTransition(async () => {
            try {
                const result = await createUser(formData);
                if (result.success) {
                    toast.success("Usuario creado correctamente. Deberá cambiar su contraseña en el primer ingreso.");
                    setUsername("");
                    setPassword("");
                } else {
                    toast.error(result.error || "Error al crear usuario");
                }
            } catch (error) {
                toast.error("Error de conexión");
            }
        });
    };

    const handleDeleteUser = async (userId: string) => {
        if (!window.confirm("¿Estás seguro de que deseas eliminar este usuario?")) return;

        startTransition(async () => {
            try {
                const result = await deleteUser(userId);
                if (result.success) {
                    toast.success("Usuario eliminado correctamente");
                } else {
                    toast.error(result.error || "Error al eliminar usuario");
                }
            } catch (error) {
                toast.error("Error de conexión");
            }
        });
    };

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* User Creation Form */}
                <Card className="md:col-span-1 rounded-[2.5rem] border-none shadow-xl shadow-muted/20 overflow-hidden h-fit">
                    <CardHeader className="bg-primary/5 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <UserPlus size={20} />
                            </div>
                            <div>
                                <CardTitle className="font-black tracking-tight">Nuevo Usuario</CardTitle>
                                <CardDescription>Añadir un administrador.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="username">Nombre de Usuario</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="username"
                                        name="username"
                                        placeholder="admin123"
                                        className="rounded-xl pl-10"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Contraseña Temporal</Label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        className="rounded-xl pl-10"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Rol</Label>
                                <select
                                    id="role"
                                    name="role"
                                    className="w-full h-10 rounded-xl border bg-background px-3 py-2 text-sm ring-offset-background border-input outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="ADMIN">Administrador Full</option>
                                    <option value="STAFF">Personal Staff</option>
                                </select>
                            </div>
                            <Button className="w-full h-12 rounded-xl font-bold mt-4" disabled={isPending}>
                                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                                Crear Acceso
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Users List */}
                <Card className="md:col-span-2 rounded-[2.5rem] border-none shadow-xl shadow-muted/20 overflow-hidden">
                    <CardHeader className="bg-muted/30 border-b">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-xl bg-primary/10 text-primary">
                                <UsersIcon size={20} />
                            </div>
                            <div>
                                <CardTitle className="font-black tracking-tight">Usuarios Activos</CardTitle>
                                <CardDescription>Gestiona los permisos de acceso al sistema.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="font-bold px-6">Usuario</TableHead>
                                    <TableHead className="font-bold">Rol</TableHead>
                                    <TableHead className="font-bold">Estado</TableHead>
                                    <TableHead className="font-bold text-right px-6">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((u) => (
                                    <TableRow key={u.id}>
                                        <TableCell className="px-6 py-4 font-medium">
                                            <div className="flex items-center gap-2">
                                                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                                    {u.username[0].toUpperCase()}
                                                </div>
                                                {u.username}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary">
                                                <Shield size={12} /> {u.role}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {u.requiresPasswordChange ? (
                                                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[10px] font-bold text-amber-700 uppercase tracking-widest">
                                                    Debe cambiar clave
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center rounded-full bg-emerald-100 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 uppercase tracking-widest">
                                                    Activo
                                                </span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right px-6">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                                                onClick={() => handleDeleteUser(u.id)}
                                                disabled={isPending}
                                            >
                                                <Trash2 size={18} />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
