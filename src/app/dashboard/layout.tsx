import { StreamVideoProvider } from "@/providers/streamClientProvider";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return(
        <main>
            <StreamVideoProvider>
            {children}
            </StreamVideoProvider>
        </main>
    );
}