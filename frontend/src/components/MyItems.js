import {Navigate} from "react-router-dom";
import ListItems from "./ListItems";
import {useCallback, useEffect, useState} from "react";
import Item from "./Item";
import AddNewItem from "./AddNewItem";

function MyItems(props) {

    const [allItems, setAllItems] = useState([]);

    let waitingItemsList = [];
    let saleItemsList = [];
    let soldItemsList = [];
    let boughtItemsList = [];

    const username = props.username;

    //---------------- FETCHING ITEMS -------------------------

    const fetchUserItems = useCallback(() => {
        fetch('http://127.0.0.1:8000/api/v1/items/user/' + props.token)
            .then(response => {
                if (!response.ok) {
                    let err = new Error(' Error in request');
                    err.responsem = response;
                    err.name = 'Custom error';
                    throw err;
                }
                return response.json();
            })
            .then((data) => {
                setAllItems(data);
            })
            .catch(err => {
                console.log('ERROR: ', err.name, err.message);
            })
    }, [props.token])


    useEffect(() => {
        fetchUserItems();
    }, [fetchUserItems])


    //-----------------------------Items Lists-----------------------------------------------

    waitingItemsList = (allItems.filter((item) => (item.status === 'WAITING') && (item.seller === username))).map((item) => {
            // let clickable = true;
            // if (basketList.find((i) => i.pk === item.pk)) {
            //     clickable = false;
            // }
            return <Item item={item} clickable={false} addBasketPossible={false} token={props.token}
                         fetchUserItems={fetchUserItems}/>
        }
    )

    soldItemsList = (allItems.filter((item) => (item.status === 'SOLD') && (item.seller === username))).map((item) => {
            return <Item item={item} clickable={false} addBasketPossible={false} token={props.token}
                         fetchUserItems={fetchUserItems}/>
        }
    )

    boughtItemsList = (allItems.filter((item) => (item.status === 'SOLD') && (item.buyer === username))).map((item) => {
            return <Item item={item} clickable={false} addBasketPossible={false} token={props.token}
                         fetchUserItems={fetchUserItems}/>
        }
    )

    saleItemsList = (allItems.filter((item) => (item.status === 'SALE') && (item.seller === username))).map((item) => {
            return <Item item={item} clickable={false} addBasketPossible={false} token={props.token}
                         fetchUserItems={fetchUserItems}/>
        }
    )


    //-------------------------- CSS -----------------------------------

    const myItemsStyle = {
        backgroundColor: '#c4dede',
        width: '90vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    }


    //-------------------------RETURN--------------------------------------
    if (!props.loggedIn) {
        return <Navigate to="/login" replace/>;
    } else return (
        <div style={myItemsStyle}>
            <AddNewItem token={props.token} fetchUserItems={fetchUserItems}></AddNewItem>
            <ListItems listTitle='My created items, not yet on sale' items={waitingItemsList}></ListItems>
            <ListItems listTitle='My items for sale' items={saleItemsList}></ListItems>
            <ListItems listTitle='My sold items' items={soldItemsList}></ListItems>
            <ListItems listTitle='My bought items' items={boughtItemsList}></ListItems>
        </div>
    )
}


export default MyItems;
