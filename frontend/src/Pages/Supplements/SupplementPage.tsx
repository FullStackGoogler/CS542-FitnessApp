import TopBar from "../../Components/TopBar";
import React, { useEffect, useState } from "react";
import { List, ListItemButton, Button } from "@mui/material";
import ListItem  from "./Components/SupplementListItem"

//TODO put in Supplement plan page not Supplement
import SupplementPopup from "./Components/SupplementPopup"
import SupplementForm from "./Components/SupplementForm";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const SupplementPage: React.FC = () => {
    interface SupplementItem {
        supplement_id: number;
        name: string;
        quantity: number;
        protein: number;
        fat: number;
        carb: number;
    }

    const [selectedSupplement, setSelectedSupplement] = useState<SupplementItem | null>(null);
    const [supplement, setSupplement] = useState<SupplementItem[]>([]);
    const [createPlan, setCreatePlan] = useState(false);
    const [confirmDiscardForm, setConfirmDiscardForm] = useState(false);
    
    /*let dummydata = [{
        Supplement_plan_id: 1,
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
        fetch('http://localhost:8080/api/supplement')
            .then(response => response.json())
            .then(data =>  {
                //console.log("data")
                setSupplement(data.map((plan: any) => ({
                    supplement_id: plan.supplement_id,
                    name:  plan.name,
                    quantity:  plan.quantity,
                    protein: plan.protein,
                    fat: plan.fat,
                    carb: plan.carb,
                })));
            }).catch(error => console.error('Error:', error));

    })

    const handleClick = (item: SupplementItem) => {
        setSelectedSupplement(item);
        console.log(item.supplement_id);
        fetch(`http://localhost:8080/api/supplement/${item.supplement_id}`)
            .then(response => response.json())
            .then(SupplementData => {
                    console.log(SupplementData)
                    setSelectedSupplement(SupplementData);
                })
            .catch(error => console.error('Error fetching Supplement:', error));
    };   

    const handleClose = () => {
        setSelectedSupplement(null);
    };

    const handleCreatePlan = () => {
        setCreatePlan(true);
    };

    const handleCreatePlanSubmit = (supplement: SupplementItem) => {
        //TODO: Figure out how to decompoes this interface into SQL queries
        console.log("Supplement:", supplement);
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
            <TopBar title="Supplements" titleColor="#ffffff"/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '75px 10px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>List of Supplements</div>
                <Button variant="contained" color="primary" onClick={handleCreatePlan}>Add a Nutrition Plan</Button>
            </div>
            <div style={{ position: 'absolute', top: '125px', bottom: '0', width: '100%' }}>
                <List>
                    {supplement.map(item => (
                        <ListItemButton>
                            <ListItem supplement={item} onClick={() => handleClick(item)}/>
                        </ListItemButton>
                    ))}
                </List>
            </div>
            <SupplementPopup selectedSupplement={selectedSupplement} onClose={handleClose} />
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
export default SupplementPage;