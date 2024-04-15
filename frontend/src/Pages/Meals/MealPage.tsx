import React, { useEffect, useState } from "react";
import TopBar from "../../Components/TopBar";
import { List, ListItemButton, Button, TextField } from "@mui/material";
import ListItem  from "./Components/MealListItem"
import MealPopUp from "./Components/DailyMealPlanPopUp"
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import './WorkoutPage.css';

const MealPage: React.FC = () => {
    interface MealPlanItem { //Define interface for a singular complete meal plan
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

    const [selectedProgram, setSelectedProgram] = useState<MealPlanItem | null>(null);
    const [userPrograms, setMealPlans] = useState<MealPlanItem[]>([]);
    const [createProgram, setCreateProgram] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const filteredUserPrograms = userPrograms.filter(program =>
        program.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    //Fetch all User Programs on page load
    useEffect(() => {
        fetch('http://localhost:9000/api/mealplan')
            .then(response => response.json())
            .then(data => {
                setMealPlans(data.map((plan: any) => ({
                    mealPlanID: plan.meal_plan_id,
                    owner: plan.owner,
                    name: plan.name,
                    description: plan.description,
                    dailyMealPlan: []
                })));
            })
            .catch(error => console.error('Error:', error));
    })

    //Load a complete User Program
    const handlePopupOpen = (item: MealPlanItem) => {
        console.log(item)
        setSelectedProgram(item);

        fetch(`http://localhost:9000/api/mealplan/${item.mealPlanID}/dailymealplan`)
            .then(response => response.json())
            .then(dailyMealData => {
                console.log(dailyMealData)
                const mealMap = new Map<number, any>();
                dailyMealData.forEach((dailymealplan: any) => {
                    const { daily_meal_id, day, ...meal } = dailymealplan;
                    const meal_data = {
                        mealID: meal.mealid,
                        mealName: meal.mealname,
                        cookTime: meal.cooktime,
                        prepTime: meal.prepTime,
                        description: meal.description,
                        servings: meal.servings,
                        receipeingredientquantity: meal.receipeingredientquantity,
                        recipeingredientparts: meal.recipeingredientparts,
                        calories: meal.calories,
                        fat: meal.fatcontent,
                        carbs: meal.carbohydratecontent,
                        protein: meal.proteincontent,
                        saturatedFat: meal.saturatedfatcontent,
                        cholesterol: meal.cholesterolcontent,
                        sodium: meal.sodiumcontent,
                        fiber: meal.fibercontent,
                        sugar: meal.sugarcontent,
                        recipeServings: meal.recipeservings,
                        recipeYield: meal.recipeyield,
                        recipeInstructions: meal.recipeinstructions
                    };

                    if (mealMap.has(daily_meal_id)) {
                        mealMap.get(daily_meal_id).meals.push(meal_data);
                    } else {
                        mealMap.set(daily_meal_id, {
                            dailyMealPlanID: daily_meal_id,
                            day: day,
                            meals: [meal_data]
                        });
                    }
                });
                const mealplan = Array.from(mealMap.values());
                setSelectedProgram(prevSelectedMealPlan => ({
                    ...prevSelectedMealPlan!,
                    dailyMealPlan: mealplan
                }));
            })
    };

    const handlePopupClose = () => {
        setSelectedProgram(null);
    };

    const handleCreateProgram = () => {
        setCreateProgram(true);
    };

    const handleCreateProgramSubmit = async (workoutItem: MealPlanItem) => {
        //console.log("Workout Item:", workoutItem); //TODO: Debugging purposes
        //console.log("Workout Stringed:", JSON.stringify(workoutItem)) //TODO: Debugging purposes
        setCreateProgram(false);

        try {
            const response = await fetch('http://localhost:9000/api/workoutItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workoutItem)
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('WorkoutItem successfully sent:', responseData);
            } else {
                console.error('Failed to send WorkoutItem:', response.statusText);
            }
        } catch (error: any) {
            console.error('Error sending WorkoutItem:', error.message);
        }
    };

    return (
        <div>
            <TopBar title="Meal Plans" titleColor="#ffffff" />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '75px 10px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>List of Meal Plans</div>
                <TextField
                        label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="outlined"
                        size="small"
                        InputProps={{
                            endAdornment: <InputAdornment position="end"><SearchIcon/></InputAdornment>,
                        }}
                    />
                    </div>
                <Button variant="contained" color="primary" onClick={handleCreateProgram}>Add a Meal Plan</Button>
            </div>
            <div style={{ position: 'absolute', top: '125px', bottom: '0', width: '100%' }}>
                <List>
                    {filteredUserPrograms.map(item => (
                        <ListItemButton>
                            <ListItem key={item.mealPlanID} meal={item} onClick={() => handlePopupOpen(item)} />
                        </ListItemButton>
                    ))}
                </List>
            </div>
            <MealPopUp selectedDailyMealPlan={selectedProgram} onClose={handlePopupClose} />
        </div>
        
    );
}

export default MealPage;