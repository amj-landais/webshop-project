

function ListItems(props) {

    const listItemsStyle = {
        border: '2px solid #0e434f',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        margin: '20px',
        width: '90%',
        backgroundColor: '#b1cccc'
    }

    const titleStyle = {
       padding: '5px',
    }

    return (
        <div style={listItemsStyle}>
            <h3 style={titleStyle}>
                {props.listTitle} ({props.items.length})
            </h3>
            <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center'}}>
                {props.items}
                {props.items.length===0 &&<div style={{fontStyle: 'italic', paddingTop: 30, paddingBottom: 30}}>
                    Nothing here...
                </div>}
            </div>

        </div>
    )
}

export default ListItems;
