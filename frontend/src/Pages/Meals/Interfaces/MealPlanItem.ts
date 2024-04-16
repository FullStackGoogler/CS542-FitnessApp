export interface MealPlanItem { //Define interface for a singular complete meal plan
        mealPlanID: number;
        name: string;
        owner: string;
        description: string;
        dailyMealPlan: {
            dailyMealPlanID: number;
            day: number;
            meals: {
                mealID: number;
                mealName: string;
                cookTime: string;
                prepTime: string;
                description: string;
                receipeingredientquantity: string;
                recipeingredientparts: string;
                calories: number;
                fat: number;
                carbs: number;
                protein: number;
                saturatedFat: number;
                cholesterol: number;
                sodium: number;
                fiber: number;
                sugar: number;
                recipeServings: number;
                recipeYield: string;
                recipeInstructions: string;
                servings: number;
            }[];
        }[];
    }