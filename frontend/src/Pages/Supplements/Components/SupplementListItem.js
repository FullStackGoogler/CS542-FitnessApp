import { useState } from "react";
import { ListItem, ListItemText } from "@mui/material";
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

const SupplementListItem = ({ supplement, onClick}) => {
    //console.log(supplement)

    const [isStarred, setIsStarred] = useState(false);

    function handleStarClick(event) {
        event.stopPropagation();
        setIsStarred(!isStarred);
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
                    <span style={styles.title}>{supplement.name}</span>
                </div>
                <ListItemText primary= {'Quantity: ' + supplement.quantity + ' g'}/>
                <ListItemText primary= {'Protein: ' + supplement.protein + ' g'}/>
                <ListItemText primary={'Fat: ' + supplement.fat + ' g'} />
                <ListItemText primary={'Carb: ' + supplement.carb + ' g'} />
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

export default SupplementListItem;
