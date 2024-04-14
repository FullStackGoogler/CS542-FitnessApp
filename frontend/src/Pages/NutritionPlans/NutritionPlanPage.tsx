import React, { useEffect, useState } from "react";

import { List, ListItemButton, ListItemSecondaryAction, Button, IconButton, Pagination} from "@mui/material";
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';

import TopBar from "../../Components/TopBar";
import ListItem  from "./Components/NutritionPlanListItem"
import NutritionPlanPopup from "./Components/NutritionPlanPopup"
import NutritionPlanForm from "./Components/NutritionPlanForm";

import usePagination from '../Paginate/paginate';

import { isTemplateHead } from "typescript";
import { setMaxIdleHTTPParsers } from "http";


import { NutritionPlanItem } from "./Interfaces/NutritionPlanItem";

const NutritionPlanPage: React.FC = () => {
    const [selectedNutritionPlan, setSelectedNutritionPlan] = useState<NutritionPlanItem | null>(null);
    const [editNutritionPlan, setEditNutritionPlan] = useState<NutritionPlanItem|null>(null);
    const [nutritionPlan, setNutritionPlan] = useState<NutritionPlanItem[]>([]);
    const [createPlan, setCreatePlan] = useState(false);
    const [editPlan, setEditPlan] = useState(false);
    //const [editId, setEditId] = useState(0);
    const [confirmDiscardForm, setConfirmDiscardForm] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);
  
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = nutritionPlan.slice(indexOfFirstPost, indexOfLastPost);

    const _DATA = usePagination(nutritionPlan, postsPerPage);
    
    
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
        fetch('http://localhost:9000/api/nutritionplan')
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
        fetch(`http://localhost:9000/api/nutritionplan/${item.nutrition_plan_id}`)
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

    const handleCreatePlanSubmit = async (nutritionPlan: NutritionPlanItem) => {
        try {
            const response = await fetch('http://localhost:9000/api/nutritionPlanItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nutritionPlan)
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('NutritionPlanItem successfully sent:', responseData);
            } else {
                console.error('Failed to send NutritionPlanItem:', response.statusText);
            }
        } catch (error: any) {
            console.error('Error sending NutritionPlanItem:', error.message);
        }

        console.log("Nutrition Plan:", nutritionPlan);
        setCreatePlan(false);
    }

    const handleCreatePlanClose = () => {
        setConfirmDiscardForm(true);
    };

    const handleEditPlanSubmit = async (nutritionPlan: NutritionPlanItem) => {
        try {
            const response = await fetch('http://localhost:9000/api/nutritionPlanEdit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nutritionPlan)
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('NutritionPlanItem successfully sent:', responseData);
            } else {
                console.error('Failed to send NutritionPlanItem:', response.statusText);
            }
        } catch (error: any) {
            console.error('Error sending NutritionPlanItem:', error.message);
        }

        console.log("Nutrition Plan:", nutritionPlan);
        setCreatePlan(false);
    }

    const handleEdit = async (nutritionPlan: NutritionPlanItem) => {
        console.log("edit pressed");
        setEditNutritionPlan(nutritionPlan);
        setEditPlan(true);
        //setEditId(nutritionPlan.nutrition_plan_id);
    }

    const handleEditPlanClose = () => {
        console.log("edit plan closed");
        setEditPlan(false);
    };

    const handleDiscardFormClose = (discard: boolean) => {
        if (discard) {
            setCreatePlan(false);
        }
        setConfirmDiscardForm(false);
    };

    const handleDelete = async (nutritionPlan: NutritionPlanItem) => {
        console.log("delete pressed")
        const response = await fetch('http://localhost:9000/api/deleteNutritionPlan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nutrition_plan_id: nutritionPlan.nutrition_plan_id,
            })
        });
    }

    const paginate = (e:any, p:number) => {
        setCurrentPage(p);
        _DATA.jump(p);
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
                            <ListItem key={item.nutrition_plan_id} nutritionPlan={item} onClick={() => handleClick(item)}/>
                            <ListItemSecondaryAction >
                                <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(item)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="delete" color="primary" onClick={() => handleDelete(item)}>
                                    <DeleteOutlined />
                                </IconButton>
                            </ListItemSecondaryAction>
                        </ListItemButton>
                    ))}
                </List>
                <Pagination
                  onChange={paginate}
                  page={currentPage}
                  count={Math.ceil(nutritionPlan.length / postsPerPage)}
                  variant="outlined"
                  shape="rounded"
               />
            </div>
            <NutritionPlanPopup selectedNutritionPlan={selectedNutritionPlan} onClose={handleClose} />

            <NutritionPlanForm open={createPlan} onClose={handleCreatePlanClose} onSubmit={handleCreatePlanSubmit} create={true} editItem={editNutritionPlan}/>

            <NutritionPlanForm open={editPlan} onClose={handleEditPlanClose} onSubmit={handleEditPlanSubmit} create={false} editItem={editNutritionPlan}/>
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