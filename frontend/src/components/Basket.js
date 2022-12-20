import basketImg from '../media/shopping-basket.png'
import {useEffect, useState} from "react";

function Basket(props) {

    const [modifiedList, setModifiedList] = useState(() => props.itemList.map((item) => false));


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
        position: 'fixed', /* Stay in place */
        zIndex: '1', /* Sit on top */
        left: '0',
        top: '0',
        width: '100%', /* Full width */
        height: '100%', /* Full height */
        overflow: 'auto', /* Enable scroll if needed */
        backgroundColor: 'rgba(0,0,0,0.6)', /* Black w/ opacity */
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

    function closeClick() {
        const modal = document.getElementById('modal');
        modal.style.display = 'none';
        setModifiedList(props.itemList.map((item) => false))
    }

    function openModal() {
        const modal = document.getElementById('modal');
        modal.style.display = 'block';
    }



    function buy() {
        setModifiedList(props.itemList.map((item) => false));

        props.itemList.map((item) => {
            //1. Verify that the items are still available and unchanged
            const uri = 'http://127.0.0.1:8000/api/v1/item/' + item.pk

            function isItem(element) {
                return element.pk === item.pk;
            }

            let modified = false;

            fetch(uri)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(' Error in request');
                    }
                    return response.json();
                })
                .then((data) => {
                    if (data.date_modified === item.date_modified) {
                        console.log(item.title, ' is NOT changed');

                    } else {
                        console.log(item.title, ' CHANGED');
                        modified = true;
                        //2. If the price changed: update price + notification next to the item

                        const idx = props.itemList.findIndex(isItem);

                        setModifiedList(prevState => {
                            prevState[idx] = true;
                            return prevState;
                        });

                        item = data;

                        props.removeItemHandler(idx);

                    }
                    return item
                })
                .then((item) => {
                    if (modified) {
                        props.addItemBasket(item)
                    }
                })
                .catch(err => {
                    console.log('ERROR: ', err.name, err.message);
                })

            return item;
        })

        //3. If item not available anymore : notification (the user removes it manually)

        //4. If all ok, each item receive 'SOLD' status + emails send to buyer/seller with list of bought/sold items

    }


    useEffect(() => {
        // props.refreshItems(props.loggedIn);
        console.log("modifiedList !")
        console.log(modifiedList)
    }, [modifiedList, props.loggedIn])


    const removeItemHandler = (itemId) => {
        props.removeItemHandler(itemId);
        setModifiedList((prevState) => {
            return prevState.filter((id, idx) => idx !== itemId)
        })
    }


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
                                        <div style={{width: '100px'}}>{item.title}</div>
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
                                        {modifiedList[idx] &&
                                            <div style={{color: 'red', marginLeft: '5px'}}>← This item has been modified
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
                                <button style={buttonStyle} onClick={buy}>BUY</button>
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
