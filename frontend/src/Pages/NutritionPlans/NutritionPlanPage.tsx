import TopBar from "../../Components/TopBar";
import React, { useEffect, useState } from "react";
import { List, ListItemButton, Button } from "@mui/material";
import ListItem  from "./Components/NutritionPlanListItem"

import NutritionPlanPopup from "./Components/NutritionPlanPopup"
import NutritionPlanForm from "./Components/NutritionPlanForm";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const NutritionPlanPage: React.FC = () => {
    interface NutritionPlanItem {
        nutrition_plan_id: number;
        calorie_goal: number;
        diet_type: string;
        protein_goal: number;
        fat_goal: number;
        carb_goal: number;
    }

    const [selectedNutritionPlan, setSelectedNutritionPlan] = useState<NutritionPlanItem | null>(null);
    const [nutritionPlan, setNutritionPlan] = useState<NutritionPlanItem[]>([]);
    const [createPlan, setCreatePlan] = useState(false);
    const [confirmDiscardForm, setConfirmDiscardForm] = useState(false);
    
    /*let dummydata = [{
        nutrition_plan_id: 1,
        calorie_goal: 1,
        diet_type: "a",
        protein_goal: 1,
        fat_goal: 1,
        carb_goal: 1
    },
    {
        nutrition_plan_id: 2,
        calorie_goal: 2,
        diet_type: "b",
        protein_goal: 2,
        fat_goal: 2,
        carb_goal: 2
    }
]*/
   
    useEffect(() => {
        fetch('http://localhost:8080/api/nutritionplan')
            .then(response => response.json())
            .then(data =>  {
                //console.log("data")
                setNutritionPlan(data.map((plan: any) => ({
                    nutrition_plan_id: plan.nutrition_plan_id,
                    calorie_goal: plan.calorie_goal,
                    diet_type: plan.diet_type,
                    protein_goal: plan.protein_goal,
                    fat_goal: plan.fat_goal,
                    carb_goal: plan.carb_goal
                })));
            }).catch(error => console.error('Error:', error));

    })

    const handleClick = (item: NutritionPlanItem) => {
        setSelectedNutritionPlan(item);
        console.log(item.nutrition_plan_id);
        fetch(`http://localhost:8080/api/nutritionplan/${item.nutrition_plan_id}`)
            .then(response => response.json())
            .then(nutritionPlanData => {
                    console.log(nutritionPlanData)
                    setSelectedNutritionPlan(nutritionPlanData);
                })
            .catch(error => console.error('Error fetching nutrition plan:', error));
    };   

    const handleClose = () => {
        setSelectedNutritionPlan(null);
    };

    const handleCreatePlan = () => {
        setCreatePlan(true);
    };

    const handleCreatePlanSubmit = (nutritionPlan: NutritionPlanItem) => {
        //TODO: Figure out how to decompoes this interface into SQL queries
        console.log("Nutrition Plan:", nutritionPlan);
        setCreatePlan(false);
    }

    const handleCreatePlanClose = () => {
        setConfirmDiscardForm(true);
    };

    const handleDiscardFormClose = (discard: boolean) => {
        if (discard) {
            setCreatePlan(false);
        }
        setConfirmDiscardForm(false);
    };

    //TODO: Use CSS to better align these
    return (
        <div>
            <TopBar title="Nutrition Plans" titleColor="#ffffff"/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '75px 10px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>List of Nutrition Plans</div>
                <Button variant="contained" color="primary" onClick={handleCreatePlan}>Add a Nutrition Plan</Button>
            </div>
            <div style={{ position: 'absolute', top: '125px', bottom: '0', width: '100%' }}>
                <List>
                    {nutritionPlan.map(item => (
                        <ListItemButton>
                            <ListItem nutritionPlan={item} onClick={() => handleClick(item)}/>
                        </ListItemButton>
                    ))}
                </List>
            </div>
            <NutritionPlanPopup selectedNutritionPlan={selectedNutritionPlan} onClose={handleClose} />

            <NutritionPlanForm open={createPlan} onClose={handleCreatePlanClose} onSubmit={handleCreatePlanSubmit} />
        </div>
    );
}    

const styles = {
    listItem: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    leftContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    titleContainer: {
        display: 'flex',
        alignItems: 'center',
    },
    starIcon: {
        marginRight: 8,
    },
    title: {
        fontSize: 20,
    }
};
export default NutritionPlanPage;