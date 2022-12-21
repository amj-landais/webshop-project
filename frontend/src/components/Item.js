import EditItem from "./EditItem";

function Item(props) {

    const changeStatus = (status) => {

        console.log('Changing status to  ', status, props.item.title);
        fetch('http://127.0.0.1:8000/api/v1/item/' + props.item.pk, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Token ' + props.token,
            },
            body: JSON.stringify({
                title: props.item.title,
                description: props.item.description,
                price: props.item.price,
                status: status
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('http error: ' + response.statusCode)
                }
                return response.json()
            })
            .then(data => {
                console.log('data ', data);
                console.log('props ', props);
                props.fetchUserItems();
            })
            .catch(response => {
                console.log("Change status failed : ", response);
            })
    }

    //-------------------------- CSS -----------------------------------

    const iStyle = {
        width: '40%', minWidth: '300px', height: '270px', border: 'solid 2px #0e434f', margin: '10px',
        backgroundColor: '#dff8f8', textAlign: 'center', color: '#0e434f', display: 'flex',
        alignItems: 'center', flexDirection: 'column',
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

    const addButtonStyle = {
        borderColor: '#0e434f',
        color: '#0e434f',
        backgroundColor: '#b2c7c7',
        borderRadius: 12,
        width: '50px',
        height: '40px',
        fontWeight: 'bold',
        margin: '20px',
    }

    //-------------------------- RETURN -----------------------------------

    return (
        <div style={iStyle}>
            <Label itemName={props.item.title.toUpperCase()}/>
            <Description description={props.item.description}/>
            <Price price={props.item.price}/>
            <DateDisplay date={props.item.created_date}/>
            {props.clickable && props.loggedIn && <button id='button' style={addButtonStyle} onClick={() => {
                props.addHandler(props.item)
            }}>
                +
            </button>}
            {props.item.pk} -- {props.item.status} - {props.item.seller}

            <div style={{display: 'flex', justifyContent: 'center'}}>
                {!props.addBasketPossible && props.item.status === 'WAITING' &&
                    <button style={buttonStyle} onClick={() => changeStatus('SALE')}>
                        Put on sale
                    </button>}
                {!props.addBasketPossible && props.item.status === 'SALE' &&
                    <button style={buttonStyle} onClick={() => changeStatus('WAITING')}>
                        Remove from sale
                    </button>}

                {!props.addBasketPossible && (props.item.status === 'SALE' || props.item.status === 'WAITING') &&
                    <EditItem item={props.item} token={props.token} fetchUserItems={props.fetchUserItems}></EditItem>}
            </div>

            {!props.clickable && props.addBasketPossible && <div style={{color: '#509324', margin: '20px'}}>
                Added to basket
            </div>}
        </div>
    )
}


function Label(props) {
    const lStyle = {
        width: '100%', height: '50px', margin: '2px'
    }

    return (
        <h3 style={lStyle}>
            {props.itemName}
        </h3>
    )
}


function Price(props) {
    const pStyle = {
        width: '100%', height: '50px', margin: '2px',
    }

    return (
        <div style={pStyle}>
            {props.price} €
        </div>
    )
}

function Description(props) {
    const boxStyle = {
        width: '100%', height: '50px'
    }

    return (
        <div style={boxStyle}>
            <div>
                {props.description}
            </div>
        </div>
    )
}

function DateDisplay(props) {
    const dateStyle = {
        width: '100%', height: '30px'
    }


    return (
        <div style={dateStyle}>
            Added on {new Date(props.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })}
        </div>
    )
}

export default Item;
