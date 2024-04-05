import TopBar from "../../Components/TopBar";
import React, { useEffect, useState } from "react";
import { List, ListItemButton, Button } from "@mui/material";
import ListItem  from "./Components/SupplementListItem"

import SupplementPopup from "./Components/SupplementPopup"
import SupplementForm from "./Components/SupplementForm";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const SupplementPage: React.FC = () => {
    interface SupplementItem {
        supplementid: number;
        product_name: string;
        product_category: string;
        product_description: string;
        brand_name: string;
        link:string;
        price:number;
        price_per_serving:number;
        overall_rating:number;
        number_of_reviews: number;
        verified_buyer_rating: number;
        verified_buyer_number: number;
        top_flavor_rated: string;
        number_of_flavors: number;
        average_flavor_rating: number;
    }

    const [selectedSupplement, setSelectedSupplement] = useState<SupplementItem | null>(null);
    const [supplement, setSupplement] = useState<SupplementItem[]>([]);
    const [createSupplement, setCreateSupplement] = useState(false);
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
        fetch('http://localhost:8080/api/supplements')
            .then(response => response.json())
            .then(data =>  {
                //console.log("data")
                setSupplement(data.map((supplement: any) => ({
                    supplementid: supplement.supplementid,
                    product_name: supplement.product_name,
                    product_category: supplement.product_category,
                    product_description: supplement.product_description,
                    brand_name: supplement.brand_name,
                    link:supplement.link,
                    price:supplement.price,
                    price_per_serving:supplement.price_per_serving,
                    overall_rating:supplement.overall_rating,
                    number_of_reviews: supplement.number_of_reviews,
                    verified_buyer_rating: supplement.verified_buyer_rating,
                    verified_buyer_number: supplement.verified_buyer_number,
                    top_flavor_rated: supplement.top_flavor_rated,
                    number_of_flavors: supplement.number_of_flavors,
                    average_flavor_rating: supplement.average_flavor_rating
                })));
            }).catch(error => console.error('Error:', error));

    })

    const handleClick = (item: SupplementItem) => {
        setSelectedSupplement(item);
        console.log(item.supplementid);
        fetch(`http://localhost:8080/api/supplements/${item.supplementid}`)
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

    const handleCreate = () => {
        setCreateSupplement(true);
    };

    const handleCreateSubmit = (supplementItem: SupplementItem) => {
        //TODO: Figure out how to decompoes this interface into SQL queries
        console.log("Supplement:", supplementItem);
        setCreateSupplement(false);
    }

    const handleCreateClose = () => {
        setConfirmDiscardForm(true);
    };

    const handleDiscardFormClose = (discard: boolean) => {
        if (discard) {
            setCreateSupplement(false);
        }
        setConfirmDiscardForm(false);
    };

    //TODO: Use CSS to better align these
    return (
        <div>
            <TopBar title="Supplements" titleColor="#ffffff"/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '75px 10px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>List of Supplements</div>
                <Button variant="contained" color="primary" onClick={handleCreate}>Add a Supplement</Button>
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

            <SupplementForm open={createSupplement} onClose={handleCreateClose} onSubmit={handleCreateSubmit} />
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