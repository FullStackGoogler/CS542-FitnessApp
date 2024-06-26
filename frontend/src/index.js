import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import {
    createBrowserRouter,
    RouterProvider
} from "react-router-dom";

import ErrorPage from "./Pages/ErrorPage/ErrorPage"
import GymFinderPage from "./Pages/GymFinder/GymFinderPage"
import HomePage from "./Pages/HomePage/HomePage"
import MealPage from "./Pages/Meals/MealPage"
import SupplementPage from "./Pages/Supplements/SupplementPage"
import NutritionPlanPage from "./Pages/NutritionPlans/NutritionPlanPage"
import WorkoutPage from "./Pages/Workouts/WorkoutPage"

import LoginPage from "./Pages/LoginPage/LoginPage"
import UserSettingPage from "./Pages/UserSettings/UserSettingPage"

const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage/>,
        errorElement: <ErrorPage/>
    },
    {
        path: "/dashboard",
        element: <HomePage/>,
        errorElement: <ErrorPage/>
    },
    {
        path: '/gymfinder',
        element: <GymFinderPage/>,
        errorElement: <ErrorPage/>
    },
    {
        path: '/workouts',
        element: <WorkoutPage/>,
        errorElement: <ErrorPage/>
    },
    {
        path:'/mealplans',
        element: <MealPage/>,
        errorElement: <ErrorPage/>
    },
    {
        path:'/nutritionplans',
        element: <NutritionPlanPage/>,
        errorElement: <ErrorPage/>
    },
    {
        path:'/supplements',
        element: <SupplementPage/>,
        errorElement: <ErrorPage/>
    },
    {
        path:'/settings',
        element: <UserSettingPage/>,
        errorElement: <ErrorPage/>
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();