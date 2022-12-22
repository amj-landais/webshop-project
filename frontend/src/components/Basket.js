import basketImg from '../media/shopping-basket.png'
import {useState} from "react";

function Basket(props) {

    const [modifiedList, setModifiedList] = useState(() => props.itemList.map(() => false));
    const [modifiedStatusList, setModifiedStatusList] = useState(() => props.itemList.map(() => false));


    /** close the basket modal */
    function closeClick() {
        //reload the items
        props.refreshItems();

        const modal = document.getElementById('modal');
        modal.style.display = 'none';
        setModifiedList(props.itemList.map(() => false))
        setModifiedStatusList(props.itemList.map(() => false))

    }

    /** open the basket modal */
    function openModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'block';

    }

    /** remove all the items of the basket */
    function removeItemHandler(idx) {
        props.removeItemHandler(idx);

        setModifiedList(prevState => {
            return prevState.filter((id, index) => index !== idx)
        });

        setModifiedStatusList(prevState => {
            return prevState.filter((id, index) => index !== idx)
        });
    }

    /** check if an item can be bought */
    async function checkItemBuy(item, idx, isBuyPossible, newBasketList) {
        let newBasketListTmp = newBasketList;
        let isBuyPossibleTmp = isBuyPossible;
        //Verify that the items are still available and unchanged
        const uri = 'http://127.0.0.1:8000/api/v1/item/' + item.pk

        await fetch(uri)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 404) {
                        throw new Error('item deleted');
                    }
                    throw new Error('Error in request');
                }
                return response.json();
            })
            .then((data) => {
                if (data.date_modified === item.date_modified || (data.price === item.price && data.status === 'SALE')) {
                    console.log(item.title, ' is NOT changed');
                    newBasketListTmp.push(data)
                } else {

                    //If item not available anymore : notification (the user removes it manually)
                    if (data.status !== 'SALE') {
                        console.log(item.title, 'status CHANGED: not on SALE');

                        isBuyPossibleTmp = false;
                        setModifiedStatusList(prevState => {
                            prevState[idx] = true;
                            return prevState;
                        });
                        newBasketListTmp.push(item)
                    }

                    //If the price changed: update price + notification next to the item
                    else if (item.price !== data.price) {
                        console.log(item.title, 'price CHANGED');

                        isBuyPossibleTmp = false;
                        setModifiedList(prevState => {
                            prevState[idx] = true;
                            return prevState;
                        });
                        newBasketListTmp.push(data)

                    }
                }
                return item
            })
            .catch(err => {
                console.log('ERROR: ', err);

                isBuyPossibleTmp = false;
                if (err.message === 'item deleted') {
                    setModifiedStatusList(prevState => {
                        prevState[idx] = true;
                        return prevState;
                    });
                    newBasketListTmp.push(item)

                }
            })

        return [isBuyPossibleTmp, newBasketListTmp];
    }

    /** request to the backend to buy an item */
    async function changeStatusBuy(item, status) {

        console.log('Changing status to  ', status, item.title);
        await fetch('http://127.0.0.1:8000/api/v1/item/' + item.pk, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + props.token,
            },
            body: JSON.stringify({
                title: item.title,
                description: item.description,
                price: item.price,
                status: status
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('http error: ' + response.message)
                }
                return response.json()
            })
            .catch(response => {
                console.log("Change status failed : ", response);
            })
    }

    async function checkEachItem() {
        setModifiedList(props.itemList.map(() => false));
        setModifiedStatusList(props.itemList.map(() => false));
        let isBuyPossible = true;
        let newBasketList = []
        for (const [idx, item] of props.itemList.entries()) {
            [isBuyPossible, newBasketList] = await checkItemBuy(item, idx, isBuyPossible, newBasketList)
        }
        props.setBasketList(newBasketList)

        return isBuyPossible
    }


    /** action to buy an item */
    async function buy() {
        const isBuyPossible = await checkEachItem();

        if (isBuyPossible) {
            //If all ok, each item receive 'SOLD' status + emails send to buyer and seller
            for (const item of props.itemList) {
                await changeStatusBuy(item, 'SOLD')
            }

            props.removeAllHandler();
            closeClick();
        }

    }

    //------------------------- CSS --------------------------------

    const bStyle = {
        color: '#0e434f',
        width: '100px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    }

    const buttonStyle = {
        borderColor: '#0e434f',
        color: '#0e434f',
        backgroundColor: '#b2c7c7',
        borderRadius: 12,
        margin: 20,
        width: 100,
        height: 50,
        fontWeight: 'bold'
    }

    const modal = {
        display: 'none',
        position: 'fixed',
        zIndex: '1',
        left: '0',
        top: '0',
        width: '100%',
        height: '100%',
        overflow: 'auto',
        backgroundColor: 'rgba(0,0,0,0.6)',
    }

    const modalContent = {
        backgroundColor: '#dff8f8',
        margin: '15% auto', /* 15% from the top and centered */
        padding: '20px',
        border: '3px solid #0e434f',
        width: '50%',
    }

    const basketContentStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    }

    const close = {
        color: 'red',
        float: 'right',
        fontSize: '28px',
        fontWeight: 'bold',
        border: '2px solid #0e434f',
        borderRadius: '8px',
        width: '35px',
        height: '35px',
    }

    //------------------------- RETURN --------------------------------

    return (
        <div style={bStyle}>

            <div>
                <img className='basket'
                     src={basketImg}
                     height={50}
                     width={50}
                     alt='Basket' onClick={openModal}/>

                {props.itemList.length}
            </div>


            <div style={modal} id={'modal'}>
                <div style={modalContent} key={props.itemList}>
                    <span style={close} onClick={closeClick}>&times;</span>
                    <div style={basketContentStyle}>
                        <h1> Basket ({props.itemList.length})</h1>
                        <div style={{
                            margin: 20,
                            fontSize: 20,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center'
                        }}>

                            {props.itemList.map((item, idx) => (
                                    <li style={{display: 'flex', margin: 5}} key={idx}>
                                        <div style={{width: '200px'}}>{item.title}</div>
                                        <div style={{width: '100px'}}>{item.price} €</div>
                                        <button style={{
                                            color: 'red',
                                            fontWeight: 'bold',
                                            borderColor: 'red',
                                            borderRadius: 7,
                                            width: 25,
                                            height: 25
                                        }}
                                                onClick={() => removeItemHandler(idx)}>x
                                        </button>
                                        {!modifiedStatusList[idx] && modifiedList[idx] &&
                                            <div style={{color: 'red', marginLeft: '5px'}}>← Price modified !</div>}
                                        {modifiedStatusList[idx] &&
                                            <div style={{color: 'red', marginLeft: '5px'}}>
                                                ← This item is no longer available
                                                !</div>}
                                    </li>
                                )
                            )
                            }

                            {props.loggedIn && props.itemList.length === 0 &&
                                <div style={{fontStyle: 'italic', paddingTop: 30, paddingBottom: 30}}>Your basket is
                                    empty for now...</div>}
                            {!props.loggedIn &&
                                <div style={{fontStyle: 'italic', paddingTop: 30, paddingBottom: 30}}>You need to be
                                    logged in to buy items...</div>}
                        </div>

                        <Total itemList={props.itemList}></Total>


                        {
                            props.itemList.length > 0 && props.loggedIn &&
                            <div style={{display: 'flex', justifyContent: 'center'}}>
                                <button style={buttonStyle}
                                        onClick={props.removeAllHandler}>Remove all from basket
                                </button>
                                <button style={buttonStyle}
                                        onClick={buy}>BUY
                                </button>
                            </div>
                        }

                    </div>
                </div>
            </div>
        </div>
    )

}

function Total(props) {
    const total = props.itemList.reduce((acc, i) => acc + parseFloat(i.price), 0);

    return (
        <h3>Total: {total} €</h3>
    );
}

export default Basket
