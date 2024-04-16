import { useState, useEffect } from "react";
import { ListItem, ListItemText, IconButton} from "@mui/material";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import DeleteOutlined from '@mui/icons-material/DeleteOutlined';
import EditIcon from '@mui/icons-material/Edit';

const UserSettingListItem = ({ userSetting, onClick}) => {

    const [isStarred, setIsStarred] = useState(false);

    //Automatically star any nutrition plans already favorited on page load
    /*useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:9000/api/usersetting/1`);
                if (response.ok) {
                    const data = await response.json();
                    const isStarred = data.some(entry => entry.userid === userSetting.userid);
                    setIsStarred(isStarred);
                } else {
                    console.error('Failed to fetch usersettings data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching usersettings data:', error.message);
            }
        };

        fetchData();
    }, [userSetting.userid]);*/

    /*function handleStarClick(event) {
        event.stopPropagation();
        setIsStarred(!isStarred);
        handleStarChange();
    };
    const handleStarChange = async () => {
        try {
            console.log(nutritionPlan.nutrition_plan_id);
            console.log(isStarred);
            const response = await fetch('http://localhost:9000/api/StarredNutritionPlan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    nutrition_plan_id: nutritionPlan.nutrition_plan_id,
                    isStarred: !isStarred,
                    userID: 1
                })
            });

            if (response.ok) {
                setIsStarred(!isStarred); //Update local state
                const responseData = await response.json();
                console.log('NutritionPlan Star successfully modified:', responseData);
            } else {
                console.error('Failed to add/remove nutrition plan from favorites:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding/removing nutrition plan from favorites:', error.message);
        }
    };*/

    /*const handleDelete = async () => {
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
    }*/

    /*const handleEdit = async () => {
        console.log("edit pressed")

        /*const response = await fetch('http://localhost:9000/api/deleteNutritionPlan', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nutrition_plan_id: nutritionPlan.nutrition_plan_id,
            })
        });*/
    /*}*/


    return (
        <ListItem style={styles.listItem}>
            <div style={styles.leftContainer}>
                <div style={styles.titleContainer}>
                    {isStarred ? (
                        <StarIcon style={{ color: '#D1B000' }} onClick={handleStarClick} />
                    ) : (
                        <StarBorderIcon style={{ color: '#D1B000' }} onClick={handleStarClick} />
                    )}
                </div>
                <ListItemText primary= {'Username: ' + userSetting.username}/>
                <ListItemText primary= {'Password: ' + userSetting.password}/>
                <ListItemText primary={'First name: ' + userSetting.firstname} />
                <ListItemText primary={'Last name: ' + userSetting.lastname} />
                <ListItemText primary={'Email: ' + userSetting.email} />
                <ListItemText primary={'Phone: ' + userSetting.phone} />
                <ListItemText primary={'Birthday: ' + userSetting.bday} />
                <ListItemText primary={'Weight: ' + userSetting.weight} />
            </div>
        </ListItem>
    );
};

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
    },
    imageContainer: {
        flexShrink: 0,
        marginLeft: 16,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 4,
    },
};

export default UserSettingListItem;