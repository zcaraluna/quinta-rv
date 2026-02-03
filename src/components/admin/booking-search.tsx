"use client";

import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useDebounce } from "use-debounce";

export function BookingSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    // Get initial value from URL
    const initialQuery = searchParams.get("search") || "";
    const [text, setText] = useState(initialQuery);
    const [query] = useDebounce(text, 500);

    // Update URL when query changes
    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        if (query) {
            params.set("search", query);
        } else {
            params.delete("search");
        }
        // Reset to page 1 when searching
        params.set("page", "1");

        startTransition(() => {
            router.push(`?${params.toString()}`);
        });
    }, [query, router, searchParams]);

    // Handle clearing the search
    const handleClear = () => {
        setText("");
    };

    return (
        <div className="relative w-full max-w-md group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <Search className={`h-5 w-5 transition-colors duration-200 ${isPending ? 'text-primary animate-pulse' : 'text-muted-foreground group-focus-within:text-primary'}`} />
            </div>
            <Input
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Buscar por nombre, email o whatsapp..."
                className="h-14 pl-12 pr-12 rounded-2xl border-none bg-card shadow-xl shadow-muted/20 text-base font-medium placeholder:text-muted-foreground/50 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
            />
            {text && (
                <button
                    onClick={handleClear}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
                    title="Limpiar búsqueda"
                >
                    <X className="h-4 w-4 text-muted-foreground" />
                </button>
            )}
        </div>
    );
}
