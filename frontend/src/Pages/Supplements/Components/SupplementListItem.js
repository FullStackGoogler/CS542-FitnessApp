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
                    <span style={styles.title}>{supplement.product_name}</span>
                </div>
                <ListItemText primary= {'Description: ' + supplement.product_description}/>
                <ListItemText secondary= {'Category: ' + supplement.product_category}/>
                <ListItemText secondary={'Brand Name: ' + supplement.brand_name} />
                <ListItemText secondary={'Link: ' + supplement.link} />
                <ListItemText secondary= {'Price: ' + supplement.price}/>
                <ListItemText secondary={'Overall Rating: ' + supplement.overall_rating} />
                <ListItemText secondary={'Top Flavor Rated: ' + supplement.top_flavor_rated} />
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
