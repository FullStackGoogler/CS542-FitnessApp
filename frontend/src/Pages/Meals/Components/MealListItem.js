import { useState, useEffect } from "react";
import { ListItem, ListItemText } from "@mui/material";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';



const MealListItem = ({ meal, onClick }) => {
    const [isStarred, setIsStarred] = useState(false);
    const [totalCalories, setCal] = useState(false);
    const [totalFat, setFat] = useState(false);
    const [totalCarb, setCarb] = useState(false);
    const [totalProtein, setProtein] = useState(false);

    //Automatically star any user programs already favorited on page load
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:9000/api/userfollowsuserprogram/1`);
                if (response.ok) {
                    const data = await response.json();
                    const isStarred = data.some(entry => entry.meal_plan_id === meal.mealPlanID);
                    setIsStarred(isStarred);
                } else {
                    console.error('Failed to fetch userfollowsmealplan data:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching userfollowsmealplan data:', error.message);
            }
        };

        fetchData();
    }, [meal.mealPlanID]);

    function handleStarClick(event) {
        event.stopPropagation();
        setIsStarred(!isStarred);
        handleStarChange();
    };

    const handleStarChange = async () => {
        try {
            const response = await fetch('http://localhost:9000/api/StarredWorkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    mealplanID: meal.mealPlanID,
                    isStarred: !isStarred,
                    userId: 1
                })
            });

            if (response.ok) {
                setIsStarred(!isStarred); //Update local state
                const responseData = await response.json();
                console.log('UserProgram Star successfully modified:', responseData);
            } else {
                console.error('Failed to add/remove meal from favorites:', response.statusText);
            }
        } catch (error) {
            console.error('Error adding/removing meal from favorites:', error.message);
        }
    };

    return (
        <ListItem style={styles.listItem} onClick={onClick}>
            <div style={styles.leftContainer}>
                <div style={styles.titleContainer}>
                    {isStarred ? (
                        <StarIcon style={{ color: '#D1B000' }} onClick={handleStarClick} />
                    ) : (
                        <StarBorderIcon style={{ color: '#D1B000' }} onClick={handleStarClick} />
                    )}
                    <span style={styles.title}>{meal.name}</span>
                </div>
                <ListItemText primary={meal.description} />
                <ListItemText secondary={`Created by ${meal.owner}`} />
            </div>
            <div style={styles.imageContainer}>
                <img src={meal.image} alt={meal.title} style={styles.image} />
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

export default MealListItem;
