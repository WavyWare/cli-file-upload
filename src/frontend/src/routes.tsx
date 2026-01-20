import { RouteObject } from "react-router-dom";
import {MainPage} from "./MainPage.tsx";

export const routes: RouteObject[] = [
    {
        path: "/",
        element: <MainPage />
    },
];
