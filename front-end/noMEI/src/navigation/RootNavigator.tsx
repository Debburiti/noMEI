import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { OnboardingScreen } from "../screens/OnboardingScreen";
import { CadastroIdentificacaoScreen } from "../screens/CadastroIdentificacaoScreen";
import { CadastroSenhaScreen } from "../screens/CadastroSenhaScreen";
import { CadastroConfirmacaoScreen } from "../screens/CadastroConfirmacaoScreen";
import { CadastroSucessoScreen } from "../screens/CadastroSucessoScreen";
import { RecuperacaoEmailScreen } from "../screens/RecuperacaoEmailScreen";
import { RecuperacaoSenhaScreen } from "../screens/RecuperacaoSenhaScreen";
import { ConfiguracaoPerfilScreen } from "../screens/ConfiguracaoPerfilScreen";
import { DetalhesLicitacaoScreen } from "../screens/DetalhesLicitacaoScreen";
import { AlertasScreen } from "../screens/AlertasScreen";
import { TabNavigator } from "./TabNavigator";
import type { RootStackParamList } from "../types";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator(): React.JSX.Element {
    return (
        <Stack.Navigator
            initialRouteName="Onboarding"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen
                name="Onboarding"
                component={OnboardingScreen}
                options={{ animation: "fade" }}
            />

            <Stack.Screen
                name="CadastroIdentificacao"
                component={CadastroIdentificacaoScreen}
                options={{ animation: "slide_from_right" }}
            />

            <Stack.Screen
                name="CadastroSenha"
                component={CadastroSenhaScreen}
                options={{ animation: "slide_from_right" }}
            />

            <Stack.Screen
                name="CadastroSucesso"
                component={CadastroSucessoScreen}
                options={{ animation: "fade" }}
            />

            <Stack.Screen
                name="CadastroConfirmacao"
                component={CadastroConfirmacaoScreen}
                options={{ animation: "slide_from_right" }}
            />

            <Stack.Screen
                name="RecuperacaoEmail"
                component={RecuperacaoEmailScreen}
                options={{ animation: "slide_from_right" }}
            />

            <Stack.Screen
                name="RecuperacaoSenha"
                component={RecuperacaoSenhaScreen}
                options={{ animation: "slide_from_right" }}
            />

            <Stack.Screen
                name="ProfileSetup"
                component={ConfiguracaoPerfilScreen}
                options={{ animation: "slide_from_right" }}
            />

            <Stack.Screen
                name="MainTabs"
                component={TabNavigator}
                options={{ animation: "fade" }}
            />

            <Stack.Screen
                name="DetalhesLicitacao"
                component={DetalhesLicitacaoScreen}
                options={{ animation: "slide_from_right" }}
            />

            <Stack.Screen
                name="Alertas"
                component={AlertasScreen}
                options={{ presentation: "modal" }}
            />
        </Stack.Navigator>
    );
}
