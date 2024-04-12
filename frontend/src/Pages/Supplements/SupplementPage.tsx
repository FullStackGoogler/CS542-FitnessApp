import TopBar from "../../Components/TopBar";
import React, { useEffect, useState } from "react";
import { List, ListItemButton, Button, Pagination, TextField } from "@mui/material";
import ListItem  from "./Components/SupplementListItem"

import SupplementPopup from "./Components/SupplementPopup"
import SupplementForm from "./Components/SupplementForm";
import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import usePagination from '../Paginate/paginate';

import { SupplementItem } from "./Interfaces/SupplementItem";

const SupplementPage: React.FC = () => {
    const [selectedSupplement, setSelectedSupplement] = useState<SupplementItem | null>(null);
    const [supplement, setSupplement] = useState<SupplementItem[]>([]);
    const [createSupplement, setCreateSupplement] = useState(false);
    const [confirmDiscardForm, setConfirmDiscardForm] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(10);

    const [searchQuery, setSearchQuery] = useState("");

    const filteredSupplements = supplement.filter(supplement =>
        supplement.product_name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = filteredSupplements.slice(indexOfFirstPost, indexOfLastPost);

    const _DATA = usePagination(filteredSupplements, postsPerPage);
    
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
        fetch('http://localhost:9000/api/supplements')
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
        fetch(`http://localhost:9000/api/supplements/${item.supplementid}`)
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

    /*const paginate = ({ selected } : {selected:number}) => {
        setCurrentPage(selected + 1);
    };*/

    const paginate = (e:any, p:number) => {
        setCurrentPage(p);
        _DATA.jump(p);
    };
    
    return (
        <div>
            <TopBar title="Supplements" titleColor="#ffffff"/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '75px 10px' }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ fontSize: '24px', fontWeight: 'bold', marginRight: '10px' }}>List of Supplements</div>
                    <TextField
                        label="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        variant="outlined"
                        size="small"
                    />
                </div>
                <Button variant="contained" color="primary" onClick={handleCreate}>Add a Supplement</Button>
            </div>
            <div style={{ position: 'absolute', top: '125px', bottom: '0', width: '100%' }}>
                <List>
                    {currentPosts.map(item => (
                        <ListItemButton>
                            <ListItem key={item.supplementid} supplement={item} onClick={() => handleClick(item)}/>
                        </ListItemButton>
                    ))}
                </List>
                <Pagination
                  onChange={paginate}
                  page={currentPage}
                  count={Math.ceil(filteredSupplements.length / postsPerPage)}
                  variant="outlined"
                  shape="rounded"
               />
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