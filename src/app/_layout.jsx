import { Slot, useRouter, useSegments } from "expo-router";
import { AuthContextProvider, useAuth } from "../../context/authContext"
import { useEffect } from "react";


const MainLayout = () => {
    const {isAuthenticated} = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if(typeof isAuthenticated == 'undefined') return;
        const inApp = segments[0] == '(app)';
        if(isAuthenticated && !inApp){
            router.replace('Bridges')
        } else if(isAuthenticated == false){
            router.replace('Login')
        }
    }, [isAuthenticated])

    return <Slot/>
}

export default function RootLayout() {
    return( 
        <AuthContextProvider>
            <MainLayout/>
        </AuthContextProvider>
    )
}