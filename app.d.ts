import "expo-router";

declare module "expo-router" {
    export interface RouteProps {
        href:
            | "/LoginScreen"
            | "/RegisterScreen"
            | "/ShowFriendListScreen"
            |  '/chat/${string}';
    }
}
